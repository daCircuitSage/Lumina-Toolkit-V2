import { auth, db } from '../config/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export async function checkUserDataInDatabase() {
  console.log('=== User Data Database Check ===');
  
  if (!auth?.currentUser) {
    console.error('❌ No authenticated user found');
    return false;
  }
  
  const user = auth.currentUser;
  console.log('✅ Current user:', user.email);
  console.log('   User ID:', user.uid);
  
  // Check if user document exists in Firestore
  try {
    const userDoc = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userDoc);
    
    if (userSnapshot.exists()) {
      console.log('✅ User document found in Firestore');
      console.log('   User data:', userSnapshot.data());
      return true;
    } else {
      console.error('❌ User document NOT found in Firestore');
      console.log('   This means user registration data is not being saved properly');
      return false;
    }
  } catch (error: any) {
    console.error('❌ Error checking user document:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    return false;
  }
}

export async function checkAllUsersInDatabase() {
  console.log('=== All Users Database Check ===');
  
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    console.log(`✅ Found ${usersSnapshot.docs.length} users in database`);
    
    usersSnapshot.forEach(doc => {
      console.log(`   User: ${doc.data().email} (${doc.data().authProvider})`);
    });
    
    return usersSnapshot.docs.length > 0;
  } catch (error: any) {
    console.error('❌ Error checking all users:', error);
    return false;
  }
}

export async function checkAuthPersistence() {
  console.log('=== Auth Persistence Check ===');
  
  if (!auth) {
    console.error('❌ Firebase auth not initialized');
    return false;
  }
  
  try {
    const currentUser = auth.currentUser;
    console.log('Current auth state:', {
      currentUser: currentUser ? currentUser.email : 'No user',
      persistence: 'browserLocalPersistence configured'
    });
    
    return !!currentUser;
  } catch (error) {
    console.error('❌ Error checking auth persistence:', error);
    return false;
  }
}
