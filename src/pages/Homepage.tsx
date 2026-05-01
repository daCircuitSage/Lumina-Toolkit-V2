import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle, 
  Zap, 
  Shield, 
  Clock,
  FileText,
  BarChart3,
  Mail,
  BrainCircuit,
  MessageSquare,
  Youtube,
  Bot,
  Calendar,
  Calculator,
  FileUp,
  ListTodo,
  Star,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';
import { TOOLS } from '../constants';

export default function Homepage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const jobTools = TOOLS.filter(t => t.category === 'Job Toolkit');
  const aiTools = TOOLS.filter(t => t.name.includes('AI') || t.name.includes('Gen') || t.id === 'chat');
  const mainTools = TOOLS.filter(t => !t.category && t.id !== 'dashboard' && t.id !== 'contact');

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8FAFC] to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6"
            >
              <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
              All-in-One Career & AI Toolkit
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black font-heading text-slate-900 dark:text-white leading-tight mb-6"
            >
              Build Your Career with
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                AI-Powered Tools
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Create professional resumes, optimize for ATS, generate cover letters, and boost your content with AI. 
              Everything you need to accelerate your career growth.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => onNavigate('resume')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                Start Building Resume
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-2"
              >
                Explore All Tools
                <Zap size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="py-16 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Zap, label: 'Fast & Free', desc: 'Instant results' },
              { icon: Shield, label: 'No Signup', desc: 'Start immediately' },
              { icon: Bot, label: 'AI Powered', desc: 'Smart generation' },
              { icon: CheckCircle, label: 'ATS Friendly', desc: 'Optimized formats' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center">
                  <item.icon size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.label}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-4"
            >
              Everything You Need in One Place
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            >
              Professional tools designed to help you succeed in your career and content creation journey.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => onNavigate(tool.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left relative overflow-hidden"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                    Try Now <ArrowRight size={16} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            >
              Get professional results in three simple steps
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Choose a Tool', desc: 'Select from our comprehensive toolkit' },
              { step: '2', title: 'Enter Your Details', desc: 'Provide your information or requirements' },
              { step: '3', title: 'Get Instant Results', desc: 'Receive professional output immediately' }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent -translate-x-8" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Toolkit Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300 mb-6"
            >
              <Award size={16} />
              Premium Features
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-4"
            >
              Job Search Toolkit
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            >
              Advanced tools to optimize your job search and stand out from the competition
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jobTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => onNavigate(tool.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-purple-200 dark:hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/5 transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon size={24} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{tool.description}</p>
                  <div className="text-purple-600 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                    Launch →
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200 dark:border-green-800 rounded-full text-sm font-medium text-green-700 dark:text-green-300 mb-6"
            >
              <Bot size={16} />
              AI-Powered
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-black font-heading text-slate-900 dark:text-white mb-4"
            >
              Smart AI Generation
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
            >
              Leverage cutting-edge AI to create professional content instantly
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: 'Smart Generation', desc: 'AI understands your needs and creates tailored content' },
              { icon: Clock, title: 'Lightning Fast', desc: 'Get professional results in seconds, not hours' },
              { icon: Star, title: 'High Quality', desc: 'Consistent, professional output every time' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center">
                  <item.icon size={32} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-white mb-6"
          >
            Start Using Lumina Toolkit for Free
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
          >
            Join thousands of professionals who are already using our tools to accelerate their careers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => onNavigate('resume')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Get Started Now
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              View All Tools
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-sm">L</span>
                </div>
                <span className="text-xl font-black font-heading text-white">Lumina Toolkit</span>
              </div>
              <p className="text-slate-400 mb-4 max-w-md">
                All-in-one career and AI toolkit designed to help you succeed professionally.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Tools</h4>
              <ul className="space-y-2">
                {mainTools.slice(0, 4).map(tool => (
                  <li key={tool.id}>
                    <button
                      onClick={() => onNavigate(tool.id)}
                      className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                      {tool.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => onNavigate('contact')}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button className="text-slate-400 hover:text-white transition-colors text-sm">
                    Privacy
                  </button>
                </li>
                <li>
                  <button className="text-slate-400 hover:text-white transition-colors text-sm">
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2026 Lumina Toolkit. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <span>Made with ❤️ for professionals</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
