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
    <div className="flex flex-col h-full w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden" style={{ colorScheme: 'light' }}>
      {/* Mobile Top Bar - Only visible on mobile, integrates with main layout */}
      <div className="md:hidden h-16 px-4 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">R</div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            ResumePro
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-md p-1">
            <button
              onClick={() => setView('edit')}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-all",
                view === 'edit' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"
              )}
            >
              Edit
            </button>
            <button
              onClick={() => setView('preview')}
              className={cn(
                "px-3 py-1 rounded text-xs font-medium transition-all",
                view === 'preview' ? "bg-white shadow-sm text-indigo-600" : "text-slate-500"
              )}
            >
              Preview
            </button>
          </div>

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isExporting ? '...' : 'PDF'}
          </button>
        </div>
      </div>

      {/* Desktop Header - Only visible on desktop */}
      <div className="hidden md:flex h-16 px-6 bg-white border-b border-slate-200 items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold">R</div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            ResumePro <span className="text-slate-400 font-normal">| Builder</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center text-xs text-slate-500 mr-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> 
            Saved locally
          </div>
          
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      <main className="flex-1 flex overflow-hidden lg:flex-row flex-col">
        {/* Sidebar: Template Selection */}
        <aside className="lg:w-20 w-full lg:h-full h-auto bg-white border-r border-slate-200 flex lg:flex-col flex-row items-center lg:justify-center justify-start lg:py-6 py-2 px-6 lg:px-0 gap-6 lg:gap-6 overflow-x-auto lg:shrink-0 order-2 lg:order-1 custom-scrollbar">
          <TemplateSelector
            activeTemplate={data.activeTemplate}
            onSelect={(id) => updateData({ activeTemplate: id })}
          />
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex lg:flex-row flex-col overflow-hidden order-1 lg:order-2">
          {/* Editor Panel */}
          <div className={cn(
            "flex-1 overflow-y-auto",
            view === 'edit' ? "block" : "hidden lg:block"
          )}>
            <Editor data={data} onChange={updateData} />
          </div>

          {/* Preview Panel */}
          <div className={cn(
            "flex-1 bg-slate-50/50 border-l border-slate-200/50",
            view === 'preview' ? "block" : "hidden lg:block"
          )}>
            <Preview data={data} isExporting={isExporting} view={view} />
          </div>
        </div>
      </main>
    </div>
  );
}
