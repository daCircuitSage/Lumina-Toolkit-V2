import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { runMobileAuthDiagnostic, testFirebaseAuth } from '../utils/mobile-auth-diagnostic';
import { checkFirebaseDomainConfig, getFirebaseAuthInstructions, createMobileAuthTest } from '../utils/firebase-domain-check';
import { simpleMobileDebug } from '../utils/simple-mobile-debug';
import { checkFirebaseOAuthConfig, generateOAuthSetupInstructions } from '../utils/firebase-oauth-check';
import { mobileAuthFinalFix } from '../utils/mobile-auth-final-fix';

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
    
    // 4. Check Firebase OAuth configuration
    const oauthCheck = await checkFirebaseOAuthConfig();
    
    // 5. Get setup instructions if needed
    const instructions = domainTest.issues.length > 0 ? getFirebaseAuthInstructions(domainTest.domain) : null;
    const oauthInstructions = oauthCheck.issues.length > 0 ? generateOAuthSetupInstructions(domainTest.domain) : null;
    
    // 6. Check current auth state
    const authState = {
      currentUser: !!currentUser,
      userEmail: currentUser?.email,
      userId: currentUser?.uid
    };
    
    // 7. Check URL parameters (for redirect results)
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('access_token');
    
    const results = {
      diagnostic,
      firebaseTest,
      domainTest,
      oauthCheck,
      authState,
      urlParams: {
        hasAuthParams,
        search: window.location.search,
        hash: window.location.hash
      },
      instructions,
      oauthInstructions,
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
      console.log('🔍 Running simple mobile debug...');
      const debugResult = await simpleMobileDebug();
      console.log('📊 Simple debug result:', debugResult);
      
      // Update test results with debug info
      setTestResults(prev => ({
        ...prev,
        simpleDebug: debugResult
      }));
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Simple debug failed:', error);
      setIsLoading(false);
    }
  };

  const handleFinalFixTest = async () => {
    setIsLoading(true);
    try {
      console.log('🚀 Running final mobile auth fix test...');
      const testResult = await mobileAuthFinalFix.runMobileAuthTest();
      console.log('📊 Final fix test result:', testResult);
      
      // Update test results with final fix info
      setTestResults(prev => ({
        ...prev,
        finalFixTest: testResult.results
      }));
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('❌ Final fix test failed:', error);
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

              {/* Simple Debug Results */}
              {testResults.simpleDebug && (
                <div className="border rounded p-4 bg-purple-50">
                  <h3 className="font-semibold mb-2 text-purple-800">Simple Debug Results</h3>
                  <div className="text-sm space-y-2">
                    <p><strong>Device:</strong> {testResults.simpleDebug.isMobile ? 'Mobile' : 'Desktop'}</p>
                    <p><strong>Cookies:</strong> {testResults.simpleDebug.cookies ? 'Enabled' : 'Disabled'}</p>
                    <p><strong>localStorage:</strong> {testResults.simpleDebug.localStorage ? 'Available' : 'Not Available'}</p>
                    <p><strong>URL Auth Params:</strong> {testResults.simpleDebug.hasAuthParams ? 'Yes' : 'No'}</p>
                    
                    {testResults.simpleDebug.firebase && (
                      <div className="mt-2">
                        <p><strong>Firebase Initialized:</strong> {testResults.simpleDebug.firebase.initialized ? 'Yes' : 'No'}</p>
                        <p><strong>Current User:</strong> {testResults.simpleDebug.firebase.currentUser ? testResults.simpleDebug.firebase.email : 'Not logged in'}</p>
                      </div>
                    )}
                    
                    {testResults.simpleDebug.redirectResult && (
                      <div className="mt-2">
                        <p><strong>Redirect Result:</strong> {testResults.simpleDebug.redirectResult.hasUser ? 'User found' : 'No user'}</p>
                        <p><strong>Redirect Email:</strong> {testResults.simpleDebug.redirectResult.email || 'None'}</p>
                      </div>
                    )}
                    
                    {testResults.simpleDebug.redirectError && (
                      <div className="mt-2">
                        <p><strong>Redirect Error:</strong> {testResults.simpleDebug.redirectError.code}</p>
                        <p><strong>Error Message:</strong> {testResults.simpleDebug.redirectError.message}</p>
                      </div>
                    )}
                    
                    {testResults.simpleDebug.firebaseError && (
                      <div className="mt-2">
                        <p><strong>Firebase Error:</strong> {testResults.simpleDebug.firebaseError.code}</p>
                        <p><strong>Error Message:</strong> {testResults.simpleDebug.firebaseError.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* OAuth Configuration Check */}
              {testResults.oauthCheck && (
                <div className="border rounded p-4 bg-red-50">
                  <h3 className="font-semibold mb-2 text-red-800">OAuth Configuration Issues</h3>
                  <div className="text-sm space-y-2">
                    {testResults.oauthCheck.issues.map((issue: string, index: number) => (
                      <p key={index} className="text-red-700">• {issue}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* OAuth Setup Instructions */}
              {testResults.oauthInstructions && (
                <div className="border rounded p-4 bg-orange-50">
                  <h3 className="font-semibold mb-2 text-orange-800">{testResults.oauthInstructions.title}</h3>
                  <ol className="text-sm space-y-1 text-orange-700 list-decimal list-inside">
                    {testResults.oauthInstructions.steps.map((step: string, index: number) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Final Fix Test Results */}
              {testResults.finalFixTest && (
                <div className="border rounded p-4 bg-green-50">
                  <h3 className="font-semibold mb-2 text-green-800">Final Mobile Auth Fix Results</h3>
                  <div className="text-sm space-y-2">
                    <p><strong>Device:</strong> {testResults.finalFixTest.isMobile ? 'Mobile' : 'Desktop'}</p>
                    <p><strong>Auth Ready:</strong> {testResults.finalFixTest.authReady ? 'Yes' : 'No'}</p>
                    <p><strong>Current User:</strong> {testResults.finalFixTest.currentUser ? testResults.finalFixTest.currentUser.email : 'Not logged in'}</p>
                    <p><strong>Mobile Auth In Progress:</strong> {testResults.finalFixTest.mobileAuthInProgress ? 'Yes' : 'No'}</p>
                    <p><strong>URL Auth Params:</strong> {testResults.finalFixTest.urlAuthParams ? 'Yes' : 'No'}</p>
                    
                    {testResults.finalFixTest.redirectResult && (
                      <div className="mt-2">
                        <p><strong>Redirect Result:</strong></p>
                        {testResults.finalFixTest.redirectResult.error ? (
                          <div>
                            <p><strong>Error:</strong> {testResults.finalFixTest.redirectResult.error}</p>
                            <p><strong>Message:</strong> {testResults.finalFixTest.redirectResult.message}</p>
                          </div>
                        ) : (
                          <div>
                            <p><strong>Has Result:</strong> {testResults.finalFixTest.redirectResult.hasResult ? 'Yes' : 'No'}</p>
                            <p><strong>Has User:</strong> {testResults.finalFixTest.redirectResult.hasUser ? 'Yes' : 'No'}</p>
                            <p><strong>Email:</strong> {testResults.finalFixTest.redirectResult.email || 'None'}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {testResults.finalFixTest.error && (
                      <div className="mt-2">
                        <p><strong>Test Error:</strong> {testResults.finalFixTest.error.code}</p>
                        <p><strong>Error Message:</strong> {testResults.finalFixTest.error.message}</p>
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
              onClick={handleFinalFixTest}
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '🚀 Testing Final Fix...' : '🚀 Test Final Mobile Fix'}
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
