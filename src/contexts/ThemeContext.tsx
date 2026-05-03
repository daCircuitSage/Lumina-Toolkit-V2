import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Extend Window interface for our global theme variable
declare global {
  interface Window {
    __THEME_INITIALIZED?: Theme;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Use pre-initialized theme from HTML script to prevent flash
    if (typeof window !== 'undefined' && window.__THEME_INITIALIZED) {
      return window.__THEME_INITIALIZED;
    }
    
    // Fallback for SSR or if script failed
    if (typeof window === 'undefined') {
      return 'light'; // Default for SSR
    }
    
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Only update if theme differs from pre-initialized state
    const currentTheme = root.classList.contains('dark') ? 'dark' : 'light';
    if (currentTheme !== theme) {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
    
    // Update global variable for consistency
    window.__THEME_INITIALIZED = theme;
  }, [theme]);

  // Listen for system theme changes when no user preference is set
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const saved = localStorage.getItem('theme');
      // Only auto-switch if user hasn't explicitly set a preference
      if (!saved || (saved !== 'light' && saved !== 'dark')) {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setTheme(newTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
