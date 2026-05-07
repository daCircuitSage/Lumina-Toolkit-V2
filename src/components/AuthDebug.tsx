import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthDebug() {
  const { currentUser, loading } = useAuth();

  // Only show in development or if there are issues
  if (process.env.NODE_ENV === 'production' && currentUser) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs z-50 border border-yellow-500/30">
      <div className="font-bold mb-2 text-yellow-400">🔍 Auth Debug</div>
      <div className="space-y-1">
        <div>Loading: {loading ? 'Yes' : 'No'}</div>
        <div>User: {currentUser ? currentUser.email : 'Not logged in'}</div>
        <div>UID: {currentUser ? currentUser.uid.substring(0, 8) + '...' : 'N/A'}</div>
        <div>Device: {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent || '') ? 'Mobile' : 'Desktop'}</div>
      </div>
    </div>
  );
}
