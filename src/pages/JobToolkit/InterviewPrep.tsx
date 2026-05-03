import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  HelpCircle, 
  Lightbulb, 
  BrainCircuit, 
  Zap, 
  ChevronRight, 
  Loader2, 
  MessageSquare,
  Sparkles,
  RefreshCw,
  Search,
  Trophy,
  Filter,
  X
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Fuse from 'fuse.js';
import { cn } from '../../lib/utils';
import SeoContent from '../../components/SeoContent';

interface QaItem {
  question: string;
  answer: string;
  type: 'technical' | 'behavioral' | 'general';
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface SearchSuggestion {
  title: string;
  description: string;
  keywords: string[];
}

const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { title: "Frontend Developer", description: "React, Vue, Angular, CSS, JavaScript", keywords: ["frontend", "ui", "ux", "javascript", "react", "vue", "angular"] },
  { title: "Backend Developer", description: "Node.js, Python, Java, databases, APIs", keywords: ["backend", "server", "api", "database", "node", "python", "java"] },
  { title: "Full Stack Developer", description: "End-to-end development, system architecture", keywords: ["fullstack", "full stack", "mearn", "mean", "lamp"] },
  { title: "DevOps Engineer", description: "CI/CD, Docker, Kubernetes, cloud infrastructure", keywords: ["devops", "docker", "kubernetes", "aws", "azure", "gcp"] },
  { title: "Data Scientist", description: "Machine learning, statistics, data analysis", keywords: ["data", "science", "ml", "ai", "analytics", "python"] },
  { title: "Product Manager", description: "Product strategy, user research, roadmapping", keywords: ["product", "manager", "strategy", "roadmap", "agile"] },
  { title: "UI/UX Designer", description: "User interface, user experience, design systems", keywords: ["designer", "ui", "ux", "figma", "prototype"] },
  { title: "Software Engineer", description: "General software development, algorithms", keywords: ["software", "engineer", "developer", "programming", "coding"] }
];

