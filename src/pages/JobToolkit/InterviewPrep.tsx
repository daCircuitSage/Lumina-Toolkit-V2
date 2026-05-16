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
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-lg text-xs font-semibold mb-4"
        >
          <BrainCircuit size={14} />
          AI-Powered Interview Coaching
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
          Master Your Interview with AI Battle Drills
        </h1>
        <p className="text-lg text-text-secondary mb-8 max-w-2xl">
          Practice personalized interview questions tailored to your role. Get expert coaching for technical, behavioral, and general screening scenarios.
        </p>

        <div className="flex flex-col gap-4 max-w-2xl">
           <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
             <input 
              type="text" 
              placeholder="e.g. Senior Frontend Engineer"
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full pl-12 pr-5 py-4 bg-surface border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-secondary"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
             
             {/* Search suggestions dropdown */}
             {showSuggestions && getSearchSuggestions.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                 <div className="p-2">
                   <p className="text-xs font-medium text-text-secondary px-3 py-2">Did you mean:</p>
                   {getSearchSuggestions.slice(0, 5).map((suggestion, index) => (
                     <button
                       key={index}
                       onClick={() => {
                         setRole(suggestion.title);
                         setShowSuggestions(false);
                       }}
                       className="w-full text-left px-3 py-2 hover:bg-hover rounded-lg transition-colors"
                     >
                       <div className="text-sm font-medium text-white">{suggestion.title}</div>
                       <div className="text-xs text-text-secondary">{suggestion.description}</div>
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>
           
           <button 
            onClick={handleGenerate}
            disabled={isGenerating || !role.trim()}
            className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-xl text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl min-h-[52px]"
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
                className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-center p-8 bg-surface border-2 border-dashed border-border rounded-3xl"
               >
                 {isGenerating ? (
                   <div className="space-y-6">
                      <div className="flex items-center justify-center gap-1.5">
                        {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                      </div>
                      <h2 className="text-sm font-black text-text-secondary uppercase tracking-widest">Generating Questions...</h2>
                      <p className="text-xs text-text-secondary max-w-md">Creating personalized interview questions for your role</p>
                   </div>
                 ) : (
                   <>
                    <BrainCircuit size={48} className="text-text-secondary mb-4" />
                    <h2 className="text-sm font-black text-text-secondary uppercase tracking-widest">Ready to Start</h2>
                    <p className="text-xs text-text-secondary mt-2 max-w-md">Enter your target role to generate personalized interview questions</p>
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
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                   <input
                     type="text"
                     placeholder={`Search ${activeTab} questions...`}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-10 py-3 bg-hover border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all placeholder:text-text-secondary"
                   />
                   {searchQuery && (
                     <button
                       onClick={clearSearch}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
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
                       <Filter className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                       <h3 className="text-sm font-medium text-text-secondary mb-2">No questions found</h3>
                       <p className="text-xs text-text-secondary">Try adjusting your search terms</p>
                     </div>
                   )}
                   
                   {filteredQuestions.length === 0 && !searchQuery && (
                     <div className="text-center py-12">
                       <HelpCircle className="w-12 h-12 text-text-secondary mx-auto mb-4" />
                       <h3 className="text-sm font-medium text-text-secondary mb-2">No {activeTab} questions</h3>
                       <p className="text-xs text-text-secondary">Try selecting another category</p>
                     </div>
                   )}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>

      <SeoContent 
        title="AI Interview Preparation Tool – Practice Job Interview Questions Free"
        description="Prepare for your next job interview with our free AI Interview Preparation tool. Practice common interview questions, improve behavioral answers using the STAR method, and get role-specific mock interview coaching from an intelligent AI interviewer."
        features={[
    "AI Interviewer: Practice realistic mock interviews with an intelligent AI interview helper.",
    
    "Role-Specific Interview Preparation: Generate customized interview questions for any profession or job title.",

    "Common Interview Questions: Practice frequently asked HR, behavioral, and technical interview questions.",

    "Behavioral Interview Coaching: Improve your answers using the proven STAR interview method.",

    "Technical Interview Practice: Prepare for coding, product, marketing, and role-specific technical interviews.",

    "AI-Powered Answer Strategies: Get professional sample answers and interview guidance instantly.",

    "Unlimited Mock Interview Sessions: Practice as many interview preparation rounds as needed.",

    "Confidence Building: Reduce anxiety and improve communication before your real job interview."
  ]}
        steps={[
          "Enter the job title or role you are preparing for, such as Software Engineer, Product Manager, or Graphic Designer.",

        "Click the 'Generate Interview Questions' button to start your AI interview preparation session.",

        "Practice common interview questions across technical, behavioral, and HR interview categories.",

        "Review AI-generated answer strategies and improve your interview communication skills.",

        "Use the STAR method examples to create stronger behavioral interview answers.",

        "Repeat mock interview practice sessions until you feel confident for your real interview."
        ]}
        benefits={[
          "Improve job interview confidence with realistic AI interview simulations.",

  "Practice common interview questions before technical and HR interviews.",

  "Learn how to prepare for an interview more effectively using AI guidance.",

  "Strengthen behavioral interview answers using the STAR response framework.",

  "Reduce interview anxiety through repeated mock interview preparation.",

  "Get free interview preparation support without hiring expensive career coaches.",

  "Prepare for interviews in tech, business, marketing, design, and other industries."
        ]}
        faq={[
  {
    q: "How does the AI interviewer generate interview questions?",
    a: "Our AI interviewer analyzes real-world job interview datasets, hiring trends, and industry-specific job descriptions to generate relevant interview preparation questions."
  },

  {
    q: "Can I practice common job interview questions with this tool?",
    a: "Yes. The tool helps you practice common interview questions, including HR, technical, behavioral, and situational interview questions."
  },

  {
    q: "How can I prepare for an interview using AI?",
    a: "You can use our AI interview preparation tool to simulate mock interviews, improve your answers, and practice communication before your actual job interview."
  },

  {
    q: "What is the STAR method in interview preparation?",
    a: "The STAR method stands for Situation, Task, Action, and Result. It helps job seekers structure behavioral interview answers clearly and professionally."
  },

  {
    q: "Is this AI interview helper free to use?",
    a: "Yes. Our AI interview helper allows users to practice interview preparation sessions for free online."
  },

  {
    q: "Can I use this tool for technical interview preparation?",
    a: "Absolutely. The AI can generate technical interview questions for software engineering, data science, marketing, product management, and many other roles."
  },

  {
    q: "Does this tool support mock interview practice?",
    a: "Yes. You can use the AI interviewer to simulate mock interviews and improve your confidence before real job interviews."
  }
]}
        ctaTitle="Practice smarter. Ace your next interview."
      />
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, title, desc, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex lg:flex items-center gap-3 p-4 md:p-6 rounded-2xl border-2 transition-all text-left relative",
        active 
          ? "bg-surface border-accent shadow-xl shadow-accent/20 scale-[1.02]" 
          : "bg-hover border-transparent hover:border-border"
      )}
    >
      <div className={cn(
        "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0",
        active ? "bg-accent text-white" : "bg-surface text-text-secondary"
      )}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className={cn("text-[11px] md:text-sm font-black uppercase tracking-wider transition-colors truncate", active ? "text-white" : "text-text-secondary")}>{title}</h4>
        <p className="hidden xs:block text-[9px] md:text-[10px] font-bold text-text-secondary tracking-wide uppercase truncate">{desc}</p>
      </div>
      {count > 0 && (
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-black",
          active ? "bg-accent/20 text-accent" : "bg-surface text-text-secondary"
        )}>
          {count}
        </div>
      )}
    </button>
  );
}

function QaCard({ q, index, isExpanded, onToggle }: { q: QaItem; index: number; isExpanded: boolean; onToggle: () => void }) {
  return (
    <div className="bg-surface rounded-2xl border border-border overflow-hidden group hover:border-accent/50 transition-all shadow-sm">
      <button 
        onClick={onToggle}
        className="w-full flex items-start justify-between p-5 md:p-8 text-left gap-4"
      >
        <div className="flex gap-3 md:gap-4 items-start flex-1 min-w-0">
           <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center shrink-0 font-black text-[10px] md:text-xs mt-0.5">
             {q.type === 'technical' ? 'T' : q.type === 'behavioral' ? 'B' : 'G'}
           </div>
           <div className="flex-1 min-w-0">
             <h3 className="text-sm md:text-lg font-black text-white tracking-tight leading-tight mb-2">
               {q.question}
             </h3>
             <div className="flex items-center gap-2">
               <span className={cn(
                 "text-[8px] md:text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full",
                 q.type === 'technical' ? "bg-blue-500/20 text-blue-400" :
                 q.type === 'behavioral' ? "bg-emerald-500/20 text-emerald-400" :
                 "bg-purple-500/20 text-purple-400"
               )}>
                 {q.type}
               </span>
             </div>
           </div>
        </div>
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-text-secondary transition-all shrink-0 mt-1", isExpanded ? "rotate-90 bg-accent/20 text-accent" : "")}>
           <ChevronRight size={20} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gradient-to-b from-accent/10 to-transparent"
          >
            <div className="px-5 md:px-8 pb-6 md:pb-8 pt-2 ml-9 md:ml-12">
               <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-surface rounded-xl border border-accent/20 shadow-sm">
                  <div className="p-2 bg-accent/20 text-accent rounded-lg shrink-0">
                    <Trophy size={14} className="md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-accent mb-3">Strategy & Model Answer</h5>
                    <div className="text-xs md:text-sm font-medium text-text-secondary leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown 
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                          li: ({children}) => <li className="text-xs md:text-sm">{children}</li>,
                          h3: ({children}) => <h3 className="font-bold text-white mb-2">{children}</h3>,
                          h4: ({children}) => <h4 className="font-semibold text-white mb-1">{children}</h4>,
                          code: ({children}) => <code className="bg-hover px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          blockquote: ({children}) => <blockquote className="border-l-2 border-border pl-3 italic text-text-secondary">{children}</blockquote>
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
