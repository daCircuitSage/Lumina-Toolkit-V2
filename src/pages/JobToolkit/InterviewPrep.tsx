import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  X,
  Mic,
  MicOff,
  Clock,
  Star,
  Bookmark,
  Download,
  TrendingUp,
  Target,
  Flame,
  Award,
  Play,
  Pause,
  RotateCcw,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Fuse from 'fuse.js';
import { cn } from '../../lib/utils';
import SeoContent from '../../components/SeoContent';
import jsPDF from 'jspdf';

interface QaItem {
  question: string;
  answer: string;
  type: 'technical' | 'behavioral' | 'general';
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  userAnswer?: string;
  rating?: number;
  timeSpent?: number;
  isBookmarked?: boolean;
  isCompleted?: boolean;
}

interface SessionStats {
  totalQuestions: number;
  completed: number;
  averageRating: number;
  totalTime: number;
  streak: number;
  points: number;
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
  const [company, setCompany] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<QaItem[]>([]);
  const [activeTab, setActiveTab] = useState<'technical' | 'behavioral' | 'general'>('technical');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    completed: 0,
    averageRating: 0,
    totalTime: 0,
    streak: 0,
    points: 0
  });
  const [showStats, setShowStats] = useState(false);
  const [practiceMode, setPracticeMode] = useState<'standard' | 'timed' | 'voice'>('standard');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleGenerate = async () => {
    if (!role.trim()) return;
    setIsGenerating(true);
    setQuestions([]);
    setExpandedQuestions(new Set());

    const enhancedPrompt = `
You are an expert interview coach. Generate 9 diverse interview questions for the role: "${role}"${company ? ` at company: "${company}"` : ''}.

CRITICAL REQUIREMENTS:
1. Generate EXACTLY 3 questions for each category: technical, behavioral, general
2. Each question MUST be properly categorized based on its content:
   - Technical: coding, algorithms, system design, architecture, tools, technologies
   - Behavioral: teamwork, leadership, conflict resolution, mentoring, project management
   - General: career goals, motivations, company fit, strengths/weaknesses
3. Difficulty level: ${difficulty}
4. For each question, provide a concise, high-impact strategy or model answer
5. ${company ? `Tailor questions to ${company}'s culture, values, and interview style.` : ''}
6. Format as valid JSON array with proper escaping

Output format (strict JSON):
[
  { "question": "...", "answer": "...", "type": "technical", "difficulty": "${difficulty}" },
  { "question": "...", "answer": "...", "type": "behavioral", "difficulty": "${difficulty}" },
  { "question": "...", "answer": "...", "type": "general", "difficulty": "${difficulty}" },
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
      
      const finalQuestions = [...technicalQuestions, ...behavioralQuestions, ...generalQuestions].map(q => ({
        ...q,
        difficulty: difficulty,
        isBookmarked: false,
        isCompleted: false
      }));
      
      setQuestions(finalQuestions);
      setSessionStats({
        totalQuestions: finalQuestions.length,
        completed: 0,
        averageRating: 0,
        totalTime: 0,
        streak: parseInt(localStorage.getItem('interviewStreak') || '0'),
        points: parseInt(localStorage.getItem('interviewPoints') || '0')
      });
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

  const startRecording = async (index: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setQuestions(prev => prev.map((q, i) => 
          i === index ? { ...q, userAnswer: audioUrl } : q
        ));
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setCurrentQuestionIndex(index);
      setRecordingTime(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Please allow microphone access to use voice recording.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setCurrentQuestionIndex(null);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    }
  };

  const startTimer = () => {
    setShowTimer(true);
    setTimerSeconds(0);
    timerRef.current = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setShowTimer(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimerSeconds(0);
  };

  const toggleBookmark = (index: number) => {
    setQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, isBookmarked: !q.isBookmarked } : q
    ));
  };

  const rateAnswer = (index: number, rating: number) => {
    setQuestions(prev => {
      const updated = prev.map((q, i) => 
        i === index ? { ...q, rating, isCompleted: true } : q
      );
      
      const completed = updated.filter(q => q.isCompleted).length;
      const rated = updated.filter(q => q.rating !== undefined);
      const avgRating = rated.length > 0 
        ? rated.reduce((sum, q) => sum + (q.rating || 0), 0) / rated.length 
        : 0;
      
      const points = sessionStats.points + (rating * 10);
      localStorage.setItem('interviewPoints', points.toString());
      
      setSessionStats(prev => ({
        ...prev,
        completed,
        averageRating: avgRating,
        points
      }));
      
      return updated;
    });
  };

  const exportSession = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = doc.internal.pageSize.width - (margin * 2);

    // Header
    doc.setFontSize(24);
    doc.setTextColor(59, 130, 246);
    doc.text('Interview Preparation Session', margin, yPos);
    yPos += 15;

    // Session Info
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Role: ${role}`, margin, yPos);
    yPos += 7;
    if (company) {
      doc.text(`Company: ${company}`, margin, yPos);
      yPos += 7;
    }
    doc.text(`Difficulty: ${difficulty.toUpperCase()}`, margin, yPos);
    yPos += 7;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 15;

    // Session Statistics
    doc.setFillColor(243, 244, 246);
    doc.rect(margin, yPos, contentWidth, 25, 'F');
    yPos += 8;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Session Statistics', margin, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    const statsText = `Completed: ${sessionStats.completed}/${sessionStats.totalQuestions} | Average Rating: ${sessionStats.averageRating.toFixed(1)}/5 | Points: ${sessionStats.points} | Streak: ${sessionStats.streak} days`;
    doc.text(statsText, margin, yPos);
    yPos += 15;

    // Group questions by type
    const categories = ['technical', 'behavioral', 'general'] as const;
    
    categories.forEach((category) => {
      const categoryQuestions = questions.filter(q => q.type === category);
      
      if (categoryQuestions.length === 0) return;

      // Category Header
      if (yPos > pageHeight - 40) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFillColor(59, 130, 246);
      doc.rect(margin, yPos, contentWidth, 10, 'F');
      yPos += 7;
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text(`${category.charAt(0).toUpperCase() + category.slice(1)} Questions (${categoryQuestions.length})`, margin + 5, yPos);
      yPos += 10;

      // Questions
      categoryQuestions.forEach((q, index) => {
        if (yPos > pageHeight - 60) {
          doc.addPage();
          yPos = 20;
        }

        // Question number and type
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Q${index + 1}`, margin, yPos);
        yPos += 6;

        // Question text
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        const questionLines = doc.splitTextToSize(q.question, contentWidth - 10);
        doc.text(questionLines, margin, yPos);
        yPos += questionLines.length * 5 + 5;

        // Rating if available
        if (q.rating) {
          doc.setFontSize(9);
          doc.setTextColor(59, 130, 246);
          doc.text(`Your Rating: ${'★'.repeat(q.rating)}${'☆'.repeat(5 - q.rating)}`, margin, yPos);
          yPos += 5;
        }

        // Answer Strategy
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text('Strategy:', margin, yPos);
        yPos += 4;
        
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        const answerLines = doc.splitTextToSize(q.answer.replace(/[#*`]/g, ''), contentWidth - 10);
        doc.text(answerLines, margin, yPos);
        yPos += answerLines.length * 4 + 10;

        // Separator
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, margin + contentWidth, yPos);
        yPos += 8;
      });

      yPos += 5;
    });

    // Footer
    const pageCount = doc.internal.pages.length - 1;
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Generated by Lumina Toolkit - Page ${i} of ${pageCount}`, margin, pageHeight - 10);
    }

    // Save the PDF
    doc.save(`interview-prep-${role}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-sm text-xs font-normal mb-4"
        >
          <BrainCircuit size={14} />
          AI-Powered Interview Coaching
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-normal text-ink mb-4 max-w-3xl leading-tight">
          Master Your Interview with AI Battle Drills
        </h1>
        <p className="text-lg text-body-mid mb-8 max-w-2xl">
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
              className="w-full pl-12 pr-5 py-4 bg-canvas border border-hairline rounded-sm text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-body-mid"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
             />
             
             {/* Search suggestions dropdown */}
             {showSuggestions && getSearchSuggestions.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-hairline rounded-sm z-[9999] overflow-hidden shadow-xl">
                 <div className="p-2">
                   <p className="text-xs font-normal text-body-mid px-3 py-2">Did you mean:</p>
                   {getSearchSuggestions.slice(0, 5).map((suggestion, index) => (
                     <button
                       key={index}
                       onClick={() => {
                         setRole(suggestion.title);
                         setShowSuggestions(false);
                       }}
                       className="w-full text-left px-3 py-2 hover:bg-canvas-soft rounded-sm transition-colors cursor-pointer"
                     >
                       <div className="text-sm font-normal text-ink">{suggestion.title}</div>
                       <div className="text-xs text-body-mid">{suggestion.description}</div>
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>
           
           {/* Company Input */}
           <div className="relative group">
             <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
             <input 
              type="text" 
              placeholder="Company (optional, e.g. Google, Microsoft)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full pl-12 pr-5 py-4 bg-canvas border border-hairline rounded-sm text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-body-mid"
             />
           </div>
           
           {/* Difficulty Selector */}
           <div className="flex gap-2">
             {(['easy', 'medium', 'hard'] as const).map((level) => (
               <button
                 key={level}
                 onClick={() => setDifficulty(level)}
                 className={cn(
                   "flex-1 px-4 py-3 rounded-sm text-xs font-normal uppercase tracking-wider transition-all border cursor-pointer active:scale-95",
                   difficulty === level 
                     ? "bg-white text-black border-white" 
                     : "bg-canvas text-body-mid border-hairline hover:border-white/50 hover:bg-canvas-soft"
                 )}
               >
                 {level}
               </button>
             ))}
           </div>
           
           {/* Practice Mode Selector */}
           <div className="flex gap-2">
             {[
               { id: 'standard', icon: Target, label: 'Standard' },
               { id: 'timed', icon: Clock, label: 'Timed' },
               { id: 'voice', icon: Mic, label: 'Voice' }
             ].map((mode) => (
               <button
                 key={mode.id}
                 onClick={() => setPracticeMode(mode.id as any)}
                 className={cn(
                   "flex-1 px-4 py-3 rounded-sm text-xs font-normal uppercase tracking-wider transition-all border cursor-pointer active:scale-95 flex items-center justify-center gap-2",
                   practiceMode === mode.id 
                     ? "bg-white text-black border-white" 
                     : "bg-canvas text-body-mid border-hairline hover:border-white/50 hover:bg-canvas-soft"
                 )}
               >
                 <mode.icon size={14} />
                 {mode.label}
               </button>
             ))}
           </div>
           
           <button 
            onClick={handleGenerate}
            disabled={isGenerating || !role.trim()}
            className="px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-sm text-sm font-normal uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px]"
           >
            {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isGenerating ? 'Generating...' : 'Generate Battle Drills'}
           </button>
        </div>
      </header>

      {/* Session Stats Bar */}
      {questions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-canvas-card border border-hairline rounded-sm flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="text-orange-500" size={20} />
              <span className="text-sm font-normal text-ink">{sessionStats.streak} Day Streak</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="text-yellow-500" size={20} />
              <span className="text-sm font-normal text-ink">{sessionStats.points} Points</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} />
              <span className="text-sm font-normal text-ink">{sessionStats.completed}/{sessionStats.totalQuestions}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-canvas-soft rounded-sm text-xs font-normal uppercase tracking-wider flex items-center gap-2 hover:bg-canvas transition-colors cursor-pointer active:scale-95 border border-transparent hover:border-hairline"
            >
              <BarChart3 size={14} />
              Stats
            </button>
            <button
              onClick={exportSession}
              className="px-4 py-2 bg-canvas-soft rounded-sm text-xs font-normal uppercase tracking-wider flex items-center gap-2 hover:bg-canvas transition-colors cursor-pointer active:scale-95 border border-transparent hover:border-hairline"
            >
              <Download size={14} />
              Export
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Detailed Stats Panel */}
      <AnimatePresence>
        {showStats && questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-6 bg-canvas-card border border-hairline rounded-sm"
          >
            <h3 className="text-lg font-normal text-ink mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-accent" />
              Session Analytics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-canvas-soft rounded-sm">
                <div className="text-2xl font-normal text-white">{sessionStats.averageRating.toFixed(1)}</div>
                <div className="text-xs font-normal text-body-mid uppercase">Avg Rating</div>
              </div>
              <div className="p-4 bg-canvas-soft rounded-sm">
                <div className="text-2xl font-normal text-white">{Math.floor(sessionStats.totalTime / 60)}m</div>
                <div className="text-xs font-normal text-body-mid uppercase">Total Time</div>
              </div>
              <div className="p-4 bg-canvas-soft rounded-sm">
                <div className="text-2xl font-normal text-white">{questions.filter(q => q.isBookmarked).length}</div>
                <div className="text-xs font-normal text-body-mid uppercase">Bookmarked</div>
              </div>
              <div className="p-4 bg-canvas-soft rounded-sm">
                <div className="text-2xl font-normal text-white">{difficulty}</div>
                <div className="text-xs font-normal text-body-mid uppercase">Difficulty</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                className="h-[300px] md:h-[400px] flex flex-col items-center justify-center text-center p-8 bg-canvas-card border-2 border-dashed border-hairline rounded-sm"
               >
                 {isGenerating ? (
                   <div className="space-y-6">
                      <div className="flex items-center justify-center gap-1.5">
                        {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                      </div>
                      <h2 className="text-sm font-normal text-body-mid uppercase tracking-widest">Generating Questions...</h2>
                      <p className="text-xs text-body-mid max-w-md">Creating personalized interview questions for your role</p>
                   </div>
                 ) : (
                   <>
                    <BrainCircuit size={48} className="text-text-secondary mb-4" />
                    <h2 className="text-sm font-normal text-body-mid uppercase tracking-widest">Ready to Start</h2>
                    <p className="text-xs text-body-mid mt-2 max-w-md">Enter your target role to generate personalized interview questions</p>
                   </>
                 )}
               </motion.div>
             ) : (
               <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                key="results"
                className="space-y-6"
               >
                 {/* Timer and Controls */}
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                     {practiceMode === 'timed' && (
                       <div className="flex items-center gap-2 px-4 py-2 bg-canvas-card border border-hairline rounded-sm">
                         <Clock size={16} className="text-white" />
                         <span className="text-sm font-normal text-ink">
                           {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                         </span>
                         {!showTimer ? (
                           <button onClick={startTimer} className="p-1 hover:bg-canvas-soft rounded-sm transition-colors cursor-pointer active:scale-95">
                             <Play size={14} className="text-white" />
                           </button>
                         ) : (
                           <div className="flex gap-1">
                             <button onClick={stopTimer} className="p-1 hover:bg-canvas-soft rounded-sm transition-colors cursor-pointer active:scale-95">
                               <Pause size={14} className="text-white" />
                             </button>
                             <button onClick={resetTimer} className="p-1 hover:bg-canvas-soft rounded-sm transition-colors cursor-pointer active:scale-95">
                               <RotateCcw size={14} className="text-white" />
                             </button>
                           </div>
                         )}
                       </div>
                     )}
                     {practiceMode === 'voice' && isRecording && (
                       <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-sm">
                         <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                         <span className="text-sm font-normal text-red-400">
                           Recording {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                         </span>
                         <button onClick={stopRecording} className="p-1 hover:bg-red-500/30 rounded-sm transition-colors cursor-pointer active:scale-95">
                           <MicOff size={14} className="text-red-400" />
                         </button>
                       </div>
                     )}
                   </div>
                   <div className="flex items-center gap-2 text-xs font-normal text-body-mid uppercase tracking-wider">
                     <span>{practiceMode} Mode</span>
                   </div>
                 </div>
                 
                 {/* Search Bar for Questions */}
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                   <input
                     type="text"
                     placeholder={`Search ${activeTab} questions...`}
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-10 py-3 bg-canvas border border-hairline rounded-sm text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-body-mid"
                   />
                   {searchQuery && (
                     <button
                       onClick={clearSearch}
                       className="absolute right-3 top-1/2 -translate-y-1/2 text-body-mid hover:text-ink transition-colors cursor-pointer active:scale-95"
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
                           onBookmark={() => toggleBookmark(globalIndex)}
                           onRate={(rating) => rateAnswer(globalIndex, rating)}
                           onStartRecording={() => startRecording(globalIndex)}
                           onStopRecording={stopRecording}
                           isRecording={isRecording && currentQuestionIndex === globalIndex}
                           practiceMode={practiceMode}
                         />
                       </motion.div>
                     );
                   })}
                   
                   {filteredQuestions.length === 0 && searchQuery && (
                     <div className="text-center py-12">
                       <Filter className="w-12 h-12 text-body-mid mx-auto mb-4" />
                       <h3 className="text-sm font-normal text-body-mid mb-2">No questions found</h3>
                       <p className="text-xs text-body-mid">Try adjusting your search terms</p>
                     </div>
                   )}
                   
                   {filteredQuestions.length === 0 && !searchQuery && (
                     <div className="text-center py-12">
                       <HelpCircle className="w-12 h-12 text-body-mid mx-auto mb-4" />
                       <h3 className="text-sm font-normal text-body-mid mb-2">No {activeTab} questions</h3>
                       <p className="text-xs text-body-mid">Try selecting another category</p>
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
        "flex lg:flex items-center gap-3 p-4 md:p-6 rounded-sm border-2 transition-all text-left relative cursor-pointer active:scale-95",
        active 
          ? "bg-canvas-card border-white" 
          : "bg-canvas border-hairline hover:border-white/50 hover:bg-canvas-soft"
      )}
    >
      <div className={cn(
        "w-10 h-10 md:w-12 md:h-12 rounded-sm flex items-center justify-center shrink-0",
        active ? "bg-white text-black" : "bg-canvas-soft text-body-mid"
      )}>
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className={cn("text-[11px] md:text-sm font-normal uppercase tracking-wider transition-colors truncate", active ? "text-ink" : "text-body-mid")}>{title}</h4>
        <p className="hidden xs:block text-[9px] md:text-[10px] font-normal text-body-mid tracking-wide uppercase truncate">{desc}</p>
      </div>
      {count > 0 && (
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-normal",
          active ? "bg-white/10 text-white" : "bg-canvas-soft text-body-mid"
        )}>
          {count}
        </div>
      )}
    </button>
  );
}

function QaCard({ 
  q, 
  index, 
  isExpanded, 
  onToggle, 
  onBookmark, 
  onRate, 
  onStartRecording, 
  onStopRecording,
  isRecording,
  practiceMode
}: { 
  q: QaItem; 
  index: number; 
  isExpanded: boolean; 
  onToggle: () => void;
  onBookmark: () => void;
  onRate: (rating: number) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  practiceMode: 'standard' | 'timed' | 'voice';
}) {
  return (
    <div className="bg-canvas-card rounded-sm border border-hairline overflow-hidden group hover:border-white/30 transition-all">
      <button 
        onClick={onToggle}
        className="w-full flex items-start justify-between p-5 md:p-8 text-left gap-4 cursor-pointer active:scale-98 transition-transform"
      >
        <div className="flex gap-3 md:gap-4 items-start flex-1 min-w-0">
           <div className={cn(
             "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 font-normal text-[10px] md:text-xs mt-0.5",
             q.isCompleted ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white"
           )}>
             {q.isCompleted ? <CheckCircle2 size={12} /> : (q.type === 'technical' ? 'T' : q.type === 'behavioral' ? 'B' : 'G')}
           </div>
           <div className="flex-1 min-w-0">
             <h3 className="text-sm md:text-lg font-normal text-ink tracking-tight leading-tight mb-2">
               {q.question}
             </h3>
             <div className="flex items-center gap-2 flex-wrap">
               <span className={cn(
                 "text-[8px] md:text-[9px] font-normal uppercase tracking-wider px-2 py-1 rounded-full",
                 q.type === 'technical' ? "bg-blue-500/20 text-blue-400" :
                 q.type === 'behavioral' ? "bg-emerald-500/20 text-emerald-400" :
                 "bg-purple-500/20 text-purple-400"
               )}>
                 {q.type}
               </span>
               {q.difficulty && (
                 <span className={cn(
                   "text-[8px] md:text-[9px] font-normal uppercase tracking-wider px-2 py-1 rounded-full",
                   q.difficulty === 'easy' ? "bg-green-500/20 text-green-400" :
                   q.difficulty === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                   "bg-red-500/20 text-red-400"
                 )}>
                 {q.difficulty}
               </span>
               )}
               {q.rating && (
                 <div className="flex items-center gap-1">
                   {[1, 2, 3, 4, 5].map((star) => (
                     <Star
                       key={star}
                       size={10}
                       className={cn(
                         star <= q.rating! ? "text-yellow-400 fill-yellow-400" : "text-text-secondary"
                       )}
                     />
                   ))}
                 </div>
               )}
             </div>
           </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBookmark();
            }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer active:scale-95",
              q.isBookmarked ? "text-yellow-400 bg-yellow-400/20" : "text-body-mid hover:text-yellow-400 hover:bg-yellow-400/10"
            )}
          >
            <Bookmark size={16} className={q.isBookmarked ? "fill-current" : ""} />
          </button>
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-body-mid transition-all shrink-0", isExpanded ? "rotate-90 bg-white/10 text-white" : "")}>
             <ChevronRight size={20} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-canvas-soft"
          >
            <div className="px-5 md:px-8 pb-6 md:pb-8 pt-2 ml-9 md:ml-12">
               {/* Voice Recording Controls */}
               {practiceMode === 'voice' && (
                 <div className="mb-4 flex items-center gap-2">
                   {!isRecording ? (
                     <button
                       onClick={onStartRecording}
                       className="px-4 py-2 bg-white hover:bg-gray-100 text-black rounded-sm text-xs font-normal uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                     >
                       <Mic size={14} />
                       Record Answer
                     </button>
                   ) : (
                     <button
                       onClick={onStopRecording}
                       className="px-4 py-2 bg-red-500 hover:bg-red-500/90 text-white rounded-sm text-xs font-normal uppercase tracking-wider flex items-center gap-2 transition-all animate-pulse cursor-pointer active:scale-95"
                     >
                       <MicOff size={14} />
                       Stop Recording
                     </button>
                   )}
                   {q.userAnswer && (
                     <audio controls src={q.userAnswer} className="h-8" />
                   )}
                 </div>
               )}
               
               {/* Rating System */}
               <div className="mb-4 flex items-center gap-2">
                 <span className="text-[9px] md:text-[10px] font-normal uppercase tracking-widest text-body-mid">Rate your answer:</span>
                 <div className="flex gap-1">
                   {[1, 2, 3, 4, 5].map((rating) => (
                     <button
                       key={rating}
                       onClick={() => onRate(rating)}
                       className={cn(
                         "transition-all hover:scale-110 cursor-pointer active:scale-95",
                         (q.rating || 0) >= rating ? "text-yellow-400" : "text-body-mid hover:text-yellow-400"
                       )}
                     >
                       <Star size={18} className={(q.rating || 0) >= rating ? "fill-current" : ""} />
                     </button>
                   ))}
                 </div>
               </div>
               
               <div className="flex items-start gap-3 md:gap-4 p-4 md:p-6 bg-canvas-card rounded-sm border border-hairline">
                  <div className="p-2 bg-white/10 text-white rounded-sm shrink-0">
                    <Trophy size={14} className="md:w-5 md:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-[9px] md:text-[10px] font-normal uppercase tracking-widest text-white mb-3">Strategy & Model Answer</h5>
                    <div className="text-xs md:text-sm font-normal text-body-mid leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown 
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({children}) => <strong className="font-normal text-ink">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          ul: ({children}) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                          li: ({children}) => <li className="text-xs md:text-sm">{children}</li>,
                          h3: ({children}) => <h3 className="font-normal text-ink mb-2">{children}</h3>,
                          h4: ({children}) => <h4 className="font-normal text-ink mb-1">{children}</h4>,
                          code: ({children}) => <code className="bg-canvas-soft px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                          blockquote: ({children}) => <blockquote className="border-l-2 border-hairline pl-3 italic text-body-mid">{children}</blockquote>
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
