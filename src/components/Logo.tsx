import React from 'react';
import { cn } from '../lib/utils';

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
      className={cn("flex items-center gap-3 cursor-pointer focus:outline-none", className)}
    >
      <div className="relative shrink-0">
        {/* xAI design: simple white square on dark canvas, no shadows */}
        <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center text-black">
          <div className="text-xl font-normal tracking-tight">L</div>
        </div>
      </div>
      {!isCollapsed && (
        <div className="flex flex-col leading-none">
          {/* xAI design: weight 400, no bold, no italic */}
          <span className="font-sans font-normal text-lg tracking-tight text-white">
            Lumina
          </span>
          {/* xAI design: Geist Mono uppercase for labels */}
          <span className="font-mono text-[10px] font-normal uppercase tracking-[1.4px] text-body-mid mt-0.5">
            Toolkit
          </span>
        </div>
      )}
    </button>
  );
}
