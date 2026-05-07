import { auth } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export async function testCurrentAuthState() {
  console.log('=== Testing Current Authentication State ===');
  
  if (!auth) {
    console.error('❌ Firebase auth not initialized');
    return false;
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔍 Auth state check:');
      console.log('   - User:', user ? user.email : 'No user');
      console.log('   - UID:', user ? user.uid : 'No UID');
      console.log('   - Provider:', user ? user.providerData?.[0]?.providerId : 'No provider');
      console.log('   - Is email verified:', user ? user.emailVerified : 'N/A');
      
      if (user) {
        console.log('✅ Authentication SUCCESSFUL');
        console.log('   - User is properly logged in');
        console.log('   - UI should show user profile');
        resolve(true);
      } else {
        console.log('❌ Authentication FAILED');
        console.log('   - No user found');
        console.log('   - UI should show sign-in button');
        resolve(false);
      }
      
      // Clean up listener
      setTimeout(() => unsubscribe(), 1000);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      console.log('⏰ Authentication test timeout');
      unsubscribe();
      resolve(false);
    }, 10000);
  });
}

export function checkFirebaseConfig() {
  console.log('=== Firebase Configuration Check ===');
  
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Missing',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Missing',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ? 'Set' : 'Missing'
  };
  
  console.log('Firebase Config:', config);
  
  const allSet = Object.values(config).every(value => value !== 'Missing');
  console.log(allSet ? '✅ All Firebase config variables are set' : '❌ Some Firebase config variables are missing');
  
  return allSet;
}
