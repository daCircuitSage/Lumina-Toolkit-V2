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
          className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-sm text-xs font-normal mb-4"
        >
          <Mail size={14} />
          AI-Powered Cover Letters
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-normal text-ink mb-4 max-w-3xl leading-tight">
          Generate Professional Cover Letters in Seconds
        </h1>
        <p className="text-lg text-body-mid mb-8 max-w-2xl">
          Create persuasive, tailored cover letters that highlight your strengths and match the company culture. AI-powered writing for any role or industry.
        </p>

      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
        <div className="lg:col-span-5 space-y-6">
           <div className="p-6 md:p-8 bg-canvas-card border border-hairline rounded-sm space-y-6">
              <InputGroup label="Target Role" value={formData.role} onChange={(v: string) => setFormData({...formData, role: v})} icon={Briefcase} placeholder="e.g. Product Manager" />
              <InputGroup label="Organization" value={formData.company} onChange={(v: string) => setFormData({...formData, company: v})} icon={Building} placeholder="e.g. Google" />
              
              <div className="space-y-2">
                <label className="text-[10px] font-normal text-body-mid uppercase tracking-widest px-1 ml-1">Core Highlights</label>
                <textarea 
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="Summarize your top 3 achievements..."
                  className="w-full h-24 md:h-32 px-5 md:px-6 py-4 bg-canvas border border-hairline rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-ink resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <ToneButton active={formData.tone === 'professional'} onClick={() => setFormData({...formData, tone: 'professional'})} label="Formal" />
                 <ToneButton active={formData.tone === 'enthusiastic'} onClick={() => setFormData({...formData, tone: 'enthusiastic'})} label="Witty" />
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !formData.role || !formData.company}
                className="w-full py-4 md:py-5 bg-white hover:bg-gray-100 text-black rounded-sm text-xs font-normal uppercase tracking-widest active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-h-[52px]"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isGenerating ? 'Drafting Genius...' : 'Generate Letter'}
              </button>
           </div>
        </div>

        <div className="lg:col-span-7">
           <div className="relative group">
              <div className="relative bg-canvas-card border border-hairline rounded-sm min-h-[400px] md:min-h-[600px] overflow-hidden flex flex-col">
                 <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-5 border-b border-hairline bg-canvas-soft">
                    <div className="flex items-center gap-1.5 md:gap-2">
                       <button onClick={() => setIsEditing(!isEditing)} className={cn("p-2 rounded-sm transition-all", isEditing ? "bg-white text-black" : "text-body-mid hover:text-ink hover:bg-canvas")}>
                         <Type size={18} />
                       </button>
                       {letter && (
                         <button onClick={copyToClipboard} className="p-2 text-body-mid hover:text-ink hover:bg-canvas rounded-sm transition-all">
                           {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                         </button>
                       )}
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="hidden sm:block text-[10px] font-normal uppercase tracking-widest text-body-mid">Intelligent Preview</div>
                       {letter && <div className="h-4 w-px bg-hairline mx-1"></div>}
                       {letter && (
                         <button 
                          onClick={handleExportPdf}
                          disabled={isExporting}
                          className="flex items-center gap-2 text-[10px] font-normal uppercase tracking-widest text-white hover:opacity-70 transition-all disabled:opacity-30"
                         >
                           {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={14} />}
                           <span className="hidden xs:inline">Save PDF</span>
                         </button>
                       )}
                    </div>
                 </div>

                 <div className="flex-1 p-6 md:p-10 font-serif leading-relaxed text-body-mid overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                       {!letter && !isGenerating && (
                         <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-20"
                         >
                            <FileText size={64} strokeWidth={1} className="mb-4" />
                            <h2 className="text-sm font-normal uppercase tracking-[4px]">Empty Draft</h2>
                            <p className="text-[10px] font-normal uppercase mt-2">Fill form to begin</p>
                         </motion.div>
                       )}
                       
                       {isGenerating && (
                         <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="space-y-6 animate-pulse"
                         >
                            <div className="h-4 bg-canvas-soft rounded-full w-24"></div>
                            <div className="space-y-3">
                              <div className="h-4 bg-canvas-soft rounded-full w-full"></div>
                              <div className="h-4 bg-canvas-soft rounded-full w-full"></div>
                              <div className="h-4 bg-canvas-soft rounded-full w-5/6"></div>
                            </div>
                            <div className="h-4 bg-canvas-soft rounded-full w-1/2"></div>
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

                 <div className="px-6 md:px-8 py-4 md:py-5 bg-canvas-soft border-t border-hairline flex items-center justify-between">
                    <div className="text-[9px] font-normal uppercase tracking-widest text-body-mid italic">Smart Resume Agent v1.0</div>
                    <div className="flex gap-4">
                       <span className="text-[9px] font-normal uppercase tracking-widest text-body-mid">{letter.split(/\s+/).length} Words</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <SeoContent 
        title="Free AI Cover Letter Generator: Land Your Dream Job"
        description="Create professional and personalized cover letters instantly with our free AI Cover Letter Generator. Whether you're applying for a tech, marketing, design, or business role, our AI writing assistant helps you generate tailored job application letters that match your target company and role. Customize tone, highlight achievements, edit content live, and export recruiter-ready PDF cover letters in seconds."
        features={[
  "Free AI Cover Letter Generator: Create personalized cover letters for any job application instantly.",

  "AI-Powered Writing Assistant: Generate professional and recruiter-friendly cover letters using advanced AI.",

  "Role-Specific Cover Letters: Tailor your letter based on your target role and company.",

  "Custom Writing Tones: Choose formal, professional, or creative writing styles.",

  "Live Cover Letter Editor: Edit and refine AI-generated content directly in your browser.",

  "PDF Export Support: Download ATS-friendly cover letters as professional PDF files.",

  "Achievement Highlighting: Showcase your top skills, accomplishments, and experience effectively.",

  "Unlimited Free Usage: Generate multiple cover letter variations without sign-up or payment."
]}
        steps={[
          "Enter your target job title and company name for personalized cover letter generation.",

  "Add your key achievements, skills, or work experience in the input field.",

  "Choose your preferred writing tone, such as formal, professional, or creative.",

  "Click the 'Generate Cover Letter' button to create your AI-powered letter instantly.",

  "Review and edit the generated cover letter using the live editor.",

  "Download your finished cover letter as a recruiter-ready PDF document."
]}
        benefits={[
  "Save time by generating professional cover letters in seconds.",

  "Improve job application quality with AI-powered writing assistance.",

  "Create customized cover letters for every job application.",

  "Reduce writer's block using intelligent AI content suggestions.",

  "Generate ATS-friendly cover letters that match recruiter expectations.",

  "Export polished PDF cover letters without expensive software.",

  "Increase interview opportunities with stronger job applications."
]}
        faq={[
  {
    q: "What is an AI cover letter generator?",
    a: "An AI cover letter generator is a tool that uses artificial intelligence to create personalized and professional cover letters for job applications."
  },

  {
    q: "Is this AI cover letter generator free?",
    a: "Yes. Our free AI cover letter generator allows users to create, edit, and export professional cover letters without any cost."
  },

  {
    q: "How does the AI generate cover letters?",
    a: "The AI analyzes your target role, company, experience, and achievements to create a tailored cover letter that matches the job description."
  },

  {
    q: "Can I customize the generated cover letter?",
    a: "Absolutely. You can edit the AI-generated content, adjust tone, and personalize the letter before downloading it."
  },

  {
    q: "Is this tool similar to Grammarly cover letter generator?",
    a: "Yes. Our AI-powered tool helps users generate professional cover letters similar to Grammarly cover letter generator, with customizable writing styles and PDF export support."
  },

  {
    q: "Can I download the cover letter as a PDF?",
    a: "Yes. You can export your finished cover letter as a professional PDF document for job applications."
  },

  {
    q: "Does the AI create ATS-friendly cover letters?",
    a: "Yes. Our generator creates clean and professional cover letters designed to work well with modern ATS recruiting systems."
  }
]}
        ctaTitle="Persuade your next employer."
      />
    </div>
  );
}

function InputGroup({ label, value, onChange, icon: Icon, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-normal text-body-mid uppercase tracking-widest px-1 ml-1 flex items-center gap-2">
        <Icon size={12} className="text-body-mid" /> {label}
      </label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-6 py-4 bg-canvas border border-hairline rounded-sm text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-ink"
      />
    </div>
  );
}

function ToneButton({ active, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-1 py-3 rounded-sm text-[10px] font-normal uppercase tracking-widest border transition-all",
        active 
          ? "bg-white text-black border-white" 
          : "bg-canvas text-body-mid border-hairline hover:border-white/30"
      )}
    >
      {label}
    </button>
  );
}
