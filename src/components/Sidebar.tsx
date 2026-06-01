import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  getRouteForTool?: (id: string) => string;
}

export default function Sidebar({ activeTool, onSelect, onSearchOpen, getRouteForTool }: SidebarProps) {
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

  // SEO-friendly route getter
  const getRoute = (toolId: string): string => {
    if (getRouteForTool) return getRouteForTool(toolId);
    
    // Fallback routes
    const routeMap: { [key: string]: string } = {
      'homepage': '/',
      'dashboard': '/all-tools',
      'chat': '/ai-assistant',
      'resume': '/resume-builder',
      'pdf': '/pdf-converter',
      'age': '/age-calculator',
      'gpa': '/gpa-calculator',
      'caption': '/ai-caption-generator',
      'youtube': '/youtube-title-generator',
      'blog': '/blog',
      'ats': '/ats-resume-checker',
      'tracker': '/job-tracker',
      'interview': '/interview-prep',
      'cover-letter': '/cover-letter-generator',
      'contact': '/contact'
    };
    return routeMap[toolId] || '/';
  };

  // Close mobile sidebar on window resize if it was open
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.innerWidth >= 768) {
          setIsMobileOpen(false);
        }
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-canvas backdrop-blur-md border-b border-hairline z-50 flex items-center px-4 justify-between transition-colors">
        <Logo onClick={handleLogoClick} />
        <div className="flex items-center gap-2">
          <button 
            onClick={onSearchOpen}
            className="p-2.5 text-body hover:bg-canvas-soft rounded-xl transition-all duration-200 border border-hairline"
          >
            <Search size={20} />
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-body hover:bg-canvas-soft rounded-xl transition-all duration-200 border border-hairline"
          >
            <Moon size={20} />
          </button>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2.5 text-body hover:bg-canvas-soft rounded-xl transition-all duration-200"
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
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[60] md:hidden"
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
            className="fixed left-0 top-0 bottom-0 h-[100vh] max-h-[100vh] w-72 bg-canvas z-[70] md:hidden flex flex-col shadow-2xl transition-colors"
          >
            <div className="p-6 flex items-center justify-between border-b border-hairline">
              <Logo onClick={handleLogoClick} />
              <button onClick={() => setIsMobileOpen(false)} className="p-2 text-mute hover:text-ink transition-colors">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 min-h-0 p-4 space-y-6 overflow-y-auto">
              <div>
                <p className="px-4 caption uppercase tracking-[3px] text-mute mb-3">General</p>
                <div className="space-y-1">
                  {TOOLS.filter(t => !t.category).map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <Link
                        key={tool.id}
                        to={getRoute(tool.id)}
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
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="px-4 caption uppercase tracking-[3px] text-primary mb-3 flex items-center gap-2">
                  <Briefcase size={12} /> Job Toolkit
                </p>
                <div className="space-y-1">
                  {TOOLS.filter(t => t.category === 'Job Toolkit').map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <Link
                        key={tool.id}
                        to={getRoute(tool.id)}
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
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="px-4 caption uppercase tracking-[3px] text-mute mb-3 flex items-center gap-2">
                   System
                </p>
                <div className="space-y-1">
                  {TOOLS.filter(t => t.category === 'System').map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <Link
                        key={tool.id}
                        to={getRoute(tool.id)}
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
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            <div className="p-4 border-t border-hairline">
               <Link 
                to={getRoute('contact')}
                onClick={() => handleSelect('contact')}
                className="w-full py-3 bg-primary text-on-primary caption font-black uppercase tracking-widest rounded-xl hover:bg-primary-active transition-all flex items-center justify-center gap-2"
               >
                 <MessageSquare size={14} /> Contact Support
               </Link>
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
          "hidden md:flex fixed left-0 top-0 h-screen bg-canvas backdrop-blur-xl border-r border-hairline z-40 flex-col transition-all duration-300 ease-out shadow-2xl",
          "supports-[backdrop-filter]:bg-canvas/85",
          "lg:block" // Always show on large screens
        )}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-canvas/10 to-transparent pointer-events-none z-0"></div>
        
        {/* Sidebar Header */}
        <div className="relative h-16 shrink-0 border-b border-hairline overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/8 to-primary/10 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-canvas/20 to-transparent"></div>
          <div className={cn(
            "relative h-full flex items-center transition-all duration-250",
            isOpen ? "px-6 justify-between" : "px-0 justify-center"
          )}>
            <Logo isCollapsed={!isOpen} onClick={handleLogoClick} />
            {isOpen && (
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-mute hover:text-ink hover:bg-canvas-soft rounded-lg transition-all duration-200 border border-hairline"
              >
                <ChevronRight className={cn("transition-transform duration-200", !isOpen && "rotate-180")} size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Search Trigger */}
        <div className={cn(
          "shrink-0 transition-all duration-300 relative z-10",
          isOpen ? "px-4 py-4" : "px-3 py-3"
        )}>
          <motion.button
            onClick={onSearchOpen}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group border border-hairline bg-canvas-soft hover:border-primary/60 hover:bg-canvas shadow-sm hover:shadow-lg relative overflow-hidden",
              isOpen ? "w-full" : "w-12 h-12 justify-center"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Search size={16} className="text-mute/60 group-hover:text-primary transition-colors duration-300 flex-shrink-0 relative z-10" />
            </motion.div>
            {isOpen && (
              <motion.div 
                className="flex-1 flex items-center justify-between text-left relative z-10"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-medium text-body">Search tools...</span>
                <motion.div 
                  className="flex items-center gap-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <kbd className="px-2 py-1 rounded-md bg-canvas text-[10px] font-semibold text-mute border border-hairline shadow-sm hover:shadow-md transition-all duration-200">⌘</kbd>
                  <kbd className="px-2 py-1 rounded-md bg-canvas text-[10px] font-semibold text-mute border border-hairline shadow-sm hover:shadow-md transition-all duration-200">K</kbd>
                </motion.div>
              </motion.div>
            )}
            {!isOpen && (
               <motion.div 
                 className="absolute left-full ml-3 px-3 py-2 bg-ink text-on-primary caption rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-6px] group-hover:translate-x-0 pointer-events-none z-50 shadow-xl border border-hairline font-semibold uppercase tracking-wider whitespace-nowrap"
                 initial={{ opacity: 0, scale: 0.8 }}
                 whileHover={{ opacity: 1, scale: 1 }}
               >
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-ink rotate-45 border-l border-b border-hairline"></div>
                Search (⌘K)
              </motion.div>
            )}
          </motion.button>
        </div>

        <div className="flex-1 relative z-10">
          <div 
            className="h-full overflow-y-auto overflow-x-hidden sidebar-scrollbar"
            style={{ 
              height: 'calc(100vh - 4rem - 5rem - 12rem)', // Header (4rem) + Search (5rem) + Footer (12rem)
              maxHeight: 'calc(100vh - 4rem - 5rem - 12rem)'
            }}
          >
          <div className={cn("space-y-6", isOpen ? "px-4 py-6" : "px-2 py-4 space-y-1")}>
            <motion.div 
              className={cn("caption font-bold text-mute uppercase tracking-[3px] px-3 mb-4 transition-all duration-300 flex items-center gap-2", !isOpen ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto")}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={12} className="text-primary" />
              </motion.div>
              <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Utility Tools</span>
            </motion.div>
            <div className="space-y-1">
              {TOOLS.filter(t => !t.category).map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <Link
                    key={tool.id}
                    to={getRoute(tool.id)}
                    onClick={() => handleSelect(tool.id)}
                  >
                    <NavButton 
                      tool={tool}
                      isActive={isActive}
                      isOpen={isOpen}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
             <motion.div 
               className={cn("caption font-bold text-primary uppercase tracking-[3px] px-3 mb-4 transition-all duration-300 flex items-center gap-2", !isOpen ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto")}
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, delay: 0.2 }}
             >
               <motion.div
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               >
                 <Briefcase size={12} className="text-primary" />
               </motion.div>
               <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">Job Toolkit</span>
             </motion.div>
             <div className="space-y-1">
               {TOOLS.filter(t => t.category === 'Job Toolkit').map((tool) => {
                 const Icon = tool.icon;
                 const isActive = activeTool === tool.id;
                 
                 return (
                   <Link
                    key={tool.id}
                    to={getRoute(tool.id)}
                    onClick={() => handleSelect(tool.id)}
                   >
                     <NavButton 
                      tool={tool}
                      isActive={isActive}
                      isOpen={isOpen}
                     />
                   </Link>
                 );
               })}
             </div>
          </div>

          <div>
             <motion.div 
               className={cn("caption font-bold text-mute uppercase tracking-[3px] px-3 mb-4 transition-all duration-300 flex items-center gap-2", !isOpen ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto")}
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3, delay: 0.3 }}
             >
               <motion.div
                 animate={{ rotate: [0, 180, 360] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               >
                 <Settings size={12} className="text-mute" />
               </motion.div>
               <span className="bg-gradient-to-r from-body to-mute bg-clip-text text-transparent">System</span>
             </motion.div>
             <div className="space-y-1">
               {TOOLS.filter(t => t.category === 'System').map((tool) => {
                 const Icon = tool.icon;
                 const isActive = activeTool === tool.id;
                 
                 return (
                   <Link
                    key={tool.id}
                    to={getRoute(tool.id)}
                    onClick={() => handleSelect(tool.id)}
                   >
                     <NavButton 
                      tool={tool}
                      isActive={isActive}
                      isOpen={isOpen}
                     />
                   </Link>
                 );
               })}
             </div>
          </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className={cn(
          "p-4 border-t border-hairline shrink-0 transition-all duration-300 relative z-10",
          !isOpen && "p-2"
        )}>
           {isOpen && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4, delay: 0.4 }}
               className="relative bg-gradient-to-br from-canvas-soft/80 to-canvas-soft/80 rounded-2xl p-4 mb-4 border border-hairline backdrop-blur-sm"
               whileHover={{ scale: 1.02, y: -2 }}
             >
                <div className="flex items-center justify-between mb-3">
                   <motion.p 
                     className="caption font-bold text-body uppercase tracking-wider"
                     animate={{ opacity: [0.7, 1, 0.7] }}
                     transition={{ duration: 2, repeat: Infinity }}
                   >
                     Settings
                   </motion.p>
                   <motion.button 
                    onClick={toggleTheme}
                    className="p-2 hover:bg-canvas-soft rounded-lg transition-all duration-300 border border-hairline"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                   >
                     <motion.div
                       animate={{ rotate: 0 }}
                       transition={{ duration: 0.5 }}
                     >
                       <Moon size={12} />
                     </motion.div>
                   </motion.button>
                </div>
                <motion.div 
                  className="flex items-center gap-2 text-xs font-medium text-body mb-3"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full bg-positive shadow-sm shadow-positive/50"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  ></motion.div> System Active
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={getRoute('contact')}
                    onClick={() => handleSelect('contact')}
                    className="w-full py-2.5 bg-gradient-to-r from-primary via-primary to-primary hover:from-primary-active hover:via-primary-active hover:to-primary-active text-on-primary caption font-bold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-canvas/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        Support
                      </motion.div>
                    </span>
                  </Link>
                </motion.div>
             </motion.div>
           )}
           <motion.div 
             className={cn(
               "flex items-center gap-2",
               !isOpen && "flex-col gap-2"
             )}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: 0.5 }}
           >
             <motion.button 
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  "text-body hover:text-ink transition-all duration-300 rounded-xl hover:bg-canvas-soft border border-hairline",
                  isOpen ? "flex-1 py-3" : "w-12 h-12 flex items-center justify-center"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <Menu size={16} />
                </motion.div>
             </motion.button>
             {!isOpen && (
              <motion.button 
                onClick={toggleTheme}
                className="w-12 h-12 flex items-center justify-center text-body hover:text-ink transition-all duration-300 rounded-xl hover:bg-canvas-soft border border-hairline"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Moon size={16} />
                </motion.div>
              </motion.button>
             )}
           </motion.div>
        </div>
      </motion.aside>
      
      {/* Spacer for desktop main content */}
      <motion.div 
        initial={false}
        animate={{ width: isOpen ? 288 : 72 }}
        className="hidden md:block lg:block transition-all duration-250 ease-out shrink-0" 
      />
    </>
  );
}

