/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { Download, Layout, Pencil, Menu, X, Monitor, Smartphone, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_DATA } from './constants';
import { ResumeData, TemplateId } from './types';
import { cn } from './utils';

// Components
import Editor from './Editor';
import Preview from './Preview';
import TemplateSelector from './TemplateSelector';

export default function ResumeBuilderApp() {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    localStorage.setItem('resume-data', JSON.stringify(data));
  }, [data]);

  const updateData = useCallback((newData: Partial<ResumeData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    // Give UI time to re-render and reveal the preview if it was hidden
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('export-pdf'));
    }, 150);
    setTimeout(() => setIsExporting(false), 3000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-white font-sans overflow-hidden" style={{ colorScheme: 'dark' }}>
      {/* Mobile Top Bar - Only visible on mobile, integrates with main layout */}
      <div className="md:hidden h-16 px-4 bg-surface border-b border-border flex items-center justify-between flex-shrink-0 z-30 relative">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-black font-bold">R</div>
          <h1 className="text-lg font-semibold tracking-tight text-white truncate">
            ResumePro
          </h1>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex bg-hover rounded-md p-1">
            <button
              onClick={() => setView('edit')}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap",
                view === 'edit' ? "bg-surface text-accent" : "text-text-secondary"
              )}
            >
              Edit
            </button>
            <button
              onClick={() => setView('preview')}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-all whitespace-nowrap",
                view === 'preview' ? "bg-surface text-accent" : "text-text-secondary"
              )}
            >
              Preview
            </button>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-3 py-2 text-sm font-medium bg-accent text-black rounded-md shadow-sm hover:bg-accent/80 transition-all disabled:opacity-50 whitespace-nowrap flex-shrink-0"
          >
            {isExporting ? '...' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Desktop Header - Only visible on desktop */}
      <div className="hidden md:flex h-16 px-6 bg-surface border-b border-border items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-black font-bold">R</div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            ResumePro <span className="text-text-secondary font-normal">| Builder</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center text-xs text-text-secondary mr-2">
            <span className="w-2 h-2 bg-accent rounded-full mr-2"></span> 
            Saved locally
          </div>
          
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium bg-accent text-black rounded-md shadow-sm hover:bg-accent/80 transition-all disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden lg:flex-row flex-col min-h-0">
        {/* Sidebar: Template Selection */}
        <aside className="lg:w-20 w-full lg:h-full h-auto bg-surface border-r border-border flex lg:flex-col flex-row items-center lg:justify-center justify-start lg:py-6 py-2 px-6 lg:px-0 gap-6 lg:gap-6 overflow-x-auto lg:shrink-0 order-2 lg:order-1 resume-scrollbar">
          <TemplateSelector
            activeTemplate={data.activeTemplate}
            onSelect={(id) => updateData({ activeTemplate: id })}
          />
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex lg:flex-row flex-col overflow-hidden order-1 lg:order-2 min-h-0">
          {/* Editor Panel */}
          <div className={cn(
            "flex-1 layout-stable min-h-0 resume-scrollbar",
            view === 'edit' ? "block lg:flex" : "hidden lg:flex"
          )}>
            <Editor data={data} onChange={updateData} />
          </div>

          {/* Preview Panel */}
          <div className={cn(
            "flex-1 bg-hover border-l border-border min-h-0",
            view === 'preview' ? "block lg:flex" : "hidden lg:flex"
          )}>
            <Preview data={data} isExporting={isExporting} view={view} />
          </div>
        </div>
      </main>
    </div>
  );
}
