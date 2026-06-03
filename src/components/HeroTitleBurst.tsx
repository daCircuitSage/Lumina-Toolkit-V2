import React, { useMemo, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import icon1 from '../assets/herotitleicons/Gemini_Generated_Image_5hs2wl5hs2wl5hs2.png';
import icon2 from '../assets/herotitleicons/Gemini_Generated_Image_7cgqt97cgqt97cgq.png';
import icon3 from '../assets/herotitleicons/Gemini_Generated_Image_egg8mcegg8mcegg8.png';
import icon4 from '../assets/herotitleicons/Gemini_Generated_Image_k9q2hyk9q2hyk9q2.png';
import icon5 from '../assets/herotitleicons/Gemini_Generated_Image_nh72annh72annh72.png';

const iconImports = {
  icon1,
  icon2,
  icon3,
  icon4,
  icon5,
};

interface IconConfig {
  id: string;
  src: string;
  angle: number;
  distance: number;
  delay: number;
  size: number;
  floatSpeed: number;
  floatRange: number;
  zIndex: number;
  opacity: number;
  blur: number;
  rotationDirection: number;
  rotationDuration: number;
  driftX: number[];
  driftY: number[];
  driftRotate: number[];
  driftDuration: number;
  driftDelay: number;
}

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const HeroTitleBurst: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('mobile');
      else if (width < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const icons = useMemo<IconConfig[]>(() => {
    const iconList: IconConfig[] = [];
    const iconKeys = Object.keys(iconImports) as Array<keyof typeof iconImports>;
    
    const config = {
      mobile: { distance: [100, 150], size: [70, 90], visibleCount: 3, rotationDuration: [12, 18] },
      tablet: { distance: [140, 200], size: [90, 120], visibleCount: 4, rotationDuration: [10, 15] },
      desktop: { distance: [180, 260], size: [120, 160], visibleCount: 5, rotationDuration: [8, 15] },
    };

    const currentConfig = config[breakpoint];
    const visibleIcons = iconKeys.slice(0, currentConfig.visibleCount);
    
    visibleIcons.forEach((key, index) => {
      const baseAngle = (index / visibleIcons.length) * 360;
      // Add random angle offset for organic feel (±8-15°)
      const angleOffset = (Math.random() - 0.5) * 30;
      const angle = baseAngle + angleOffset;
      
      // Non-linear distance spread for organic burst
      const baseDistance = currentConfig.distance[0] + Math.random() * (currentConfig.distance[1] - currentConfig.distance[0]);
      const distance = baseDistance * (0.9 + Math.random() * 0.15);
      
      // Depth-based layering: closer icons larger and more opaque
      const depthFactor = 0.5 + Math.random() * 0.5; // 0.5-1.0
      const zIndex = index < 2 ? 20 : Math.floor(depthFactor * 10);
      const opacity = 0.6 + depthFactor * 0.4; // 0.6-1.0
      const blur = 0; // No permanent blur - keep icons sharp
      
      // Random rotation direction (clockwise or counter-clockwise)
      const rotationDirection = Math.random() > 0.5 ? 1 : -1;
      const rotationDuration = currentConfig.rotationDuration[0] + Math.random() * (currentConfig.rotationDuration[1] - currentConfig.rotationDuration[0]);
      
      // Multi-axis drift parameters
      const driftDuration = 3.5 + Math.random() * 2.5; // 3.5-6s
      const driftDelay = Math.random() * 2;
      const driftX = [-4 + Math.random() * 2, 6 + Math.random() * 2, -3 + Math.random() * 2];
      const driftY = [-8 + Math.random() * 2, 10 + Math.random() * 2, -6 + Math.random() * 2];
      const driftRotate = [-6 + Math.random() * 2, 8 + Math.random() * 2, -4 + Math.random() * 2];
      
      iconList.push({
        id: key,
        src: iconImports[key],
        angle,
        distance,
        delay: 0.3 + index * 0.1,
        size: currentConfig.size[0] + Math.random() * (currentConfig.size[1] - currentConfig.size[0]),
        floatSpeed: driftDuration,
        floatRange: 5 + Math.random() * 10,
        zIndex,
        opacity,
        blur,
        rotationDirection,
        rotationDuration,
        driftX,
        driftY,
        driftRotate,
        driftDuration,
        driftDelay,
      });
    });

    return iconList;
  }, [breakpoint]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Glow pulse behind title */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: breakpoint === 'mobile' ? '200px' : breakpoint === 'tablet' ? '280px' : '350px',
          height: breakpoint === 'mobile' ? '200px' : breakpoint === 'tablet' ? '280px' : '350px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 40%, transparent 70%)',
          zIndex: 5,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Radial gradient aura behind icon cluster */}
      <div 
        className="absolute rounded-full"
        style={{
          width: breakpoint === 'mobile' ? '300px' : breakpoint === 'tablet' ? '450px' : '600px',
          height: breakpoint === 'mobile' ? '300px' : breakpoint === 'tablet' ? '450px' : '600px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.02) 50%, transparent 70%)',
          zIndex: 0,
        }}
      />
      {/* Subtle particle dots */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * 360;
        const distance = breakpoint === 'mobile' ? 120 + Math.random() * 60 : breakpoint === 'tablet' ? 180 + Math.random() * 80 : 250 + Math.random() * 100;
        const radians = (angle * Math.PI) / 180;
        const x = Math.cos(radians) * distance;
        const y = Math.sin(radians) * distance;
        const size = 2 + Math.random() * 3;
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-indigo-400/20"
            style={{
              width: size,
              height: size,
              zIndex: 1,
            }}
            initial={{
              x: 0,
              y: 0,
            }}
            animate={{
              x: [x, x + (Math.random() - 0.5) * 20, x],
              y: [y, y + (Math.random() - 0.5) * 20, y],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        );
      })}
      {icons.map((icon) => {
        const radians = (icon.angle * Math.PI) / 180;
        const endX = Math.cos(radians) * icon.distance;
        const endY = Math.sin(radians) * icon.distance;
        const isDesktop = breakpoint === 'desktop';

        return (
          <motion.div
            key={`${icon.id}-${breakpoint}`}
            className="absolute"
            style={{
              width: icon.size,
              height: icon.size,
              willChange: 'transform, opacity, filter',
              zIndex: icon.zIndex,
              transformStyle: 'preserve-3d',
            }}
            initial={{
              x: 0,
              y: 0,
              z: 0,
              opacity: 0,
              scale: 0.2,
              rotate: 0,
              filter: 'blur(8px)',
            }}
            animate={{
              x: endX,
              y: endY,
              z: 0,
              opacity: icon.opacity,
              scale: [0.2, 1.1, 1],
              rotate: 0,
              filter: 'blur(0px)',
            }}
            transition={{
              duration: 1.2,
              delay: icon.delay,
              ease: [0.16, 1, 0.3, 1],
              scale: {
                duration: 1.2,
                delay: icon.delay,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            whileHover={isDesktop ? {
              scale: 1.15,
              filter: 'brightness(1.1) blur(0px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              transition: { duration: 0.3 }
            } : undefined}
          >
            <motion.img
              src={icon.src}
              alt=""
              className="w-full h-full object-contain"
              style={{ willChange: 'transform' }}
              animate={{
                x: icon.driftX,
                y: icon.driftY,
                z: 0,
                rotate: icon.driftRotate,
              }}
              transition={{
                duration: icon.driftDuration,
                delay: icon.driftDelay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeroTitleBurst;
