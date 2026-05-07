/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics, initializeGA, analyticsEvents } from '../lib/analytics';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

export default function HomepageLayout({ children }: HomepageLayoutProps) {
  const location = useLocation();

  // Initialize Google Analytics
  React.useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    if (gaId) {
      initializeGA(gaId);
    }
  }, []);

  // Track page navigation
  React.useEffect(() => {
    analyticsEvents.pageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      {children}
      <Analytics />
    </div>
  );
}
