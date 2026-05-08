import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthTestPage() {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const checkAuth = () => {
    addResult(`Current user: ${currentUser ? currentUser.email : 'Not logged in'}`);
    addResult(`User ID: ${currentUser ? currentUser.uid : 'N/A'}`);
    addResult(`Display Name: ${currentUser ? (currentUser.displayName || 'Not set') : 'N/A'}`);
  };

  const testGoogleAuth = async () => {
    try {
      addResult('Starting Google sign-in test...');
      const result = await signInWithGoogle();
      if (result?.redirectInitiated) {
        addResult('🔄 Redirect initiated for mobile sign-in. Complete auth in the returned window/tab.');
        return;
      }
      addResult('✅ Google sign-in completed successfully');
    } catch (error: any) {
      addResult(`❌ Google sign-in failed: ${error.message}`);
    }
  };

  const testLogout = async () => {
    try {
      addResult('Testing logout...');
      await logout();
      addResult('✅ Logout successful');
    } catch (error: any) {
      addResult(`❌ Logout failed: ${error.message}`);
    }
  };

  useEffect(() => {
    addResult(`Auth state changed: ${currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in'}`);
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">🔍 Authentication System Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={checkAuth}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              👤 Check Current User
            </button>
            
            <button
              onClick={testGoogleAuth}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            >
              🔐 Test Google Sign-In
            </button>
            
            <button
              onClick={testLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              🚪 Test Logout
            </button>
          </div>

          <div className="mb-4">
            <button
              onClick={() => navigate('/')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              🏠 Back to Homepage
            </button>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <h2 className="font-bold mb-2">📋 Test Results:</h2>
            <div className="h-64 overflow-y-auto font-mono text-sm">
              {testResults.length === 0 ? (
                <p className="text-gray-500">No tests run yet. Click a button above to start testing.</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">{result}</div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2">📊 Current Status:</h3>
            <div className="space-y-1">
              <p><strong>Current User:</strong> {currentUser ? currentUser.email : 'Not logged in'}</p>
              <p><strong>User ID:</strong> {currentUser ? currentUser.uid : 'N/A'}</p>
              <p><strong>Display Name:</strong> {currentUser ? (currentUser.displayName || 'Not set') : 'N/A'}</p>
              <p><strong>Email Verified:</strong> {currentUser ? (currentUser.emailVerified ? 'Yes' : 'No') : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
