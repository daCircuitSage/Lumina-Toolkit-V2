import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { 
  FaStar as Sparkles, 
  FaTerminal as Terminal, 
  FaMicrochip as Cpu, 
  FaSearch as Search, 
  FaFileAlt as FileText, 
  FaChevronRight as ChevronRight,
  FaRobot as Bot,
  FaFileUpload as FileUp,
  FaCalendar as Calendar,
  FaCalculator as Calculator,
  FaComment as MessageSquare,
  FaYoutube as Youtube,
  FaChartBar as BarChart3,
  FaTasks as ListTodo,
  FaBrain as BrainCircuit,
  FaEnvelope as Mail,
  FaCheckCircle as CheckCircle,
  FaUsers as Users,
  FaStar as Star,
  FaArrowRight as ArrowRight,
  FaShieldAlt as Shield,
  FaBolt as Zap,
  FaClock as Clock,
  FaUser as User,
  FaSignOutAlt as LogOut,
  FaTerminal as Command,
  FaGlobe as Globe,
  FaChartLine as TrendingUp,
  FaLayerGroup as Layers,
  FaPuzzlePiece as Puzzle,
  FaRocket as Rocket,
  FaFire as Flame,
  FaInfinity as Infinity
} from 'react-icons/fa';
import TerminalBackground from '../components/TerminalBackground';
import CustomCursor from '../components/CustomCursor';
import { TOOLS } from '../constants';
import { useDatabase } from '../contexts/DatabaseContext';

