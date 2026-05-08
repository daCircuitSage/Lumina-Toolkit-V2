import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../config/firebase';
import { remoteLogger, logAuthEvent } from '../utils/remote-logger';
import { runMobileAuthDiagnostic, testFirebaseAuth } from '../utils/mobile-auth-diagnostic';

export default function AuthDebug() {
  const { currentUser, loading } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [redirectResult, setRedirectResult] = useState<any>(null);
  const [remoteLogs, setRemoteLogs] = useState<any[]>([]);
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    // Check Firebase auth state directly and get remote logs
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
      
      // Get remote logs for debugging
      const logs = remoteLogger.getLogs();
      setRemoteLogs(logs);
      
      // Add test log if no logs exist
      if (logs.length === 0) {
        logAuthEvent('AuthDebug component initialized - testing logging system');
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

  const clearLogs = () => {
    remoteLogger.clearLogs();
    setRemoteLogs([]);
  };

  const testLogging = () => {
    logAuthEvent('Test log triggered manually', { timestamp: new Date().toISOString() });
    // Force refresh logs
    const logs = remoteLogger.getLogs();
    setRemoteLogs(logs);
  };

  const testSignInFunction = async () => {
    try {
      console.log('🧪 Testing signInWithGoogle function directly...');
      logAuthEvent('Testing signInWithGoogle from debug panel');
      
      // Run mobile diagnostic
      const diagnostic = runMobileAuthDiagnostic();
      logAuthEvent('Mobile diagnostic completed', diagnostic);
      
      // Test Firebase auth
      const firebaseTest = await testFirebaseAuth();
      logAuthEvent('Firebase auth test', { success: firebaseTest });
      
      // Add immediate test log
      console.log('🔥 About to call signInWithGoogle...');
      logAuthEvent('About to call signInWithGoogle');
      
      await signInWithGoogle();
      
      console.log('🔥 signInWithGoogle completed successfully');
      logAuthEvent('signInWithGoogle completed successfully');
    } catch (error: any) {
      console.log('❌ Test signIn failed:', error);
      logAuthEvent('Test signIn failed', { error: error.message });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-3 rounded-lg text-xs max-w-md z-50 border border-yellow-500/30 max-h-96 overflow-y-auto">
      <div className="font-bold mb-2 text-yellow-400">🔍 Auth Debug</div>
      
      {/* Auth Status */}
      <div className="space-y-1 mb-3 pb-2 border-b border-gray-600">
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

      {/* Remote Logs */}
      <div className="mb-3 pb-2 border-b border-gray-600">
        <div className="font-bold text-yellow-300 mb-1">📱 Remote Logs ({remoteLogs.length})</div>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {remoteLogs.slice(0, 10).map((log, index) => (
            <div key={index} className={`text-xs ${
              log.level === 'error' ? 'text-red-400' : 
              log.level === 'warn' ? 'text-yellow-400' : 
              'text-green-400'
            }`}>
              <div className="font-mono">{log.message}</div>
              {log.data && <div className="text-gray-400 ml-2">{JSON.stringify(log.data)}</div>}
            </div>
          ))}
          {remoteLogs.length === 0 && <div className="text-gray-400">No logs yet</div>}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
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
        <button 
          onClick={testLogging}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs"
        >
          🧪 Test Logging
        </button>
        <button 
          onClick={testSignInFunction}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-xs"
        >
          🔐 Test Sign-In
        </button>
        <button 
          onClick={() => {
            const diagnostic = runMobileAuthDiagnostic();
            logAuthEvent('Manual diagnostic run', diagnostic);
            console.log('📱 Mobile Diagnostic:', diagnostic);
          }}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-2 py-1 rounded text-xs"
        >
          📱 Run Diagnostic
        </button>
        <button 
          onClick={clearLogs}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
        >
          🗑️ Clear Logs
        </button>
      </div>
    </div>
  );
}
