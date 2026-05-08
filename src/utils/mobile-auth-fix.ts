// Mobile Authentication Fix
// Addresses common mobile authentication issues

import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';

export class MobileAuthFix {
  private auth: any;
  private googleProvider: any;

  constructor() {
    this.auth = getAuth();
    this.googleProvider = new GoogleAuthProvider();
    this.configureProvider();
  }

  private configureProvider() {
    this.googleProvider.addScope('profile');
    this.googleProvider.addScope('email');
    this.googleProvider.setCustomParameters({
      prompt: 'select_account',
      access_type: 'offline'
    });
  }

  // Enhanced mobile detection
  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 1024;
    
    return isMobile || isTablet || (hasTouchScreen && isSmallScreen);
  }

  // Check for mobile-specific issues
  private checkMobileReadiness(): { ready: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check cookies
    if (!navigator.cookieEnabled) {
      issues.push('Cookies are disabled - required for Firebase auth');
    }
    
    // Check localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (error) {
      issues.push('localStorage not available - required for auth persistence');
    }
    
    // Check for iOS private browsing
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS && !navigator.cookieEnabled) {
      issues.push('iOS private browsing mode detected - auth may not work');
    }
    
    // Check for unsupported browsers
    const userAgent = navigator.userAgent;
    if (/Opera Mini|UCBrowser|SamsungBrowser/i.test(userAgent)) {
      issues.push('Unsupported browser detected - use Chrome, Safari, or Firefox');
    }
    
    return {
      ready: issues.length === 0,
      issues
    };
  }

  // Enhanced mobile sign-in with better error handling
  async signInWithGoogle(): Promise<{ success: boolean; error?: string; redirectInitiated?: boolean }> {
    console.log('🚀 Enhanced mobile sign-in initiated');
    
    // Check mobile readiness
    const readiness = this.checkMobileReadiness();
    if (!readiness.ready) {
      console.error('❌ Mobile auth not ready:', readiness.issues);
      return {
        success: false,
        error: `Mobile auth not ready: ${readiness.issues.join(', ')}`
      };
    }
    
    const isMobile = this.isMobileDevice();
    console.log('📱 Device type:', isMobile ? 'Mobile' : 'Desktop');
    
    try {
      if (isMobile) {
        // Mobile: Use redirect with enhanced handling
        console.log('🔁 Using redirect for mobile');
        
        // Clear any existing redirect state
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Set a flag to detect redirect completion
        sessionStorage.setItem('mobileAuthInProgress', 'true');
        sessionStorage.setItem('mobileAuthTimestamp', Date.now().toString());
        
        await signInWithRedirect(this.auth, this.googleProvider);
        return {
          success: true,
          redirectInitiated: true
        };
      } else {
        // Desktop: Use popup with fallback
        console.log('🪟 Using popup for desktop');
        const { signInWithPopup } = await import('firebase/auth');
        
        try {
          const result = await signInWithPopup(this.auth, this.googleProvider);
          console.log('✅ Popup sign-in successful');
          return {
            success: true
          };
        } catch (popupError: any) {
          console.warn('⚠️ Popup failed, falling back to redirect:', popupError);
          
          if (
            popupError.code === 'auth/popup-closed-by-user' ||
            popupError.code === 'auth/popup-blocked' ||
            popupError.code === 'auth/operation-not-supported-in-this-environment'
          ) {
            // Clear redirect state before fallback
            window.history.replaceState({}, document.title, window.location.pathname);
            sessionStorage.setItem('mobileAuthInProgress', 'true');
            
            await signInWithRedirect(this.auth, this.googleProvider);
            return {
              success: true,
              redirectInitiated: true
            };
          }
          
          throw popupError;
        }
      }
    } catch (error: any) {
      console.error('❌ Sign-in failed:', error);
      
      // Clear auth progress flag on error
      sessionStorage.removeItem('mobileAuthInProgress');
      sessionStorage.removeItem('mobileAuthTimestamp');
      
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // Enhanced redirect result handling
  async handleRedirectResult(): Promise<{ success: boolean; user?: any; error?: string }> {
    console.log('🔄 Handling redirect result');
    
    try {
      // Check if this is a mobile auth return
      const authInProgress = sessionStorage.getItem('mobileAuthInProgress');
      const authTimestamp = sessionStorage.getItem('mobileAuthTimestamp');
      
      if (authInProgress === 'true') {
        console.log('📱 Mobile auth redirect detected');
        
        // Check timestamp to prevent stale redirects
        if (authTimestamp) {
          const elapsed = Date.now() - parseInt(authTimestamp);
          if (elapsed > 300000) { // 5 minutes
            console.warn('⚠️ Stale redirect detected, clearing');
            sessionStorage.removeItem('mobileAuthInProgress');
            sessionStorage.removeItem('mobileAuthTimestamp');
            return {
              success: false,
              error: 'Authentication session expired. Please try again.'
            };
          }
        }
      }
      
      const result = await getRedirectResult(this.auth);
      console.log('🔄 Redirect result:', result);
      
      // Clear auth progress flags
      sessionStorage.removeItem('mobileAuthInProgress');
      sessionStorage.removeItem('mobileAuthTimestamp');
      
      if (result?.user) {
        console.log('✅ Redirect sign-in successful:', result.user.email);
        return {
          success: true,
          user: result.user
        };
      } else {
        console.log('ℹ️ No user in redirect result');
        return {
          success: false,
          error: 'Authentication was cancelled or incomplete'
        };
      }
    } catch (error: any) {
      console.error('❌ Redirect result handling failed:', error);
      
      // Clear auth progress flags on error
      sessionStorage.removeItem('mobileAuthInProgress');
      sessionStorage.removeItem('mobileAuthTimestamp');
      
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  private getErrorMessage(error: any): string {
    if (!error) return 'Unknown error occurred';
    
    switch (error.code) {
      case 'auth/unauthorized-domain':
        return `Domain ${window.location.origin} is not authorized. Add it to Firebase Auth settings.`;
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site.';
      case 'auth/redirect-cancelled-by-user':
        return 'Sign-in was cancelled. Please try again.';
      case 'auth/operation-not-supported-in-this-environment':
        return 'Sign-in method not supported. Please try a different browser.';
      case 'auth/no-current-user':
        return 'Authentication session expired. Please try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait and try again later.';
      default:
        return error.message || 'Authentication failed. Please try again.';
    }
  }

  // Check current auth state with mobile considerations
  getCurrentAuthState(): { user: any; isMobile: boolean; issues: string[] } {
    const user = this.auth.currentUser;
    const isMobile = this.isMobileDevice();
    const readiness = this.checkMobileReadiness();
    
    return {
      user,
      isMobile,
      issues: readiness.issues
    };
  }
}

// Export singleton instance
export const mobileAuthFix = new MobileAuthFix();
