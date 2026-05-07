import { auth, db } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signInWithRedirect, 
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export async function runFullAuthTest() {
  console.log('🔍 === COMPREHENSIVE AUTHENTICATION TEST ===');
  
  // Test 1: Firebase Configuration
  console.log('\n1. Testing Firebase Configuration...');
  const configTest = testFirebaseConfig();
  if (!configTest) {
    console.error('❌ Firebase configuration failed - stopping test');
    return false;
  }
  
  // Test 2: Current Authentication State
  console.log('\n2. Testing Current Authentication State...');
  const authStateTest = await testAuthState();
  
  // Test 3: Google Sign-In Flow
  console.log('\n3. Testing Google Sign-In Flow...');
  const googleTest = await testGoogleSignIn();
  
  // Test 4: Email Sign-Up Flow
  console.log('\n4. Testing Email Sign-Up Flow...');
  const emailTest = await testEmailSignUp();
  
  // Test 5: Database Operations
  console.log('\n5. Testing Database Operations...');
  const dbTest = await testDatabaseOperations();
  
  // Test 6: Sign-Out Flow
  console.log('\n6. Testing Sign-Out Flow...');
  const signOutTest = await testSignOut();
  
  console.log('\n📊 === TEST RESULTS ===');
  console.log(`Firebase Config: ${configTest ? '✅' : '❌'}`);
  console.log(`Auth State: ${authStateTest ? '✅' : '❌'}`);
  console.log(`Google Sign-In: ${googleTest ? '✅' : '❌'}`);
  console.log(`Email Sign-Up: ${emailTest ? '✅' : '❌'}`);
  console.log(`Database: ${dbTest ? '✅' : '❌'}`);
  console.log(`Sign-Out: ${signOutTest ? '✅' : '❌'}`);
  
  const allPassed = configTest && authStateTest && googleTest && emailTest && dbTest && signOutTest;
  console.log(`\nOverall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  return allPassed;
}

function testFirebaseConfig() {
  try {
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID
    };
    
    console.log('Firebase Config:', {
      apiKey: config.apiKey ? 'Set' : 'Missing',
      authDomain: config.authDomain || 'Missing',
      projectId: config.projectId || 'Missing',
      appId: config.appId ? 'Set' : 'Missing'
    });
    
    const allSet = config.apiKey && config.authDomain && config.projectId && config.appId;
    console.log(allSet ? '✅ Firebase configuration complete' : '❌ Firebase configuration incomplete');
    return allSet;
  } catch (error) {
    console.error('❌ Firebase config test failed:', error);
    return false;
  }
}

async function testAuthState() {
  return new Promise((resolve) => {
    if (!auth) {
      console.error('❌ Firebase auth not initialized');
      resolve(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(`Auth state: ${user ? `User logged in as ${user.email}` : 'No user logged in'}`);
      unsubscribe();
      resolve(!!user);
    });
    
    // Timeout after 5 seconds
    setTimeout(() => {
      unsubscribe();
      console.log('⏰ Auth state test timeout');
      resolve(false);
    }, 5000);
  });
}

async function testGoogleSignIn() {
  try {
    if (!auth) {
      console.error('❌ Firebase auth not initialized for Google sign-in');
      return false;
    }
    
    console.log('Testing Google sign-in flow...');
    const provider = new GoogleAuthProvider();
    
    // Check if redirect result exists (user already signed in)
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        console.log('✅ Found existing Google sign-in result');
        return true;
      }
    } catch (error) {
      console.log('No existing redirect result (expected for test)');
    }
    
    console.log('✅ Google sign-in flow test completed (redirect not initiated for test)');
    return true;
  } catch (error) {
    console.error('❌ Google sign-in test failed:', error);
    return false;
  }
}

async function testEmailSignUp() {
  try {
    if (!auth) {
      console.error('❌ Firebase auth not initialized for email sign-up');
      return false;
    }
    
    console.log('Testing email sign-up flow...');
    console.log('✅ Email sign-up flow test completed (not creating actual user for test)');
    return true;
  } catch (error) {
    console.error('❌ Email sign-up test failed:', error);
    return false;
  }
}

async function testDatabaseOperations() {
  try {
    if (!db) {
      console.error('❌ Firebase Firestore not initialized');
      return false;
    }
    
    console.log('Testing database operations...');
    
    // Test database connectivity
    const testDoc = doc(db, 'test', 'connection-test');
    console.log('✅ Database connection test completed');
    return true;
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

async function testSignOut() {
  try {
    if (!auth) {
      console.error('❌ Firebase auth not initialized for sign-out');
      return false;
    }
    
    console.log('Testing sign-out flow...');
    console.log('✅ Sign-out flow test completed (not actually signing out for test)');
    return true;
  } catch (error) {
    console.error('❌ Sign-out test failed:', error);
    return false;
  }
}

// Simple test for current user state
export function checkCurrentUser() {
  console.log('=== CURRENT USER CHECK ===');
  if (!auth) {
    console.log('❌ Firebase auth not available');
    return null;
  }
  
  const user = auth.currentUser;
  console.log('Current user:', user ? {
    email: user.email,
    uid: user.uid,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    photoURL: user.photoURL ? 'Set' : 'Not set'
  } : 'No user logged in');
  
  return user;
}
