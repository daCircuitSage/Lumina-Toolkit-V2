// Mobile Authentication Diagnostic Tool
// This helps identify why authentication works on desktop but not mobile

export const runMobileAuthDiagnostic = () => {
  console.log('🔍 ===== MOBILE AUTHENTICATION DIAGNOSTIC =====');
  
  const diagnostic = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    origin: window.location.origin,
    
    // Browser capabilities
    cookies: navigator.cookieEnabled,
    localStorage: typeof(Storage) !== 'undefined',
    sessionStorage: typeof(sessionStorage) !== 'undefined',
    
    // Mobile detection
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    
    // Screen info
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    
    // Network info
    connection: (navigator as any).connection?.effectiveType || 'unknown',
    online: navigator.onLine,
    
    // Firebase auth check
    firebase: {
      initialized: !!(window as any).firebase,
      auth: !!(window as any).firebase?.auth
    }
  };
  
  console.log('📱 Mobile Diagnostic Results:', diagnostic);
  
  // Check for common mobile auth issues
  const issues = [];
  
  if (!diagnostic.cookies) {
    issues.push('Cookies are disabled - Firebase auth requires cookies');
  }
  
  if (!diagnostic.localStorage) {
    issues.push('localStorage is not available - Firebase auth requires storage');
  }
  
  if (diagnostic.isIOS && diagnostic.screenWidth < 768) {
    issues.push('iOS device with small screen - popup may be blocked');
  }
  
  if (diagnostic.isAndroid && diagnostic.connection === 'slow-2g') {
    issues.push('Slow 2G connection - timeout likely');
  }
  
  if (issues.length > 0) {
    console.warn('⚠️ Mobile Auth Issues Detected:', issues);
  } else {
    console.log('✅ No obvious mobile auth issues detected');
  }
  
  return { diagnostic, issues };
};

export const testFirebaseAuth = async () => {
  try {
    console.log('🔥 Testing Firebase auth initialization...');
    
    // Check if Firebase is properly initialized
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    
    if (!auth) {
      console.error('❌ Firebase auth is not initialized');
      return false;
    }
    
    console.log('✅ Firebase auth is initialized');
    console.log('🔍 Auth config:', {
      apiKey: !!auth.config?.apiKey,
      authDomain: !!auth.config?.authDomain
    });
    
    return true;
  } catch (error) {
    console.error('❌ Firebase auth test failed:', error);
    return false;
  }
};
