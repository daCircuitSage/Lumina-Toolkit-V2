import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Terminal, Cpu, Search, FileText, ChevronRight } from 'lucide-react';
import TerminalBackground from './components/TerminalBackground';

export default function App() {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Animated Terminal Background */}
      <TerminalBackground />

      {/* Main Content (Foreground) */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-20 text-center">
        {/* Navigation / Top Bar */}
        <nav className="absolute top-0 w-full p-8 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">Lumina</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-blue-400 transition-colors">Products</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Enterprise</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Docs</a>
          </div>
          <div className="w-[80px] md:hidden" /> {/* Spacer for mobile balance */}
        </nav>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-8">
            <Sparkles className="w-3 h-3" />
            <span>AI-Powered Career Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
            Engineer your career <br /> 
            <span className="text-white">with precision.</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Lumina Toolkit provides developers and professionals with the ultimate suite of 
            career optimization tools. From ATS-proof resumes to AI-led mock interviews.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-8 py-4 bg-white text-zinc-950 font-semibold rounded-xl flex items-center justify-center gap-2 overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98]">
              <span className="relative z-10">Get Started Free</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/10 to-blue-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            <button className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
              View Toolkit
            </button>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12"
        >
          {[
            { Icon: Search, label: "ATS Checker" },
            { Icon: FileText, label: "CV Builder" },
            { Icon: Cpu, label: "AI Assistant" },
            { Icon: Terminal, label: "Interview Prep" }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial="initial"
              whileHover="hover"
              className="flex flex-col items-center gap-3 cursor-pointer"
            >
              <motion.div 
                variants={{
                  initial: { y: 0 },
                  hover: { y: -8 }
                }}
                className="relative p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-center transition-all duration-300 hover:border-blue-500/30 hover:bg-zinc-900"
              >
                <motion.div
                  variants={{
                    initial: { rotate: 0, scale: 1 },
                    hover: { rotate: 15, scale: 1.1 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <feature.Icon className="w-6 h-6 text-blue-500" />
                </motion.div>
                
                {/* Background Glow */}
                <motion.div 
                  variants={{
                    initial: { opacity: 0, scale: 0.5 },
                    hover: { opacity: 1, scale: 1 }
                  }}
                  className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full -z-10 pointer-events-none"
                />
              </motion.div>
              
              <motion.span 
                variants={{
                  initial: { color: "#71717a" },
                  hover: { color: "#60a5fa" }
                }}
                className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold transition-colors duration-300"
              >
                {feature.label}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
