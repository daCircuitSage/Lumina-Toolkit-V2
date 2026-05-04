import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TOOLS } from '../constants';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // Map tool IDs to routes
  const getRouteFromToolId = (toolId: string): string => {
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

  const handleToolClick = (toolId: string) => {
    const route = getRouteFromToolId(toolId);
    navigate(route);
  };

  // Enhanced tool descriptions for SEO
  const enhancedToolDescriptions: { [key: string]: { short: string, detailed: string } } = {
    'chat': {
      short: 'AI-powered chat companion for productivity and tasks',
      detailed: 'Get instant help with writing, problem-solving, and productivity tasks from your personal AI assistant.'
    },
    'resume': {
      short: 'Professional resume builder with multiple templates',
      detailed: 'Create ATS-friendly resumes in minutes with professional templates and AI-powered suggestions.'
    },
    'pdf': {
      short: 'Convert images and documents to PDF format',
      detailed: 'Transform images, Word docs, and other files into high-quality PDF documents instantly.'
    },
    'age': {
      short: 'Calculate exact age and upcoming birthdays',
      detailed: 'Find your precise age in years, months, days, and discover when your next birthday falls.'
    },
    'gpa': {
      short: 'Calculate grade point average for academic performance',
      detailed: 'Track and calculate your GPA with support for multiple grading scales and weighted courses.'
    },
    'caption': {
      short: 'Generate engaging social media captions with AI',
      detailed: 'Create compelling, platform-optimized captions for Instagram, Facebook, Twitter, and more.'
    },
    'youtube': {
      short: 'Create catchy, SEO-optimized YouTube titles',
      detailed: 'Generate high-CTR YouTube titles that improve video visibility and search rankings.'
    },
    'ats': {
      short: 'Optimize your resume for ATS systems',
      detailed: 'Analyze and improve your resume for Applicant Tracking Systems to increase interview chances.'
    },
    'tracker': {
      short: 'Track job applications and interview progress',
      detailed: 'Monitor your job search journey from application to offer with organized tracking tools.'
    },
    'interview': {
      short: 'Practice and prepare for job interviews',
      detailed: 'Get AI-powered interview coaching, practice questions, and personalized feedback.'
    },
    'cover-letter': {
      short: 'Generate tailored cover letters with AI',
      detailed: 'Create professional, customized cover letters for any job application in minutes.'
    }
  };

  const mainTools = TOOLS.filter(t => t.id !== 'dashboard' && t.id !== 'homepage' && t.id !== 'contact');
  const jobTools = TOOLS.filter(t => t.category === 'Job Toolkit');
  const aiTools = TOOLS.filter(t => t.name.includes('AI') || t.name.includes('Gen') || t.id === 'chat');
  const utilityTools = mainTools.filter(t => !jobTools.includes(t) && !aiTools.includes(t));

  return (
    <div className="tool-container px-6 md:px-10 py-10 md:py-16">
      <header className="mb-12 md:mb-20 flex flex-col items-center md:items-start text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold mb-4"
        >
          <Sparkles size={14} />
          Complete Collection of 14+ Free Tools
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-slate-900 dark:text-white mb-4 max-w-3xl leading-[1.1]">
          All <span className="text-lumina-blue glow-sm">Productivity Tools</span> in One Place
        </h1>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Browse our complete collection of AI-powered tools, professional builders, and utilities. 
          Everything you need for career growth, content creation, and productivity.
        </p>
      </header>

      {/* AI Tools Section */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            🤖 AI-Powered Tools
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Smart tools that leverage artificial intelligence to deliver professional results instantly
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {aiTools.map((tool, index) => {
            const Icon = tool.icon;
            const enhancedDesc = enhancedToolDescriptions[tool.id];
            return (
              <Link
                key={tool.id}
                to={getRouteFromToolId(tool.id)}
                className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-green-200 dark:hover:border-green-500 hover:shadow-xl hover:shadow-green-500/5 transition-all text-left relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-6 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                  <Icon size={24} className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {enhancedDesc?.short || tool.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 leading-relaxed">
                  {enhancedDesc?.detailed}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                  Launch tool <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Job Search Toolkit Section */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            💼 Job Search Toolkit
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Professional tools to optimize your job search and advance your career
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {jobTools.map((tool, index) => {
            const Icon = tool.icon;
            const enhancedDesc = enhancedToolDescriptions[tool.id];
            return (
              <Link
                key={tool.id}
                to={getRouteFromToolId(tool.id)}
                className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-purple-200 dark:hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/5 transition-all text-left relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Icon size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {enhancedDesc?.short || tool.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 leading-relaxed">
                  {enhancedDesc?.detailed}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                  Launch tool <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Utility Tools Section */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            🛠️ Utility Tools
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Essential calculators and converters for everyday productivity
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {utilityTools.map((tool, index) => {
            const Icon = tool.icon;
            const enhancedDesc = enhancedToolDescriptions[tool.id];
            return (
              <Link
                key={tool.id}
                to={getRouteFromToolId(tool.id)}
                className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all text-left relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Icon size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                  {enhancedDesc?.short || tool.description}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 leading-relaxed">
                  {enhancedDesc?.detailed}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                  Launch tool <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="mt-20 py-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm">
            <div className="w-5 h-5 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-bold">L</span>
            </div>
            © 2026 Lumina Toolkit. Made for the next generation.
         </div>
         <div className="flex gap-6 text-sm text-slate-400 dark:text-slate-500">
           <Link to="/contact" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Feedback</Link>
           <Link to="/contact" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Report Bug</Link>
           <Link to="/contact" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Request Feature</Link>
         </div>
      </footer>
    </div>
  );
}
