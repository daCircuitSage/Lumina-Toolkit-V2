import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants';
import { 
  Home, 
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
      'profile': '/profile',
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
      'contact': '/contact',
      'settings': '/settings'
    };
    return routeMap[toolId] || '/';
  };

  const iconBarItems = [
    { id: 'home', icon: Home, label: 'Home', toolId: 'homepage' },
    { id: 'auth', icon: User, label: 'Account', toolId: 'profile' },
    { id: 'settings', icon: Settings, label: 'Settings', toolId: 'settings' }
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
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-canvas border-b border-hairline z-[80]">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-on-primary font-normal text-lg">L</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-ink font-normal text-sm leading-tight">Lumina</h2>
              <p className="body-sm text-xs leading-tight">Toolkit</p>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={onSearchOpen}
              className="p-2.5 rounded-xl bg-canvas-soft border border-hairline body-sm hover:text-ink hover:bg-canvas transition-all duration-200 touch-target-enhanced"
            >
              <Search size={18} />
            </button>
            
            {/* Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`relative p-2.5 rounded-xl transition-all duration-300 touch-target-enhanced ${
                isMobileMenuOpen 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-canvas-soft border border-hairline body-sm hover:text-ink hover:bg-canvas'
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
            className="md:hidden fixed top-16 left-0 right-0 h-[calc(100vh-4rem)] bg-canvas border-r border-hairline z-[70] overflow-hidden"
          >
            {/* Scrollable Content Container */}
            <div className="h-full overflow-y-auto scrollbar-hide">
              {/* User Profile Section */}
              <div className="sticky top-0 bg-canvas border-b border-hairline p-4 z-10">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-canvas-soft border border-hairline">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <span className="text-on-primary font-normal text-lg">L</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-ink font-normal text-lg">Lumina Toolkit</h3>
                    <p className="body-sm text-sm">Your creative companion</p>
                  </div>
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSearchOpen}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-canvas-soft border border-hairline hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Search size={18} className="text-ink" />
                    </div>
                    <span className="text-xs body-sm">Search</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-canvas-soft border border-hairline hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Home size={18} className="text-ink" />
                    </div>
                    <span className="text-xs body-sm">Home</span>
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
                      className="w-full flex items-center justify-between px-4 py-3 body-sm hover:text-ink transition-all duration-200 hover:bg-canvas-soft rounded-xl group"
                    >
                      <span className="text-sm font-normal uppercase tracking-wider group-hover:text-ink transition-colors">
                        {section.title}
                      </span>
                      <motion.div 
                        className="w-4 h-4 flex items-center justify-center text-ink transition-transform"
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
                                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                    isActive 
                                      ? 'bg-primary/10 text-ink border border-primary/30' 
                                      : 'body-sm hover:bg-canvas-soft hover:text-ink'
                                  }`}
                                >
                                  <div className={`p-2.5 rounded-xl transition-all duration-200 ${
                                    isActive ? 'bg-primary/20' : 'bg-canvas-soft'
                                  }`}>
                                    <Icon size={16} className={isActive ? 'text-ink' : ''} />
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-sm font-normal">{tool.name}</span>
                                  </div>
                                  {isActive && (
                                    <motion.div 
                                      className="w-2 h-2 bg-primary rounded-full"
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
              <div className="sticky bottom-0 bg-canvas border-t border-hairline p-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onSearchOpen}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-ink hover:bg-primary/20 rounded-xl transition-all duration-200 border border-hairline"
                >
                  <div className="p-2.5 bg-primary/20 rounded-xl">
                    <Search size={18} className="text-ink" />
                  </div>
                  <span className="text-sm font-normal">Search All Tools</span>
                  <div className="ml-auto">
                    <kbd className="px-2 py-1 text-xs bg-canvas-soft rounded-xl border border-hairline">⌘K</kbd>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:h-auto md:w-auto h-0 w-0 bg-canvas">
        {/* Icon Bar */}
        <div className="w-16 bg-canvas border-r border-hairline flex flex-col items-center py-4 space-y-4">
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
                className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  isActive 
                    ? 'bg-primary text-on-primary' 
                    : 'body-sm hover:bg-canvas-soft hover:text-ink'
                }`}
                title={item.label}
              >
                <Icon size={18} />
                {isActive && (
                  <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Navigation Rail */}
        <div className="w-56 bg-canvas-soft border-r border-hairline flex flex-col">
          <div className="p-4 border-b border-hairline">
            <h2 className="text-ink font-normal text-lg">Lumina Toolkit</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {navigationSections.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => setExpandedSection(
                    expandedSection === section.id ? null : section.id
                  )}
                  className="w-full flex items-center justify-between px-3 py-2 body-sm hover:text-ink transition-colors"
                >
                  <span className="text-xs font-normal uppercase tracking-wider">
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
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                            isActive 
                              ? 'bg-primary/10 text-ink border-l-2 border-primary' 
                              : 'body-sm hover:bg-canvas hover:text-ink'
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

          <div className="p-4 border-t border-hairline">
            <button
              onClick={onSearchOpen}
              className="w-full flex items-center gap-3 px-3 py-2 bg-canvas body-sm hover:text-ink rounded-xl transition-all"
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
