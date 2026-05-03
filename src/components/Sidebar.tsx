import React, { useState, useEffect } from 'react';
import { TOOLS } from '../constants';
import { cn } from '../lib/utils';
import Logo from './Logo';
import { 
  ChevronRight, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Sparkles, 
  Briefcase, 
  MessageSquare, 
  Search,
  Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  activeTool: string;
  onSelect: (id: string) => void;
  onSearchOpen: () => void;
}

export default function Sidebar({ activeTool, onSelect, onSearchOpen }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Close mobile sidebar on navigation
  const handleSelect = (id: string) => {
    onSelect(id);
    setIsMobileOpen(false);
  };

  // Handle logo click - navigate to homepage
  const handleLogoClick = () => {
    onSelect('homepage');
    setIsMobileOpen(false);
  };

  // Close mobile sidebar on window resize if it was open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 z-50 flex items-center px-4 justify-between transition-colors">
        <Logo onClick={handleLogoClick} />
        <div className="flex items-center gap-2">
          <button 
            onClick={onSearchOpen}
            className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 border border-transparent dark:border-slate-800"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 border border-transparent dark:border-slate-800"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Content (Drawer) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-slate-900 z-[70] md:hidden flex flex-col shadow-2xl transition-colors"
          >
            <div className="p-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800">
              <Logo onClick={handleLogoClick} />
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
              <div>
                <p className="px-4 text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-3">General</p>
                <div className="space-y-1">
                  {TOOLS.filter(t => !t.category).map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleSelect(tool.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                          isActive 
                            ? "bg-lumina-blue/10 text-lumina-blue font-medium" 
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                      >
                        <Icon size={20} />
                        <span className="text-sm font-heading font-semibold tracking-tight">{tool.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="px-4 text-[10px] font-black uppercase tracking-[3px] text-lumina-blue mb-3 flex items-center gap-2">
                  <Briefcase size={12} /> Job Toolkit
                </p>
                <div className="space-y-1">
                  {TOOLS.filter(t => t.category === 'Job Toolkit').map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleSelect(tool.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                          isActive 
                            ? "bg-lumina-blue/10 text-lumina-blue font-medium" 
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                      >
                        <Icon size={20} />
                        <span className="text-sm font-heading font-semibold tracking-tight">{tool.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="px-4 text-[10px] font-black uppercase tracking-[3px] text-slate-400 mb-3 flex items-center gap-2">
                   System
                </p>
                <div className="space-y-1">
                  {TOOLS.filter(t => t.category === 'System').map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => handleSelect(tool.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                          isActive 
                            ? "bg-lumina-blue/10 text-lumina-blue font-medium" 
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        )}
                      >
                        <Icon size={20} />
                        <span className="text-sm font-heading font-semibold tracking-tight">{tool.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            <div className="p-4 border-t border-slate-50 dark:border-slate-800">
               <button 
                onClick={() => handleSelect('contact')}
                className="w-full py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
               >
                 <MessageSquare size={14} /> Contact Support
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside 
        id="app-sidebar"
        initial={false}
        animate={{ width: isOpen ? 288 : 72 }}
        className={cn(
          "hidden md:flex fixed left-0 top-0 h-screen bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/60 dark:border-slate-800/60 z-40 flex-col transition-all duration-250 ease-out overflow-hidden shadow-xl",
          "supports-[backdrop-filter]:bg-white/90 supports-[backdrop-filter]:dark:bg-slate-900/90"
        )}
      >
        {/* Sidebar Header */}
        <div className="relative h-16 shrink-0 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/60 via-blue-50/40 to-transparent dark:from-indigo-900/20 dark:via-blue-900/10 dark:to-transparent"></div>
          <div className={cn(
            "relative h-full flex items-center transition-all duration-250",
            isOpen ? "px-6 justify-between" : "px-0 justify-center"
          )}>
            <Logo isCollapsed={!isOpen} onClick={handleLogoClick} />
            {isOpen && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 rounded-lg transition-all duration-200 border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700/60"
              >
                <ChevronRight className={cn("transition-transform duration-200", !isOpen && "rotate-180")} size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Search Trigger */}
        <div className={cn(
          "shrink-0 transition-all duration-250",
          isOpen ? "px-4 py-4" : "px-3 py-3"
        )}>
          <button
            onClick={onSearchOpen}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group border border-slate-200/60 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/40 hover:border-indigo-300/60 dark:hover:border-indigo-600/60 hover:bg-white dark:hover:bg-slate-800/60 shadow-sm hover:shadow-md",
              isOpen ? "w-full" : "w-12 h-12 justify-center"
            )}
          >
            <Search size={16} className="text-slate-400/60 group-hover:text-indigo-500 transition-colors duration-200" />
            {isOpen && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Search tools...</span>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 text-[10px] font-semibold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm">⌘</kbd>
                  <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-900 text-[10px] font-semibold text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm">K</kbd>
                </div>
              </div>
            )}
            {!isOpen && (
               <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-6px] group-hover:translate-x-0 pointer-events-none z-50 shadow-xl border border-slate-700 dark:border-slate-600 font-semibold uppercase tracking-wider whitespace-nowrap">
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 border-l border-b border-slate-700 dark:border-slate-600"></div>
                Search (⌘K)
              </div>
            )}
          </button>
        </div>

        <nav className={cn(
          "flex-1 overflow-y-scroll overflow-x-hidden transition-all duration-250",
          isOpen ? "px-4 py-6 space-y-6" : "px-2 py-4 space-y-1"
        )}>
          <div>
            <div className={cn("text-[11px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[3px] px-3 mb-4 transition-all duration-300 flex items-center gap-2", !isOpen ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto")}>
              <Sparkles size={12} className="text-indigo-500" /> Utility Tools
            </div>
            <div className="space-y-1">
              {TOOLS.filter(t => !t.category).map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <NavButton 
                    key={tool.id}
                    tool={tool}
                    isActive={isActive}
                    isOpen={isOpen}
                    onClick={() => handleSelect(tool.id)}
                  />
                );
              })}
            </div>
          </div>

          <div>
             <div className={cn("text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[3px] px-3 mb-4 transition-all duration-300 flex items-center gap-2", !isOpen ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto")}>
               <Briefcase size={12} /> Job Toolkit
             </div>
             <div className="space-y-1">
               {TOOLS.filter(t => t.category === 'Job Toolkit').map((tool) => {
                 const Icon = tool.icon;
                 const isActive = activeTool === tool.id;
                 
                 return (
                   <NavButton 
                    key={tool.id}
                    tool={tool}
                    isActive={isActive}
                    isOpen={isOpen}
                    onClick={() => handleSelect(tool.id)}
                   />
                 );
               })}
             </div>
          </div>

          <div>
             <div className={cn("text-[11px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-[3px] px-3 mb-4 transition-all duration-300 flex items-center gap-2", !isOpen ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto")}>
               <Settings size={12} /> System
             </div>
             <div className="space-y-1">
               {TOOLS.filter(t => t.category === 'System').map((tool) => {
                 const Icon = tool.icon;
                 const isActive = activeTool === tool.id;
                 
                 return (
                   <NavButton 
                    key={tool.id}
                    tool={tool}
                    isActive={isActive}
                    isOpen={isOpen}
                    onClick={() => handleSelect(tool.id)}
                   />
                 );
               })}
             </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className={cn(
          "p-4 border-t border-slate-200/60 dark:border-slate-800/60 shrink-0 transition-all duration-250",
          !isOpen && "p-2"
        )}>
           {isOpen && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-4 mb-4 border border-slate-200/60 dark:border-slate-700/60"
             >
                <div className="flex items-center justify-between mb-3">
                   <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Settings</p>
                   <button 
                    onClick={toggleTheme}
                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 border border-slate-200/60 dark:border-slate-700/60"
                   >
                     {theme === 'light' ? <Moon size={12} /> : <Sun size={12} />}
                   </button>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></div> System Active
                </div>
                <button 
                  onClick={() => handleSelect('contact')}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Support
                </button>
             </motion.div>
           )}
           <div className={cn(
             "flex items-center gap-2",
             !isOpen && "flex-col gap-2"
           )}>
             <button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60",
                  isOpen ? "flex-1 py-3" : "w-12 h-12 flex items-center justify-center"
                )}
              >
                <Menu size={16} />
             </button>
             {!isOpen && (
              <button 
                onClick={toggleTheme}
                className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all duration-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
             )}
           </div>
        </div>
      </motion.aside>
      
      {/* Spacer for desktop main content */}
      <motion.div 
        initial={false}
        animate={{ width: isOpen ? 288 : 72 }}
        className="hidden md:block transition-all duration-250 ease-out shrink-0" 
      />
    </>
  );
}

function NavButton({ tool, isActive, isOpen, onClick }: any) {
  const Icon = tool.icon;
  const { theme } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center transition-all duration-200 group",
        isOpen 
          ? "w-full gap-3 px-3 py-2 rounded-xl" 
          : "w-12 h-12 mx-auto rounded-xl justify-center"
      )}
      style={{
        backgroundColor: isActive 
          ? isOpen 
            ? theme === 'dark' ? 'rgb(30 58 138)' : 'rgb(238 242 255)' // indigo-900 dark, indigo-50 light
            : 'rgb(99 102 241)' // indigo-500
          : isOpen
          ? 'transparent'
          : 'transparent',
        color: isActive 
          ? isOpen 
            ? theme === 'dark' ? 'rgb(165 180 252)' : 'rgb(79 70 229)' // indigo-400 dark, indigo-600 light
            : 'white'
          : isOpen
          ? theme === 'dark' ? 'rgb(148 163 184)' : 'rgb(71 85 105)' // slate-400 dark, slate-600 light
          : theme === 'dark' ? 'rgb(148 163 184)' : 'rgb(71 85 105)',
        border: isActive 
          ? isOpen
            ? theme === 'dark' ? '1px solid rgb(55 48 163)' : '1px solid rgb(165 180 252)' // indigo-800 dark, indigo-200 light
            : '1px solid rgb(99 102 241)'
          : isOpen
          ? '1px solid transparent'
          : '1px solid transparent',
        opacity: isActive ? 1 : 0.7,
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = isOpen 
            ? theme === 'dark' ? 'rgb(30 41 59)' : 'rgb(241 245 249)' // slate-800 dark, slate-100 light
            : theme === 'dark' ? 'rgb(30 41 59)' : 'rgb(241 245 249)';
          e.currentTarget.style.borderColor = isOpen
            ? theme === 'dark' ? 'rgb(51 65 85)' : 'rgb(226 232 240)' // slate-700 dark, slate-200 light
            : theme === 'dark' ? 'rgb(51 65 85)' : 'rgb(226 232 240)';
          e.currentTarget.style.color = theme === 'dark' ? 'rgb(226 232 240)' : 'rgb(30 41 59)'; // slate-200 dark, slate-800 light
          e.currentTarget.style.opacity = '1';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.color = theme === 'dark' ? 'rgb(148 163 184)' : 'rgb(71 85 105)';
          e.currentTarget.style.opacity = '0.7';
        }
      }}
    >
      <div className={cn(
        "flex items-center justify-center transition-all duration-200",
        isOpen ? "w-10 h-10 rounded-lg" : "w-8 h-8 rounded-lg"
      )}
      style={{
        backgroundColor: isActive 
          ? isOpen 
            ? theme === 'dark' ? 'rgb(30 58 138)' : 'rgb(224 231 255)' // indigo-900 dark, indigo-100 light
            : 'rgba(255, 255, 255, 0.2)'
          : isOpen
          ? theme === 'dark' ? 'rgb(30 41 59)' : 'rgb(241 245 249)' // slate-800 dark, slate-100 light
          : theme === 'dark' ? 'rgb(30 41 59)' : 'rgb(241 245 249)',
        color: isActive 
          ? isOpen 
            ? theme === 'dark' ? 'rgb(165 180 252)' : 'rgb(79 70 229)' // indigo-400 dark, indigo-600 light
            : 'white'
          : isOpen
          ? theme === 'dark' ? 'rgb(100 116 139)' : 'rgb(100 116 139)' // slate-500
          : theme === 'dark' ? 'rgb(100 116 139)' : 'rgb(100 116 139)',
      }}>
        <Icon size={isOpen ? 16 : 14} className="transition-colors duration-200" />
      </div>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex items-center justify-between text-left"
        >
          <span className={cn(
            "text-sm font-semibold tracking-tight whitespace-nowrap",
            isActive 
              ? theme === 'dark' ? "text-indigo-400" : "text-indigo-600 font-bold"
              : theme === 'dark' ? "text-slate-300" : "text-slate-700"
          )}>
            {tool.name}
          </span>
          {isActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-1"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
            </motion.div>
          )}
        </motion.div>
      )}
      {!isOpen && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-6px] group-hover:translate-x-0 pointer-events-none z-50 shadow-xl border border-slate-700 dark:border-slate-600 font-semibold uppercase tracking-wider whitespace-nowrap">
          <div className={cn(
            "absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 border-l border-b",
            theme === 'dark' ? "bg-slate-800 border-slate-600" : "bg-slate-900 border-slate-700"
          )}></div>
          {tool.name}
        </div>
      )}
    </button>
  );
}

