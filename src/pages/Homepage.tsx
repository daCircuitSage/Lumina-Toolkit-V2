import React, { useState, useEffect, useRef, useMemo, memo } from 'react';

import { useNavigate } from 'react-router-dom';

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';

import {

  FaStar as Sparkles,

  FaFileAlt as FileText,

  FaFileUpload as FileUp,

  FaCalculator as Calculator,

  FaComment as MessageSquare,

  FaYoutube as Youtube,

  FaEnvelope as Mail,

  FaCheckCircle as CheckCircle,

  FaUsers as Users,

  FaStar as Star,

  FaArrowRight as ArrowRight,

  FaShieldAlt as Shield,

  FaBolt as Zap,

  FaUser as User,

  FaSignOutAlt as LogOut,

  FaTerminal as Command,

  FaGlobe as Globe,

  FaLayerGroup as Layers,

  FaRocket as Rocket,

  FaFire as Flame,

  FaInfinity as Infinity

} from 'react-icons/fa';

import TerminalBackground from '../components/TerminalBackground';

import ToolPreviewCard from '../components/ToolPreviewCard';

import { lazy, Suspense } from 'react';

const HeroRobot = lazy(() => import('../components/HeroRobot'));

import { TOOLS } from '../constants';

import { useDatabase } from '../contexts/DatabaseContext';

import { useTheme } from '../contexts/ThemeContext';

import lockImage from '../assets/wise_images/imgi_143_lock-large@2x.webp';

import globeImage from '../assets/wise_images/imgi_144_globe-large@2x.webp';

import newLogo from '../assets/logo/newlogo.png';

import usFlag from '../assets/wise_images/imgi_133_us.svg';

import gbFlag from '../assets/wise_images/imgi_132_gb.svg';

import deFlag from '../assets/wise_images/imgi_65_de.svg';

import auFlag from '../assets/wise_images/imgi_40_au.svg';

import inFlag from '../assets/wise_images/imgi_73_in.svg';

import jpFlag from '../assets/wise_images/imgi_79_jp.svg';

import cornerBackgroundImage from '../assets/herotitleicons/Gemini_Generated_Image_k9q2hyk9q2hyk9q2.png';



const countryFlagMap: Record<string, string> = {

  us: usFlag,

  gb: gbFlag,

  de: deFlag,

  au: auFlag,

  in: inFlag,

  jp: jpFlag,

};



