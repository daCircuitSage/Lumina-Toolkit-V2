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
import { logAuthError, logAuthEvent, remoteLogger } from '../utils/remote-logger';
import { mobileAuthFinalFix } from '../utils/mobile-auth-final-fix';

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

  interface GoogleSignInResult {
    redirectInitiated?: boolean;
    user?: User | null;
  }

  const isMobileDevice = () => {
    const userAgent = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);
    const hasTouchScreen = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 1024;

    return isMobile || isTablet || (hasTouchScreen && isSmallScreen);
  };

  async function signInWithGoogle(): Promise<GoogleSignInResult> {
    if (!auth || !googleProvider) {
      logAuthError('Firebase auth or Google provider is not initialized');
      throw new Error('Authentication is not available. Firebase is not configured.');
    }

    const isMobile = isMobileDevice();
    logAuthEvent('Google sign-in requested', { isMobile, domain: window.location.origin });

    try {
      // Force popup auth on mobile to avoid redirect domain issues
      if (isMobile) {
        logAuthEvent('Using popup auth on mobile to avoid redirect issues');
        
        try {
          const result = await signInWithPopup(auth, googleProvider);
          if (result?.user && db) {
            await saveUserToFirestore(result.user);
          }
          return result;
        } catch (popupError: any) {
          logAuthError('Popup sign-in failed on mobile', popupError);
          
          // If popup fails, try redirect as last resort
          if (popupError.code === 'auth/popup-blocked' || popupError.code === 'auth/popup-closed-by-user') {
            logAuthEvent('Popup blocked, falling back to redirect');
            await signInWithRedirect(auth, googleProvider);
            return { redirectInitiated: true };
          }
          
          throw popupError;
        }
      }

      // Desktop: try popup first, fallback to redirect
      try {
        const result = await signInWithPopup(auth, googleProvider);
        if (result?.user && db) {
          await saveUserToFirestore(result.user);
        }
        return result;
      } catch (popupError: any) {
        logAuthError('Popup sign-in failed, falling back to redirect', popupError);

        if (
          popupError.code === 'auth/popup-closed-by-user' ||
          popupError.code === 'auth/popup-blocked' ||
          popupError.code === 'auth/operation-not-supported-in-this-environment' ||
          popupError.code === 'auth/cancelled-popup-request'
        ) {
          logAuthEvent('Fallback to redirect after popup failure');
          
          await signInWithRedirect(auth, googleProvider);
          
          return { redirectInitiated: true };
        }

        throw popupError;
      }
    } catch (error: any) {
      logAuthError('Google sign-in failed', { code: error?.code, message: error?.message });

      if (error.code === 'auth/unauthorized-domain') {
        throw new Error(`Domain ${window.location.origin} is not authorized. Add it to Firebase Auth authorized domains.`);
      }

      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/redirect-cancelled-by-user') {
        throw new Error('Google sign-in was cancelled.');
      }

      if (error.code === 'auth/popup-blocked') {
        throw new Error('Google sign-in popup was blocked. Please allow popups or use a supported browser.');
      }

      throw new Error(error?.message || 'Google authentication failed.');
    }
  }

  async function saveUserToFirestore(user: any) {
    if (!db) return;

    const userDoc = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      await setDoc(userDoc, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
        authProvider: 'google'
      });
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
      console.error('Firebase auth is not initialized');
      setLoading(false);
      return;
    }

    let didCancel = false;
    let unsubscribe = () => {};

    const initializeAuth = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.warn('Failed to set auth persistence:', error);
      }

      // Only check for redirect result on desktop, not mobile (since mobile uses popup)
      const isMobile = isMobileDevice();
      if (!isMobile) {
        try {
          console.log('🔄 Checking redirect result for desktop...');
          console.log('🌐 Redirect URL search:', window.location.search);
          console.log('🌐 Redirect URL hash:', window.location.hash);
          
          const result = await getRedirectResult(auth);
          
          if (result?.user) {
            console.log('✅ Desktop redirect user detected:', result.user.email);
            logAuthEvent('Desktop redirect sign-in succeeded', { email: result.user.email });
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Save user to Firestore
            if (db) {
              await saveUserToFirestore(result.user);
            }
            
            // Set user immediately
            setCurrentUser(result.user);
            console.log('🔄 Setting redirect user immediately:', result.user.email);
          } else {
            console.log('ℹ️ No redirect result found');
          }
        } catch (error: any) {
          console.warn('Desktop redirect result error:', error);
          if (error.code === 'auth/unauthorized-domain') {
            logAuthError('Unauthorized domain during redirect callback', { domain: window.location.origin });
          }
        }
      }

      // Set up auth state listener
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('👤 onAuthStateChanged called with user:', !!user);
        
        if (user) {
          console.log('✅ Setting authenticated user:', user.email);
          setCurrentUser(user);
          
          // Save to Firestore if not already done
          if (db) {
            await saveUserToFirestore(user);
          }
        } else {
          console.log('👤 No authenticated user found');
          setCurrentUser(null);
        }

        if (!didCancel) {
          setLoading(false);
        }
      });
    };

    initializeAuth();

    return () => {
      didCancel = true;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [auth, db]);

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

// fixed