import React from 'react';
import { cn } from '../lib/utils';

interface SemanticHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export default function SemanticHeading({ 
  level, 
  children, 
  className 
}: SemanticHeadingProps) {
  const baseClasses = "font-bold tracking-tight";
  
  const sizeClasses = {
    1: "text-4xl sm:text-5xl lg:text-6xl",
    2: "text-3xl sm:text-4xl", 
    3: "text-2xl sm:text-3xl",
    4: "text-xl sm:text-2xl",
    5: "text-lg sm:text-xl",
    6: "text-base sm:text-lg"
  };

  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  return React.createElement(
    HeadingTag,
    { className: cn(baseClasses, sizeClasses[level], className) },
    children
  );
}
