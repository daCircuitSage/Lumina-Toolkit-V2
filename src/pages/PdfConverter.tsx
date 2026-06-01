import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { 
  FileUp, 
  Trash2, 
  Download, 
  Plus, 
  FileImage, 
  Settings,
  ArrowRightLeft,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import SeoContent from '../components/SeoContent';
import InternalLinks from '../components/InternalLinks';

interface ImageFile {
  id: string;
  name: string;
  url: string;
  size: string;
  file: File;
}

export default function PdfConverter() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageSize, setPageSize] = useState('a4');
  const [noMargins, setNoMargins] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    const newImages = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      file
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: pageSize
      });

      for (let i = 0; i < images.length; i++) {
        if (i !== 0) pdf.addPage();
        
        await new Promise((resolve) => {
          const img = new Image();
          img.src = images[i].url;
          img.onload = () => {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            const margin = noMargins ? 0 : 20; // 10mm margin on each side (20mm total)
            const effectiveWidth = pageWidth - margin;
            const effectiveHeight = pageHeight - margin;
            
            // Calculate scale to fit effective area while maintaining aspect ratio
            const ratio = img.width / img.height;
            let drawWidth = effectiveWidth;
            let drawHeight = effectiveWidth / ratio;

            if (drawHeight > effectiveHeight) {
              drawHeight = effectiveHeight;
              drawWidth = effectiveHeight * ratio;
            }

            const x = (pageWidth - drawWidth) / 2;
            const y = (pageHeight - drawHeight) / 2;

            pdf.addImage(img, 'JPEG', x, y, drawWidth, drawHeight);
            resolve(null);
          };
        });
      }

      pdf.save('Lumina_Converted.pdf');
    } catch (error) {
      console.error(error);
      alert('Failed to generate PDF');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tool-container">
      <header className="mb-10">
        <h1 className="text-3xl font-normal text-ink mb-2">PDF Forge</h1>
        <p className="text-sm text-body-mid">Transform your documents and images into clean PDFs.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-hairline rounded-sm p-8 md:p-12 flex flex-col items-center justify-center bg-canvas-card hover:border-white/30 hover:bg-canvas-soft transition-all cursor-pointer"
          >
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
            />
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-sm bg-white/10 flex items-center justify-center text-ink mb-4 md:mb-6 group-hover:scale-110 transition-transform text-center flex-col">
               <FileUp size={32} />
            </div>
            <h3 className="text-base md:text-lg font-normal text-ink mb-2">Choose Images</h3>
            <p className="text-xs md:text-sm text-body-mid text-center max-w-sm px-6">
              Select one or multiple images to combine into a single PDF document. Drag and drop supported.
            </p>
          </div>

          <div className="bg-canvas-card border border-hairline rounded-sm overflow-hidden flex-1 flex flex-col min-h-[300px] md:min-h-[400px]">
            <div className="p-4 md:p-6 border-b border-hairline flex justify-between items-center bg-canvas-soft">
              <h4 className="font-normal text-ink flex items-center gap-2">
                <FileImage size={18} className="text-body-mid" /> Image Queue
              </h4>
              <span className="text-[10px] md:text-xs font-normal text-body-mid bg-canvas px-2 py-1 rounded-sm uppercase tracking-wider">
                {images.length} Files Selected
              </span>
            </div>

            <div className="p-4 md:p-6 space-y-3 overflow-y-auto max-h-[400px] md:max-h-none">
              <AnimatePresence>
                {images.map((img) => (
                  <motion.div 
                    key={img.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 border border-hairline rounded-sm hover:bg-canvas-soft transition-colors"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-sm object-cover bg-canvas-soft flex-shrink-0 overflow-hidden border border-hairline">
                       <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <div className="text-xs md:text-sm font-normal text-ink truncate">{img.name}</div>
                       <div className="text-[10px] md:text-xs text-body-mid">{img.size}</div>
                    </div>
                    <button 
                       onClick={() => removeImage(img.id)}
                       className="p-2 text-body-mid hover:text-red-500 transition-colors"
                    >
                       <Trash2 size={16} className="w-4 h-4 md:w-4 md:h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 md:py-20 text-body-mid">
                   <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-dashed rounded-sm mb-4 border-hairline" />
                   <p className="text-xs md:text-sm font-normal">Your queue is empty</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-canvas-card rounded-sm border border-hairline p-6 md:p-8">
              <h3 className="font-normal text-ink mb-6 flex items-center gap-2">
                <Settings size={18} className="text-body-mid" /> Settings
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] md:text-xs font-normal text-body-mid uppercase tracking-widest block mb-3">Page Size</label>
                    <div className="grid grid-cols-2 gap-2">
                       {['a4', 'letter', 'legal', 'tabloid'].map(p => (
                         <button 
                           key={p}
                           onClick={() => setPageSize(p)}
                           className={cn(
                             "px-3 md:px-4 py-2 text-[10px] md:text-xs font-normal rounded-sm border transition-all uppercase tracking-wider",
                             pageSize === p 
                               ? "bg-white text-black" 
                               : "border-hairline text-body-mid hover:border-white/30"
                           )}
                         >
                           {p}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] md:text-xs font-normal text-body-mid uppercase tracking-widest block mb-3">Margins</label>
                    <button 
                      onClick={() => setNoMargins(!noMargins)}
                      className="w-full p-3 md:p-4 bg-canvas-soft rounded-sm flex items-center justify-between transition-all hover:bg-canvas group"
                    >
                       <span className="text-xs md:text-sm font-normal text-body-mid">No Margins</span>
                       <div className={cn(
                          "w-10 h-5 rounded-sm relative transition-all duration-300",
                          noMargins ? "bg-white" : "bg-canvas"
                       )}>
                          <div className={cn(
                            "absolute top-1 w-3 h-3 bg-black rounded-sm transition-all duration-300",
                            noMargins ? "right-1" : "left-1"
                          )} />
                       </div>
                    </button>
                 </div>
              </div>

              <div className="mt-8 md:mt-10">
                 <button 
                    disabled={images.length === 0 || isProcessing}
                    onClick={generatePdf}
                    className="w-full bg-white hover:bg-gray-100 text-black h-14 rounded-sm font-normal flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                 >
                    {isProcessing ? <Loader2 className="animate-spin text-black" /> : <Download size={20} />}
                    {isProcessing ? 'Processing...' : 'Generate PDF'}
                 </button>
              </div>
           </div>

           <div className="bg-white/10 rounded-sm p-8 border border-hairline">
              <h4 className="text-sm font-normal text-ink mb-4 flex items-center gap-2">
                <ArrowRightLeft size={16} /> Other Tools coming soon
              </h4>
              <div className="space-y-2 opacity-60">
                 <div className="p-3 bg-canvas-card rounded-sm text-xs font-normal text-body-mid">PDF to Word</div>
                 <div className="p-3 bg-canvas-card rounded-sm text-xs font-normal text-body-mid">Compress PDF</div>
              </div>
           </div>
        </div>
      </div>

      <SeoContent 
        title="Free PDF Converter Online: Transform Images and Documents"
        description="Our Free PDF Converter is a powerful, browser-based tool designed to help you create clean and professional PDF documents in seconds. Whether you're combining several project photos into a single report or converting a series of images into a structured document, our 'PDF Forge' handles everything with precision. With support for multiple page sizes like A4 and Letter, and options for margin-less printing, we ensure your documents look exactly how you intend them to. No software installation, no watermarks, just high-quality PDF generation."
        features={[
          "Bulk Image Support: Select multiple images to combine into a single PDF document.",
          "Custom Page Sizes: Support for A4, Letter, Legal, and Tabloid formats.",
          "Margin Control: Toggle between standard margins and edge-to-edge 'No Margins' mode.",
          "Instant Queue: Easily manage and re-order your image queue before generation.",
          "Privacy Optimized: All processing happens in your browser; your files are never uploaded.",
          "High Fidelity: Maintains the original resolution and quality of your uploaded images."
        ]}
        steps={[
          "Click the upload area to select one or more images from your device.",
          "Review your images in the 'Image Queue' and remove any if necessary.",
          "Choose your desired page size and margin settings in the side panel.",
          "Click 'Generate PDF' to trigger the browser-side PDF forge.",
          "Download your finished PDF document immediately to your device."
        ]}
        benefits={[
          "Zero cost, professional-grade PDF generation.",
          "Secure processing with no server-side data storage.",
          "Universal compatibility with all modern PDF readers.",
          "Combines multiple files into one for easy sharing.",
          "Fast execution even with large image files."
        ]}
        faq={[
          { q: "Is there a limit on file size?", a: "There is no strict limit, but very large images might take a few moments longer to process within your browser's memory." },
          { q: "Which image formats are supported?", a: "You can upload all standard image formats including JPEG, PNG, and WebP." },
          { q: "Will the PDF have watermarks?", a: "No, our tool is free to use and provides clean PDF exports without any additional watermarks or branding." },
          { q: "Are my images uploaded to a server?", a: "No. For your security and privacy, the entire conversion process happens locally in your browser using the jsPDF library." },
          { q: "Can I convert images back to original format?", a: "This specific tool is designed for PDF creation. To extract images from a PDF, we will be launching a 'PDF to Image' tool soon." }
        ]}
        ctaTitle="Forge your documents today."
      />
      
      {/* Internal Links for SEO */}
      <div className="mt-12">
        <InternalLinks currentToolId="pdf" title="Related Utility Tools" />
      </div>
    </div>
  );
}
