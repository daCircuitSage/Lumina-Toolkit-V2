// Firebase Domain Configuration Checker
// Critical for mobile authentication to work

export const checkFirebaseDomainConfig = () => {
  console.log('🔍 Checking Firebase domain configuration...');
  
  const currentDomain = window.location.origin;
  const isLocalhost = currentDomain.includes('localhost') || currentDomain.includes('127.0.0.1');
  const isProduction = !isLocalhost;
  
  console.log('🌐 Current domain:', currentDomain);
  console.log('🔧 Environment:', isLocalhost ? 'Development' : 'Production');
  
  // Common issues that prevent mobile auth
  const issues = [];
  
  // Check if running on localhost with correct port
  if (isLocalhost) {
    const port = window.location.port;
    if (port !== '3001' && port !== '3000') {
      issues.push(`Running on localhost:${port} - Firebase may be configured for different port`);
    }
  }
  
  // Check for HTTPS in production
  if (isProduction && !currentDomain.startsWith('https://')) {
    issues.push('Production domain must use HTTPS for Firebase Auth to work');
  }
  
  // Check for common mobile browser issues
  const userAgent = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  if (isIOS) {
    // iOS specific checks
    if (!navigator.cookieEnabled) {
      issues.push('iOS: Cookies are disabled - required for Firebase Auth');
    }
    
    // Check for private browsing
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (error) {
      issues.push('iOS: Private browsing mode detected - Firebase Auth may not work');
    }
  }
  
  if (isAndroid) {
    // Android specific checks
    const isChrome = /Chrome/.test(userAgent);
    if (!isChrome) {
      issues.push('Android: Non-Chrome browser detected - may have compatibility issues');
    }
  }
  
  console.log('📊 Domain check results:', {
    domain: currentDomain,
    isLocalhost,
    isProduction,
    issues
  });
  
  return {
    domain: currentDomain,
    isLocalhost,
    isProduction,
    issues,
    isConfigured: issues.length === 0
  };
};

export const getFirebaseAuthInstructions = (domain: string) => {
  const isLocalhost = domain.includes('localhost') || domain.includes('127.0.0.1');
  
  if (isLocalhost) {
    return {
      title: 'Development Setup Required',
      instructions: [
        '1. Go to Firebase Console → Authentication → Settings',
        '2. Under "Authorized domains", add:',
        `   - localhost:3001`,
        `   - 127.0.0.1:3001`,
        '3. Save settings and restart development server',
        '4. Clear browser cache and test again'
      ]
    };
  } else {
    return {
      title: 'Production Setup Required',
      instructions: [
        '1. Go to Firebase Console → Authentication → Settings',
        '2. Under "Authorized domains", add:',
        `   - ${domain}`,
        '3. Also add www variant if needed:',
        `   - www.${domain.replace('www.', '')}`,
        '4. Save settings and deploy',
        '5. Test authentication on mobile device'
      ]
    };
  }
};

export const createMobileAuthTest = async () => {
  console.log('🧪 Running comprehensive mobile auth test...');
  
  const domainCheck = checkFirebaseDomainConfig();
  const instructions = getFirebaseAuthInstructions(domainCheck.domain);
  
  // Test Firebase initialization
  let firebaseTest = false;
  try {
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    firebaseTest = !!auth;
    console.log('🔥 Firebase auth test:', firebaseTest);
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
  }
  
  // Test browser capabilities
  const browserTest = {
    cookies: navigator.cookieEnabled,
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })(),
    sessionStorage: typeof sessionStorage !== 'undefined'
  };
  
  console.log('🌐 Browser capabilities:', browserTest);
  
  return {
    domainCheck,
    firebaseTest,
    browserTest,
    instructions,
    timestamp: new Date().toISOString()
  };
};
