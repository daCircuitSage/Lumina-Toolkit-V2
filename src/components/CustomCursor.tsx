/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import cursorImage from '../assets/customcursore/cusore.png';
import clickImage from '../assets/customcursore/click.png';

const CustomCursor = memo(function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLImageElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });
  
  const dotX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' ||
      target.tagName === 'A' ||
      target.tagName === 'INPUT' ||
      target.tagName === 'SELECT' ||
      target.tagName === 'TEXTAREA' ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('[role="link"]') ||
      target.closest('[role="checkbox"]') ||
      target.closest('[role="radio"]') ||
      target.classList.contains('cursor-pointer') ||
      target.classList.contains('clickable') ||
      target.onclick !== null
    ) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    setIsHovering(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseOut]);

  // Hide default cursor on desktop
  useEffect(() => {
    const isDesktop = window.matchMedia('(pointer: fine)').matches;
    if (isDesktop) {
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
      return () => {
        document.body.style.cursor = 'auto';
        document.documentElement.style.cursor = 'auto';
      };
    }
  }, []);

  return (
    <motion.img
      ref={cursorRef}
      src={isHovering ? clickImage : cursorImage}
      alt="Custom Cursor"
      loading="eager"
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
        willChange: 'transform'
      }}
      animate={{
        scale: isHovering ? 1.2 : 1,
      }}
      transition={{
        duration: 0.1,
      }}
    />
  );
});

export default CustomCursor;
