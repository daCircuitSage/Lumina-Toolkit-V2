import React, { useState, useRef, useLayoutEffect } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { 
  Plus, 
  Trash2, 
  Download, 
  Save, 
  User, 
  Briefcase, 
  Wrench, 
  Eye,
  Edit3,
  Loader2,
  Layout,
  Palette,
  ChevronUp,
  ChevronDown,
  Camera,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { analyticsEvents } from '../lib/analytics';

type TemplateId = 'modern' | 'ats' | 'minimal' | 'creative' | 'corporate' | 'elegant' | 'techno' | 'executive' | 'designer' | 'hybrid';

interface SectionConfig {
  id: string;
  name: string;
  visible: boolean;
  order: number;
}

interface ResumeData {
  settings: {
    primaryColor: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    margins: number;
  };
  sections: SectionConfig[];
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
    photo?: string;
  };
  experience: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    period: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    link: string;
    description: string;
    image?: string;
  }>;
  skills: string[];
}

const INITIAL_DATA: ResumeData = {
  settings: {
    primaryColor: '#6366f1',
    fontFamily: 'font-sans',
    fontSize: 1,
    lineHeight: 1.5,
    margins: 40,
  },
  sections: [
    { id: 'personal', name: 'Identity', visible: true, order: 0 },
    { id: 'summary', name: 'Profile', visible: true, order: 1 },
    { id: 'experience', name: 'Experience', visible: true, order: 2 },
    { id: 'projects', name: 'Projects', visible: true, order: 3 },
    { id: 'education', name: 'Education', visible: true, order: 4 },
    { id: 'skills', name: 'Skills', visible: true, order: 5 },
  ],
  personal: {
    fullName: 'Alex River',
    email: 'alex@example.com',
    phone: '+1 234 567 890',
    location: 'San Francisco, CA',
    website: 'alexriver.design',
    summary: 'Creative problem solver with 5 years of experience building digital products. Specialized in crafting visual identities and interactive experiences.',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop'
  },
  experience: [
    {
      id: '1',
      role: 'Senior Product Designer',
      company: 'TechFlow',
      period: '2021 - Present',
      description: 'Led the design of a new mobile app that reached 1M+ downloads. Developed design systems and improved user retention by 25%.'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'Lumina Dashboard',
      link: 'lumina.io',
      description: 'A comprehensive analytics suite for SaaS startups, focusing on real-time data visualization.',
      image: 'https://images.unsplash.com/photo-1551288049-bbda48658a7d?w=800&q=80'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. in Computer Science',
      school: 'Stanford University',
      period: '2016 - 2020'
    }
  ],
  skills: ['React', 'TypeScript', 'UI/UX Design', 'Figma', 'Node.js', 'AWS', 'Python']
};

