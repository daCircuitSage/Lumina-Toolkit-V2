/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Analytics } from '@vercel/analytics/react';

// Analytics helper functions for tracking custom events
export const trackEvent = (action: string, category?: string, label?: string, value?: number) => {
  // Only run on client-side
  if (typeof window === 'undefined') return;

  // Track with Vercel Analytics
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Also track with custom Vercel Analytics events
  if (window.va) {
    window.va('event', {
      action,
      category,
      label,
      value,
    });
  }
};

// Predefined event tracking functions
export const analyticsEvents = {
  resumeTemplateSelected: (templateName: string) => 
    trackEvent('resume_template_selected', 'Resume Builder', templateName),
  
  resumePdfDownloaded: (templateName?: string) => 
    trackEvent('resume_pdf_downloaded', 'Resume Builder', templateName || 'unknown'),
  
  atsCheckStarted: () => 
    trackEvent('ats_check_started', 'ATS Checker'),
  
  coverLetterGenerated: (jobTitle?: string) => 
    trackEvent('cover_letter_generated', 'Cover Letter', jobTitle),
  
  chatMessageSent: () => 
    trackEvent('chat_message_sent', 'AI Chat'),
  
  toolSearchUsed: (query: string) => 
    trackEvent('tool_search_used', 'Search', query),
  
  toolNavigation: (toolName: string) => 
    trackEvent('tool_navigation', 'Navigation', toolName),
  
  pageView: (pageName: string) => 
    trackEvent('page_view', 'Navigation', pageName),
};

// Google Analytics initialization
export const initializeGA = (gaId: string) => {
  if (typeof window === 'undefined' || !gaId) return;

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(...args: any[]) {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', gaId, {
    page_location: window.location.href,
    page_title: document.title,
  });
};

// Type declarations for global window objects
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    va: (event: "beforeSend" | "event" | "pageview", properties?: unknown) => void;
    dataLayer: any[];
  }
}

export { Analytics };
