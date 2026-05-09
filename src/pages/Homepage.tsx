import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Search, 
  FileText, 
  ChevronRight,
  Bot,
  FileUp,
  Calendar,
  Calculator,
  MessageSquare,
  Youtube,
  BarChart3,
  ListTodo,
  BrainCircuit,
  Mail,
  CheckCircle,
  Users,
  Star,
  ArrowRight,
  Shield,
  Zap,
  Clock,
  User,
  LogOut
} from 'lucide-react';
import TerminalBackground from '../components/TerminalBackground';
import { TOOLS } from '../constants';
import { useDatabase } from '../contexts/DatabaseContext';

export default function Homepage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signOut } = useDatabase();


  return (
    <div className="relative bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Hero Section with Modern Gradient Background */}
      <section className="relative min-h-screen">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-surface to-black">
          <div className="absolute inset-0 bg-gradient-to-t from-accent/5 via-transparent to-purple-500/5" />
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
          </div>
        </div>

        {/* Mobile-Optimized Navigation */}
        <nav className="relative z-20 px-4 py-6 md:px-8 md:py-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl tracking-tight">Lumina</span>
                <span className="text-xs text-text-secondary hidden md:block">Toolkit</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {authLoading ? (
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
              ) : user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-full" />
                      ) : (
                        <User className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <span className="text-sm text-white/80 hidden md:block">
                      {user?.displayName || user?.email || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate('/all-tools')}
                    className="px-4 py-2 bg-surface/50 border border-border/30 rounded-xl hover:bg-surface transition-all duration-200 text-sm font-medium"
                  >
                    All Tools
                  </button>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/all-tools')}
                    className="px-4 py-2 bg-surface/50 border border-border/30 rounded-xl hover:bg-surface transition-all duration-200 text-sm font-medium"
                  >
                    All Tools
                  </button>
                  <button
                    onClick={signIn}
                    className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-accent/30"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-32">
          <div className="text-center space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-white via-accent to-purple-400 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                <span className="text-white">Productivity Tools</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mt-6">
                Access 14+ free AI tools including resume builders, PDF converters, calculators, and job search assistants. 
                Boost your productivity with our comprehensive toolkit - no registration required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate('/all-tools')}
                className="group relative px-8 py-4 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 text-lg"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  Explore All Tools
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              
              <button
                onClick={() => navigate('/resume-builder')}
                className="px-8 py-4 bg-surface/50 border border-border/30 hover:bg-surface text-white font-semibold rounded-xl transition-all duration-300 text-lg"
              >
                <span className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Build Resume
                </span>
              </button>
            </motion.div>

            {/* Tool Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mt-16"
            >
              {[
                { icon: BarChart3, name: "ATS Checker", description: "Optimize your resume" },
                { icon: FileText, name: "CV Builder", description: "Professional resumes" },
                { icon: Bot, name: "AI Assistant", description: "Smart productivity" },
                { icon: BrainCircuit, name: "Interview Prep", description: "Ace your interviews" }
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center group cursor-pointer"
                  onClick={() => {
                    const routeMap: Record<string, string> = {
                      'ATS Checker': '/ats-resume-checker',
                      'CV Builder': '/resume-builder',
                      'AI Assistant': '/ai-assistant',
                      'Interview Prep': '/interview-prep'
                    };
                    const route = routeMap[tool.name];
                    if (route) navigate(route);
                  }}
                >
                  <div className="relative w-12 h-12 md:w-14 md:h-14 mx-auto mb-3">
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                    
                    {/* Main icon container with glassmorphism */}
                    <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-accent/10 group-hover:to-purple-500/10 group-hover:border-accent/30">
                      {/* Animated gradient border */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Icon with creative effects */}
                      <div className="relative">
                        <tool.icon className="w-6 h-6 md:w-7 md:h-7 text-white/90 group-hover:text-white transition-colors duration-300 drop-shadow-lg" />
                        
                        {/* Subtle pulse animation */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <tool.icon className="w-6 h-6 md:w-7 md:h-7 text-accent/30 animate-pulse" />
                        </div>
                      </div>
                      
                      {/* Floating particles effect */}
                      <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-accent/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-bounce"></div>
                      <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-purple-500/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-bounce delay-75"></div>
                    </div>
                  </div>
                  <div className="font-semibold text-white text-sm md:text-base">{tool.name}</div>
                  <div className="text-text-secondary text-xs md:text-sm mt-1">{tool.description}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular <span className="text-accent">Tools</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Our most used productivity tools designed to help you succeed
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.slice(0, 6).map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  // Map tool IDs to actual routes
                  const routeMap: Record<string, string> = {
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
                  const route = routeMap[tool.id];
                  if (route) navigate(route);
                }}
                className="group bg-surface/30 border border-border/30 rounded-xl p-6 hover:bg-surface/50 hover:border-accent/30 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-accent/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{tool.name}</h3>
                    <p className="text-text-secondary text-sm">{tool.category}</p>
                  </div>
                </div>
                <p className="text-text-secondary mb-4">{tool.description}</p>
                <div className="flex items-center gap-2 text-accent group-hover:text-accent/80 transition-colors">
                  <span className="text-sm font-medium">Try Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate('/all-tools')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-surface/50 border border-border/30 hover:bg-surface text-white font-semibold rounded-xl transition-all duration-300"
            >
              View All Tools
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      
      {/* CTA Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Boost Your <span className="text-accent">Productivity</span>?
            </h2>
            <p className="text-text-secondary text-lg mb-8">
              Join thousands of users who are already using our free AI tools to streamline their workflow and achieve more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/all-tools')}
                className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent/30"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-4 bg-surface/50 border border-border/30 hover:bg-surface text-white font-semibold rounded-xl transition-all duration-300"
              >
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