function NavButton({ tool, isActive, isOpen }: any) {
  const Icon = tool.icon;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center transition-all duration-300 group",
        isOpen 
          ? "w-full gap-3 px-3 py-2.5 rounded-xl" 
          : "w-12 h-12 mx-auto rounded-xl justify-center"
      )}
      style={{
        backgroundColor: isActive 
          ? isOpen 
            ? 'var(--color-primary-pale)'
            : 'var(--color-primary)'
          : isOpen
          ? 'transparent'
          : 'transparent',
        color: isActive 
          ? isOpen 
            ? 'var(--color-ink)'
            : 'var(--color-on-primary)'
          : isOpen
          ? 'var(--color-body)'
          : 'var(--color-body)',
        border: isActive 
          ? isOpen
            ? '1px solid var(--color-primary)'
            : '1px solid var(--color-primary)'
          : isOpen
          ? '1px solid transparent'
          : '1px solid transparent',
        opacity: isActive ? 1 : 0.8,
        boxShadow: isActive 
          ? isOpen 
            ? '0 0 20px rgba(159, 232, 112, 0.3)' 
            : '0 0 15px rgba(159, 232, 112, 0.4)'
          : isHovered 
            ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
            : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = isOpen 
            ? 'var(--color-canvas-soft)'
            : 'var(--color-canvas-soft)';
          e.currentTarget.style.borderColor = isOpen
            ? 'var(--color-hairline)'
            : 'var(--color-hairline)';
          e.currentTarget.style.color = 'var(--color-ink)';
          e.currentTarget.style.opacity = '1';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.borderColor = 'transparent';
          e.currentTarget.style.color = 'var(--color-body)';
          e.currentTarget.style.opacity = '0.8';
        }
      }}
    >
      <motion.div 
        className={cn(
          "flex items-center justify-center transition-all duration-300",
          isOpen ? "w-10 h-10 rounded-lg" : "w-8 h-8 rounded-lg"
        )}
        animate={{
          rotate: isHovered ? 360 : 0,
          scale: isHovered ? 1.1 : 1
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          backgroundColor: isActive 
            ? isOpen 
              ? 'var(--color-primary)'
              : 'rgba(255, 255, 255, 0.2)'
            : isOpen
            ? 'var(--color-canvas-soft)'
            : 'var(--color-canvas-soft)',
          color: isActive 
            ? isOpen 
              ? 'var(--color-on-primary)'
              : 'var(--color-on-primary)'
            : isOpen
            ? 'var(--color-body)'
            : 'var(--color-body)',
          boxShadow: isActive 
            ? '0 0 15px rgba(159, 232, 112, 0.4)' 
            : isHovered 
            ? '0 0 10px rgba(159, 232, 112, 0.2)' 
            : 'none',
        }}>
        <Icon size={isOpen ? 16 : 14} className="transition-colors duration-300" />
      </motion.div>
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
              ? "text-ink font-bold"
              : "text-body"
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
              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-neutral"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-pale"></div>
            </motion.div>
          )}
        </motion.div>
      )}
      {!isOpen && (
        <div className="absolute left-full ml-3 px-3 py-2 bg-ink text-on-primary caption rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-[-6px] group-hover:translate-x-0 pointer-events-none z-50 shadow-xl border border-hairline font-semibold uppercase tracking-wider whitespace-nowrap">
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 border-l border-b bg-ink border-hairline"></div>
          {tool.name}
        </div>
      )}
    </motion.div>
  );
}

