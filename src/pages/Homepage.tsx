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
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TerminalBackground from '../components/TerminalBackground';
import ReviewDisplay from '../components/reviews/ReviewDisplay';
import ReviewSubmission from '../components/reviews/ReviewSubmission';
import { TOOLS } from '../constants';
import { testCurrentAuthState, checkFirebaseConfig } from '../utils/auth-test';

export default function Homepage() {
  const navigate = useNavigate();
  const { currentUser, logout, signInWithGoogle, submitReview, getFeaturedReviews } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Debug authentication state
  useEffect(() => {
    console.log('Homepage - Auth state:', currentUser ? `Logged in as ${currentUser.email}` : 'Not logged in');
  }, [currentUser]);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const featuredReviews = await getFeaturedReviews();
      setReviews(featuredReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      await submitReview(reviewData);
      setShowReviewForm(false);
      await loadReviews(); // Reload reviews after submission
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

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
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg md:text-xl tracking-tight">Lumina</span>
                <span className="text-xs text-text-secondary hidden md:block">Toolkit</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30">
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-text-secondary hidden md:block">{currentUser.displayName || currentUser.email}</span>
                  </div>
                  <button
                    onClick={async () => {
                      await logout();
                      navigate('/');
                    }}
                    className="p-2.5 bg-surface/50 border border-border/30 rounded-xl hover:bg-surface transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                  <button
                    onClick={async () => {
                      await testCurrentAuthState();
                      await checkFirebaseConfig();
                    }}
                    className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl transition-all duration-200"
                  >
                    🔍 Test Auth
                  </button>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    const result = await signInWithGoogle();
                    if (result?.redirectInitiated) {
                      return;
                    }
                    navigate('/');
                  }}
                  className="px-4 py-2.5 bg-accent hover:bg-accent/90 text-black font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-accent/30"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="hidden md:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-6 py-12 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl w-full"
          >
            {/* Modern Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-accent/20 to-purple-500/20 border border-accent/30 backdrop-blur-sm mb-8"
            >
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent text-xs md:text-sm font-semibold">✨ AI-Powered Career Intelligence</span>
            </motion.div>

            {/* Mobile-Optimized Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
            >
              <span className="block bg-gradient-to-b from-white via-white to-text-secondary bg-clip-text text-transparent">
                Engineer your
              </span>
              <span className="block bg-gradient-to-r from-accent via-purple-400 to-accent bg-clip-text text-transparent">
                career
              </span>
              <span className="block bg-gradient-to-b from-white to-text-secondary bg-clip-text text-transparent">
                with precision
              </span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed px-4"
            >
              The ultimate suite of AI-powered career tools for developers and professionals. 
              <br className="hidden md:block" />
              From ATS-proof resumes to intelligent interview preparation.
            </motion.p>

            {/* Mobile-First CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 mb-12"
            >
              {currentUser ? (
                <>
                  <motion.button 
                    onClick={() => navigate('/all-tools')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-black font-bold rounded-2xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 shadow-lg shadow-accent/30 w-full sm:w-auto"
                  >
                    <span className="relative z-10">Explore All Tools</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/all-tools')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-surface/50 border border-border/30 text-white font-semibold rounded-2xl hover:bg-surface transition-all duration-300 w-full sm:w-auto"
                  >
                    View Dashboard
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button 
                    onClick={async () => {
                      const result = await signInWithGoogle();
                      if (result?.redirectInitiated) {
                        return;
                      }
                      navigate('/');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-black font-bold rounded-2xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 shadow-lg shadow-accent/30 w-full sm:w-auto"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/all-tools')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-surface/50 border border-border/30 text-white font-semibold rounded-2xl hover:bg-surface transition-all duration-300 w-full sm:w-auto"
                  >
                    Browse Tools
                  </motion.button>
                </>
              )}
            </motion.div>

            {/* Mobile-Optimized Feature Cards */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto"
            >
              {[
                { Icon: Search, label: "ATS Checker", desc: "Resume optimization" },
                { Icon: FileText, label: "CV Builder", desc: "Professional templates" },
                { Icon: Bot, label: "AI Assistant", desc: "Smart guidance" },
                { Icon: BrainCircuit, label: "Interview Prep", desc: "Mock interviews" }
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial="initial"
                  whileHover="hover"
                  className="group cursor-pointer"
                  onClick={() => navigate('/all-tools')}
                >
                  <motion.div 
                    variants={{
                      initial: { y: 0 },
                      hover: { y: -8 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="relative p-4 bg-surface/50 rounded-2xl border border-border/30 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-surface/70 mb-3"
                  >
                    <feature.Icon className="w-6 h-6 text-accent mx-auto" />
                    
                    {/* Hover Glow */}
                    <motion.div 
                      variants={{
                        initial: { opacity: 0, scale: 0.5 },
                        hover: { opacity: 1, scale: 1 }
                      }}
                      className="absolute inset-0 bg-accent/10 blur-xl rounded-full -z-10 pointer-events-none"
                    />
                  </motion.div>
                  
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white mb-1 group-hover:text-accent transition-colors">
                      {feature.label}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {feature.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Modern Design */}
      <section className="relative py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-transparent to-surface/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to <span className="text-accent">level up</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-3xl mx-auto px-4">
              Professional tools designed by experts, powered by AI. Free forever, no credit card required.
            </p>
          </motion.div>

          {/* Mobile-First Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {TOOLS.filter(tool => tool.id !== 'homepage' && tool.id !== 'dashboard').map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div 
                  className="relative p-6 md:p-8 bg-surface/50 border border-border/30 rounded-3xl backdrop-blur-sm transition-all duration-300 cursor-pointer hover:border-accent/30 hover:bg-surface/70 hover:shadow-xl hover:shadow-accent/10"
                  onClick={() => navigate(`/${tool.id === 'chat' ? 'ai-assistant' : tool.id === 'resume' ? 'resume-builder' : tool.id === 'pdf' ? 'pdf-converter' : tool.id === 'age' ? 'age-calculator' : tool.id === 'gpa' ? 'gpa-calculator' : tool.id === 'caption' ? 'ai-caption-generator' : tool.id === 'youtube' ? 'youtube-title-generator' : tool.id === 'ats' ? 'ats-resume-checker' : tool.id === 'tracker' ? 'job-tracker' : tool.id === 'interview' ? 'interview-prep' : tool.id === 'cover-letter' ? 'cover-letter-generator' : tool.id === 'contact' ? 'contact' : tool.id}`)}
                >
                  {/* Tool Icon */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl border border-accent/30">
                      <tool.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
                        {tool.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-lg">
                          FREE
                        </span>
                        <span className="text-text-secondary text-xs">
                          {tool.category || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  {/* Arrow Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-accent text-sm font-semibold group-hover:translate-x-2 transition-transform">
                      Try Now
                    </span>
                    <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - Modern Design */}
      <section className="relative py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why professionals choose <span className="text-accent">Lumina</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-3xl mx-auto px-4">
              Built for modern developers and professionals who value efficiency and results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                Icon: Zap,
                title: "Lightning Fast",
                description: "Get results in seconds, not hours. Our optimized tools work instantly in your browser.",
                gradient: "from-yellow-500/20 to-orange-500/20",
                borderColor: "border-yellow-500/30",
                iconColor: "text-yellow-400"
              },
              {
                Icon: Shield,
                title: "Privacy First",
                description: "Your data never leaves your device. All processing happens locally in your browser.",
                gradient: "from-green-500/20 to-emerald-500/20",
                borderColor: "border-green-500/30",
                iconColor: "text-green-400"
              },
              {
                Icon: Clock,
                title: "Save Time",
                description: "Automate repetitive tasks and focus on what matters most - your career growth.",
                gradient: "from-blue-500/20 to-purple-500/20",
                borderColor: "border-blue-500/30",
                iconColor: "text-blue-400"
              }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className={`inline-flex p-4 bg-gradient-to-br ${benefit.gradient} rounded-3xl border ${benefit.borderColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.Icon className={`w-8 h-8 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{benefit.title}</h3>
                <p className="text-text-secondary leading-relaxed text-lg">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Modern Design */}
      <section className="relative py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-transparent to-surface/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Trusted by <span className="text-accent">professionals</span> worldwide
            </h2>
            <p className="text-text-secondary text-lg max-w-3xl mx-auto px-4">
              Join thousands of developers and professionals who are already using Lumina Toolkit.
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Review Submission Button for Authenticated Users */}
            {currentUser && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 bg-accent hover:bg-accent/90 text-black font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-accent/30"
                >
                  Share Your Experience
                </button>
              </motion.div>
            )}

            {/* Dynamic Reviews from Firebase */}
            {loading ? (
              <div className="text-center py-12 text-text-secondary">
                <div className="inline-flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-150" />
                </div>
                <p className="mt-4">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {reviews.map((review, idx) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ReviewDisplay review={review} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-surface/50 border border-border/30 rounded-3xl mb-4">
                  <Star className="w-8 h-8 text-accent" />
                </div>
                <p className="text-text-secondary text-lg mb-4">No featured reviews yet.</p>
                <p className="text-text-secondary">Be the first to share your experience!</p>
              </div>
            )}
          </div>

          {/* Review Submission Modal */}
          {showReviewForm && (
            <ReviewSubmission
              onSubmit={handleReviewSubmit}
              onCancel={() => setShowReviewForm(false)}
            />
          )}
        </div>
      </section>

      {/* CTA Section - Modern Design */}
      <section className="relative py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 bg-gradient-to-br from-accent/10 via-purple-500/5 to-accent/10 rounded-3xl border border-accent/20 backdrop-blur-sm"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to transform your <span className="text-accent">career</span>?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-3xl mx-auto px-4">
              {currentUser 
                ? `Welcome back, ${currentUser.displayName || currentUser.email}! Ready to continue your career journey?`
                : "Join thousands of professionals who are already using Lumina Toolkit to accelerate their career growth."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {currentUser ? (
                <>
                  <motion.button 
                    onClick={() => navigate('/all-tools')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-black font-bold rounded-2xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 shadow-lg shadow-accent/30 w-full sm:w-auto"
                  >
                    <span className="relative z-10">All Tools</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/all-tools')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-surface/50 border border-border/30 text-white font-semibold rounded-2xl hover:bg-surface transition-all duration-300 w-full sm:w-auto"
                  >
                    View Dashboard
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button 
                    onClick={async () => {
                      const result = await signInWithGoogle();
                      if (result?.redirectInitiated) {
                        return;
                      }
                      navigate('/');
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-black font-bold rounded-2xl flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 shadow-lg shadow-accent/30 w-full sm:w-auto"
                  >
                    <span className="relative z-10">Get Started Free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/contact')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-surface/50 border border-border/30 text-white font-semibold rounded-2xl hover:bg-surface transition-all duration-300 w-full sm:w-auto"
                  >
                    Contact Us
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Modern Design */}
      <footer className="relative py-16 px-4 md:px-6 border-t border-border/30 bg-gradient-to-b from-transparent to-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-bold text-2xl tracking-tight text-white">Lumina</span>
                  <div className="text-sm text-text-secondary">Toolkit</div>
                </div>
              </div>
              <p className="text-text-secondary text-lg leading-relaxed mb-6 max-w-md">
                AI-powered career toolkit for professionals. Build your future with precision and confidence.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-accent text-sm font-semibold">Always Free</span>
                </div>
                <div className="w-px h-4 bg-border/30" />
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-semibold">Privacy First</span>
                </div>
              </div>
            </div>
            
            {/* Tools Section */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Tools</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/all-tools')} className="text-text-secondary hover:text-accent transition-colors text-lg">All Tools</button></li>
                <li><button onClick={() => navigate('/ai-assistant')} className="text-text-secondary hover:text-accent transition-colors text-lg">AI Assistant</button></li>
                <li><button onClick={() => navigate('/resume-builder')} className="text-text-secondary hover:text-accent transition-colors text-lg">Resume Builder</button></li>
                <li><button onClick={() => navigate('/ats-resume-checker')} className="text-text-secondary hover:text-accent transition-colors text-lg">ATS Checker</button></li>
              </ul>
            </div>
            
            {/* Company Section */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate('/contact')} className="text-text-secondary hover:text-accent transition-colors text-lg">Contact</button></li>
                <li><a href="#" className="text-text-secondary hover:text-accent transition-colors text-lg">Privacy</a></li>
                <li><a href="#" className="text-text-secondary hover:text-accent transition-colors text-lg">Terms</a></li>
                <li><a href="#" className="text-text-secondary hover:text-accent transition-colors text-lg">About</a></li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-border/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-text-secondary text-lg">
                &copy; 2024 Lumina Toolkit. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full" />
                  <span className="text-text-secondary text-sm">Made with ❤️ for professionals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

