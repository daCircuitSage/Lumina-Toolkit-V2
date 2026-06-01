import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { FaArrowRight as ArrowRight } from 'react-icons/fa';

interface ToolPreviewCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  videoPreview: string;
  onClick: () => void;
  isLarge?: boolean;
  delay?: number;
}

export default function ToolPreviewCard({
  title,
  description,
  icon: Icon,
  videoPreview,
  onClick,
  isLarge = false,
  delay = 0
}: ToolPreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse position for radial highlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 20
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 20
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    console.log('Video source:', videoPreview);
    console.log('Video load state before play:', videoRef.current?.readyState);
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error('Video play error:', error);
        setVideoError(true);
      });
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      className={`group relative card-content cursor-pointer overflow-hidden ${
        isLarge ? 'md:col-span-2' : ''
      }`}
    >
      {/* Radial highlight effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            useMotionValue(0),
            [0, 1],
            ['rgba(255,255,255,0)', 'rgba(255,255,255,0.03)']
          )
        }}
      />
      
      {/* Glass reflection sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
          animate={isHovered ? { x: ['-100%', '200%'] } : { x: '-100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{
          boxShadow: 'inset 0 0 20px rgba(159,232,112,0.1)'
        }}
      />

      {/* Video overlay - only loaded when near viewport */}
      {isVideoLoaded && (
        <motion.div
          className="absolute inset-0 bg-ink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <video
            ref={videoRef}
            src={videoPreview}
            muted
            loop
            playsInline
            autoPlay={isHovered}
            preload="auto"
            onError={(e) => {
              console.error('Video failed to load', e);
              console.error('Video source:', videoPreview);
              setVideoError(true);
            }}
            onLoadStart={() => {
              console.log('Video loading:', videoPreview);
              console.log('Video readyState on load start:', videoRef.current?.readyState);
            }}
            onCanPlay={() => {
              console.log('Video loaded successfully:', videoPreview);
              console.log('Video readyState on can play:', videoRef.current?.readyState);
            }}
            onLoadedData={() => {
              console.log('Video data loaded:', videoPreview);
              console.log('Video load state:', videoRef.current?.readyState);
            }}
            className="w-full h-full object-cover opacity-35"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        className="relative z-10"
        animate={{ opacity: isHovered ? 0.35 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-14 h-14 bg-transparent rounded-xl flex items-center justify-center mb-6"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon className="w-8 h-8 text-ink" />
        </motion.div>
        
        <h3 className={`font-normal mb-2 ${isLarge ? 'text-2xl' : 'text-xl'}`}>
          {title}
        </h3>
        
        <p className="body-md mb-4 max-w-md">
          {description}
        </p>
        
        <motion.div
          className="flex items-center gap-2 text-ink"
          animate={{ gap: isHovered ? 12 : 8 }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-normal">
            {isLarge ? 'Start Chatting' : 'Explore'}
          </span>
          <motion.div
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Subtle zoom effect on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ scale: isHovered ? 1.03 : 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </motion.div>
  );
}
