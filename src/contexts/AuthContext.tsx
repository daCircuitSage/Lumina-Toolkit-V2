import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  userId: string;
  userEmail: string;
  createdAt: any;
  featured?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  submitReview: (review: Omit<Review, 'id' | 'userId' | 'userEmail' | 'createdAt'>) => Promise<void>;
  getFeaturedReviews: () => Promise<Review[]>;
  getAllReviews: () => Promise<Review[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  
  // Simple mobile detection
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

async function signInWithGoogle() {
    console.log('🚀 signInWithGoogle function called');
    if (!auth || !googleProvider) {
      console.error('❌ Firebase auth or Google provider not available');
      throw new Error('Authentication is not available. Firebase is not configured.');
    }
    
    const isMobile = isMobileDevice();
    console.log('📱 Device type:', isMobile ? 'Mobile' : 'Desktop');
    
    try {
      let result;
      
      if (isMobile) {
        console.log('📱 Using redirect method for mobile...');
        await signInWithRedirect(auth, googleProvider);
        return null; // Redirect will cause page reload
      } else {
        console.log('🖥️ Using popup method for desktop...');
        result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Sign-in successful via popup:', result.user);
      }
      
      // Save user data to Firestore (only for successful popup sign-in)
      if (result && result.user && db) {
        await saveUserToFirestore(result.user);
      }
      
      return result;
      
    } catch (error: any) {
      console.error('Error initiating Google sign in:', error);
      
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Domain not authorized. Please add your domain to Firebase Auth → Settings → Authorized domains.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Google sign-in was blocked by the browser.');
      } else {
        throw new Error(`Google authentication failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  // Helper function to save user to Firestore
  async function saveUserToFirestore(user: any) {
    if (!db) return;
    
    const userDoc = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
    
    if (!userSnapshot.exists()) {
      console.log('Creating new user document...');
      await setDoc(userDoc, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        authProvider: 'google'
      });
      console.log('User document created');
    } else {
      console.log('User already exists in Firestore');
    }
  }

  async function signUp(email: string, password: string, displayName: string) {
    if (!auth) {
      throw new Error('Authentication is not available. Firebase is not configured.');
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Update display name
      await updateProfile(user, { displayName });
      
      // Save user data to Firestore
      if (db) {
        const userDoc = doc(db, 'users', user.uid);
        await setDoc(userDoc, {
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          photoURL: null,
          createdAt: new Date().toISOString(),
          authProvider: 'email'
        });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async function signIn(email: string, password: string) {
    if (!auth) {
      throw new Error('Authentication is not available. Firebase is not configured.');
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async function logout() {
    if (!auth) {
      throw new Error('Authentication is not available. Firebase is not configured.');
    }
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async function submitReview(reviewData: Omit<Review, 'id' | 'userId' | 'userEmail' | 'createdAt'>) {
    if (!currentUser) {
      throw new Error('User must be logged in to submit a review');
    }
    
    if (!db) {
      throw new Error('Database is not available. Firebase is not configured.');
    }

    try {
      const reviewsCollection = collection(db, 'reviews');
      await addDoc(reviewsCollection, {
        ...reviewData,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        createdAt: serverTimestamp(),
        featured: false
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  async function getFeaturedReviews(): Promise<Review[]> {
    if (!db) {
      return [];
    }
    
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(3)
      );
      const querySnapshot = await getDocs(reviewsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review)).filter(review => review.featured);
    } catch (error) {
      console.error('Error fetching featured reviews:', error);
      return [];
    }
  }

  async function getAllReviews(): Promise<Review[]> {
    if (!db) {
      return [];
    }
    
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(reviewsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Review));
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      return [];
    }
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out');
      
      if (user) {
        setCurrentUser(user);
        
        // Save user to Firestore if not already exists
        if (db) {
          await saveUserToFirestore(user);
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    // Handle redirect result for mobile authentication
    const handleRedirectResult = async () => {
      try {
        console.log('🔄 Checking for redirect result...');
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
          console.log('✅ Redirect sign-in successful:', result.user);
          // onAuthStateChanged will handle the state update
        }
      } catch (error: any) {
        console.error('Error handling redirect result:', error);
        
        if (error.code === 'auth/unauthorized-domain') {
          console.error('Domain not authorized for redirect');
        }
      }
    };

    handleRedirectResult();

    return unsubscribe;
  }, [auth]);

  const value: AuthContextType = {
    currentUser,
    loading,
    signInWithGoogle,
    signUp,
    signIn,
    logout,
    submitReview,
    getFeaturedReviews,
    getAllReviews
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
