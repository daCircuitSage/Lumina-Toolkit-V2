// Firebase OAuth Configuration Checker
// Verifies OAuth settings that cause mobile redirect failures

export const checkFirebaseOAuthConfig = async () => {
  console.log('🔍 ===== FIREBASE OAUTH CONFIG CHECK =====');
  
  const results = {
    timestamp: new Date().toISOString(),
    domain: window.location.origin,
    issues: [] as string[],
    recommendations: [] as string[]
  };
  
  // Check if we can detect Firebase configuration
  try {
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    
    if (!auth) {
      results.issues.push('Firebase auth not initialized');
      results.recommendations.push('Check Firebase configuration in firebase.ts');
      return results;
    }
    
    // Get auth config (if available)
    const config = (auth as any).config;
    console.log('🔧 Auth config:', {
      hasConfig: !!config,
      apiKey: !!config?.apiKey,
      authDomain: !!config?.authDomain,
      projectId: !!config?.projectId
    });
    
    if (!config) {
      results.issues.push('Firebase auth config not accessible');
      results.recommendations.push('Check Firebase initialization in firebase.ts');
      return results;
    }
    
    // Check domain configuration
    const currentDomain = window.location.origin;
    const authDomain = config.authDomain;
    
    if (authDomain && !currentDomain.includes(authDomain)) {
      results.issues.push(`Domain mismatch: app configured for ${authDomain} but running on ${currentDomain}`);
      results.recommendations.push(`Update authDomain in Firebase config to match ${currentDomain}`);
    }
    
    // Check for common OAuth issues
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('access_token');
    
    if (!hasAuthParams) {
      results.issues.push('No OAuth parameters in URL - Google redirect not working');
      results.recommendations.push('Check Firebase OAuth consent screen configuration');
      results.recommendations.push('Verify authorized redirect URIs in Firebase Console');
    }
    
    console.log('📊 OAuth check results:', results);
    
    return results;
  } catch (error: any) {
    results.issues.push(`Error checking OAuth config: ${error.message}`);
    results.recommendations.push('Check Firebase configuration and network connection');
    return results;
  }
};

export const generateOAuthSetupInstructions = (domain: string) => {
  return {
    title: 'Firebase OAuth Configuration Required',
    steps: [
      '1. Go to Firebase Console → Authentication → Settings',
      '2. Click "OAuth consent screen" tab',
      '3. Under "Authorized redirect URIs", add:',
      `   - ${domain}`,
      `   - ${domain}/`,
      '4. Under "Authorized domains", add:',
      `   - ${domain}`,
      '5. Under "Authorized JavaScript origins", add:',
      `   - ${domain}`,
      '6. Save settings and test authentication again',
      '7. Clear browser cache and cookies before testing'
    ]
  };
};
