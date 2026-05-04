import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Grid3X3, ChevronRight } from 'lucide-react';
import { TOOLS } from '../constants';

interface InternalLinksProps {
  currentToolId: string;
  title?: string;
}

export default function InternalLinks({ currentToolId, title = "Related Tools" }: InternalLinksProps) {
  // Get related tools based on category and relevance
  const getRelatedTools = () => {
    const currentTool = TOOLS.find(t => t.id === currentToolId);
    if (!currentTool) return [];

    // Filter out current tool and system tools
    const availableTools = TOOLS.filter(t => 
      t.id !== currentToolId && 
      t.id !== 'homepage' && 
      t.id !== 'dashboard' && 
      t.id !== 'contact'
    );

    // If current tool is in Job Toolkit, prioritize other job tools
    if (currentTool.category === 'Job Toolkit') {
      const jobTools = availableTools.filter(t => t.category === 'Job Toolkit');
      const otherTools = availableTools.filter(t => t.category !== 'Job Toolkit');
      return [...jobTools.slice(0, 2), ...otherTools.slice(0, 1)];
    }

    // If current tool is AI-related, prioritize other AI tools
    if (currentTool.name.includes('AI') || currentTool.name.includes('Gen') || currentTool.id === 'chat') {
      const aiTools = availableTools.filter(t => 
        t.name.includes('AI') || t.name.includes('Gen') || t.id === 'chat'
      );
      const otherTools = availableTools.filter(t => 
        !t.name.includes('AI') && !t.name.includes('Gen') && t.id !== 'chat'
      );
      return [...aiTools.slice(0, 2), ...otherTools.slice(0, 1)];
    }

    // For utility tools, suggest a mix
    const utilityTools = availableTools.filter(t => 
      !t.category && 
      !t.name.includes('AI') && 
      !t.name.includes('Gen') && 
      t.id !== 'chat'
    );
    const otherTools = availableTools.filter(t => 
      t.category || 
      t.name.includes('AI') || 
      t.name.includes('Gen') || 
      t.id === 'chat'
    );

    return [...utilityTools.slice(0, 1), ...otherTools.slice(0, 2)];
  };

  const getRouteFromToolId = (toolId: string): string => {
    const routeMap: { [key: string]: string } = {
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
    return routeMap[toolId] || '/all-tools';
  };

  const relatedTools = getRelatedTools();

  return (
    <nav className="internal-links" role="navigation" aria-label="Page navigation">
      {/* Structured Navigation Block */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 mb-6 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <span>Navigation</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all text-sm font-medium border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-600"
            aria-label="Go to homepage"
          >
            <Home size={14} />
            Homepage
          </Link>
          <Link
            to="/all-tools"
            className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all text-sm font-medium border border-slate-200 dark:border-slate-700"
            aria-label="View all tools"
          >
            <Grid3X3 size={14} />
            All Tools
          </Link>
        </div>
      </div>

      {/* Navigation Breadcrumb */}
      <div className="flex flex-wrap items-center gap-2 text-sm mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          aria-label="Go to homepage"
        >
          <Home size={14} />
          Home
        </Link>
        <ChevronRight size={14} className="text-slate-400" />
        <Link
          to="/all-tools"
          className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          aria-label="View all tools"
        >
          <Grid3X3 size={14} />
          All Tools
        </Link>
        <ChevronRight size={14} className="text-slate-400" />
        <span className="text-slate-900 dark:text-white font-medium">
          {TOOLS.find(t => t.id === currentToolId)?.name || 'Current Tool'}
        </span>
      </div>

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              (You might also need)
            </span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  to={getRouteFromToolId(tool.id)}
                  className="group p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/5 transition-all text-left"
                  aria-label={`Navigate to ${tool.name}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors flex-shrink-0">
                      <Icon size={16} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
