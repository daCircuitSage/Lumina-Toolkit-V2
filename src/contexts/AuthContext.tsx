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

  
  // Helper function to detect mobile devices
const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(userAgent);
  const isMobileSize = window.innerWidth <= 768;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  console.log('📱 Device detection:', {
    userAgent: userAgent.substring(0, 50),
    isMobileUA,
    isMobileSize,
    hasTouch,
    isMobile: isMobileUA || (isMobileSize && hasTouch)
  });
  
  return isMobileUA || (isMobileSize && hasTouch);
};

async function signInWithGoogle() {
    console.log('🚀 signInWithGoogle function called');
    if (!auth || !googleProvider) {
      console.error('❌ Firebase auth or Google provider not available');
      console.log('Auth available:', !!auth);
      console.log('Google provider available:', !!googleProvider);
      throw new Error('Authentication is not available. Firebase is not configured.');
    }
    
    const isMobile = isMobileDevice();
    console.log('� Device type:', isMobile ? 'Mobile' : 'Desktop');
    
    try {
      console.log('📋 Firebase config:', {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Not set',
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Set' : 'Not set'
      });
      
      let result;
      
      if (isMobile) {
        console.log('� Using redirect method for mobile device...');
        // Use redirect method for mobile devices
        await signInWithRedirect(auth, googleProvider);
        console.log('🔄 Redirect initiated, waiting for result...');
        
        // The redirect will cause a page reload, so we need to check for result after redirect
        // This will be handled by the getRedirectResult call in useEffect
        return null;
        
      } else {
        console.log('🖥️ Using popup method for desktop...');
        // Use popup method for desktop
        result = await signInWithPopup(auth, googleProvider);
        console.log('✅ Sign-in successful via popup:', result.user);
        console.log('User details:', {
          email: result.user.email,
          uid: result.user.uid,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        });
      }
      
      // Save user data to Firestore (only for successful popup sign-in)
      if (result && result.user && db) {
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
      
      return result;
      
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

  // Handle redirect result for mobile authentication
  useEffect(() => {
    const handleRedirectResult = async () => {
      if (auth) {
        try {
          console.log('🔄 Checking for redirect result...');
          const result = await getRedirectResult(auth);
          
          if (result && result.user) {
            console.log('✅ Redirect sign-in successful:', result.user);
            console.log('User details:', {
              email: result.user.email,
              uid: result.user.uid,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL
            });
            
            // Manually update the current user state for mobile redirect
            setCurrentUser(result.user);
            
            // Save user data to Firestore for mobile sign-in
            if (db) {
              const userDoc = doc(db, 'users', result.user.uid);
              const userSnapshot = await getDoc(userDoc);
              
              if (!userSnapshot.exists()) {
                console.log('Creating new user document from redirect...');
                await setDoc(userDoc, {
                  uid: result.user.uid,
                  email: result.user.email,
                  displayName: result.user.displayName,
                  photoURL: result.user.photoURL,
                  createdAt: new Date().toISOString(),
                  authProvider: 'google'
                });
                console.log('User document created from redirect');
              } else {
                console.log('User already exists in Firestore (redirect)');
              }
            }
          } else {
            console.log('No redirect result found (normal for popup auth)');
            
            // Additional check: maybe user is already authenticated but redirect result is empty
            const currentUser = auth.currentUser;
            if (currentUser && !result?.user) {
              console.log('🔄 Found authenticated user but no redirect result, updating state manually');
              setCurrentUser(currentUser);
            }
          }
        } catch (error: any) {
          console.error('Error handling redirect result:', error);
          
          // Handle redirect-specific errors
          if (error.code === 'auth/unauthorized-domain') {
            console.error('Domain not authorized for redirect');
          } else if (error.code === 'auth/redirect-cancelled-by-user') {
            console.log('Redirect was cancelled by user');
          } else {
            console.log('Redirect result error:', error.message);
          }
        }
      }
    };

    handleRedirectResult();
  }, [auth]);

  // Force refresh authentication state after redirect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth && !currentUser) {
        console.log('Forcing authentication state refresh...');
        
        // Check if user is authenticated but state not updated
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          console.log('🔄 Found authenticated user, updating state:', firebaseUser.email);
          setCurrentUser(firebaseUser);
        } else {
          console.log('No authenticated user found in Firebase');
        }
      }
    }, 2000); // Wait 2 seconds after component mount

    return () => clearTimeout(timer);
  }, [auth, currentUser]);

  // Additional fallback for mobile authentication
  useEffect(() => {
    const checkAuthState = async () => {
      if (auth) {
        // Multiple checks at different intervals for mobile redirect
        const checks = [
          { delay: 1000, name: '1s' },
          { delay: 3000, name: '3s' },
          { delay: 5000, name: '5s' }
        ];

        checks.forEach(({ delay, name }) => {
          setTimeout(async () => {
            try {
              const firebaseUser = auth.currentUser;
              if (firebaseUser && !currentUser) {
                console.log(`🔄 Mobile fallback (${name}): Updating auth state from Firebase`);
                setCurrentUser(firebaseUser);
                return; // Stop checking once user is set
              }
              
              // Double-check with getRedirectResult in case it was missed
              const result = await getRedirectResult(auth);
              if (result && result.user && !currentUser) {
                console.log(`🔄 Mobile fallback (${name}): Found redirect result, updating state`);
                setCurrentUser(result.user);
                return; // Stop checking once user is set
              }
              
              if (!firebaseUser && !currentUser && name === '5s') {
                console.log('🔄 Mobile fallback: No authentication found after all checks');
              }
            } catch (error) {
              console.log(`Mobile fallback check (${name}) completed:`, error.message);
            }
          }, delay);
        });
      }
    };

    checkAuthState();
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
