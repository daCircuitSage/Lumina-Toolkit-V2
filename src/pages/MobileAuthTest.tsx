import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { runMobileAuthDiagnostic, testFirebaseAuth } from '../utils/mobile-auth-diagnostic';
import { checkFirebaseDomainConfig, getFirebaseAuthInstructions, createMobileAuthTest } from '../utils/firebase-domain-check';
import { mobileRedirectDebug } from '../utils/mobile-redirect-debug';

export default function MobileAuthTest() {
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runComprehensiveTest();
  }, []);

  const runComprehensiveTest = async () => {
    console.log('🧪 Running comprehensive mobile auth test...');
    
    // 1. Run mobile diagnostic
    const diagnostic = runMobileAuthDiagnostic();
    
    // 2. Test Firebase auth
    const firebaseTest = await testFirebaseAuth();
    
    // 3. Check Firebase domain configuration
    const domainTest = checkFirebaseDomainConfig();
    
    // 4. Get setup instructions if needed
    const instructions = domainTest.issues.length > 0 ? getFirebaseAuthInstructions(domainTest.domain) : null;
    
    // 5. Check current auth state
    const authState = {
      currentUser: !!currentUser,
      userEmail: currentUser?.email,
      userId: currentUser?.uid
    };
    
    // 6. Check URL parameters (for redirect results)
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('access_token');
    
    const results = {
      diagnostic,
      firebaseTest,
      domainTest,
      authState,
      urlParams: {
        hasAuthParams,
        search: window.location.search,
        hash: window.location.hash
      },
      instructions,
      timestamp: new Date().toISOString()
    };
    
    setTestResults(results);
    console.log('📊 Comprehensive test results:', results);
  };

  const handleMobileSignIn = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Starting mobile sign-in test...');
      const result = await signInWithGoogle();
      console.log('📝 Sign-in result:', result);
      
      if (result?.redirectInitiated) {
        console.log('🔄 Redirect initiated, waiting for return...');
        // Wait a bit and then check again
        setTimeout(() => {
          runComprehensiveTest();
          setIsLoading(false);
        }, 5000);
      } else {
        console.log('✅ Sign-in completed immediately');
        runComprehensiveTest();
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('❌ Mobile sign-in failed:', error);
      setIsLoading(false);
    }
  };

  const handleRedirectDebug = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Running redirect debug...');
      const debugResult = await mobileRedirectDebug.debugRedirectFlow();
      console.log('📊 Redirect debug result:', debugResult);
      
      // Update test results with debug info
      setTestResults(prev => ({
        ...prev,
        redirectDebug: debugResult
      }));
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Redirect debug failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mobile Authentication Test</h1>
        
        {/* Test Results */}
        {testResults && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            <div className="space-y-4">
              {/* Mobile Detection */}
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Mobile Detection</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Is Mobile:</strong> {testResults.diagnostic?.diagnostic?.isMobile ? 'Yes' : 'No'}</p>
                  <p><strong>Is iOS:</strong> {testResults.diagnostic?.diagnostic?.isIOS ? 'Yes' : 'No'}</p>
                  <p><strong>Is Android:</strong> {testResults.diagnostic?.diagnostic?.isAndroid ? 'Yes' : 'No'}</p>
                  <p><strong>User Agent:</strong> {testResults.diagnostic?.diagnostic?.userAgent}</p>
                </div>
              </div>

              {/* Browser Capabilities */}
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Browser Capabilities</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Cookies:</strong> {testResults.diagnostic?.diagnostic?.cookies ? 'Enabled' : 'Disabled'}</p>
                  <p><strong>localStorage:</strong> {testResults.diagnostic?.diagnostic?.localStorage ? 'Available' : 'Not Available'}</p>
                  <p><strong>sessionStorage:</strong> {testResults.diagnostic?.diagnostic?.sessionStorage ? 'Available' : 'Not Available'}</p>
                </div>
              </div>

              {/* Firebase Status */}
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Firebase Status</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Firebase Initialized:</strong> {testResults.firebaseTest ? 'Yes' : 'No'}</p>
                  <p><strong>Current User:</strong> {testResults.authState?.currentUser ? testResults.authState.userEmail : 'Not logged in'}</p>
                  <p><strong>User ID:</strong> {testResults.authState?.userId || 'None'}</p>
                </div>
              </div>

              {/* Firebase Domain Configuration */}
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">Firebase Domain Configuration</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Current Domain:</strong> {testResults.domainTest?.domain || 'Unknown'}</p>
                  <p><strong>Environment:</strong> {testResults.domainTest?.isLocalhost ? 'Development' : 'Production'}</p>
                  <p><strong>Configured:</strong> {testResults.domainTest?.isConfigured ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {/* URL Parameters */}
              <div className="border rounded p-4">
                <h3 className="font-semibold mb-2">URL Parameters</h3>
                <div className="text-sm space-y-1">
                  <p><strong>Has Auth Params:</strong> {testResults.urlParams?.hasAuthParams ? 'Yes' : 'No'}</p>
                  <p><strong>Search:</strong> {testResults.urlParams?.search || 'None'}</p>
                  <p><strong>Hash:</strong> {testResults.urlParams?.hash || 'None'}</p>
                </div>
              </div>

              {/* Issues */}
              {testResults.diagnostic?.issues && testResults.diagnostic.issues.length > 0 && (
                <div className="border rounded p-4 bg-red-50">
                  <h3 className="font-semibold mb-2 text-red-800">Issues Detected</h3>
                  <ul className="text-sm space-y-1 text-red-700">
                    {testResults.diagnostic.issues.map((issue: string, index: number) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Firebase Setup Instructions */}
              {testResults.instructions && (
                <div className="border rounded p-4 bg-amber-50">
                  <h3 className="font-semibold mb-2 text-amber-800">{testResults.instructions.title}</h3>
                  <ol className="text-sm space-y-1 text-amber-700 list-decimal list-inside">
                    {testResults.instructions.instructions.map((instruction: string, index: number) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Redirect Debug Results */}
              {testResults.redirectDebug && (
                <div className="border rounded p-4 bg-purple-50">
                  <h3 className="font-semibold mb-2 text-purple-800">Redirect Debug Results</h3>
                  <div className="text-sm space-y-2">
                    <p><strong>Success:</strong> {testResults.redirectDebug.success ? 'Yes' : 'No'}</p>
                    {testResults.redirectDebug.error && (
                      <p><strong>Error:</strong> {testResults.redirectDebug.error}</p>
                    )}
                    {testResults.redirectDebug.details?.analysis && (
                      <div className="mt-2">
                        <p><strong>Issue:</strong> {testResults.redirectDebug.details.analysis.issue}</p>
                        <p><strong>Recommendation:</strong> {testResults.redirectDebug.details.analysis.recommendation}</p>
                      </div>
                    )}
                    {testResults.redirectDebug.details?.authState && (
                      <div className="mt-2">
                        <p><strong>Auth State Before:</strong> {testResults.redirectDebug.details.authState.currentUser ? 'Logged in' : 'Not logged in'}</p>
                        <p><strong>Auth State After:</strong> {testResults.redirectDebug.details.finalAuthState?.currentUser ? 'Logged in' : 'Not logged in'}</p>
                      </div>
                    )}
                    {testResults.redirectDebug.details?.redirectResult && (
                      <div className="mt-2">
                        <p><strong>Redirect Result:</strong> {testResults.redirectDebug.details.redirectResult.hasUser ? 'User found' : 'No user'}</p>
                        <p><strong>URL Auth Params:</strong> {testResults.redirectDebug.details.hasAuthParams ? 'Yes' : 'No'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="space-y-4">
            <button
              onClick={runComprehensiveTest}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Run Diagnostic Test
            </button>
            
            <button
              onClick={handleRedirectDebug}
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '🔍 Debugging...' : '🔍 Debug Redirect Flow'}
            </button>
            
            <button
              onClick={handleMobileSignIn}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '⏳ Testing Sign-In...' : '🔑 Test Google Sign-In'}
            </button>
            
            {currentUser && (
              <button
                onClick={async () => {
                  await logout();
                  setTimeout(runComprehensiveTest, 1000);
                }}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                🚪 Sign Out & Test
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mobile Testing Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open this page on your mobile device</li>
            <li>Check "Mobile Detection" results to confirm mobile detection is working</li>
            <li>Verify "Browser Capabilities" show all required features are available</li>
            <li>Click "Test Google Sign-In" and observe the behavior</li>
            <li>After redirect, check if URL parameters are present</li>
            <li>Verify "Firebase Status" shows you as logged in</li>
            <li>If issues are detected, they will be highlighted in red</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