function Homepage() {

  const navigate = useNavigate();

  const { user, loading: authLoading, signIn, signOut } = useDatabase();

  const { resolvedTheme, setTheme } = useTheme();

  const { scrollY } = useScroll();

  const heroSectionRef = useRef<HTMLElement>(null);

  const toolsSectionRef = useRef<HTMLElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  // Hero exit animation based on scroll

  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroY = useTransform(scrollY, [0, 300], [0, -50]);



  // Parallax for tools section

  const toolsY = useTransform(scrollY, [300, 600], [0, 30]);



  // Get featured tools for the bento grid (memoized)

  const featuredTools = useMemo(() => [

    TOOLS.find(t => t.id === 'chat')!,

    TOOLS.find(t => t.id === 'resume')!,

    TOOLS.find(t => t.id === 'ats')!,

    TOOLS.find(t => t.id === 'interview')!,

    TOOLS.find(t => t.id === 'pdf')!,

  ], []);



  return (

    <div className="relative bg-canvas text-ink selection:bg-primary/20 overflow-x-hidden">

      {/* Wise design: canvas background */}

      <div className="fixed inset-0 pointer-events-none bg-canvas" />



      {/* Navigation */}

      <nav className="relative z-50 px-4 py-6 md:px-8 md:py-8">

        <div className="flex justify-between items-center max-w-7xl mx-auto">

          <motion.div 

            className="flex items-center cursor-pointer"

            onClick={() => navigate('/')}

            whileHover={{ scale: 1.05 }}

            transition={{ type: "spring", stiffness: 400 }}

          >

            <img 

              src={newLogo} 

              alt="Lumina Toolkit Logo"

              loading="eager"

              className="h-20 w-auto object-contain"

            />

          </motion.div>

          

          <div className="flex items-center gap-3">

            {/* Theme Toggle Button */}
            <motion.button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 text-sm body-sm-strong text-ink hover:text-primary transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {resolvedTheme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>

            {/* Mobile Menu Button */}

            <motion.button

              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}

              whileHover={{ scale: 1.05 }}

              whileTap={{ scale: 0.95 }}

              className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm body-sm-strong text-ink hover:text-primary transition-colors cursor-pointer"

            >

              <Command className="w-5 h-5" />

            </motion.button>



            {authLoading ? (

              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

            ) : user ? (

              <div className="flex items-center gap-3">

                <div className="hidden sm:flex items-center gap-2">

                  <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">

                    {user?.photoURL ? (

                      <img src={user.photoURL} alt="Profile" className="w-6 h-6 rounded-xl" />

                    ) : (

                      <User className="w-4 h-4 text-ink" />

                    )}

                  </div>

                  <span className="text-sm body-sm hidden md:block">

                    {user?.displayName || user?.email || 'User'}

                  </span>

                </div>

                <motion.button

                  onClick={() => navigate('/all-tools')}

                  whileHover={{ scale: 1.05 }}

                  whileTap={{ scale: 0.95 }}

                  className="px-4 py-2 bg-canvas-soft border border-hairline rounded-xl hover:bg-canvas transition-all duration-200 text-sm font-normal"

                >

                  All Tools

                </motion.button>

                <motion.button

                  onClick={signOut}

                  whileHover={{ scale: 1.05 }}

                  whileTap={{ scale: 0.95 }}

                  className="flex items-center gap-2 px-4 py-2 text-sm body-sm hover:text-ink transition-colors cursor-pointer border border-transparent hover:border-hairline rounded-xl"

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

                  className="px-4 py-2 bg-canvas-soft border border-hairline rounded-xl hover:bg-canvas hover:border-white/50 transition-all duration-200 text-sm font-normal cursor-pointer shadow-sm hover:shadow-md"

                >

                  All Tools

                </motion.button>

                <motion.button

                  onClick={signIn}

                  whileHover={{ scale: 1.05 }}

                  whileTap={{ scale: 0.95 }}

                  className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl border-2 border-primary hover:border-primary-active transition-all duration-200 text-sm font-normal cursor-pointer shadow-md hover:shadow-lg"

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



            {/* Navigation Links - Desktop */}

            <div className="hidden lg:flex items-center gap-2 ml-4">

              <motion.button

                onClick={() => navigate('/about')}

                whileHover={{ scale: 1.05 }}

                whileTap={{ scale: 0.95 }}

                className="px-3 py-2 text-sm body-sm-strong text-ink hover:text-primary transition-colors cursor-pointer"

              >

                About Us

              </motion.button>

              <motion.button

                onClick={() => navigate('/terms')}

                whileHover={{ scale: 1.05 }}

                whileTap={{ scale: 0.95 }}

                className="px-3 py-2 text-sm body-sm-strong text-ink hover:text-primary transition-colors cursor-pointer"

              >

                Terms

              </motion.button>

            </div>

          </div>

        </div>



        {/* Mobile Menu */}

        <AnimatePresence>

          {mobileMenuOpen && (

            <motion.div

              initial={{ opacity: 0, height: 0 }}

              animate={{ opacity: 1, height: 'auto' }}

              exit={{ opacity: 0, height: 0 }}

              transition={{ duration: 0.3 }}

              className="lg:hidden mt-4 pt-4 border-t border-hairline"

            >

              <div className="flex flex-col gap-2">

                <motion.button

                  onClick={() => {

                    navigate('/about');

                    setMobileMenuOpen(false);

                  }}

                  whileHover={{ scale: 1.02 }}

                  whileTap={{ scale: 0.98 }}

                  className="px-4 py-3 text-sm body-sm-strong text-ink hover:text-primary hover:bg-canvas-soft transition-all cursor-pointer rounded-xl text-left"

                >

                  About Us

                </motion.button>

                <motion.button

                  onClick={() => {

                    navigate('/terms');

                    setMobileMenuOpen(false);

                  }}

                  whileHover={{ scale: 1.02 }}

                  whileTap={{ scale: 0.98 }}

                  className="px-4 py-3 text-sm body-sm-strong text-ink hover:text-primary hover:bg-canvas-soft transition-all cursor-pointer rounded-xl text-left"

                >

                  Terms and Conditions

                </motion.button>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </nav>



      {/* Hero Section */}

      <section ref={heroSectionRef} className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-16 bg-canvas-soft overflow-hidden">

        {/* 3D Robot Head Background */}
        <Suspense fallback={null}>
          <HeroRobot className="absolute inset-0" />
        </Suspense>

        <div className="max-w-7xl mx-auto w-full">

          <motion.div 

            className="text-center space-y-10 md:space-y-16 relative"

            style={{

              scale: heroScale,

              opacity: heroOpacity,

              y: heroY

            }}

          >

            {/* Badge */}

            <motion.div

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.6 }}

              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-pale border border-primary rounded-full relative z-0"

            >

              <Sparkles className="w-4 h-4 text-positive-deep" />

              <span className="text-sm body-sm-strong text-positive-deep">14+ Free AI Tools</span>

            </motion.div>



            {/* Main Heading */}

            <motion.h1

              initial={{ opacity: 0, y: 30 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.8, delay: 0.2 }}

              className="display-mega relative z-10"

            >

              <span className="block mb-2">

                <span className="text-ink">

                  Supercharge Your

                </span>

              </span>

              <span className="block">

                <span className="text-primary">

                  Productivity

                </span>

              </span>

            </motion.h1>



            {/* Subtitle */}

            <motion.p

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.8, delay: 0.4 }}

              className="text-lg md:text-xl body-md max-w-3xl mx-auto leading-relaxed relative z-10"

            >

              AI-powered tools for resume building, job search, PDF conversion, and more. 

              <span className="text-ink font-normal"> Free forever. No registration required.</span>

            </motion.p>



            {/* CTA Buttons */}

            <motion.div

              initial={{ opacity: 0, y: 20 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{ duration: 0.8, delay: 0.6 }}

              className="flex flex-col sm:flex-row gap-3 justify-center items-center relative z-10"

            >

              <motion.button

                onClick={() => navigate('/all-tools')}

                whileHover={{ scale: 1.02 }}

                whileTap={{ scale: 0.98 }}

                className="group relative px-6 py-3 bg-primary text-on-primary font-normal rounded-xl transition-all duration-200 hover:bg-primary-active text-base border-2 border-primary cursor-pointer shadow-lg hover:shadow-xl"

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

                className="px-6 py-3 bg-canvas border-2 border-hairline hover:bg-canvas-soft hover:border-white/50 text-ink font-normal rounded-xl transition-all duration-200 text-base cursor-pointer shadow-md hover:shadow-lg"

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

              className="flex flex-col items-center gap-2 mt-16 relative z-10"

            >

              <span className="text-sm body-sm">Scroll to explore</span>

              <motion.div

                animate={{ y: [0, 10, 0] }}

                transition={{ duration: 1.5, repeat: 9999 }}

                className="w-6 h-10 border-2 border-hairline rounded-xl flex justify-center pt-2"

              >

                <div className="w-1.5 h-3 bg-primary/50 rounded-full" />

              </motion.div>

            </motion.div>

          </motion.div>

        </div>

      </section>



      {/* Marquee Section */}

      <section className="py-12 border-y border-hairline overflow-hidden">

        <div className="relative">

          <motion.div

            animate={{ x: [0, -1000] }}

            transition={{ duration: 30, repeat: 9999, ease: "linear" }}

            className="flex gap-8 whitespace-nowrap"

          >

            {[...Array(4)].map((_, i) => (

              <React.Fragment key={i}>

                <div className="flex items-center gap-2 px-6 py-3 bg-canvas-soft border border-hairline rounded-full">

                  <Zap className="w-4 h-4 text-ink" />

                  <span className="text-sm font-normal">Lightning Fast</span>

                </div>

                <div className="flex items-center gap-2 px-6 py-3 bg-canvas-soft border border-hairline rounded-full">

                  <Shield className="w-4 h-4 text-ink" />

                  <span className="text-sm font-normal">100% Secure</span>

                </div>

                <div className="flex items-center gap-2 px-6 py-3 bg-canvas-soft border border-hairline rounded-full">

                  <Infinity className="w-4 h-4 text-ink" />

                  <span className="text-sm font-normal">Free Forever</span>

                </div>

                <div className="flex items-center gap-2 px-6 py-3 bg-canvas-soft border border-hairline rounded-full">

                  <Users className="w-4 h-4 text-ink" />

                  <span className="text-sm font-normal">10K+ Users</span>

                </div>

                <div className="flex items-center gap-2 px-6 py-3 bg-canvas-soft border border-hairline rounded-full">

                  <Star className="w-4 h-4 text-ink" />

                  <span className="text-sm font-normal">5-Star Rated</span>

                </div>

                <div className="flex items-center gap-2 px-6 py-3 bg-canvas-soft border border-hairline rounded-full">

                  <Globe className="w-4 h-4 text-ink" />

                  <span className="text-sm font-normal">Available Worldwide</span>

                </div>

              </React.Fragment>

            ))}

          </motion.div>

        </div>

      </section>



      {/* Bento Grid Tools Section */}

      <section ref={toolsSectionRef} className="py-20 md:py-32 relative overflow-hidden">

        {/* Corner Background Image */}

        <img

          src={cornerBackgroundImage}

          alt=""

          loading="lazy"

          className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 object-contain opacity-60 pointer-events-none"

        />

        <motion.div 

          style={{ y: toolsY }}

          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"

        >

          <motion.div

            initial={{ opacity: 0, y: 30 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true, margin: '-100px' }}

            transition={{ duration: 0.8 }}

            className="text-center mb-16"

          >

            <motion.h2 

              className="text-4xl md:text-5xl font-normal mb-4"

              initial={{ opacity: 0 }}

              whileInView={{ opacity: 1 }}

              viewport={{ once: true }}

              transition={{ duration: 1, delay: 0.2 }}

            >

              {["Everything You Need"].map((word, wordIndex) => (

                <span key={wordIndex} className="inline-block">

                  {word.split("").map((letter, letterIndex) => (

                    <motion.span

                      key={letterIndex}

                      initial={{ opacity: 0, y: 20 }}

                      whileInView={{ opacity: 1, y: 0 }}

                      viewport={{ once: true }}

                      transition={{

                        delay: 0.2 + letterIndex * 0.03,

                        type: "spring",

                        stiffness: 100,

                        damping: 15

                      }}

                      className="inline-block"

                    >

                      {letter}

                    </motion.span>

                  ))}

                  <span className="inline-block w-2" />

                </span>

              ))}

            </motion.h2>

            <motion.p 

              className="body-md text-lg max-w-2xl mx-auto"

              initial={{ opacity: 0, y: 20 }}

              whileInView={{ opacity: 1, y: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.8, delay: 0.6 }}

            >

              A complete toolkit for productivity, career growth, and content creation

            </motion.p>

          </motion.div>



          {/* Bento Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

            {featuredTools.map((tool, index) => (

              <ToolPreviewCard

                key={tool.id}

                title={tool.name}

                description={tool.description}

                icon={tool.icon}

                videoPreview={tool.videoPreview || '/videos/placeholder.mp4'}

                onClick={() => {

                  const routeMap: Record<string, string> = {

                    'chat': '/ai-assistant',

                    'resume': '/resume-builder',

                    'ats': '/ats-resume-checker',

                    'interview': '/interview-prep',

                    'pdf': '/pdf-converter',

                  };

                  navigate(routeMap[tool.id] || '/all-tools');

                }}

                isLarge={index === 0}

                delay={0.1 + index * 0.1}

              />

            ))}

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

              className="inline-flex items-center gap-3 px-8 py-4 bg-canvas-soft border-2 border-hairline hover:bg-canvas hover:border-white/50 text-ink font-normal rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"

            >

              View All 14+ Tools

              <ArrowRight className="w-5 h-5" />

            </motion.button>

          </motion.div>

        </motion.div>

      </section>



      {/* Features Section */}

      <section className="py-20 md:py-32 relative bg-canvas-soft">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <motion.div

            initial={{ opacity: 0, y: 20 }}

            whileInView={{ opacity: 1, y: 0 }}

            viewport={{ once: true, margin: '-100px' }}

            className="text-center mb-16"

          >

            <h2 className="text-4xl md:text-5xl font-normal mb-4">

              Why Choose <span className="text-primary">Lumina</span>?

            </h2>

            <p className="body-md text-lg max-w-2xl mx-auto">

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

                initial={{ opacity: 0, y: 30 }}

                whileInView={{ opacity: 1, y: 0 }}

                viewport={{ once: true, margin: '-50px' }}

                transition={{ 

                  delay: index * 0.15,

                  type: "spring",

                  stiffness: 100,

                  damping: 15

                }}

                whileHover={{ y: -8, scale: 1.02 }}

                className="card-content p-6 hover:border-primary/30 transition-all duration-300"

              >

                <motion.div 

                  className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4"

                  whileHover={{ scale: 1.1, rotate: 5 }}

                  transition={{ type: "spring", stiffness: 300 }}

                >

                  <feature.icon className="w-6 h-6 text-ink" />

                </motion.div>

                <h3 className="font-normal text-lg mb-2">{feature.title}</h3>

                <p className="body-sm">{feature.description}</p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>



      {/* Trust Section with Lock Image */}

      <section className="py-20 md:py-32 relative">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <motion.div

              initial={{ opacity: 0, x: -30 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.8 }}

            >

              <motion.img

                src={lockImage}

                alt="Secure and trusted"

                loading="lazy"

                className="w-full max-w-md mx-auto"

                initial={{ scale: 0.9, opacity: 0 }}

                whileInView={{ scale: 1, opacity: 1 }}

                viewport={{ once: true }}

                transition={{ duration: 1, delay: 0.2 }}

              />

            </motion.div>

            <motion.div

              initial={{ opacity: 0, x: 30 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.8, delay: 0.2 }}

            >

              <h2 className="text-3xl md:text-4xl font-normal mb-6">

                Your Data is <span className="text-primary">Secure</span>

              </h2>

              <p className="body-md mb-6">

                We use enterprise-grade encryption and never share your personal information. Your documents and data stay private and protected.

              </p>

              <ul className="space-y-4">

                {[

                  "End-to-end encryption",

                  "GDPR compliant",

                  "No data selling",

                  "Local processing options"

                ].map((item, index) => (

                  <motion.li

                    key={index}

                    initial={{ opacity: 0, x: 20 }}

                    whileInView={{ opacity: 1, x: 0 }}

                    viewport={{ once: true }}

                    transition={{ delay: 0.4 + index * 0.1 }}

                    className="flex items-center gap-3"

                  >

                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">

                      <CheckCircle className="w-4 h-4 text-on-primary" />

                    </div>

                    <span className="body-md">{item}</span>

                  </motion.li>

                ))}

              </ul>

            </motion.div>

          </div>

        </div>

      </section>



      {/* Global Reach Section with Globe Image */}

      <section className="py-20 md:py-32 relative bg-canvas-soft">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <motion.div

              initial={{ opacity: 0, x: -30 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.8 }}

              className="order-2 md:order-1"

            >

              <h2 className="text-3xl md:text-4xl font-normal mb-6">

                Available <span className="text-primary">Worldwide</span>

              </h2>

              <p className="body-md mb-6">

                Access Lumina Toolkit from anywhere in the world. Our platform supports multiple languages and currencies, making it easy for professionals globally.

              </p>

              <div className="flex flex-wrap gap-3 mt-8">

                {['US', 'GB', 'DE', 'AU', 'IN', 'JP'].map((country, index) => (

                  <motion.div

                    key={country}

                    initial={{ opacity: 0, scale: 0.8 }}

                    whileInView={{ opacity: 1, scale: 1 }}

                    viewport={{ once: true }}

                    transition={{ delay: 0.3 + index * 0.1 }}

                    className="w-12 h-12 bg-canvas rounded-xl flex items-center justify-center"

                  >

                    <img

                      src={countryFlagMap[country.toLowerCase()]}

                      alt={country}

                      loading="lazy"

                      className="w-8 h-8"

                    />

                  </motion.div>

                ))}

              </div>

            </motion.div>

            <motion.div

              initial={{ opacity: 0, x: 30 }}

              whileInView={{ opacity: 1, x: 0 }}

              viewport={{ once: true }}

              transition={{ duration: 0.8, delay: 0.2 }}

              className="order-1 md:order-2"

            >

              <motion.img

                src={globeImage}

                alt="Global reach"

                loading="lazy"

                className="w-full max-w-md mx-auto"

                initial={{ scale: 0.9, opacity: 0 }}

                whileInView={{ scale: 1, opacity: 1 }}

                viewport={{ once: true }}

                transition={{ duration: 1, delay: 0.4 }}

              />

            </motion.div>

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

            className="relative card-feature-dark p-8 md:p-16 text-center overflow-hidden"

          >

            

            <div className="relative">

              <motion.div

                initial={{ scale: 0 }}

                animate={{ scale: 1 }}

                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}

                className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-6"

              >

                <Flame className="w-8 h-8 text-on-primary" />

              </motion.div>

              

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-6">

                Ready to Transform Your <span className="text-primary">Workflow</span>?

              </h2>

              <p className="body-md text-lg mb-8 max-w-2xl mx-auto">

                Join thousands of professionals who are already using Lumina Toolkit to achieve more in less time.

              </p>

              

              <div className="flex flex-col sm:flex-row gap-4 justify-center">

                <motion.button

                  onClick={() => navigate('/all-tools')}

                  whileHover={{ scale: 1.05 }}

                  whileTap={{ scale: 0.95 }}

                  className="px-8 py-4 bg-primary hover:bg-primary-active text-on-primary font-normal rounded-xl transition-all duration-300 text-lg border-2 border-primary cursor-pointer shadow-lg hover:shadow-xl"

                >

                  Get Started Free

                </motion.button>

                <motion.button

                  onClick={() => navigate('/contact')}

                  whileHover={{ scale: 1.05 }}

                  whileTap={{ scale: 0.95 }}

                  className="px-8 py-4 bg-canvas border-2 border-hairline hover:bg-canvas-soft hover:border-white/50 text-ink font-normal rounded-xl transition-all duration-300 text-lg cursor-pointer shadow-md hover:shadow-lg"

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



export default memo(Homepage);

