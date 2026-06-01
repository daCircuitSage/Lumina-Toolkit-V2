/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import cursorImage from '../assets/customcursore/cusore.png';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef = useRef<HTMLImageElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });
  
  const dotX = useSpring(mouseX, { stiffness: 1000, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 1000, damping: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [mouseX, mouseY]);

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
      src={cursorImage}
      alt="Custom Cursor"
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        duration: 0.2,
      }}
    />
  );
}
