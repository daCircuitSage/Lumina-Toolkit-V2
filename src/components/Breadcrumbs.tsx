import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn("flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400", className)}
    >
      <a 
        href="/" 
        className="flex items-center hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        aria-label="Home"
      >
        <Home size={16} />
      </a>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="text-slate-400" />
          {item.href ? (
            <a 
              href={item.href}
              className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              aria-current={item.isActive ? "page" : undefined}
            >
              {item.label}
            </a>
          ) : (
            <span 
              className={cn(
                "font-medium",
                item.isActive ? "text-slate-900 dark:text-slate-100" : ""
              )}
              aria-current={item.isActive ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