export default function Homepage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signOut } = useDatabase();


  return (
    <div className="relative bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      <CustomCursor />
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-black">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-4 py-6 md:px-8 md:py-8">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-purple-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center shadow-lg">
                <Terminal className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg md:text-xl tracking-tight">Lumina</span>
              <span className="text-xs text-text-secondary hidden md:block">Toolkit</span>
            </div>
          </motion.div>
          
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
                <motion.button
                  onClick={() => navigate('/all-tools')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-surface/50 border border-border/30 rounded-xl hover:bg-surface transition-all duration-200 text-sm font-medium"
                >
                  All Tools
                </motion.button>
                <motion.button
                  onClick={signOut}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => navigate('/all-tools')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-surface/50 border border-border/30 rounded-xl hover:bg-surface transition-all duration-200 text-sm font-medium"
                >
                  All Tools
                </motion.button>
                <motion.button
                  onClick={signIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-accent/30"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign In
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div 
            className="text-center space-y-8 md:space-y-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 border border-border/30 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-text-secondary">14+ Free AI Tools</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight"
            >
              <span className="block mb-2">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                  Supercharge Your
                </span>
              </span>
              <span className="block">
                <span className="bg-gradient-to-r from-accent via-purple-400 to-blue-500 bg-clip-text text-transparent animate-gradient">
                  Productivity
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed"
            >
              AI-powered tools for resume building, job search, PDF conversion, and more. 
              <span className="text-white font-medium"> Free forever. No registration required.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <motion.button
                onClick={() => navigate('/all-tools')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-6 py-3 bg-white text-black font-medium rounded-lg transition-all duration-200 hover:bg-gray-100 text-base"
              >
                <span className="flex items-center gap-2">
                  <Rocket className="w-4 h-4" />
                  Explore All Tools
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                </span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/resume-builder')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-white/10 border border-white/20 hover:bg-white/15 text-white font-medium rounded-lg transition-all duration-200 text-base"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Build Resume
                </span>
              </motion.button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-col items-center gap-2 mt-16"
            >
              <span className="text-sm text-text-secondary">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: 9999 }}
                className="w-6 h-10 border-2 border-border/50 rounded-full flex justify-center pt-2"
              >
                <div className="w-1.5 h-3 bg-accent/50 rounded-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-12 border-y border-border/20 overflow-hidden">
        <div className="relative">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: 9999, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap"
          >
            {[...Array(4)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2 px-6 py-3 bg-surface/30 border border-border/30 rounded-full">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Lightning Fast</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-surface/30 border border-border/30 rounded-full">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">100% Secure</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-surface/30 border border-border/30 rounded-full">
                  <Infinity className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Free Forever</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-surface/30 border border-border/30 rounded-full">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">10K+ Users</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-surface/30 border border-border/30 rounded-full">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">5-Star Rated</span>
                </div>
                <div className="flex items-center gap-2 px-6 py-3 bg-surface/30 border border-border/30 rounded-full">
                  <Globe className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Available Worldwide</span>
                </div>
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Tools Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              A complete toolkit for productivity, career growth, and content creation
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Large Featured Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/ai-assistant')}
              className="group relative md:col-span-2 bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/20 rounded-3xl p-8 cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-2">AI Assistant</h3>
                <p className="text-text-secondary mb-4 max-w-md">
                  Your intelligent companion for writing, brainstorming, coding help, and productivity tasks. Get instant answers and boost your workflow.
                </p>
                <div className="flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                  <span className="font-medium">Start Chatting</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
            </motion.div>

            {/* Resume Builder Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/resume-builder')}
              className="group bg-surface/30 border border-border/30 rounded-3xl p-8 cursor-pointer hover:border-accent/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Resume Builder</h3>
              <p className="text-text-secondary mb-4">
                Create professional resumes in minutes with multiple templates and AI-powered suggestions.
              </p>
              <div className="flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                <span className="font-medium">Build Now</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>

            {/* ATS Checker Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/ats-resume-checker')}
              className="group bg-surface/30 border border-border/30 rounded-3xl p-8 cursor-pointer hover:border-accent/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">ATS Checker</h3>
              <p className="text-text-secondary mb-4">
                Optimize your resume for Applicant Tracking Systems and increase interview chances.
              </p>
              <div className="flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                <span className="font-medium">Check Now</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>

            {/* Interview Prep Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/interview-prep')}
              className="group bg-surface/30 border border-border/30 rounded-3xl p-8 cursor-pointer hover:border-accent/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BrainCircuit className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Interview Prep</h3>
              <p className="text-text-secondary mb-4">
                Practice with AI-powered mock interviews and master the STAR method.
              </p>
              <div className="flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                <span className="font-medium">Practice</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>

            {/* PDF Converter Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/pdf-converter')}
              className="group bg-surface/30 border border-border/30 rounded-3xl p-8 cursor-pointer hover:border-accent/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-transparent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">PDF Converter</h3>
              <p className="text-text-secondary mb-4">
                Convert images and documents to high-quality PDF files instantly.
              </p>
              <div className="flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                <span className="font-medium">Convert</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <motion.button
              onClick={() => navigate('/all-tools')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-surface/50 border border-border/30 hover:bg-surface text-white font-semibold rounded-2xl transition-all duration-300"
            >
              View All 14+ Tools
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-accent">Lumina</span>?
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Built for modern professionals who want to achieve more
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: "Lightning Fast", description: "Instant results with no waiting" },
              { icon: Shield, title: "Privacy First", description: "Your data stays secure" },
              { icon: Infinity, title: "Free Forever", description: "No hidden costs or limits" },
              { icon: Layers, title: "All-in-One", description: "Everything in one place" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-surface/30 border border-border/30 rounded-2xl p-6 hover:border-accent/30 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-accent/10 to-purple-500/10 border border-accent/20 rounded-3xl p-8 md:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-50" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl" />
            
            <div className="relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-6"
              >
                <Flame className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Transform Your <span className="text-accent">Workflow</span>?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who are already using Lumina Toolkit to achieve more in less time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => navigate('/all-tools')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-accent hover:bg-accent/90 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-accent/30 text-lg"
                >
                  Get Started Free
                </motion.button>
                <motion.button
                  onClick={() => navigate('/contact')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-surface/50 border border-border/30 hover:bg-surface text-white font-semibold rounded-2xl transition-all duration-300 text-lg"
                >
                  Contact Us
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
