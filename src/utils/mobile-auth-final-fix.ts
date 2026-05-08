// Final Mobile Authentication Fix
// Completely rewritten mobile authentication approach

import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut } from 'firebase/auth';

export class MobileAuthFinalFix {
  private auth: any;
  private googleProvider: any;

  constructor() {
    this.auth = getAuth();
    this.googleProvider = new GoogleAuthProvider();
    
    // Configure Google provider for mobile
    this.googleProvider.addScope('email');
    this.googleProvider.addScope('profile');
  }

  // Force sign out to clear any stale state
  async forceSignOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('🔓 Forced sign out complete');
    } catch (error) {
      console.log('🔓 Sign out failed (might not be signed in)');
    }
  }

  // Mobile-specific sign in with enhanced error handling
  async signInMobile(): Promise<{ success: boolean; user?: any; error?: string }> {
    console.log('🚀 Starting final mobile auth fix...');
    
    try {
      // Clear any existing auth state
      await this.forceSignOut();
      
      // Clear URL state
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear session storage
      sessionStorage.removeItem('mobileAuthInProgress');
      sessionStorage.removeItem('mobileAuthTimestamp');
      
      // Set mobile auth flag
      sessionStorage.setItem('mobileAuthInProgress', 'true');
      sessionStorage.setItem('mobileAuthTimestamp', Date.now().toString());
      
      console.log('🔁 Initiating mobile redirect...');
      
      // Use redirect for mobile
      await signInWithRedirect(this.auth, this.googleProvider);
      
      return { success: true };
      
    } catch (error: any) {
      console.error('❌ Mobile sign-in error:', error);
      
      // Clear auth flags on error
      sessionStorage.removeItem('mobileAuthInProgress');
      sessionStorage.removeItem('mobileAuthTimestamp');
      
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Handle redirect result with enhanced processing
  async handleRedirectResult(): Promise<{ success: boolean; user?: any; error?: string }> {
    console.log('🔄 Handling redirect result...');
    
    try {
      // Check if we're returning from mobile auth
      const mobileAuthInProgress = sessionStorage.getItem('mobileAuthInProgress');
      const mobileAuthTimestamp = sessionStorage.getItem('mobileAuthTimestamp');
      
      if (!mobileAuthInProgress) {
        console.log('ℹ️ No mobile auth session flag found; still checking redirect result');
      } else {
        console.log('📱 Mobile auth detected, processing redirect...');
      }
      
      // Get redirect result
      const result = await getRedirectResult(this.auth);
      
      if (result?.user) {
        console.log('✅ Mobile auth successful:', result.user.email);
        
        // Clear mobile auth flags
        sessionStorage.removeItem('mobileAuthInProgress');
        sessionStorage.removeItem('mobileAuthTimestamp');
        
        // Clear URL state
        window.history.replaceState({}, document.title, window.location.pathname);
        
        return {
          success: true,
          user: result.user
        };
      } else {
        console.log('❌ No user in redirect result');
        
        // Clear mobile auth flags
        sessionStorage.removeItem('mobileAuthInProgress');
        sessionStorage.removeItem('mobileAuthTimestamp');
        
        return {
          success: false,
          error: 'No user returned from redirect'
        };
      }
      
    } catch (error: any) {
      console.error('❌ Redirect result error:', error);
      
      // Clear mobile auth flags on error
      sessionStorage.removeItem('mobileAuthInProgress');
      sessionStorage.removeItem('mobileAuthTimestamp');
      
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Check current auth state
  getCurrentUser(): any {
    return this.auth.currentUser;
  }

  // Enhanced error message handling
  private getErrorMessage(error: any): string {
    if (!error) return 'Unknown error occurred';
    
    switch (error.code) {
      case 'auth/unauthorized-domain':
        return `Domain ${window.location.origin} is not authorized. Check Firebase Console settings.`;
      case 'auth/redirect-cancelled-by-user':
        return 'Authentication was cancelled. Please try again.';
      case 'auth/redirect-pending':
        return 'Another authentication is already in progress.';
      case 'auth/no-current-user':
        return 'No user is currently signed in.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      case 'auth/timeout':
        return 'Authentication timed out. Please try again.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please wait and try again.';
      default:
        return error.message || 'Authentication failed. Please try again.';
    }
  }

  // Comprehensive mobile test
  async runMobileAuthTest(): Promise<{ results: any }> {
    console.log('🧪 Running comprehensive mobile auth test...');
    
    const results = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      search: window.location.search,
      hash: window.location.hash,
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      currentUser: null,
      authReady: false,
      mobileAuthInProgress: false,
      urlAuthParams: false,
      redirectResult: null,
      error: null
    };

    try {
      // Check auth state
      results.currentUser = this.auth.currentUser;
      results.authReady = !!this.auth;
      
      // Check mobile auth state
      results.mobileAuthInProgress = !!sessionStorage.getItem('mobileAuthInProgress');
      
      // Check URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      results.urlAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('access_token');
      
      // Try to get redirect result
      try {
        const redirectResult = await getRedirectResult(this.auth);
        results.redirectResult = {
          hasResult: !!redirectResult,
          hasUser: !!redirectResult?.user,
          email: redirectResult?.user?.email
        };
      } catch (redirectError: any) {
        results.redirectResult = {
          error: redirectError.code,
          message: redirectError.message
        };
      }
      
      console.log('📊 Mobile auth test results:', results);
      
    } catch (error: any) {
      results.error = {
        code: error.code,
        message: error.message
      };
      console.error('❌ Mobile auth test error:', results.error);
    }
    
    return { results };
  }
}

// Export singleton instance
export const mobileAuthFinalFix = new MobileAuthFinalFix();
