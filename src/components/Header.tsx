import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const location = useLocation();

  const getBreadcrumbItems = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const items: { label: string; href?: string; isActive?: boolean }[] = [];

    // Map routes to breadcrumb items
    const routeMap: { [key: string]: string } = {
      'all-tools': 'All Tools',
      'ai-assistant': 'AI Assistant',
      'resume-builder': 'Resume Builder',
      'pdf-converter': 'PDF Converter',
      'age-calculator': 'Age Calculator',
      'gpa-calculator': 'GPA Calculator',
      'ai-caption-generator': 'AI Caption Generator',
      'youtube-title-generator': 'YouTube Title Generator',
      'blog': 'Blog',
      'ats-resume-checker': 'ATS Resume Checker',
      'job-tracker': 'Job Tracker',
      'interview-prep': 'Interview Preparation',
      'cover-letter-generator': 'Cover Letter Generator',
      'contact': 'Contact',
      'profile': 'Profile'
    };

    pathSegments.forEach((segment, index) => {
      const label = routeMap[segment] || segment;
      const href = index < pathSegments.length - 1 ? `/${pathSegments.slice(0, index + 1).join('/')}` : undefined;
      const isActive = index === pathSegments.length - 1;

      items.push({ label, href, isActive });
    });

    return items;
  };

  return (
    <header className="border-b border-border bg-surface">
      <div className="px-6 py-4">
        <Breadcrumbs items={getBreadcrumbItems()} />
        {title && (
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-text-secondary mt-1">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
