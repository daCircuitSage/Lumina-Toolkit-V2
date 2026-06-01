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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <header className="mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-on-primary rounded-sm text-xs font-normal mb-4"
        >
          <Sparkles size={14} />
          Complete Collection of 14+ Free Tools
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-normal text-ink mb-4 max-w-3xl leading-tight">
          All <span className="text-primary">Productivity Tools</span> in One Place
        </h1>
        <p className="text-lg text-body max-w-2xl leading-relaxed">
          Browse our complete collection of AI-powered tools, professional builders, and utilities. 
          Everything you need for career growth, content creation, and productivity.
        </p>
      </header>

      {/* AI Tools Section */}
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-normal text-ink mb-2">
            🤖 AI-Powered Tools
          </h2>
          <p className="text-body">
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
                className="group p-4 md:p-6 bg-canvas border border-hairline rounded-sm hover:border-primary/30 transition-all text-left relative overflow-hidden w-full"
              >
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-normal text-ink mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-body mb-4 leading-relaxed">
                  {enhancedDesc?.short || tool.description}
                </p>
                <p className="text-xs text-body/70 mb-6 leading-relaxed">
                  {enhancedDesc?.detailed}
                </p>
                <div className="flex items-center gap-2 text-sm font-normal text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
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
          <h2 className="text-2xl md:text-3xl font-normal text-ink mb-2">
            💼 Job Search Toolkit
          </h2>
          <p className="text-body">
            Professional tools to optimize your job search and advance your career
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {jobTools.map((tool, index) => {
            const Icon = tool.icon;
            const enhancedDesc = enhancedToolDescriptions[tool.id];
            return (
              <Link
                key={tool.id}
                to={getRouteFromToolId(tool.id)}
                className="group p-4 md:p-6 bg-canvas border border-hairline rounded-sm hover:border-primary/30 transition-all text-left relative overflow-hidden w-full"
              >
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-normal text-ink mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-body mb-4 leading-relaxed">
                  {enhancedDesc?.short || tool.description}
                </p>
                <p className="text-xs text-body/70 mb-6 leading-relaxed">
                  {enhancedDesc?.detailed}
                </p>
                <div className="flex items-center gap-2 text-sm font-normal text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
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
          <h2 className="text-2xl md:text-3xl font-normal text-ink mb-2">
            🛠️ Utility Tools
          </h2>
          <p className="text-body">
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
                className="group p-4 md:p-6 bg-canvas border border-hairline rounded-sm hover:border-primary/30 transition-all text-left relative overflow-hidden w-full"
              >
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-normal text-ink mb-2 group-hover:text-primary transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-body mb-4 leading-relaxed">
                  {enhancedDesc?.short || tool.description}
                </p>
                <p className="text-xs text-body/70 mb-6 leading-relaxed">
                  {enhancedDesc?.detailed}
                </p>
                <div className="flex items-center gap-2 text-sm font-normal text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all">
                  Launch tool <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="mt-20 py-8 border-t border-hairline flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2 text-body text-sm">
            <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-[10px] font-normal text-on-primary">L</span>
            </div>
            © 2026 Lumina Toolkit. Made for the next generation.
         </div>
         <div className="flex gap-6 text-sm text-body">
           <Link to="/contact" className="hover:text-ink transition-colors">Feedback</Link>
           <Link to="/contact" className="hover:text-ink transition-colors">Report Bug</Link>
           <Link to="/contact" className="hover:text-ink transition-colors">Request Feature</Link>
         </div>
      </footer>
    </div>
  );
}
