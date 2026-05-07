import { db, auth } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function testFirebaseConnection() {
  console.log('=== Firebase Connection Test ===');
  
  // Test 1: Check Firebase initialization
  console.log('1. Firebase Config Check:');
  console.log('   - DB available:', !!db);
  console.log('   - Auth available:', !!auth);
  console.log('   - Current user:', auth?.currentUser);
  
  if (!auth?.currentUser) {
    console.error('❌ No authenticated user found');
    return false;
  }
  
  // Test 2: Check user permissions
  console.log('2. User Authentication Check:');
  console.log('   - User ID:', auth.currentUser.uid);
  console.log('   - User email:', auth.currentUser.email);
  
  // Test 3: Try to create a test document
  console.log('3. Firestore Write Test:');
  try {
    const testDoc = {
      userId: auth.currentUser.uid,
      type: 'test',
      timestamp: serverTimestamp(),
      test: true
    };
    
    const docRef = await addDoc(collection(db, 'test'), testDoc);
    console.log('✅ Test document created successfully:', docRef.id);
    return true;
  } catch (error: any) {
    console.error('❌ Firestore write failed:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('   This suggests Firestore security rules are not properly deployed or configured.');
    }
    
    return false;
  }
}

export async function testJobsCollection() {
  console.log('=== Jobs Collection Test ===');
  
  if (!auth?.currentUser) {
    console.error('❌ No authenticated user found');
    return false;
  }
  
  try {
    const testJob = {
      userId: auth.currentUser.uid,
      company: 'Test Company',
      role: 'Test Role',
      status: 'applied',
      date: new Date().toISOString().split('T')[0],
      notes: 'Test job for debugging',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      test: true
    };
    
    const docRef = await addDoc(collection(db, 'jobs'), testJob);
    console.log('✅ Test job created successfully:', docRef.id);
    return true;
  } catch (error: any) {
    console.error('❌ Jobs collection write failed:', error);
    console.error('   Error code:', error.code);
    console.error('   Error message:', error.message);
    return false;
  }
}
