import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants';
import { 
  Home, 
  Database, 
  User, 
  Settings, 
  Briefcase,
  MessageSquare,
  FileText,
  Calculator,
  Image,
  Video,
  Search,
  Clipboard,
  Target,
  Mail,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModernSidebarProps {
  activeTool: string;
  onSelect: (id: string) => void;
  onSearchOpen: () => void;
}

export default function ModernSidebar({ activeTool, onSelect, onSearchOpen }: ModernSidebarProps) {
  const location = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>('general');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getRouteForTool = (toolId: string): string => {
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
      'ats': '/ats-resume-checker',
      'tracker': '/job-tracker',
      'interview': '/interview-prep',
      'cover-letter': '/cover-letter-generator',
      'contact': '/contact'
    };
    return routeMap[toolId] || '/';
  };

  const iconBarItems = [
    { id: 'home', icon: Home, label: 'Home', toolId: 'homepage' },
    { id: 'tools', icon: Database, label: 'Tools', toolId: 'dashboard' },
    { id: 'auth', icon: User, label: 'Account', toolId: 'dashboard' },
    { id: 'settings', icon: Settings, label: 'Settings', toolId: 'contact' }
  ];

  const navigationSections = [
    {
      id: 'general',
      title: 'General',
      tools: TOOLS.filter(t => !t.category)
    },
    {
      id: 'job-toolkit',
      title: 'Job Toolkit',
      tools: TOOLS.filter(t => t.category === 'Job Toolkit')
    },
    {
      id: 'system',
      title: 'System',
      tools: TOOLS.filter(t => t.category === 'System')
    }
  ];

  return (
    <>
      {/* Modern Mobile Menu Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-black via-surface to-black border-b border-border/30 z-[80] mobile-menu-bar-enhanced">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-white font-bold text-sm leading-tight">Lumina</h2>
              <p className="text-text-secondary text-xs leading-tight">Toolkit</p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={onSearchOpen}
              className="p-2.5 rounded-xl bg-surface/50 border border-border/30 text-text-secondary hover:text-white hover:bg-surface transition-all duration-200 touch-target-enhanced"
            >
              <Search size={18} />
            </button>
            
            {/* Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`relative p-2.5 rounded-xl transition-all duration-300 touch-target-enhanced ${
                isMobileMenuOpen 
                  ? 'bg-accent text-black shadow-lg shadow-accent/30' 
                  : 'bg-surface/50 border border-border/30 text-text-secondary hover:text-white hover:bg-surface'
              }`}
            >
              <div className="relative w-5 h-5 flex flex-col justify-center items-center">
                <span 
                  className={`absolute h-0.5 w-4 bg-current transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen 
                      ? 'rotate-45 translate-y-0' 
                      : '-translate-y-1.5'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
                <span 
                  className={`h-0.5 bg-current transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen 
                      ? 'w-0 opacity-0' 
                      : 'w-3 opacity-100'
                  }`}
                />
                <span 
                  className={`absolute h-0.5 w-4 bg-current transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen 
                      ? '-rotate-45 translate-y-0' 
                      : 'translate-y-1.5'
                  }`}
                  style={{ transformOrigin: 'center' }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-black/80 z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Modern Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed top-16 left-0 right-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-surface via-surface/95 to-surface/90 border-r border-border/20 z-[70] overflow-hidden mobile-menu-drawer-enhanced"
          >
            {/* Scrollable Content Container */}
            <div className="h-full overflow-y-auto scrollbar-hide">
              {/* User Profile Section */}
              <div className="sticky top-0 bg-gradient-to-r from-surface to-surface/95 border-b border-border/20 p-4 z-10">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-accent/10 to-purple-500/5 border border-accent/20">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center shadow-lg shadow-accent/30">
                    <span className="text-white font-bold text-lg">L</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">Lumina Toolkit</h3>
                    <p className="text-text-secondary text-sm">Your creative companion</p>
                  </div>
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSearchOpen}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-surface to-surface/50 border border-border/20 hover:border-accent/30 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Search size={18} className="text-accent" />
                    </div>
                    <span className="text-xs text-text-secondary">Search</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gradient-to-br from-surface to-surface/50 border border-border/20 hover:border-accent/30 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Home size={18} className="text-purple-400" />
                    </div>
                    <span className="text-xs text-text-secondary">Home</span>
                  </motion.button>
                </div>
              </div>

              {/* Navigation Sections */}
              <div className="px-4 pb-4 space-y-4">
                {navigationSections.map((section) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * navigationSections.indexOf(section) }}
                  >
                    <button
                      onClick={() => setExpandedSection(
                        expandedSection === section.id ? null : section.id
                      )}
                      className="w-full flex items-center justify-between px-4 py-3 text-text-secondary hover:text-white transition-all duration-200 hover:bg-accent/10 rounded-xl group"
                    >
                      <span className="text-sm font-bold uppercase tracking-wider group-hover:text-accent transition-colors">
                        {section.title}
                      </span>
                      <motion.div 
                        className="w-4 h-4 flex items-center justify-center text-accent transition-transform"
                        animate={{ rotate: expandedSection === section.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▶
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {expandedSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-2 space-y-2 overflow-hidden"
                        >
                          {section.tools.map((tool, index) => {
                            const Icon = tool.icon;
                            const isActive = activeTool === tool.id;
                            
                            return (
                              <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Link
                                  to={getRouteForTool(tool.id)}
                                  onClick={() => {
                                    onSelect(tool.id);
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                                    isActive 
                                      ? 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent border border-accent/30 shadow-lg shadow-accent/20' 
                                      : 'text-text-secondary hover:bg-surface/50 hover:text-white hover:shadow-md'
                                  }`}
                                >
                                  <div className={`p-2.5 rounded-xl transition-all duration-200 ${
                                    isActive ? 'bg-accent/20' : 'bg-surface/50'
                                  }`}>
                                    <Icon size={16} className={isActive ? 'text-accent' : ''} />
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-sm font-medium">{tool.name}</span>
                                  </div>
                                  {isActive && (
                                    <motion.div 
                                      className="w-2 h-2 bg-accent rounded-full"
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 2, repeat: Infinity }}
                                    />
                                  )}
                                </Link>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="sticky bottom-0 bg-gradient-to-t from-surface to-surface/95 border-t border-border/20 p-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSearchOpen}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-accent/20 to-purple-500/10 text-white hover:from-accent/30 hover:to-purple-500/20 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl border border-accent/30"
                >
                  <div className="p-2.5 bg-white/10 rounded-xl">
                    <Search size={18} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium">Search All Tools</span>
                  <div className="ml-auto">
                    <kbd className="px-2 py-1 text-xs bg-surface/50 rounded-lg border border-border/50">⌘K</kbd>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:h-auto md:w-auto h-0 w-0 bg-black">
        {/* Icon Bar */}
        <div className="w-16 bg-black border-r border-border flex flex-col items-center py-4 space-y-4">
          {iconBarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTool === item.toolId;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.toolId);
                  if (item.id === 'tools') {
                    setExpandedSection(expandedSection === 'general' ? null : 'general');
                  }
                }}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-accent text-black' 
                    : 'text-text-secondary hover:bg-hover hover:text-white'
                }`}
                title={item.label}
              >
                <Icon size={18} />
                {isActive && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Rail */}
        <div className="w-56 bg-surface border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-white font-semibold text-lg">Lumina Toolkit</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {navigationSections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )}
                  className="w-full flex items-center justify-between px-3 py-2 text-text-secondary hover:text-white transition-colors"
                >
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {section.title}
                  </span>
                  <div className={`w-4 h-4 flex items-center justify-center transition-transform ${
                    expandedSection === section.id ? 'rotate-90' : ''
                  }`}>
                    ▶
                  </div>
                </button>

                {expandedSection === section.id && (
                  <div className="mt-2 space-y-1">
                    {section.tools.map((tool) => {
                      const Icon = tool.icon;
                      const isActive = activeTool === tool.id;
                      
                      return (
                        <Link
                          key={tool.id}
                          to={getRouteForTool(tool.id)}
                          onClick={() => onSelect(tool.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                            isActive 
                              ? 'bg-accent/20 text-accent border-l-2 border-accent' 
                              : 'text-text-secondary hover:bg-hover hover:text-white'
                          }`}
                        >
                          <Icon size={16} />
                          <span className="text-sm">{tool.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <button
              onClick={onSearchOpen}
              className="w-full flex items-center gap-3 px-3 py-2 bg-hover text-text-secondary hover:text-white rounded-md transition-all"
            >
              <Search size={16} />
              <span className="text-sm">Search</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
