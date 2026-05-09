import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase configuration is complete for database usage
const isFirebaseConfigured = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  return requiredFields.every(field => firebaseConfig[field as keyof typeof firebaseConfig]);
};

let app: any = null;
let db: any = null;
let auth: any = null;

if (isFirebaseConfigured()) {
  try {
    console.log('Firebase configuration found, initializing Firebase services...');
    
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    
    console.log('Firebase app initialized:', !!app);
    console.log('Firebase Firestore initialized:', !!db);
    console.log('Firebase Auth initialized:', !!auth);
    
    console.log('Firebase services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase services:', error);
  }
} else {
  console.warn('Firebase configuration is incomplete. Database features will be disabled.');
}

// Auth helper functions
export const signInWithGoogle = async () => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

export const signOutUser = async () => {
  if (!auth) {
    return;
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: (user: any) => void) => {
  if (!auth) {
    return () => {};
  }
  
  return onAuthStateChanged(auth, callback);
};

export { app, db, auth };
export default app;
