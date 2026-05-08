import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logAuthEvent } from '../utils/remote-logger';

interface MobileAuthButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function MobileAuthButton({ className = "", children }: MobileAuthButtonProps) {
  const { signInWithGoogle } = useAuth();

  const handleMobileAuth = async () => {
    logAuthEvent('Mobile auth button clicked');
    
    // Detect if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile, try to open in same window to avoid popup blocking
      logAuthEvent('Mobile device detected, using optimized flow');
      
      // Show user instruction for mobile
      const shouldContinue = window.confirm(
        'Google sign-in will open in a new tab. Please complete the sign-in there and return to this app.'
      );
      
      if (!shouldContinue) {
        logAuthEvent('User cancelled mobile auth flow');
        return;
      }
    }
    
    try {
      await signInWithGoogle();
    } catch (error: any) {
      logAuthEvent('Mobile auth failed', { error: error.message });
      
      // Show user-friendly error
      if (error.code === 'auth/popup-closed-by-user') {
        alert('Sign-in was cancelled. Please try again and allow the popup when prompted.');
      } else if (error.code === 'auth/popup-blocked') {
        alert('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else {
        alert(`Sign-in failed: ${error.message}`);
      }
    }
  };

  return (
    <button
      onClick={handleMobileAuth}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors ${className}`}
    >
      {children || 'Sign in with Google'}
    </button>
  );
}
