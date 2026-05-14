/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Download, Home, LayoutDashboard } from 'lucide-react';
import { INITIAL_DATA } from './constants';
import { ResumeData, TemplateId } from './types';
import { cn } from './lib/utils';

// Components (to be created)
import Editor from './components/Editor';
import Preview from './components/Preview';
import TemplateSelector from './components/TemplateSelector';

export interface ResumeCraftAppProps {
  /** When true, show links back to Lumina home and all-tools (standalone /resume-builder route). */
  toolkitNav?: boolean;
}

export default function App({ toolkitNav = false }: ResumeCraftAppProps) {
  const [data, setData] = useState<ResumeData>(() => {
    const saved = localStorage.getItem('resume-data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [view, setView] = useState<'edit' | 'preview'>('edit');
  const [isExporting, setIsExporting] = useState(false);
  const previewSlotRef = useRef<HTMLDivElement>(null);
  const [previewSlotWidth, setPreviewSlotWidth] = useState(0);

  useLayoutEffect(() => {
    const el = previewSlotRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setPreviewSlotWidth(w);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('orientationchange', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', measure);
    };
  }, [view]);

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
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden" style={{ colorScheme: 'light' }}>
      {/* Header Navigation */}
      <header className="h-16 px-3 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between flex-shrink-0 gap-2 z-50">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {toolkitNav && (
            <nav
              className="flex items-center gap-0.5 sm:gap-1 shrink-0 border-r border-slate-200 pr-2 sm:pr-3 mr-1 sm:mr-2"
              aria-label="Lumina Toolkit"
            >
              <Link
                to="/"
                title="Lumina home"
                aria-label="Lumina home"
                className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Home size={18} className="shrink-0 text-slate-500" aria-hidden />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                to="/all-tools"
                title="Browse all tools"
                aria-label="Browse all tools"
                className="inline-flex items-center gap-1 rounded-md px-2 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <LayoutDashboard size={18} className="shrink-0 text-slate-500" aria-hidden />
                <span className="hidden md:inline">All tools</span>
              </Link>
            </nav>
          )}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold shrink-0">R</div>
            <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 truncate">
              ResumePro <span className="text-slate-400 font-normal hidden sm:inline">| Builder</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center text-xs text-slate-500 mr-2">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> 
            Saved locally
          </div>
          
          <div className="lg:hidden flex bg-slate-100 rounded-md p-1 mr-2">
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
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
          >
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden lg:flex-row flex-col">
        {/* Sidebar: Template Selection */}
        <aside className="lg:w-20 w-full lg:h-full h-auto bg-white border-r border-slate-200 flex lg:flex-col flex-row items-center lg:justify-center justify-start lg:py-6 py-2 px-6 lg:px-0 gap-6 lg:gap-6 overflow-x-auto lg:shrink-0 order-2 lg:order-1 custom-scrollbar">
          <TemplateSelector
            activeTemplate={data.activeTemplate}
            onSelect={(id) => updateData({ activeTemplate: id })}
          />
        </aside>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden order-1 lg:order-2">
          {/* Editor Section */}
          <section className={cn(
            "lg:w-[460px] w-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300",
            view === 'preview' && "hidden lg:flex lg:opacity-50 pointer-events-none"
          )}>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Editor data={data} onChange={updateData} />
            </div>
          </section>

          {/* Live Preview Section — column + inner scroll so width matches real viewport (not default flex-row) */}
          <section className={cn(
            "flex-1 min-h-0 min-w-0 bg-slate-200 flex flex-col relative lg:overflow-x-hidden",
            view === 'edit' && !isExporting && "hidden lg:flex"
          )}>
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/20 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-tighter backdrop-blur-md hidden md:block z-10">
              A4 Preview
            </div>
            <div className="flex-1 min-h-0 w-full min-w-0 flex flex-col p-2 sm:p-3 md:p-8">
              <div
                ref={previewSlotRef}
                className="min-h-0 w-full min-w-0 flex-1 overflow-x-auto overflow-y-auto custom-scrollbar flex flex-col items-stretch"
              >
                <Preview
                  data={data}
                  isExporting={isExporting}
                  view={view}
                  slotWidth={previewSlotWidth > 0 ? previewSlotWidth : undefined}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}