export default function ResumeBuilder() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal', 'experience', 'education', 'projects', 'skills']));
  const [showTemplatesPanel, setShowTemplatesPanel] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user has seen onboarding before
  useLayoutEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('resume_onboarding_complete');
    if (hasSeenOnboarding) {
      setShowOnboarding(false);
    }
  }, []);

  const onboardingSteps = [
    {
      title: "Welcome to Resume Builder",
      description: "Create professional resumes in minutes with our intuitive editor. Let's walk you through the basics.",
      action: "Start Building"
    },
    {
      title: "Add Your Information",
      description: "Fill in your personal details, work experience, education, and skills. Use the Content tab to get started.",
      action: "Got it"
    },
    {
      title: "Choose Your Style",
      description: "Pick from 10 professional templates and customize colors, fonts, and layout in the Design tab.",
      action: "Continue"
    },
    {
      title: "Preview & Export",
      description: "See your resume in real-time and export as PDF when you're ready.",
      action: "Start Creating"
    }
  ];

  // Dynamic Scaling Engine
  useLayoutEffect(() => {
    const updateScale = () => {
      if (!previewContainerRef.current) return;
      
      const containerWidth = previewContainerRef.current.offsetWidth;
      const containerHeight = previewContainerRef.current.offsetHeight;
      const isMobile = window.innerWidth < 768;
      
      const horizontalPadding = isMobile ? 16 : 32;
      const verticalPadding = isMobile ? 16 : 32;
      const availableWidth = containerWidth - horizontalPadding;
      const availableHeight = containerHeight - verticalPadding;
      
      const resumeA4Width = 794;
      const resumeA4Height = 1123;
      
      let newScale = Math.min(
        availableWidth / resumeA4Width,
        availableHeight / resumeA4Height
      );
      
      if (newScale > 1.2) newScale = 1.2;
      if (newScale < 0.25) newScale = 0.25;
      
      setScale(newScale);
    };

    updateScale();
    const timer = setTimeout(updateScale, 150);
    
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      clearTimeout(timer);
    };
  }, [selectedTemplate]);

  // Auto-save functionality
  useLayoutEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem('resume_draft', JSON.stringify(data));
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [data]);

  // Load draft on mount
  useLayoutEffect(() => {
    const savedDraft = localStorage.getItem('resume_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setData(prev => ({
          ...INITIAL_DATA,
          ...parsed,
          settings: { ...INITIAL_DATA.settings, ...parsed.settings },
          personal: { ...INITIAL_DATA.personal, ...parsed.personal },
          sections: parsed.sections || INITIAL_DATA.sections,
          experience: parsed.experience || INITIAL_DATA.experience,
          education: parsed.education || INITIAL_DATA.education,
          projects: parsed.projects || INITIAL_DATA.projects,
          skills: parsed.skills || INITIAL_DATA.skills,
        }));
      } catch (e) {
        console.error('Failed to load draft:', e);
      }
    }
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem('resume_draft', JSON.stringify(data));
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
    toast.textContent = 'Draft saved successfully!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleExportPdf = async () => {
    if (!componentRef.current || isExporting) return;
    
    setIsExporting(true);
    
    try {
      const progressToast = document.createElement('div');
      progressToast.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      progressToast.innerHTML = '<div class="flex items-center gap-2"><div class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>Generating PDF...</div>';
      document.body.appendChild(progressToast);
      
      const dataUrl = await toPng(componentRef.current, {
        quality: 1.0,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        skipAutoScale: true,
        cacheBust: true,
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `${data.personal.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_resume_${timestamp}.pdf`;
      pdf.save(filename);
      
      progressToast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      progressToast.innerHTML = '<div class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>PDF exported successfully!</div>';
      
      setTimeout(() => progressToast.remove(), 3000);
      analyticsEvents.resumePdfDownloaded(selectedTemplate);
    } catch (error) {
      console.error('PDF Export Error:', error);
      const errorToast = document.createElement('div');
      errorToast.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorToast.innerHTML = '<div class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>Failed to generate PDF. Please try again.</div>';
      document.body.appendChild(errorToast);
      setTimeout(() => errorToast.remove(), 5000);
    } finally {
      setIsExporting(false);
    }
  };

  // State Update Helpers
  const updateSettings = (field: keyof typeof data.settings, value: any) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }));
  };

  const updatePersonal = (field: keyof typeof data.personal, value: string) => {
    setData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonal('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now().toString(), role: '', company: '', period: '', description: '' }]
    }));
  };

  const removeExperience = (id: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now().toString(), degree: '', school: '', period: '' }]
    }));
  };

  const removeEducation = (id: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      education: prev.education.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const addSkill = (skill: string) => {
    if (!skill || data.skills.includes(skill)) return;
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, skill]
    }));
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const templates: { id: TemplateId, name: string, description: string }[] = [
    { id: 'modern', name: 'Modern', description: 'Clean, bold, and high-impact design.' },
    { id: 'ats', name: 'ATS Friendly', description: 'Simple, readable, and parser-optimized.' },
    { id: 'minimal', name: 'Minimal', description: 'Ultra-clean with focus on typography.' },
    { id: 'creative', name: 'Creative', description: 'Distinctive accents for designers and artists.' },
    { id: 'corporate', name: 'Corporate', description: 'Traditional, serif-driven, and authoritative.' },
    { id: 'elegant', name: 'Elegant', description: 'Sophisticated layout with centered headers.' },
    { id: 'techno', name: 'Techno', description: 'Cyber-inspired design for developers.' },
    { id: 'executive', name: 'Executive', description: 'Premium feel for high-level individuals.' },
    { id: 'designer', name: 'Designer', description: 'Perfect for showcasing portfolio work.' },
    { id: 'hybrid', name: 'Hybrid', description: 'Best of both modern and classic styles.' }
  ];

  const handleOnboardingNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowOnboarding(false);
      localStorage.setItem('resume_onboarding_complete', 'true');
      setActiveTab('content');
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('resume_onboarding_complete', 'true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
      {/* Sticky Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex gap-2">
            {[
              { id: 'content', label: 'Content', icon: Edit3 },
              { id: 'design', label: 'Design', icon: Palette },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {/* Templates Button */}
            <button
              onClick={() => setShowTemplatesPanel(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            >
              <Layout size={16} />
              Templates
            </button>
            
            {/* Mobile Preview Toggle */}
            <button
              onClick={() => setShowMobilePreview(!showMobilePreview)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all"
            >
              <Eye size={16} />
              {showMobilePreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - 2-Column Layout */}
      <div className="flex flex-col lg:flex-row flex-1">
        {/* Editor Panel */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === 'content' && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Content Builder</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Build your resume section by section</p>
                    
                    <div className="space-y-8">
                      <Section 
                        icon={User} 
                        title="Identity" 
                        sectionId="personal"
                        isExpanded={expandedSections.has('personal')}
                        onToggle={toggleSectionExpanded}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input label="Full Name" value={data.personal.fullName} onChange={(v: string) => updatePersonal('fullName', v)} />
                          <Input label="Email Address" value={data.personal.email} onChange={(v: string) => updatePersonal('email', v)} />
                          <Input label="Phone Number" value={data.personal.phone} onChange={(v: string) => updatePersonal('phone', v)} />
                          <Input label="Location" value={data.personal.location} onChange={(v: string) => updatePersonal('location', v)} />
                        </div>
                        <Textarea 
                          label="Professional Bio" 
                          value={data.personal.summary} 
                          onChange={(v: string) => updatePersonal('summary', v)} 
                          rows={4}
                          className="mt-4"
                        />
                      </Section>

                      <Section 
                        icon={Briefcase} 
                        title="Experience" 
                        sectionId="experience"
                        isExpanded={expandedSections.has('experience')}
                        onToggle={toggleSectionExpanded}
                        action={
                          <button onClick={addExperience} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all">
                            <Plus size={16} className="inline mr-2" /> Add Position
                          </button>
                        }
                      >
                        <div className="space-y-4">
                          {(data.experience || []).map((exp) => (
                            <div key={exp.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <Input label="Role" value={exp.role} onChange={(v: string) => updateExperience(exp.id, 'role', v)} />
                                </div>
                                <button onClick={() => removeExperience(exp.id)} className="ml-4 p-2 text-slate-400 hover:text-red-500 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <Input label="Company" value={exp.company} onChange={(v: string) => updateExperience(exp.id, 'company', v)} />
                              <Input label="Period" value={exp.period} onChange={(v: string) => updateExperience(exp.id, 'period', v)} />
                              <Textarea label="Description" value={exp.description} onChange={(v: string) => updateExperience(exp.id, 'description', v)} rows={3} />
                            </div>
                          ))}
                        </div>
                      </Section>

                      <Section 
                        icon={BookOpen} 
                        title="Education" 
                        sectionId="education"
                        isExpanded={expandedSections.has('education')}
                        onToggle={toggleSectionExpanded}
                        action={
                          <button onClick={addEducation} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all">
                            <Plus size={16} className="inline mr-2" /> Add School
                          </button>
                        }
                      >
                        <div className="space-y-4">
                          {(data.education || []).map((edu) => (
                            <div key={edu.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <Input label="Degree" value={edu.degree} onChange={(v: string) => updateEducation(edu.id, 'degree', v)} />
                                </div>
                                <button onClick={() => removeEducation(edu.id)} className="ml-4 p-2 text-slate-400 hover:text-red-500 transition-colors">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <Input label="Institution" value={edu.school} onChange={(v: string) => updateEducation(edu.id, 'school', v)} />
                              <Input label="Period" value={edu.period} onChange={(v: string) => updateEducation(edu.id, 'period', v)} />
                            </div>
                          ))}
                        </div>
                      </Section>

                      <Section 
                        icon={Wrench} 
                        title="Skills"
                        sectionId="skills"
                        isExpanded={expandedSections.has('skills')}
                        onToggle={toggleSectionExpanded}
                      >
                        <div className="flex flex-wrap gap-2">
                          {(data.skills || []).map((skill, i) => (
                            <span key={i} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium border border-slate-200/50 dark:border-slate-700/50 flex items-center gap-2">
                              {skill}
                              <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                          <input 
                            type="text"
                            placeholder="Add skill..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addSkill(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            className="px-4 py-2 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 focus:text-slate-900 focus:border-indigo-500 transition-all bg-transparent focus:outline-none"
                          />
                        </div>
                      </Section>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'design' && (
                <motion.div
                  key="design"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-lg">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Design Customization</h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">Fine-tune your resume's appearance</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Primary Color</label>
                        <div className="flex gap-3">
                          {['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6'].map((color) => (
                            <button
                              key={color}
                              onClick={() => updateSettings('primaryColor', color)}
                              className={cn(
                                "w-10 h-10 rounded-full transition-all ring-offset-2",
                                data.settings.primaryColor === color ? "ring-2 ring-indigo-500 scale-110" : "hover:scale-105"
                              )}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Typography</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['font-sans', 'font-serif', 'font-mono'].map((font) => (
                            <button
                              key={font}
                              onClick={() => updateSettings('fontFamily', font)}
                              className={cn(
                                "p-3 text-left rounded-xl border transition-all",
                                data.settings.fontFamily === font ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                              )}
                            >
                              <span className={cn("block font-medium mb-1", font)}>
                                {font === 'font-sans' ? 'Inter' : font === 'font-serif' ? 'Merriweather' : 'JetBrains Mono'}
                              </span>
                              <span className="text-xs text-slate-500">
                                {font === 'font-sans' ? 'Modern' : font === 'font-serif' ? 'Classic' : 'Technical'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Preview Panel - Desktop only, Mobile toggleable */}
        <div className={cn(
          "hidden lg:block w-[400px] xl:w-[500px] bg-slate-50/50 dark:bg-slate-900/50 border-l border-slate-200/50 dark:border-slate-800/50",
          showMobilePreview && "lg:hidden block w-full"
        )}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Preview</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleSaveDraft}
                  className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  title="Save Draft"
                >
                  <Save size={16} />
                </button>
                <button 
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
                  title="Export PDF"
                >
                  {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                </button>
              </div>
            </div>
            
            <div 
              ref={previewContainerRef}
              className="flex-1 overflow-auto flex items-start justify-center"
            >
              <div 
                style={{ 
                  width: '210mm',
                  height: '297mm',
                  aspectRatio: '210/297', // Standard A4 ratio
                  transform: `scale(${scale})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}
                className="bg-white shadow-2xl overflow-hidden rounded-lg border border-slate-200/50"
              >
                <div ref={componentRef} className="bg-white h-full" style={{ aspectRatio: '210/297' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTemplate}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <ModernTemplate data={data} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplatesPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowTemplatesPanel(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Choose Template</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Select a professional template for your resume</p>
                  </div>
                  <button
                    onClick={() => setShowTemplatesPanel(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setShowTemplatesPanel(false);
                        analyticsEvents.resumeTemplateSelected(template.name);
                      }}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-left",
                        selectedTemplate === template.id
                          ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700"
                          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700"
                      )}
                    >
                      <div className="w-full h-20 mb-3 rounded-lg overflow-hidden bg-gradient-to-br">
                        <div className={cn(
                          "w-full h-full flex items-center justify-center text-white font-bold",
                          template.id === 'modern' && "from-indigo-500 to-purple-600",
                          template.id === 'ats' && "from-slate-600 to-slate-800",
                          template.id === 'minimal' && "from-gray-100 to-gray-200",
                          template.id === 'creative' && "from-pink-500 to-orange-400",
                          template.id === 'corporate' && "from-slate-700 to-slate-900",
                          template.id === 'elegant' && "from-amber-100 to-amber-200",
                          template.id === 'techno' && "from-emerald-500 to-teal-600",
                          template.id === 'executive' && "from-blue-900 to-indigo-900",
                          template.id === 'designer' && "from-purple-600 to-pink-600",
                          template.id === 'hybrid' && "from-blue-500 to-teal-500"
                        )}>
                          {template.name}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-white">{template.name}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{template.description}</div>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="mt-2 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Selected
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Onboarding Overlay */}
      {showOnboarding && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {currentStep + 1}
                  </div>
                  <div className="flex gap-1">
                    {onboardingSteps.map((_, index) => (
                      <div 
                        key={index} 
                        className={cn(
                          "w-8 h-1 rounded-full transition-all",
                          index <= currentStep ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <button 
                  onClick={handleOnboardingSkip}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium"
                >
                  Skip
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {onboardingSteps[currentStep].title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {onboardingSteps[currentStep].description}
              </p>
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  Back
                </button>
              )}
              <button 
                onClick={handleOnboardingNext}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all"
              >
                {onboardingSteps[currentStep].action}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// --- Resume Templates ---

function ModernTemplate({ data }: { data: ResumeData }) {
  const primaryColor = data.settings?.primaryColor || '#6366f1';
  const sortedSections = [...(data.sections || [])].sort((a, b) => a.order - b.order);

  return (
    <div className={cn("text-slate-800 bg-white h-full flex flex-col", data.settings.fontFamily)} style={{ padding: `${data.settings.margins}px`, lineHeight: data.settings.lineHeight }}>
      <header className="flex items-center gap-10 mb-10 pb-10 border-b-4" style={{ borderColor: primaryColor }}>
        {data.personal.photo && (
          <img src={data.personal.photo} className="w-32 h-32 rounded-3xl object-cover transition-all shadow-xl" alt="Profile" />
        )}
        <div className="flex-1">
          <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-slate-900 leading-none">{data.personal.fullName || 'Full Name'}</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
            <span className="flex items-center gap-2"><Mail size={12} style={{ color: primaryColor }} /> {data.personal.email}</span>
            <span className="flex items-center gap-2"><Phone size={12} style={{ color: primaryColor }} /> {data.personal.phone}</span>
            <span className="flex items-center gap-2"><MapPin size={12} style={{ color: primaryColor }} /> {data.personal.location}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-12 flex-1">
        <div className="col-span-8 space-y-10">
          {sortedSections.map(section => {
            if (!section.visible) return null;
            
            switch (section.id) {
              case 'summary':
                return (
                  <div key={section.id}>
                    <h3 className="text-xs font-black uppercase tracking-[4px] mb-4" style={{ color: primaryColor }}>Professional Story</h3>
                    <p className="text-sm leading-relaxed text-slate-600 italic whitespace-pre-wrap">{data.personal.summary}</p>
                  </div>
                );
              case 'experience':
                return (
                  <div key={section.id}>
                    <h3 className="text-xs font-black uppercase tracking-[4px] mb-6" style={{ color: primaryColor }}>Experience</h3>
                    <div className="space-y-8">
                      {data.experience.map(exp => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-black text-xl text-slate-900">{exp.role}</h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.period}</span>
                          </div>
                          <div className="text-xs font-black mb-3 uppercase tracking-widest" style={{ color: primaryColor }}>{exp.company}</div>
                          <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case 'education':
                return (
                  <div key={section.id}>
                    <h3 className="text-xs font-black uppercase tracking-[4px] mb-6" style={{ color: primaryColor }}>Education</h3>
                    <div className="space-y-4">
                      {data.education.map(edu => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-baseline">
                            <h4 className="font-black text-sm text-slate-900">{edu.degree}</h4>
                            <span className="text-[10px] font-black text-slate-400">{edu.period}</span>
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{edu.school}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              default: return null;
            }
          })}
        </div>
        
        <div className="col-span-4 border-l border-slate-100 pl-8 space-y-10">
           {data.sections.find(s => s.id === 'skills')?.visible && (
             <div>
               <h3 className="text-xs font-black uppercase tracking-[4px] mb-6" style={{ color: primaryColor }}>Expertise</h3>
               <div className="flex flex-wrap gap-2">
                 {data.skills.map((s, i) => (
                   <span key={i} className="text-[9px] font-black uppercase tracking-[1px] px-2 py-1 bg-slate-900 text-white rounded">
                     {s}
                   </span>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

// Component helpers
function Section({ icon: Icon, title, children, action, sectionId, isExpanded, onToggle }: any) {
  return (
    <div className="mb-12">
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 cursor-pointer group"
        onClick={() => sectionId && onToggle && onToggle(sectionId)}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-indigo-600 ring-4 ring-indigo-500/5 transition-all group-hover:scale-105 group-hover:shadow-md">
            <Icon size={20} />
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest">{title}</h2>
            <div className="transition-transform duration-200">
              {isExpanded ? (
                <ChevronUp size={16} className="text-slate-400 group-hover:text-indigo-500" />
              ) : (
                <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-500" />
              )}
            </div>
          </div>
        </div>
        {action && (
          <div className="w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="space-y-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-slate-700"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, rows }: any) {
  return (
    <div className="space-y-3 w-full mt-2">
      <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">{label}</label>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none text-slate-900 dark:text-white leading-relaxed hover:border-slate-300 dark:hover:border-slate-700"
      />
    </div>
  );
}
