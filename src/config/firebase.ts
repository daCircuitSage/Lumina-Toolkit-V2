import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase configuration is complete
const isFirebaseConfigured = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  return requiredFields.every(field => firebaseConfig[field as keyof typeof firebaseConfig]);
};

let app: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured()) {
  try {
    console.log('Firebase configuration found, initializing Firebase...');
    
    // Enhanced initialization for mobile browsers
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Wait for Firebase to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Firebase app initialized:', !!app);
    console.log('Firebase auth initialized:', !!auth);
    console.log('Firebase db initialized:', !!db);
    
    // Configure auth persistence to keep users logged in across sessions
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('Auth persistence configured successfully');
      })
      .catch((error) => {
        console.error('Failed to configure auth persistence:', error);
      });
    
    // Configure Google Provider with proper settings for mobile compatibility
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    googleProvider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline',
      include_granted_scopes: 'true'
    });
    
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  console.warn('Firebase configuration is incomplete. Authentication features will be disabled.');
}

export { app, auth, db, googleProvider };
export default app;
