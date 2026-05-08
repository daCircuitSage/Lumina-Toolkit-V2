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
  updateProfile,
  browserLocalPersistence,
  setPersistence
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { testMobileAuth, logAuthEvent } from '../utils/mobile-auth-test';

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

  
  // Enhanced mobile detection including tablets and mobile browsers
const isMobileDevice = () => {
  const userAgent = navigator.userAgent;
  
  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Check for tablet devices that should use redirect
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);
  
  // Check for mobile browsers or touch-enabled devices
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 1024; // Tablets and below
  
  // Use redirect for mobile, tablets, and touch-enabled small screens
  return isMobile || isTablet || (hasTouchScreen && isSmallScreen);
};

async function signInWithGoogle() {
    logAuthEvent('signInWithGoogle called');
    
    // Run mobile auth test for debugging
    const authTest = testMobileAuth();
    logAuthEvent('Mobile auth test results', authTest);
    
    if (!auth || !googleProvider) {
      console.error('❌ Firebase auth or Google provider not available');
      throw new Error('Authentication is not available. Firebase is not configured.');
    }
    
    const isMobile = isMobileDevice();
    logAuthEvent('Device detection', { isMobile, shouldUseRedirect: authTest.shouldUseRedirect });
    logAuthEvent('Current domain', window.location.origin);
    
    try {
      let result;
      
      if (isMobile) {
        console.log('📱 Trying redirect method for mobile first...');
        try {
          await signInWithRedirect(auth, googleProvider);
          return null; // Redirect will cause page reload
        } catch (redirectError: any) {
          console.error('❌ Redirect method failed, trying popup fallback:', redirectError);
          
          // If redirect fails, try popup as fallback
          if (redirectError.code === 'auth/unauthorized-domain' || 
              redirectError.code === 'auth/redirect-cancelled-by-user') {
            console.log('🔄 Trying popup method as fallback...');
            result = await signInWithPopup(auth, googleProvider);
            console.log('✅ Fallback popup sign-in successful:', result.user);
          } else {
            throw redirectError;
          }
        }
      } else {
        console.log('🖥️ Using popup method for desktop...');
        result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Sign-in successful via popup:', result.user);
      }
      
      // Save user data to Firestore (only for successful sign-in)
      if (result && result.user && db) {
        await saveUserToFirestore(result.user);
      }
      
      return result;
      
    } catch (error: any) {
      console.error('Error initiating Google sign in:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Current domain:', window.location.origin);
      
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error(`Domain ${window.location.origin} not authorized. Please add this domain to Firebase Auth → Settings → Authorized domains.`);
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Google sign-in was blocked by the browser.');
      } else if (error.code === 'auth/redirect-cancelled-by-user') {
        throw new Error('Google sign-in was cancelled.');
      } else {
        throw new Error(`Google authentication failed: ${error.message || 'Unknown error'} (Code: ${error.code})`);
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

    // Ensure persistence is set before any auth operations
    const setupAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log('✅ Auth persistence set to browserLocalPersistence');
      } catch (error) {
        console.error('❌ Failed to set auth persistence:', error);
      }
    };

    setupAuth();

    // Handle redirect result first, before setting up auth state listener
    const handleRedirectResult = async () => {
      try {
        console.log('🔄 Checking for redirect result...');
        console.log('🌐 Current domain after redirect:', window.location.origin);
        console.log('📱 User agent:', navigator.userAgent);
        
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
          console.log('✅ Redirect sign-in successful:', result.user);
          console.log('User details:', {
            email: result.user.email,
            uid: result.user.uid,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL
          });
          
          // Save user to Firestore immediately after redirect
          if (db) {
            await saveUserToFirestore(result.user);
          }
          
          // Set user state immediately
          setCurrentUser(result.user);
          setLoading(false);
          return true; // Indicate successful redirect handling
        } else {
          console.log('ℹ️ No redirect result found (normal for popup auth or first load)');
          return false;
        }
      } catch (error: any) {
        console.error('❌ Error handling redirect result:', error);
        console.error('Redirect error code:', error.code);
        console.error('Redirect error message:', error.message);
        
        if (error.code === 'auth/unauthorized-domain') {
          console.error(`❌ Domain ${window.location.origin} not authorized for redirect`);
          showDomainAuthorizationError();
        } else if (error.code === 'auth/redirect-cancelled-by-user') {
          console.log('ℹ️ Redirect was cancelled by user');
        } else if (error.code === 'auth/redirect-pending') {
          console.log('ℹ️ Redirect is pending, continuing...');
        } else {
          console.error('❌ Unexpected redirect error:', error.message);
        }
        return false;
      }
    };

    // Handle redirect result before setting up auth state listener
    handleRedirectResult().then((redirectHandled) => {
      if (!redirectHandled) {
        // Only set up auth state listener if redirect wasn't handled
        setupAuthStateListener();
      }
    });

    const setupAuthStateListener = () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('🔄 Auth state changed:', user ? `User logged in: ${user.email}` : 'User logged out');
        
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

      return unsubscribe;
    };

    // Function to show domain authorization error
    const showDomainAuthorizationError = () => {
      const currentDomain = window.location.origin;
      console.error(`🚨 CRITICAL: Domain ${currentDomain} is not authorized in Firebase!`);
      console.error('To fix this:');
      console.error('1. Go to https://console.firebase.google.com/project/luminatoolkit/authentication/providers');
      console.error('2. Click on Google provider');
      console.error('3. Add these domains to authorized domains:');
      console.error('   - https://lumintoolkit.com');
      console.error('   - https://www.lumintoolkit.com');
      console.error('   - http://localhost:5173 (for development)');
      console.error('4. Save and wait 5-10 minutes for changes to propagate');
    };

    return () => {
      // Cleanup function
      const unsubscribe = setupAuthStateListener();
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
