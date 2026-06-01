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
      mobile: { distance: [100, 150], size: [60, 80], visibleCount: 3 },
      tablet: { distance: [150, 200], size: [80, 100], visibleCount: 4 },
      desktop: { distance: [200, 300], size: [100, 140], visibleCount: 5 },
    };

    const currentConfig = config[breakpoint];
    const visibleIcons = iconKeys.slice(0, currentConfig.visibleCount);
    
    visibleIcons.forEach((key, index) => {
      const angle = (index / visibleIcons.length) * 360;
      iconList.push({
        id: key,
        src: iconImports[key],
        angle,
        distance: currentConfig.distance[0] + Math.random() * (currentConfig.distance[1] - currentConfig.distance[0]),
        delay: 0.3 + index * 0.1,
        size: currentConfig.size[0] + Math.random() * (currentConfig.size[1] - currentConfig.size[0]),
        floatSpeed: 2 + Math.random() * 2,
        floatRange: 5 + Math.random() * 10,
      });
    });

    return iconList;
  }, [breakpoint]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {icons.map((icon) => {
        const radians = (icon.angle * Math.PI) / 180;
        const endX = Math.cos(radians) * icon.distance;
        const endY = Math.sin(radians) * icon.distance;

        return (
          <motion.div
            key={`${icon.id}-${breakpoint}`}
            className="absolute"
            style={{
              width: icon.size,
              height: icon.size,
              willChange: 'transform',
            }}
            initial={{
              x: 0,
              y: 0,
              opacity: 0,
              scale: 0.5,
              rotate: 0,
            }}
            animate={{
              x: endX,
              y: endY,
              opacity: [0, 1, 0.9],
              scale: [0.5, 1, 0.95],
              rotate: [0, 15, -10, 5],
            }}
            transition={{
              duration: 1.2,
              delay: icon.delay,
              ease: [0.25, 0.1, 0.25, 1],
              rotate: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                repeatType: 'reverse',
              },
            }}
          >
            <motion.img
              src={icon.src}
              alt=""
              className="w-full h-full object-contain"
              style={{ willChange: 'transform' }}
              animate={{
                y: [0, -icon.floatRange, 0],
              }}
              transition={{
                duration: icon.floatSpeed,
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
