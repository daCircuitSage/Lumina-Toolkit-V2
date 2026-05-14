import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData } from '../types';
import ModernTemplate from '../templates/ModernTemplate';
import CorporateTemplate from '../templates/CorporateTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import SidebarTemplate from '../templates/SidebarTemplate';

interface PreviewProps {
  data: ResumeData;
  isExporting: boolean;
  view: 'edit' | 'preview';
  /** Inner scroll slot width from parent — fixes flex shrink-to-fit measuring bugs on mobile */
  slotWidth?: number;
}

export default function Preview({ data, isExporting, view, slotWidth }: PreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let frameId: number;
    const updateScale = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        let width: number;

        if (slotWidth && slotWidth > 0) {
          width = Math.round(slotWidth);
        } else {
          const rect = container.getBoundingClientRect();
          width = Math.round(rect.width);

          const parent = container.parentElement;
          if (parent) {
            const pw = Math.round(parent.getBoundingClientRect().width);
            if (pw > width + 4) width = pw;
          }

          if (parent && width < 260) {
            const pw = Math.round(parent.getBoundingClientRect().width);
            if (pw >= 280) width = pw;
          }
        }

        if (width === 0) return;

        const targetWidth = 794;
        // Keep a sliver of room for shadow; on phones prefer filling width
        let padding = 40;
        if (width < 420) padding = 12;
        else if (width < 640) padding = 20;

        const availableWidth = Math.max(160, width - padding);
        let baseScale = availableWidth / targetWidth;

        const isNarrow = width < 640;
        const zoomBoost = isNarrow ? 1.22 : width < 900 ? 1.04 : 1;
        let newScale = baseScale * zoomBoost;

        newScale = Math.max(0.15, Math.min(1, newScale));

        setScale(newScale);
      });
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    const parent = container.parentElement;
    if (parent) observer.observe(parent);

    updateScale();
    
    // Also update scale when isExporting changes after a short delay
    if (isExporting) {
      setTimeout(updateScale, 50);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [view, isExporting, slotWidth]);

  useEffect(() => {
    const handleExport = async () => {
      // Use the export ref if available (hidden full-size version)
      // otherwise fallback to preview ref
      const element = exportRef.current || resumeRef.current;
      if (!element) return;
      
      // Wait for layout to stabilize
      if (element.offsetWidth === 0 || element.offsetHeight === 0) {
        let attempts = 0;
        while ((element.offsetWidth === 0 || element.offsetHeight === 0) && attempts < 20) {
          await new Promise(resolve => setTimeout(resolve, 50));
          attempts++;
        }
      }

      if (element.offsetWidth === 0 || element.offsetHeight === 0) {
        console.error("Resume element has zero dimensions. Export cancelled.");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Force light mode and handle print adjustments
          const style = clonedDoc.createElement('style');
          style.innerHTML = `
            * { 
              color-scheme: light !important; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              font-variant-ligatures: none !important;
            }
            :root {
              /* Force hex fallbacks for ALL standard Tailwind colors to prevent html2canvas failures */
              --color-gray-50: #f9fafb !important; --color-gray-100: #f3f4f6 !important; --color-gray-200: #e5e7eb !important;
              --color-gray-300: #d1d5db !important; --color-gray-400: #9ca3af !important; --color-gray-500: #6b7280 !important;
              --color-gray-600: #4b5563 !important; --color-gray-700: #374151 !important; --color-gray-800: #1f2937 !important;
              --color-gray-900: #111827 !important;

              --color-slate-50: #f8fafc !important; --color-slate-100: #f1f5f9 !important; --color-slate-200: #e2e8f0 !important;
              --color-slate-300: #cbd5e1 !important; --color-slate-400: #94a3b8 !important; --color-slate-500: #64748b !important;
              --color-slate-600: #475569 !important; --color-slate-700: #334155 !important; --color-slate-800: #1e293b !important;
              --color-slate-900: #0f172a !important;

              --color-indigo-50: #eef2ff !important; --color-indigo-100: #e0e7ff !important; --color-indigo-200: #c7d2fe !important;
              --color-indigo-300: #a5b4fc !important; --color-indigo-400: #818cf8 !important; --color-indigo-500: #6366f1 !important;
              --color-indigo-600: #4f46e5 !important; --color-indigo-700: #4338ca !important; --color-indigo-800: #3730a3 !important;
              --color-indigo-900: #312e81 !important;

              --color-blue-50: #eff6ff !important; --color-blue-500: #3b82f6 !important; --color-blue-900: #1e3a8a !important;
              --color-cyan-50: #ecfeff !important; --color-cyan-400: #22d3ee !important; --color-cyan-600: #0891b2 !important;
              --color-emerald-50: #ecfdf5 !important; --color-emerald-500: #10b981 !important;
              
              --color-white: #ffffff !important;
              --color-black: #000000 !important;
              --color-transparent: transparent !important;
            }
          `;
          clonedDoc.head.appendChild(style);
          
          const all = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < all.length; i++) {
            const el = all[i] as HTMLElement;
            if (el.style) {
              el.style.colorScheme = 'light';
              
              const checkAndFix = (prop: string, fallback: string) => {
                const val = window.getComputedStyle(el).getPropertyValue(prop);
                if (val && (val.includes('oklch') || val.includes('oklab') || val.includes('var(--oklch') || val.includes('var(--oklab'))) {
                  el.style.setProperty(prop, fallback, 'important');
                }
              };

              checkAndFix('color', '#000000');
              checkAndFix('background-color', 'transparent');
              checkAndFix('border-color', 'transparent');
              checkAndFix('fill', '#000000');
              checkAndFix('stroke', '#000000');
              checkAndFix('outline-color', 'transparent');
              checkAndFix('box-shadow', 'none'); 
            }
          }
        }
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    };

    window.addEventListener('export-pdf', handleExport);
    return () => window.removeEventListener('export-pdf', handleExport);
  }, [data]);

  const renderTemplate = () => {
    switch (data.activeTemplate) {
      case 'modern': return <ModernTemplate data={data} />;
      case 'corporate': return <CorporateTemplate data={data} />;
      case 'creative': return <CreativeTemplate data={data} />;
      case 'minimal': return <MinimalTemplate data={data} />;
      case 'sidebar': return <SidebarTemplate data={data} />;
      default: return <ModernTemplate data={data} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-none min-w-0 flex-1 flex flex-col items-center justify-start py-2 sm:py-3"
    >
      {/* Hidden container for PDF capture - always full scale to avoid mobile scaling issues */}
      <div 
        style={{ position: 'fixed', left: '-10000px', top: 0, width: '794px', pointerEvents: 'none', zIndex: -1 }}
        ref={exportRef}
        aria-hidden="true"
      >
        <div className="w-[794px] min-h-[1123px] bg-white max-w-none">
          {renderTemplate()}
        </div>
      </div>

      {/* Viewport clips scaled page; top-left origin keeps layout width === 794 * scale */}
      <div
        style={{
          width: `${794 * scale}px`,
          height: `${1123 * scale}px`,
          minHeight: `${1123 * scale}px`,
          maxWidth: 'none',
        }}
        className="relative shrink-0 overflow-hidden rounded-sm shadow-[0_16px_48px_-10px_rgba(0,0,0,0.32)] md:shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)]"
      >
        <div
          className="bg-white relative overflow-hidden max-w-none"
          style={{
            width: '794px',
            height: '1123px',
            minHeight: '1123px',
            maxWidth: 'none',
            transform: `translateZ(0) scale(${scale})`,
            transformOrigin: 'top left',
            WebkitFontSmoothing: 'antialiased',
          }}
        >
          <div ref={resumeRef} className="w-full h-full max-w-none bg-white print:shadow-none">
            {renderTemplate()}
          </div>
        </div>
      </div>
      
      {isExporting && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center">
           <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 border border-slate-100">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="font-bold text-slate-900 text-lg">Perfecting your Resume</p>
                <p className="text-slate-500 text-sm">Generating professional PDF...</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
