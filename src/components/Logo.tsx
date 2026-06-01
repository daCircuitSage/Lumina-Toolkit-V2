import React from 'react';
import { cn } from '../lib/utils';
import newLogo from '../assets/logo/newlogo.png';

interface LogoProps {
  className?: string;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export default function Logo({ className, isCollapsed, onClick }: LogoProps) {
  return (
    <button 
      onClick={onClick}
      aria-label="Go to homepage"
      className={cn("flex items-center cursor-pointer focus:outline-none", className)}
    >
      <img 
        src={newLogo} 
        alt="Lumina Toolkit Logo"
        className={cn(
          "object-contain",
          isCollapsed ? "w-14 h-14" : "w-auto h-20"
        )}
      />
    </button>
  );
}
