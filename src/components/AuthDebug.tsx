import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';

export default function AuthDebug() {
  const { currentUser, loading } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [redirectResult, setRedirectResult] = useState<any>(null);

  useEffect(() => {
    // Check Firebase auth state directly
    const checkFirebaseAuth = async () => {
      if (auth) {
        const user = auth.currentUser;
        setFirebaseUser(user);
        
        try {
          const result = await auth.getRedirectResult();
          setRedirectResult(result);
        } catch (error) {
          console.log('No redirect result available');
        }
      }
    };

    checkFirebaseAuth();
    const interval = setInterval(checkFirebaseAuth, 2000);
    return () => clearInterval(interval);
  }, []);

  // Only show in development or if there are issues
  if (process.env.NODE_ENV === 'production' && currentUser) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs max-w-sm z-50 border border-yellow-500/30">
      <div className="font-bold mb-2 text-yellow-400">🔍 Auth Debug</div>
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>Context User: {currentUser ? currentUser.email : 'Not logged in'}</div>
        <div>Firebase User: {firebaseUser ? firebaseUser.email : 'None'}</div>
        <div>Redirect Result: {redirectResult?.user ? redirectResult.user.email : 'None'}</div>
        <div>UID: {currentUser ? currentUser.uid.substring(0, 8) + '...' : 'N/A'}</div>
        <div>Device: {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent || '') ? 'Mobile' : 'Desktop'}</div>
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="text-green-400">✅ Context: {currentUser ? 'Set' : 'Not Set'}</div>
          <div className="text-blue-400">🔥 Firebase: {firebaseUser ? 'Set' : 'Not Set'}</div>
          <div className="text-purple-400">🔄 Redirect: {redirectResult?.user ? 'Set' : 'Not Set'}</div>
        </div>
      </div>
    </div>
  );
}
