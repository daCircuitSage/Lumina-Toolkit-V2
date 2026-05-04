/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import GlobalSearch from './GlobalSearch';
import { Analytics, initializeGA, analyticsEvents } from '../lib/analytics';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Map tool IDs to routes
  const getRouteFromToolId = (toolId: string): string => {
    const routeMap: { [key: string]: string } = {
      'homepage': '/',
      'dashboard': '/all-tools',
      'chat': '/ai-assistant',
      'resume': '/resume-builder',
      'pdf': '/pdf-converter',
      'age': '/age-calculator',
      'gpa': '/gpa-calculator',
      'caption': '/ai-caption-generator',
      'youtube': '/youtube-title-generator',
      'ats': '/ats-resume-checker',
      'tracker': '/job-tracker',
      'interview': '/interview-prep',
      'cover-letter': '/cover-letter-generator',
      'contact': '/contact'
    };
    return routeMap[toolId] || '/';
  };

  // Get active tool from current route
  const getActiveToolFromRoute = (pathname: string): string => {
    const routeToToolMap: { [key: string]: string } = {
      '/': 'homepage',
      '/all-tools': 'dashboard',
      '/ai-assistant': 'chat',
      '/resume-builder': 'resume',
      '/pdf-converter': 'pdf',
      '/age-calculator': 'age',
      '/gpa-calculator': 'gpa',
      '/ai-caption-generator': 'caption',
      '/youtube-title-generator': 'youtube',
      '/ats-resume-checker': 'ats',
      '/job-tracker': 'tracker',
      '/interview-prep': 'interview',
      '/cover-letter-generator': 'cover-letter',
      '/contact': 'contact'
    };
    return routeToToolMap[pathname] || 'homepage';
  };

  const activeTool = getActiveToolFromRoute(location.pathname);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Google Analytics
  useEffect(() => {
    const gaId = import.meta.env.VITE_GA_ID;
    if (gaId) {
      initializeGA(gaId);
    }
  }, []);

  // Track page navigation
  useEffect(() => {
    analyticsEvents.pageView(location.pathname);
  }, [location.pathname]);

  const handleToolSelect = (toolId: string) => {
    const route = getRouteFromToolId(toolId);
    navigate(route);
  };

  // SEO-friendly navigation function
  const getRouteForTool = (toolId: string): string => {
    return getRouteFromToolId(toolId);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      <Sidebar 
        activeTool={activeTool}
        onSelect={handleToolSelect}
        onSearchOpen={() => setIsSearchOpen(true)}
        getRouteForTool={getRouteForTool}
      />
      
      <GlobalSearch 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={handleToolSelect}
        getRouteForTool={getRouteForTool}
      />

      <main className="flex-1 relative pt-16 md:pt-0 overflow-x-hidden">
        <div className="h-full">
          {children}
        </div>
      </main>
      <Analytics />
    </div>
  );
}
