// Mobile Authentication Test Utility
// This file helps test and debug mobile authentication issues

export const testMobileAuth = () => {
  console.log('🧪 Mobile Authentication Test');
  console.log('==============================');
  
  // Test device detection
  const userAgent = navigator.userAgent;
  console.log('📱 User Agent:', userAgent);
  
  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  console.log('📱 Is Mobile Device:', isMobile);
  
  // Check for tablet devices
  const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(userAgent);
  console.log('📱 Is Tablet Device:', isTablet);
  
  // Check for touch capabilities
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  console.log('📱 Has Touch Screen:', hasTouchScreen);
  
  // Check screen size
  const isSmallScreen = window.innerWidth <= 1024;
  console.log('📱 Screen Width:', window.innerWidth, 'px (Small Screen:', isSmallScreen, ')');
  
  // Determine auth method
  const shouldUseRedirect = isMobile || isTablet || (hasTouchScreen && isSmallScreen);
  console.log('🔐 Should Use Redirect:', shouldUseRedirect);
  
  // Check current domain
  const currentDomain = window.location.origin;
  console.log('🌐 Current Domain:', currentDomain);
  
  // Check if domain is authorized
  const authorizedDomains = [
    'https://lumintoolkit.com',
    'https://www.lumintoolkit.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:8080'
  ];
  
  const isAuthorized = authorizedDomains.includes(currentDomain);
  console.log('✅ Domain Authorized:', isAuthorized);
  
  if (!isAuthorized) {
    console.warn('⚠️ Current domain may not be authorized in Firebase Console');
    console.warn('Add this domain to Firebase Auth → Settings → Authorized domains:', currentDomain);
  }
  
  return {
    isMobile,
    isTablet,
    hasTouchScreen,
    isSmallScreen,
    shouldUseRedirect,
    currentDomain,
    isAuthorized
  };
};

export const logAuthEvent = (event: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`🔐 [${timestamp}] ${event}`, data || '');
};

export const checkAuthPersistence = async () => {
  try {
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    
    // Check if user is persisted
    const currentUser = auth.currentUser;
    console.log('👤 Current User:', currentUser ? {
      uid: currentUser.uid,
      email: currentUser.email,
      displayName: currentUser.displayName
    } : 'No user');
    
    // Note: Firebase doesn't expose current persistence type directly
    console.log('💾 Auth persistence is configured (browserLocalPersistence set during init)');
    
    return { currentUser };
  } catch (error) {
    console.error('❌ Error checking auth persistence:', error);
    return { error };
  }
};
