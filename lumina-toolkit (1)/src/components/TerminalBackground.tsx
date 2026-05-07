import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Command {
  id: string;
  text: string;
  meta: string;
  instant?: boolean;
}

const COMMANDS = [
  'lumina --task scan --target resume.pdf --engine deep-analysis --output verbose --threads 8',
  'lumina --task build --type professional --template modern-dark --optimize-level ultra',
  'lumina --task assistant --init --model gemini-pro-vision --stream --session-id x921',
  'lumina --task interview --mode frontend-expert --questions random --feedback-v4',
  'lumina --task optimize --resume score --vignette --score-target 100 --auto-keyword',
  'lumina --task analyze --job description --extract-entities --match-score --raw',
  'lumina --task match --skills --role software-engineer-v3 --strict-mode --json',
  'lumina --task verify --credentials --blockchain-sync --secure-handshake --wait',
];

const TerminalBackground: React.FC = () => {
  const nextId = useRef(0);
  const [activeCommands, setActiveCommands] = useState<Command[]>(() => {
    // Pre-fill history so it looks active immediately
    return Array.from({ length: 14 }).map(() => ({
      id: `cmd-${nextId.current++}`,
      text: COMMANDS[Math.floor(Math.random() * COMMANDS.length)],
      meta: '',
      instant: true,
    }));
  });

  useEffect(() => {
    const addCommand = () => {
      const text = COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
      const id = `cmd-${nextId.current++}`;
      const newCommand: Command = {
        id,
        text,
        meta: '',
        instant: false,
      };

      setActiveCommands((prev) => {
        const next = [...prev, newCommand];
        return next.length > 20 ? next.slice(1) : next;
      });
    };

    const interval = setInterval(addCommand, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-zinc-950 font-mono select-none z-0">
      {/* Texture & Vignette */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.98)_100%)]" />

      {/* Zoomed Out Terminal Container */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 opacity-[0.08] filter blur-[0.2px]">
        <div className="flex flex-col gap-1.5 w-full">
          <AnimatePresence mode="popLayout" initial={false}>
            {activeCommands.map((command, index) => (
              <motion.div
                key={command.id}
                initial={command.instant ? false : { opacity: 0, x: -10, y: 10 }}
                animate={{ 
                  opacity: (index + 1) / activeCommands.length, 
                  x: 0, 
                  y: 0 
                }}
                exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="flex items-center gap-3 text-[10px] md:text-[12px] font-medium tracking-normal w-full justify-start whitespace-nowrap"
              >
                <span className="text-blue-500/30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                <span className="text-zinc-600 font-bold shrink-0 text-[9px] md:text-[11px]">core@lumina:~$</span>
                
                <TypedText text={command.text} instant={command.instant} className="text-white/60 flex-1" />

                {index === activeCommands.length - 1 && (
                  <motion.div
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.51, 1] }}
                    className="w-1.5 h-3 bg-blue-500/40"
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Subtle Atmospheric Scanline */}
      <motion.div
        animate={{ y: ['-100%', '100%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-x-0 h-[1px] bg-blue-500/[0.02] shadow-[0_0_15px_rgba(59,130,246,0.05)]"
      />
    </div>
  );
};

const TypedText: React.FC<{ text: string; className?: string; instant?: boolean }> = ({ text, className, instant }) => {
  const [displayedText, setDisplayedText] = useState(instant ? text : '');
  
  useEffect(() => {
    if (instant) return;
    
    let current = '';
    const chars = text.split('');
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < chars.length) {
        current += chars[i];
        setDisplayedText(current);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30 + Math.random() * 20);
    
    return () => clearInterval(interval);
  }, [text, instant]);

  return <span className={className}>{displayedText}</span>;
};

export default TerminalBackground;
