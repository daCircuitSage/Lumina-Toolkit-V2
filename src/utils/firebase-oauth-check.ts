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
    
    if (!authDomain) {
      results.issues.push('Firebase authDomain is not configured in the auth object');
      results.recommendations.push('Check Firebase initialization and environment variables');
    }
    
    // Only warn about missing OAuth params if a redirect-like URL is present
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const hasAnyUrlParams = window.location.search.length > 0 || window.location.hash.length > 0;
    const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('access_token') || hashParams.has('code') || hashParams.has('state') || hashParams.has('access_token');
    
    if (hasAnyUrlParams && !hasAuthParams) {
      results.issues.push('No OAuth parameters in URL - Google redirect not working');
      results.recommendations.push('Check Firebase OAuth consent screen configuration');
      results.recommendations.push('Verify authorized redirect URIs in Google Cloud OAuth client');
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
  const origin = domain.replace(/^https?:\/\//, '');
  return {
    title: 'Firebase OAuth Configuration Required',
    steps: [
      '1. Go to Firebase Console → Authentication → Settings',
      '2. Under "Authorized domains", add these domains without protocol:',
      '   - luminatoolkit.com',
      '   - www.lumintoolkit.com',
      '3. Go to Google Cloud Console → APIs & Services → Credentials',
      '4. Edit your OAuth 2.0 Client ID',
      '5. Under "Authorized redirect URIs", add:',
      '   - https://luminatoolkit.firebaseapp.com/__/auth/handler',
      '6. Under "Authorized JavaScript origins", add:',
      `   - https://${origin}`,
      `   - https://www.${origin.replace(/^www\./, '')}`,
      '7. Save settings and test authentication again',
      '8. Clear browser cache and cookies before testing'
    ]
  };
};
