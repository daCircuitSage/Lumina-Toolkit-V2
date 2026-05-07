import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';

export default function AuthDebug() {
  const { currentUser, loading } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [redirectResult, setRedirectResult] = useState<any>(null);
  const { signInWithGoogle } = useAuth();

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

  const forceRefresh = async () => {
    if (auth) {
      const user = auth.currentUser;
      if (user) {
        console.log('🔄 Manual refresh: Setting user state');
        setFirebaseUser(user);
        // Force React to update by calling signInWithGoogle with a flag
        window.location.reload();
      }
    }
  };

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
        <div className="mt-3 space-y-2">
          <button 
            onClick={forceRefresh}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            🔄 Force Refresh
          </button>
          {firebaseUser && !currentUser && (
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
            >
              🔄 Reload Page
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
