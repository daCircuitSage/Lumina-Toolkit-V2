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
  signInWithGoogle: () => Promise<void>;
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

  // Handle redirect result for Google sign-in
  useEffect(() => {
    const handleRedirectResult = async () => {
      if (auth) {
        try {
          const result = await getRedirectResult(auth);
          if (result) {
            console.log('Google sign in successful via redirect:', result.user);
            
            // Force update current user state
            setCurrentUser(result.user);
            
            // Save user data to Firestore
            if (db) {
              const userDoc = doc(db, 'users', result.user.uid);
              const userSnapshot = await getDoc(userDoc);
              
              if (!userSnapshot.exists()) {
                console.log('Creating new user document...');
                await setDoc(userDoc, {
                  uid: result.user.uid,
                  email: result.user.email,
                  displayName: result.user.displayName,
                  photoURL: result.user.photoURL,
                  createdAt: new Date().toISOString(),
                  authProvider: 'google'
                });
                console.log('User document created');
              } else {
                console.log('User already exists in Firestore');
              }
            }
          }
        } catch (error) {
          console.error('Redirect result error:', error);
        }
      }
    };

    handleRedirectResult();
  }, [auth, db]);

  async function signInWithGoogle() {
    if (!auth || !googleProvider) {
      throw new Error('Authentication is not available. Firebase is not configured.');
    }
    
    try {
      console.log('Starting Google sign in with redirect...');
      console.log('Firebase config:', {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not set',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
      });
      
      // Use redirect instead of popup to avoid Cross-Origin-Opener-Policy issues
      await signInWithRedirect(auth, googleProvider);
      console.log('Redirect initiated successfully');
      
    } catch (error: any) {
      console.error('Error initiating Google sign in:', error);
      
      // Provide more specific error messages
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error('Domain not authorized. Please add your domain to Firebase Auth → Settings → Authorized domains. See firebase-troubleshooting.md for steps.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Google sign-in was blocked by the browser.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Google sign-in was cancelled.');
      } else {
        throw new Error(`Google authentication failed: ${error.message || 'Unknown error'}`);
      }
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
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log('Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out');
        setCurrentUser(user);
        setLoading(false);
      });

      return unsubscribe;
    } else {
      // Firebase is not configured, set loading to false
      setLoading(false);
      return () => {};
    }
  }, []);

  // Force refresh authentication state after redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth && !currentUser) {
        console.log('Forcing authentication state refresh...');
        auth.currentUser && setCurrentUser(auth.currentUser);
      }
    }, 2000); // Wait 2 seconds after component mount

    return () => clearTimeout(timer);
  }, [auth, currentUser]);

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
