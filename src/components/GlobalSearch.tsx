import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Command, X, ArrowRight, Sparkles, Briefcase, Settings } from 'lucide-react';
import { TOOLS } from '../constants';
import { cn } from '../lib/utils';
import { analyticsEvents } from '../lib/analytics';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export default function GlobalSearch({ isOpen, onClose, onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredTools = query.trim() === '' 
    ? [] 
    : TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        (tool.category && tool.category.toLowerCase().includes(query.toLowerCase()))
      );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(filteredTools.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Math.max(filteredTools.length, 1)) % Math.max(filteredTools.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          handleSelect(filteredTools[selectedIndex].id);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex]);

  const handleSelect = (id: string) => {
    // Track search usage
    if (query.trim()) {
      analyticsEvents.toolSearchUsed(query.trim());
    }
    analyticsEvents.toolNavigation(id);
    onSelect(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100] transition-all"
          />
          
          {/* Search Container */}
          <motion.div
            initial={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.95, y: -20 }}
            animate={isMobile ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "bg-white dark:bg-slate-900 shadow-2xl z-[110] overflow-hidden border border-slate-200 dark:border-slate-800",
              isMobile 
                ? "fixed inset-0 flex flex-col" 
                : "fixed left-1/2 top-[15%] -translate-x-1/2 w-full max-w-2xl rounded-3xl"
            )}
          >
            {/* Search Header */}
            <div className={cn(
              "flex items-center border-b border-slate-100 dark:border-slate-800",
              isMobile ? "px-4 py-4" : "px-6 py-5"
            )}>
              <Search className="text-slate-400 mr-3" size={isMobile ? 20 : 20} />
              <input
                ref={inputRef}
                type="text"
                placeholder="What tool do you need today?"
                className={cn(
                  "bg-transparent border-none outline-none placeholder-slate-400 font-medium",
                  isMobile 
                    ? "flex-1 text-base text-slate-900 dark:text-white" 
                    : "flex-1 text-lg text-slate-900 dark:text-white"
                )}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              {!isMobile && (
                <div className="flex items-center gap-1.5 ml-4">
                  <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700 leading-none">ESC</kbd>
                </div>
              )}
              {isMobile && (
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Search Results */}
            <div className={cn(
              "overflow-y-auto custom-scrollbar",
              isMobile ? "flex-1" : "max-h-[60vh] p-3"
            )}>
              {query.trim() === '' ? (
                <div className={cn("space-y-6", isMobile ? "p-4" : "p-4")}>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-4 px-2">Popular Tools</p>
                     <div className={cn("gap-2", isMobile ? "space-y-3" : "grid grid-cols-2 gap-2")}>
                       {TOOLS.slice(1, 5).map(tool => (
                         <QuickActionButton key={tool.id} tool={tool} onClick={() => handleSelect(tool.id)} isMobile={isMobile} />
                       ))}
                     </div>
                   </div>
                   <div className="flex items-center justify-center py-10 text-center">
                      <div>
                        <div className="w-12 h-12 bg-lumina-blue/10 rounded-2xl flex items-center justify-center text-lumina-blue mx-auto mb-4">
                          <Command size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Ready for your command</p>
                        <p className="text-xs text-slate-400 mt-1">Start typing to find what you're looking for</p>
                      </div>
                   </div>
                </div>
              ) : filteredTools.length > 0 ? (
                <div className={cn("space-y-1", isMobile ? "p-2" : "")}>
                  {filteredTools.map((tool, index) => {
                    const Icon = tool.icon;
                    const isActive = index === selectedIndex;
                    return (
                      <button
                        key={tool.id}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => handleSelect(tool.id)}
                        className={cn(
                          "w-full flex items-center gap-4 transition-all text-left group",
                          isMobile ? "p-4 rounded-2xl" : "p-4 rounded-2xl",
                          isActive 
                            ? "bg-lumina-blue text-white shadow-xl shadow-lumina-blue/20 dark:shadow-none" 
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <div className={cn(
                          "rounded-xl flex items-center justify-center transition-colors flex-shrink-0",
                          isMobile ? "w-14 h-14" : "w-12 h-12",
                          isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-lumina-blue"
                        )}>
                          <Icon size={isMobile ? 28 : 24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn(
                            "font-heading font-bold truncate",
                            isMobile ? "text-lg" : "text-base",
                            isActive ? "text-white" : "text-slate-900 dark:text-white"
                          )}>
                            {tool.name}
                          </div>
                          <div className={cn(
                            "text-sm line-clamp-2",
                            isActive ? "text-blue-100" : "text-slate-500 dark:text-slate-400"
                          )}>
                            {tool.description}
                          </div>
                        </div>
                        {tool.category && (
                          <div className={cn(
                            "px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border shrink-0",
                            isActive 
                              ? "bg-white/20 border-white/20 text-white" 
                              : "bg-lumina-blue/10 border-lumina-blue/10 text-lumina-blue"
                          )}>
                            {tool.category === 'Job Toolkit' ? 'Career' : tool.category}
                          </div>
                        )}
                        {!isMobile && (
                          <ArrowRight size={18} className={cn("transition-transform group-hover:translate-x-1", isActive ? "opacity-100" : "opacity-0")} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className={cn("py-12 text-center", isMobile ? "px-4" : "")}>
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-4">
                    <Search size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">No tools found</p>
                  <p className="text-xs text-slate-400 mt-1">Try a different search term or category</p>
                </div>
              )}
            </div>

            {/* Footer - Desktop Only */}
            {!isMobile && (
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">Enter</span>
                    <span>Select</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">↑↓</span>
                    <span>Navigate</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-lumina-blue uppercase tracking-widest">
                  Lumina Intelligence Platform
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function QuickActionButton({ tool, onClick, isMobile }: any) {
  const Icon = tool.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left group",
        isMobile ? "p-4 w-full" : "p-3"
      )}
    >
      <div className={cn(
        "rounded-xl bg-lumina-blue/10 flex items-center justify-center text-lumina-blue group-hover:scale-110 transition-transform flex-shrink-0",
        isMobile ? "w-12 h-12" : "w-10 h-10"
      )}>
        <Icon size={isMobile ? 24 : 20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-heading font-bold text-slate-900 dark:text-white truncate",
          isMobile ? "text-sm" : "text-xs"
        )}>{tool.name}</p>
        <p className={cn(
          "text-slate-400 line-clamp-1",
          isMobile ? "text-xs" : "text-[10px]"
        )}>{tool.description}</p>
      </div>
    </button>
  );
}
