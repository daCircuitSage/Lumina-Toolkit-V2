import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ResumeData } from './types';
import ModernTemplate from '../../templates/ModernTemplate';
import CorporateTemplate from '../../templates/CorporateTemplate';
import CreativeTemplate from '../../templates/CreativeTemplate';
import MinimalTemplate from '../../templates/MinimalTemplate';
import SidebarTemplate from '../../templates/SidebarTemplate';

interface PreviewProps {
  data: ResumeData;
  isExporting: boolean;
  view: 'edit' | 'preview';
}

export default function Preview({ data, isExporting, view }: PreviewProps) {
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
        const width = container.clientWidth;
        if (width === 0) return;

        const targetWidth = 794;
        // On very small screens, use less padding to maximize space
        let padding = 48;
        if (width < 400) padding = 8;
        else if (width < 640) padding = 24;
        
        const availableWidth = width - padding;
        
        let newScale = availableWidth / targetWidth;
        // Clamp scale to reasonable values
        newScale = Math.max(0.1, Math.min(1.1, newScale));
        
        setScale(newScale);
      });
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    
    updateScale();
    
    // Also update scale when isExporting changes after a short delay
    if (isExporting) {
      setTimeout(updateScale, 50);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [view, isExporting]);

  useEffect(() => {
    const handleExport = async () => {
      try {
        console.log('Starting PDF export...');
        
        // Force the preview to be visible during export
        const exportElement = exportRef.current;
        const previewElement = resumeRef.current;
        
        let targetElement = exportElement;
        
        // If export element doesn't exist or has no dimensions, try preview element
        if (!targetElement || targetElement.offsetWidth === 0 || targetElement.offsetHeight === 0) {
          targetElement = previewElement;
        }
        
        // If still no good element, create a temporary one
        if (!targetElement || targetElement.offsetWidth === 0 || targetElement.offsetHeight === 0) {
          console.log('Creating temporary export element...');
          const tempDiv = document.createElement('div');
          tempDiv.style.width = '794px';
          tempDiv.style.height = '1123px';
          tempDiv.style.position = 'absolute';
          tempDiv.style.left = '-9999px';
          tempDiv.style.top = '0';
          tempDiv.style.backgroundColor = 'white';
          tempDiv.className = 'export-temp';
          document.body.appendChild(tempDiv);
          
          // Render the template directly into the temp element
          const templateComponent = renderTemplate();
          // Create a simple HTML structure for export
          tempDiv.innerHTML = `
            <div style="width: 794px; min-height: 1123px; background: white; padding: 48px; font-family: sans-serif;">
              <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 16px;">${data.personalInfo.fullName || 'Your Name'}</h1>
              <p style="font-size: 16px; margin-bottom: 8px;">${data.personalInfo.email || 'email@example.com'}</p>
              <p style="font-size: 16px; margin-bottom: 8px;">${data.personalInfo.phone || '+1 234 567 890'}</p>
              <p style="font-size: 16px; margin-bottom: 24px;">${data.personalInfo.address || 'City, State'}</p>
              
              ${data.personalInfo.summary ? `<p style="margin-bottom: 24px;">${data.personalInfo.summary}</p>` : ''}
              
              ${data.experience && data.experience.length > 0 ? `
                <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Experience</h2>
                ${data.experience.map(exp => `
                  <div style="margin-bottom: 16px;">
                    <h3 style="font-weight: bold; margin-bottom: 4px;">${exp.role}</h3>
                    <p style="font-style: italic; margin-bottom: 4px;">${exp.company} | ${exp.period}</p>
                    <p>${exp.description}</p>
                  </div>
                `).join('')}
              ` : ''}
              
              ${data.education && data.education.length > 0 ? `
                <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Education</h2>
                ${data.education.map(edu => `
                  <div style="margin-bottom: 12px;">
                    <h3 style="font-weight: bold; margin-bottom: 4px;">${edu.degree}</h3>
                    <p style="font-style: italic;">${edu.school} | ${edu.period}</p>
                  </div>
                `).join('')}
              ` : ''}
              
              ${data.skills && data.skills.length > 0 ? `
                <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 16px;">Skills</h2>
                <p>${data.skills.map(skill => skill.name || skill).join(', ')}</p>
              ` : ''}
            </div>
          `;
          
          targetElement = tempDiv;
        }
        
        console.log('Element found:', targetElement);
        console.log('Element dimensions:', targetElement.offsetWidth, 'x', targetElement.offsetHeight);
        
        // Wait for layout to stabilize
        if (targetElement.offsetWidth === 0 || targetElement.offsetHeight === 0) {
          console.log('Waiting for element to have dimensions...');
          let attempts = 0;
          while ((targetElement.offsetWidth === 0 || targetElement.offsetHeight === 0) && attempts < 20) {
            await new Promise(resolve => setTimeout(resolve, 50));
            attempts++;
          }
        }

        if (targetElement.offsetWidth === 0 || targetElement.offsetHeight === 0) {
          console.error("Resume element has zero dimensions. Export cancelled.");
          // Clean up temp element if created
          const tempEl = document.querySelector('.export-temp');
          if (tempEl) tempEl.remove();
          return;
        }

        console.log('Creating canvas with html2canvas...');
        const canvas = await html2canvas(targetElement, {
          scale: 2,
          useCORS: true,
          logging: true, // Enable logging for debugging
          backgroundColor: '#ffffff',
          onclone: (clonedDoc) => {
            console.log('Cloning document for export...');
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
            if (all && all.length > 0) {
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
                  checkAndFix('background-color', '#ffffff');
                  checkAndFix('border-color', 'transparent');
                  checkAndFix('fill', '#000000');
                  checkAndFix('stroke', '#000000');
                  checkAndFix('outline-color', 'transparent');
                  checkAndFix('box-shadow', 'none'); 
                }
              }
            }
          }
        });

        console.log('Canvas created successfully:', canvas);
        console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

        console.log('Creating PDF...');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        console.log('Adding image to PDF...');
        pdf.addImage(canvas, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
        
        const filename = `${data.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        console.log('Saving PDF as:', filename);
        pdf.save(filename);
        
        console.log('PDF export completed successfully!');
        
        // Clean up temporary element if it was created
        const tempEl = document.querySelector('.export-temp');
        if (tempEl) tempEl.remove();
      } catch (error) {
        console.error('Error during PDF export:', error);
        // Show error to user
        const errorToast = document.createElement('div');
        errorToast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        errorToast.innerHTML = `<div class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>Export failed: ${error.message}</div>`;
        document.body.appendChild(errorToast);
        setTimeout(() => errorToast.remove(), 5000);
        
        // Clean up temporary element if it was created
        const tempEl = document.querySelector('.export-temp');
        if (tempEl) tempEl.remove();
      }
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
    <div ref={containerRef} className="w-full flex-1 flex flex-col items-center justify-start py-4 overflow-hidden">
      {/* Hidden container for PDF capture - always full scale to avoid mobile scaling issues */}
      <div 
        style={{ position: 'fixed', left: '-10000px', top: 0, width: '794px', pointerEvents: 'none', zIndex: -1 }}
        ref={exportRef}
        aria-hidden="true"
      >
        <div className="w-[794px] min-h-[1123px] bg-white">
          {renderTemplate()}
        </div>
      </div>

      {/* Wrapper to maintain scaled height and prevent layout flickering */}
      <div 
        style={{ 
          width: `${794 * scale}px`, 
          height: `${1123 * scale}px`,
          minHeight: `${1123 * scale}px`
        }}
        className="flex items-start justify-center overflow-visible"
      >
        <div 
          className="bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] relative overflow-hidden origin-top transform-gpu shrink-0"
          style={{
            minHeight: '1123px',
            width: '794px',
            transform: `scale(${scale})`,
          }}
        >
          <div ref={resumeRef} className="w-full h-full bg-white print:shadow-none">
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
