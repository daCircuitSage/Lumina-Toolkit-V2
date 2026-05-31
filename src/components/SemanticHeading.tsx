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
  // xAI design: weight 400 only, negative letter-spacing for larger headings
  const baseClasses = "font-normal text-ink";
  
  const sizeClasses = {
    1: "text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-tight",
    2: "text-4xl sm:text-5xl leading-tight tracking-tight", 
    3: "text-3xl sm:text-4xl leading-tight tracking-tight",
    4: "text-2xl sm:text-3xl leading-tight",
    5: "text-xl sm:text-2xl leading-tight",
    6: "text-lg sm:text-xl leading-tight"
  };

  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  return React.createElement(
    HeadingTag,
    { className: cn(baseClasses, sizeClasses[level], className) },
    children
  );
}
