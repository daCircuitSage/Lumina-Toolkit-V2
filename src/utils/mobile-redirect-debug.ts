// Mobile Redirect Debug Tool
// Helps identify exactly where mobile authentication is failing

import { getAuth, getRedirectResult } from 'firebase/auth';

export class MobileRedirectDebug {
  private auth: any;

  constructor() {
    this.auth = getAuth();
  }

  // Comprehensive redirect debugging
  async debugRedirectFlow(): Promise<{ success: boolean; details: any; error?: string }> {
    console.log('🔍 ===== MOBILE REDIRECT DEBUG START =====');
    
    const debugInfo: any = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      search: window.location.search,
      hash: window.location.hash,
      origin: window.location.origin,
      pathname: window.location.pathname,
      userAgent: navigator.userAgent,
      authState: null as any,
      redirectResult: null as any,
      error: null as any
    };

    try {
      // 1. Check current auth state before redirect result
      debugInfo.authState = {
        currentUser: !!this.auth.currentUser,
        email: this.auth.currentUser?.email,
        uid: this.auth.currentUser?.uid
      };
      console.log('👤 Current auth state:', debugInfo.authState);

      // 2. Check URL parameters for auth indicators
      const urlParams = new URLSearchParams(window.location.search);
      const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('access_token') || urlParams.has('id_token');
      debugInfo.hasAuthParams = hasAuthParams;
      console.log('🔗 URL auth params:', hasAuthParams);

      // 3. Check sessionStorage for mobile auth flags
      const mobileAuthInProgress = sessionStorage.getItem('mobileAuthInProgress');
      const mobileAuthTimestamp = sessionStorage.getItem('mobileAuthTimestamp');
      debugInfo.sessionStorage = {
        mobileAuthInProgress,
        mobileAuthTimestamp,
        elapsed: mobileAuthTimestamp ? Date.now() - parseInt(mobileAuthTimestamp) : null
      };
      console.log('💾 Session storage:', debugInfo.sessionStorage);

      // 4. Get redirect result with detailed error handling
      console.log('🔄 Calling getRedirectResult...');
      const redirectResult = await getRedirectResult(this.auth);
      debugInfo.redirectResult = {
        hasResult: !!redirectResult,
        hasUser: !!redirectResult?.user,
        userEmail: redirectResult?.user?.email,
        userId: redirectResult?.user?.uid,
        credential: !!(redirectResult as any)?.credential
      };
      console.log('🔄 Redirect result:', debugInfo.redirectResult);

      // 5. Check final auth state
      const finalAuthState = {
        currentUser: !!this.auth.currentUser,
        email: this.auth.currentUser?.email,
        uid: this.auth.currentUser?.uid
      };
      debugInfo.finalAuthState = finalAuthState;
      console.log('👤 Final auth state:', finalAuthState);

      // 6. Analyze the results
      const analysis = this.analyzeResults(debugInfo);
      debugInfo.analysis = analysis;

      console.log('📊 Debug analysis:', analysis);
      console.log('🔍 ===== MOBILE REDIRECT DEBUG END =====');

      return {
        success: analysis.success,
        details: debugInfo
      };

    } catch (error: any) {
      debugInfo.error = {
        code: error.code,
        message: error.message,
        stack: error.stack
      };
      console.error('❌ Redirect debug error:', debugInfo.error);
      
      return {
        success: false,
        details: debugInfo,
        error: this.getErrorMessage(error)
      };
    }
  }

  private analyzeResults(debugInfo: any): { success: boolean; issue: string; recommendation: string } {
    // Case 1: Successful authentication
    if (debugInfo.redirectResult?.hasUser && debugInfo.finalAuthState?.currentUser) {
      return {
        success: true,
        issue: 'Authentication successful',
        recommendation: 'No action needed'
      };
    }

    // Case 2: Redirect returned user but not in auth state
    if (debugInfo.redirectResult?.hasUser && !debugInfo.finalAuthState?.currentUser) {
      return {
        success: false,
        issue: 'Redirect result has user but auth state not updated',
        recommendation: 'Check onAuthStateChanged listener setup in AuthContext'
      };
    }

    // Case 3: No redirect result but has auth params
    if (!debugInfo.redirectResult?.hasUser && debugInfo.hasAuthParams) {
      return {
        success: false,
        issue: 'URL has auth params but getRedirectResult returned no user',
        recommendation: 'Check Firebase Auth domain configuration and OAuth settings'
      };
    }

    // Case 4: No redirect result and no auth params
    if (!debugInfo.redirectResult?.hasUser && !debugInfo.hasAuthParams) {
      return {
        success: false,
        issue: 'No redirect result and no auth parameters in URL',
        recommendation: 'Authentication was cancelled or failed during Google redirect'
      };
    }

    // Case 5: Error in redirect result
    if (debugInfo.error) {
      return {
        success: false,
        issue: `Error in getRedirectResult: ${debugInfo.error.code}`,
        recommendation: this.getErrorMessage(debugInfo.error)
      };
    }

    // Default case
    return {
      success: false,
      issue: 'Unknown authentication failure',
      recommendation: 'Check Firebase console for detailed error logs'
    };
  }

  private getErrorMessage(error: any): string {
    if (!error) return 'Unknown error occurred';
    
    switch (error.code) {
      case 'auth/unauthorized-domain':
        return `Domain ${window.location.origin} is not authorized. Add it to Firebase Auth settings.`;
      case 'auth/redirect-cancelled-by-user':
        return 'Authentication was cancelled by the user.';
      case 'auth/redirect-pending':
        return 'A redirect is already in progress.';
      case 'auth/no-current-user':
        return 'No user is currently signed in.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection.';
      case 'auth/timeout':
        return 'Authentication timed out. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please wait and try again.';
      default:
        return error.message || 'Authentication failed. Please try again.';
    }
  }

  // Create a test function to manually trigger redirect handling
  async testRedirectHandling(): Promise<void> {
    console.log('🧪 Testing redirect handling manually...');
    
    // Clear any existing auth state
    await this.auth.signOut();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check redirect result
    const result = await this.debugRedirectFlow();
    
    console.log('📋 Test result:', result);
  }
}

// Export singleton instance
export const mobileRedirectDebug = new MobileRedirectDebug();
