// Simple Mobile Debug Tool
// Basic debugging without complex dependencies

export const simpleMobileDebug = async () => {
  console.log('🔍 ===== SIMPLE MOBILE DEBUG =====');
  
  const results = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    search: window.location.search,
    hash: window.location.hash,
    userAgent: navigator.userAgent,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
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
  
  console.log('📱 Device info:', {
    isMobile: results.isMobile,
    userAgent: results.userAgent
  });
  
  console.log('🌐 URL info:', {
    url: results.url,
    search: results.search,
    hash: results.hash
  });
  
  console.log('🔧 Browser capabilities:', {
    cookies: results.cookies,
    localStorage: results.localStorage,
    sessionStorage: results.sessionStorage
  });
  
  // Check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const hasAuthParams = urlParams.has('code') || urlParams.has('state') || urlParams.has('access_token');
  console.log('🔗 URL auth params:', hasAuthParams);
  
  // Try to get Firebase auth
  try {
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    console.log('🔥 Firebase auth:', {
      initialized: !!auth,
      currentUser: !!currentUser,
      email: currentUser?.email,
      uid: currentUser?.uid
    });
    
    // Try getRedirectResult
    try {
      const { getRedirectResult } = await import('firebase/auth');
      const redirectResult = await getRedirectResult(auth);
      
      console.log('🔄 Redirect result:', {
        hasResult: !!redirectResult,
        hasUser: !!redirectResult?.user,
        email: redirectResult?.user?.email
      });
      
      return {
        ...results,
        firebase: {
          initialized: !!auth,
          currentUser: !!currentUser,
          email: currentUser?.email
        },
        redirectResult: {
          hasResult: !!redirectResult,
          hasUser: !!redirectResult?.user,
          email: redirectResult?.user?.email
        },
        hasAuthParams
      };
    } catch (redirectError: any) {
      console.error('❌ Redirect result error:', redirectError);
      return {
        ...results,
        firebase: {
          initialized: !!auth,
          currentUser: !!currentUser,
          email: currentUser?.email
        },
        redirectError: {
          code: redirectError.code,
          message: redirectError.message
        },
        hasAuthParams
      };
    }
  } catch (firebaseError: any) {
    console.error('❌ Firebase error:', firebaseError);
    return {
      ...results,
      firebaseError: {
        code: firebaseError.code,
        message: firebaseError.message
      },
      hasAuthParams
    };
  }
};