export default function InterviewPrep() {
  const [role, setRole] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'technical' | 'behavioral' | 'general'>('technical');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerate = async () => {
    if (!role.trim()) return;
    setIsGenerating(true);
    setQuestions([]);
    setExpandedQuestions(new Set());

    const enhancedPrompt = `
You are an expert interview coach. Generate 9 diverse interview questions for the role: "${role}".

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 3 questions for each category: technical, behavioral, general
2. Each question MUST be properly categorized based on its content:
   - Technical: coding, algorithms, system design, architecture, tools, technologies
   - Behavioral: teamwork, leadership, conflict resolution, mentoring, project management
   - General: career goals, motivations, company fit, strengths/weaknesses
3. For each question, provide a concise, high-impact strategy or model answer
4. Format as valid JSON array with proper escaping

Output format (strict JSON):
[
  { "question": "...", "answer": "...", "type": "technical" },
  { "question": "...", "answer": "...", "type": "behavioral" },
  { "question": "...", "answer": "...", "type": "general" },
  ...
]

Do not include any markdown formatting, explanations, or additional text. Only the JSON array.`;

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription: enhancedPrompt,
          questionType: 'mixed'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate interview questions');
      }

      const data = await response.json();
      const questionsText = data.questions;
      
      // Try to parse as JSON first
      let parsedQuestions: QaItem[] = [];
      try {
        // Extract JSON from response if it contains extra text
        const jsonMatch = questionsText.match(/\[.*?\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : questionsText;
        parsedQuestions = JSON.parse(jsonString);
      } catch (jsonError) {
        // Fallback: parse line by line with better categorization
        const lines = questionsText.split('\n').filter((line: string) => line.trim());
        parsedQuestions = lines.map((line: string, index: number) => {
          const questionText = line.trim().replace(/^\d+\.\s*/, ''); // Remove numbering
          let type: 'technical' | 'behavioral' | 'general' = 'general';
          
          // Smart categorization based on keywords
          const technicalKeywords = ['code', 'algorithm', 'system', 'architecture', 'database', 'api', 'framework', 'language', 'programming', 'debug', 'optimize', 'scale', 'performance'];
          const behavioralKeywords = ['team', 'lead', 'conflict', 'manage', 'project', 'deadline', 'communicate', 'collaborate', 'mentor', 'feedback', 'challenge', 'failure', 'success'];
          
          const lowerQuestion = questionText.toLowerCase();
          if (technicalKeywords.some(keyword => lowerQuestion.includes(keyword))) {
            type = 'technical';
          } else if (behavioralKeywords.some(keyword => lowerQuestion.includes(keyword))) {
            type = 'behavioral';
          }
          
          return {
            question: questionText,
            answer: "Prepare a thoughtful response using the S.T.A.R. method (Situation, Task, Action, Result) for behavioral questions, and focus on technical depth for technical questions.",
            type
          };
        });
      }
      
      // Ensure we have exactly 3 questions per category
      const technicalQuestions = parsedQuestions.filter(q => q.type === 'technical').slice(0, 3);
      const behavioralQuestions = parsedQuestions.filter(q => q.type === 'behavioral').slice(0, 3);
      const generalQuestions = parsedQuestions.filter(q => q.type === 'general').slice(0, 3);
      
      // Fill missing categories if needed
      while (technicalQuestions.length < 3) {
        technicalQuestions.push({
          question: `Describe a technical challenge you've faced in your ${role} role.`,
          answer: "Focus on the technical complexity, your approach, and the outcome.",
          type: 'technical'
        });
      }
      
      while (behavioralQuestions.length < 3) {
        behavioralQuestions.push({
          question: "Describe a situation where you had to work with a difficult team member.",
          answer: "Use the S.T.A.R. method to explain how you handled the situation professionally.",
          type: 'behavioral'
        });
      }
      
      while (generalQuestions.length < 3) {
        generalQuestions.push({
          question: "Why are you interested in this position?",
          answer: "Connect your skills and career goals with the company's mission and role requirements.",
          type: 'general'
        });
      }
      
      setQuestions([...technicalQuestions, ...behavioralQuestions, ...generalQuestions]);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to reach the coaching engine. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Fuzzy search implementation
  const fuse = useMemo(() => {
    if (questions.length === 0) return null;
    return new Fuse(questions, {
      keys: ['question', 'answer'],
      threshold: 0.3, // Lower threshold = stricter matching
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 2
    });
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    let filtered = questions.filter(q => q.type === activeTab);
    
    // Apply fuzzy search if searchQuery exists
    if (searchQuery.trim() && fuse) {
      const searchResults = fuse.search(searchQuery);
      filtered = searchResults.map(result => result.item).filter(q => q.type === activeTab);
    }
    
    return filtered;
  }, [questions, activeTab, searchQuery, fuse]);

  // Typo correction suggestions
  const getSearchSuggestions = useMemo(() => {
    if (!role.trim()) return [];
    
    const fuse = new Fuse(SEARCH_SUGGESTIONS, {
      keys: ['keywords', 'title', 'description'],
      threshold: 0.4,
      includeScore: true
    });
    
    return fuse.search(role).map(result => result.item);
  }, [role]);

  const handleRoleChange = (value: string) => {
    setRole(value);
    setSearchQuery('');
  };

  const toggleQuestionExpansion = (index: number) => {
    setExpandedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
      <header className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 shrink-0 mx-auto md:mx-0">
            <BrainCircuit size={28} />
          </div>
          <div className="text-center md:text-left">
             <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Interview Preparation</h1>
             <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Master your narrative with AI battle drills.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
             <input 
              type="text" 
              placeholder="e.g. Senior Frontend Engineer"
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-12 pr-5 py-4 bg-white dark:bg-slate-900 rounded-xl md:rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
             
             {/* Search suggestions dropdown */}
             {showSuggestions && getSearchSuggestions.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                 <div className="p-2">
                   <p className="text-xs font-medium text-slate-500 dark:text-slate-400 px-3 py-2">Did you mean:</p>
                   {getSearchSuggestions.slice(0, 5).map((suggestion, index) => (
                     <button
                       key={index}
                       onClick={() => {
                         setRole(suggestion.title);
                         setShowSuggestions(false);
                       }}
                       className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                     >
                       <div className="text-sm font-medium text-slate-900 dark:text-white">{suggestion.title}</div>
                       <div className="text-xs text-slate-500 dark:text-slate-400">{suggestion.description}</div>
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>
           
           <button 
            onClick={handleGenerate}
            disabled={isGenerating || !role.trim()}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl md:rounded-2xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl min-h-[52px]"
           >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            {isGenerating ? 'Generating...' : 'Generate Drills'}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Category Tabs */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
           <TabButton 
            active={activeTab === 'technical'} 
            onClick={() => setActiveTab('technical')} 
            icon={Terminal} 
            title="Technical" 
            desc="Domain depth" 
            count={questions.filter(q => q.type === 'technical').length}
           />
           <TabButton 
            active={activeTab === 'behavioral'} 
            onClick={() => setActiveTab('behavioral')} 
            icon={MessageSquare} 
            title="Behavioral" 
            desc="S.T.A.R. method" 
            count={questions.filter(q => q.type === 'behavioral').length}
           />
           <TabButton 
            active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')} 
            icon={HelpCircle} 
            title="General" 
            desc="Screening questions" 
            count={questions.filter(q => q.type === 'general').length}
           />
        </div>

        {/* Questions Display */}
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
             {questions.length === 0 ? (
               <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                key="empty"
                className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl md:rounded-[40px]"
               >
                 {isGenerating ? (
                   <div className="space-y-6">
                      <div className="flex items-center justify-center gap-1.5">
                        {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                      </div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Generating Questions...</h3>
                      <p className="text-xs text-slate-500 max-w-md">Creating personalized interview questions for your role</p>
                   </div>
                 ) : (
                   <>
                    <BrainCircuit size={48} className="text-slate-200 dark:text-slate-800 mb-4" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Ready to Start</h3>
                    <p className="text-xs text-slate-500 mt-2 max-w-md">Enter your target role to generate personalized interview questions</p>
                   </>
                 )}
               </motion.div>
             ) : (
               <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                key="results"
                className="space-y-6"
               >
                 {/* Search Bar for Questions */}
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input
                     type="text"
                     placeholder={`Search ${activeTab} questions...`}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all border border-slate-200 dark:border-slate-700 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                   />
                   {searchQuery && (
                     <button
                       onClick={clearSearch}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                     >
                       <X size={16} />
                     </button>
                   )}
                 </div>
                 
                 {/* Questions List */}
                 <div className="space-y-4">
                   {filteredQuestions.map((q, i) => {
                     const globalIndex = questions.indexOf(q);
                     return (
                       <motion.div key={globalIndex} layout>
                         <QaCard 
                           q={q} 
                           index={globalIndex}
                           isExpanded={expandedQuestions.has(globalIndex)}
                           onToggle={() => toggleQuestionExpansion(globalIndex)}
                         />
                       </motion.div>
                     );
                   })}
                   
                   {filteredQuestions.length === 0 && searchQuery && (
                     <div className="text-center py-12">
                       <Filter className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                       <h3 className="text-sm font-medium text-slate-400 mb-2">No questions found</h3>
                       <p className="text-xs text-slate-500">Try adjusting your search terms</p>
                     </div>
                   )}
                   
                   {filteredQuestions.length === 0 && !searchQuery && (
                     <div className="text-center py-12">
                       <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                       <h3 className="text-sm font-medium text-slate-400 mb-2">No {activeTab} questions</h3>
                       <p className="text-xs text-slate-500">Try selecting another category</p>
                     </div>
                   )}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <SeoContent 
        title="AI Interview Preparation: Master Your Job Interviews"
        description="Walking into an interview can be intimidating, but preparation is your secret weapon. Our AI Interview Preparation tool acts as your personal career coach, generating high-impact 'battle drills' tailored to your specific role. By simulating real-world scenarios, our engine provides a balanced mix of Technical, Behavioral (S.T.A.R. method), and General screening questions. Each drill comes with a professional strategy and model answer, helping you refine your narrative and build the confidence needed to land your dream job at top-tier organizations."
        features={[
          "Role-Specific Simulation: Generate questions tailored to any job title, from Frontend Engineer to Product Manager.",
          "Tri-Category Drills: Get specialized practice in Technical domain depth, Behavioral soft skills, and General screening.",
          "S.T.A.R. Method Focus: Master the Situation, Task, Action, Result framework for behavioral questions.",
          "Professional Strategy: Every question includes a high-impact 'Model Answer' or coaching strategy.",
          "Intelligent AI Engine: Powered by advanced AI that understands industry-specific hiring standards.",
          "Unlimited Practice: Generate as many simulation rounds as you need to feel perfectly prepared."
        ]}
        steps={[
          "Enter the job title you are preparing for in the search bar (e.g., Senior Designer).",
          "Click 'Generate Drills' to start the AI coaching simulation.",
          "Use the category tabs to filter through Technical, Behavioral, and General questions.",
          "Click on any question to reveal the 'Strategy' and model answer panel.",
          "Practice your verbal delivery guided by the AI's professional strategies."
        ]}
        benefits={[
          "Reduce interview anxiety through repetitive simulation.",
          "Improve the structure and impact of your behavioral answers.",
          "Stay updated on modern technical interview trends.",
          "Refine your personal career narrative and unique value proposition.",
          "Free access to high-quality coaching without expensive consulting fees."
        ]}
        faq={[
          { q: "How does the AI know the right questions?", a: "Our AI is trained on thousands of real-world interview datasets and job descriptions to understand what hiring managers at elite companies are looking for." },
          { q: "What is the S.T.A.R. method?", a: "S.T.A.R. stands for Situation, Task, Action, and Result. It is the gold standard for answering behavioral interview questions effectively." },
          { q: "Is this tool specific to tech roles?", a: "While we have deep domain knowledge for tech, our AI is versatile and can generate relevant questions for any industry or professional role." },
          { q: "Can I use this for mock interviews?", a: "Absolutely. We recommend reading the questions aloud and recording your response, then comparing your answer to our AI's 'Strategy' section." },
          { q: "Is my personal data safe?", a: "We only use the job role you provide to generate questions in real-time. We do not store your practice sessions on our servers." }
        ]}
        ctaTitle="Master your next interview."
      />
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, title, desc, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex lg:flex items-center gap-3 p-4 md:p-6 rounded-2xl md:rounded-[28px] border-2 transition-all text-left relative",
        active 
          ? "bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-400 shadow-xl shadow-indigo-500/5 scale-[1.02]" 
          : "bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700"
      )}
    >
      <div className={cn(
        "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0",
        active ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-700 text-slate-400"
      )}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className={cn("text-[11px] md:text-sm font-black uppercase tracking-wider transition-colors truncate", active ? "text-slate-900 dark:text-white" : "text-slate-400")}>{title}</h4>
        <p className="hidden xs:block text-[9px] md:text-[10px] font-bold text-slate-400 tracking-wide uppercase truncate">{desc}</p>
      </div>
      {count > 0 && (
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black",
          active ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
        )}>
          {count}
        </div>
      )}
    </button>
  );
}

function QaCard({ q, index, isExpanded, onToggle }: { q: QaItem; index: number; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl md:rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden group hover:border-indigo-200 dark:hover:border-indigo-900 transition-all shadow-sm">
      <button 
        onClick={onToggle}
        className="w-full flex items-start justify-between p-5 md:p-8 text-left gap-4"
      >
        <div className="flex gap-3 md:gap-4 items-start flex-1 min-w-0">
           <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-black text-[10px] md:text-xs mt-0.5">
             {q.type === 'technical' ? 'T' : q.type === 'behavioral' ? 'B' : 'G'}
           </div>
           <div className="flex-1 min-w-0">
             <h3 className="text-sm md:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-2">
               {q.question}
             </h3>
             <div className="flex items-center gap-2">
               <span className={cn(
                 "text-[8px] md:text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full",
                 q.type === 'technical' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                 q.type === 'behavioral' ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" :
                 "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
               )}>
                 {q.type}
               </span>
             </div>
           </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-slate-300 transition-all shrink-0 mt-1", isExpanded ? "rotate-90 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500" : "")}>
           <ChevronRight size={20} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gradient-to-b from-indigo-50/10 to-transparent dark:from-indigo-900/5"
          >
            <div className="px-5 md:px-8 pb-6 md:pb-8 pt-2 ml-9 md:ml-12">
               <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-xl md:rounded-[24px] border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0">
                    <Trophy size={14} className="md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">Strategy & Model Answer</h5>
                    <div className="text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown 
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({children}) => <strong className="font-bold text-slate-700 dark:text-slate-300">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                          li: ({children}) => <li className="text-xs md:text-sm">{children}</li>,
                          h3: ({children}) => <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">{children}</h3>,
                          h4: ({children}) => <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">{children}</h4>,
                          code: ({children}) => <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          blockquote: ({children}) => <blockquote className="border-l-2 border-slate-300 dark:border-slate-600 pl-3 italic text-slate-600 dark:text-slate-400">{children}</blockquote>
                        }}
                      >
                        {q.answer}
                      </ReactMarkdown>
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
