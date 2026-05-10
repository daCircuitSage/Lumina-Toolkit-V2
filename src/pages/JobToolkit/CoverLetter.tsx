import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Send, 
  Copy, 
  Check, 
  Loader2, 
  User, 
  Building, 
  Briefcase, 
  Mail, 
  Sparkles,
  Download,
  Terminal,
  Eye,
  Type
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { jsPDF } from 'jspdf';
import SeoContent from '../../components/SeoContent';
import * as htmlToImage from 'html-to-image';
import { analyticsEvents } from '../../lib/analytics';

export default function CoverLetter() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [letter, setLetter] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const letterRef = React.useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    experience: '',
    tone: 'professional'
  });

  const handleGenerate = async () => {
    if (!formData.role || !formData.company) return;
    setIsGenerating(true);
    setLetter('');

    // Track cover letter generation
    analyticsEvents.coverLetterGenerated(formData.role);

    const prompt = `
      Create a highly professional and tailored cover letter for the following position:
      Role: ${formData.role}
      Company: ${formData.company}
      Relevant Experience: ${formData.experience}
      Tone: ${formData.tone}
      
      Requirements:
      - Use a modern, persuasive writing style.
      - Keep it under 300 words.
      - Do not include header address blocks, just start from "Dear Hiring Manager,"
      - Focus on how the experience directly benefits ${formData.company}.
    `;

    try {
      const response = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: formData.experience,
          jobDescription: `Role: ${formData.role}\nCompany: ${formData.company}`,
          tone: formData.tone
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate cover letter');
      }

      const data = await response.json();
      setLetter(data.coverLetter);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "AI generator is busy. Please try again in a moment.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = async () => {
    if (!letterRef.current || isExporting) return;
    setIsExporting(true);
    
    try {
      // Create a temporary element for PDF rendering to ensure A4 proportions
      const printArea = document.createElement('div');
      printArea.style.width = '794px'; // 210mm at 96 DPI
      printArea.style.padding = '60px';
      printArea.style.backgroundColor = 'white';
      printArea.style.color = '#1e293b';
      printArea.style.fontFamily = 'serif';
      printArea.style.fontSize = '14pt';
      printArea.style.lineHeight = '1.6';
      printArea.style.whiteSpace = 'pre-wrap';
      printArea.innerText = letter;
      
      document.body.appendChild(printArea);
      
      const dataUrl = await htmlToImage.toPng(printArea, {
        quality: 1.0,
        pixelRatio: 2
      });
      
      document.body.removeChild(printArea);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (printArea.offsetHeight * imgWidth) / printArea.offsetWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Cover_Letter_${formData.company.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-lg text-xs font-semibold mb-4"
        >
          <Mail size={14} />
          AI-Powered Cover Letters
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
          Generate Professional Cover Letters in Seconds
        </h1>
        <p className="text-lg text-text-secondary mb-8 max-w-2xl">
          Create persuasive, tailored cover letters that highlight your strengths and match the company culture. AI-powered writing for any role or industry.
        </p>

      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-5 space-y-6">
           <div className="p-6 md:p-8 bg-surface border border-border rounded-3xl shadow-sm space-y-6">
              <InputGroup label="Target Role" value={formData.role} onChange={(v: string) => setFormData({...formData, role: v})} icon={Briefcase} placeholder="e.g. Product Manager" />
              <InputGroup label="Organization" value={formData.company} onChange={(v: string) => setFormData({...formData, company: v})} icon={Building} placeholder="e.g. Google" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1 ml-1">Core Highlights</label>
                <textarea 
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="Summarize your top 3 achievements..."
                  className="w-full h-24 md:h-32 px-5 md:px-6 py-4 bg-hover border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <ToneButton active={formData.tone === 'professional'} onClick={() => setFormData({...formData, tone: 'professional'})} label="Formal" />
                 <ToneButton active={formData.tone === 'enthusiastic'} onClick={() => setFormData({...formData, tone: 'enthusiastic'})} label="Witty" />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !formData.role || !formData.company}
                className="w-full py-4 md:py-5 bg-accent hover:bg-accent/90 text-white rounded-xl text-xs font-black uppercase tracking-widest active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl min-h-[52px]"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isGenerating ? 'Drafting Genius...' : 'Generate Letter'}
              </button>
           </div>
        </div>

        <div className="lg:col-span-7">
           <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-accent to-purple-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              <div className="relative bg-surface border border-border rounded-2xl shadow-sm min-h-[400px] md:min-h-[600px] overflow-hidden flex flex-col">
                 <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-5 border-b border-border bg-hover/50">
                    <div className="flex items-center gap-1.5 md:gap-2">
                       <button onClick={() => setIsEditing(!isEditing)} className={cn("p-2 rounded-lg transition-all", isEditing ? "bg-accent text-white" : "text-text-secondary hover:text-accent hover:bg-surface")}>
                         <Type size={18} />
                       </button>
                       {letter && (
                         <button onClick={copyToClipboard} className="p-2 text-text-secondary hover:text-accent hover:bg-surface rounded-lg transition-all">
                           {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                         </button>
                       )}
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-text-secondary">Intelligent Preview</div>
                       {letter && <div className="h-4 w-px bg-border mx-1"></div>}
                       {letter && (
                         <button 
                          onClick={handleExportPdf}
                          disabled={isExporting}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:opacity-70 transition-all disabled:opacity-30"
                         >
                           {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={14} />}
                           <span className="hidden xs:inline">Save PDF</span>
                         </button>
                       )}
                    </div>
                 </div>

                 <div className="flex-1 p-6 md:p-10 font-serif leading-relaxed text-text-secondary overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                       {!letter && !isGenerating && (
                         <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-20"
                         >
                            <FileText size={64} strokeWidth={1} className="mb-4" />
                            <h2 className="text-sm font-black uppercase tracking-[4px]">Empty Draft</h2>
                            <p className="text-[10px] font-bold uppercase mt-2">Fill form to begin</p>
                         </motion.div>
                       )}
                       
                       {isGenerating && (
                         <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="space-y-6 animate-pulse"
                         >
                            <div className="h-4 bg-hover rounded-full w-24"></div>
                            <div className="space-y-3">
                              <div className="h-4 bg-hover rounded-full w-full"></div>
                              <div className="h-4 bg-hover rounded-full w-full"></div>
                              <div className="h-4 bg-hover rounded-full w-5/6"></div>
                            </div>
                            <div className="h-4 bg-hover rounded-full w-1/2"></div>
                         </motion.div>
                       )}

                       {letter && (
                         <motion.div 
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          className="relative h-full"
                         >
                            {isEditing ? (
                              <textarea 
                                value={letter}
                                onChange={(e) => setLetter(e.target.value)}
                                className="w-full h-full min-h-[400px] bg-transparent focus:outline-none resize-none leading-relaxed text-base"
                              />
                            ) : (
                              <div ref={letterRef} className="whitespace-pre-wrap text-base md:text-lg">
                                {letter}
                              </div>
                            )}
                         </motion.div>
                       )}
                    </AnimatePresence>
                 </div>

                 <div className="px-6 md:px-8 py-4 md:py-5 bg-hover/20 border-t border-border flex items-center justify-between">
                    <div className="text-[9px] font-black uppercase tracking-widest text-text-secondary italic">Smart Resume Agent v1.0</div>
                    <div className="flex gap-4">
                       <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary">{letter.split(/\s+/).length} Words</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <SeoContent 
        title="Free AI Cover Letter Generator: Land Your Dream Job"
        description="A great cover letter can be the difference between getting an interview and being ignored. Our AI Cover Letter Generator helps you craft persuasive, tailored, and high-impact letters in seconds. By analyzing your target role, the organization, and your key achievements, our intelligent writing assistant produces a professional letter that speaks directly to the hiring manager's needs. Whether you need a formal tone for a corporate role or something more witty for a creative position, we've got you covered."
        features={[
          "AI-Powered Writing: Generate professional content tailored to your specific role and company.",
          "Customizable Tones: Choose between Formal and Witty to match the company's culture.",
          "Live Editor: Refine and edit the AI-generated content directly in your browser.",
          "PDF Export: Download your finished cover letter as a print-ready PDF file.",
          "Smart Highlights: Focus on your top 3 achievements to maximize impact.",
          "Fast & Free: Create as many variations as you need without any cost or sign-up."
        ]}
        steps={[
          "Enter your target role and the company you are applying to.",
          "Summarize your core highlights or achievements in the text box.",
          "Choose your preferred tone (Formal/Formal vs Witty/Enthusiastic).",
          "Click 'Generate Letter' to watch the AI draft your unique letter.",
          "Edit the result if needed and export it as a professional PDF."
        ]}
        benefits={[
          "Save hours of writer's block.",
          "Tailor every application with minimal effort.",
          "Mirror the company's culture with different tones.",
          "Maintain consistent professional formatting.",
          "Impress recruiters with high-quality writing."
        ]}
        faq={[
          { q: "Is the AI cover letter unique?", a: "Yes, our generator uses advanced AI to create unique content every time based on the specific role, company, and experience you provide." },
          { q: "Can I edit the generated letter?", a: "Absolutely. You can click the 'Edit' icon in the preview panel to manually adjust the text before saving or exporting." },
          { q: "How many letters can I generate?", a: "There is no limit on how many cover letters you can generate. Use it for every job application to maximize your chances!" },
          { q: "Is it free to download the PDF?", a: "Yes, the AI generation and the PDF export features are both completely free to use." },
          { q: "Does the AI protect my privacy?", a: "Your input data is processed in real-time to generate your letter and is not permanently stored on our servers." }
        ]}
        ctaTitle="Persuade your next employer."
      />
    </div>
  );
}

function InputGroup({ label, value, onChange, icon: Icon, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-1 ml-1 flex items-center gap-2">
        <Icon size={12} className="text-text-secondary" /> {label}
      </label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-hover border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-white"
      />
    </div>
  );
}

function ToneButton({ active, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all",
        active 
          ? "bg-surface text-white border-accent shadow-lg" 
          : "bg-hover text-text-secondary border-border hover:border-accent/50"
      )}
    >
      {label}
    </button>
  );
}
