import { 

  FileText, 

  FileUp, 

  Calendar, 

  Calculator, 

  MessageSquare, 

  Youtube, 

  LayoutDashboard,

  Bot,

  BarChart3,

  ListTodo,

  BrainCircuit,

  Mail,

  BookOpen

} from 'lucide-react';



export const TOOLS = [

  {

    id: 'homepage',

    name: 'Home',

    icon: LayoutDashboard,

    description: 'Welcome to Lumina Toolkit',

    videoPreview: '/videos/homepage.mp4'

  },

  {

    id: 'dashboard',

    name: 'All Tools',

    icon: LayoutDashboard,

    description: 'View all available tools',

    videoPreview: '/videos/all-tools.mp4'

  },

  {

    id: 'chat',

    name: 'AI Assistant',

    icon: Bot,

    description: 'Chat with your personal AI productivity companion',

    videoPreview: '/videos/ai-assistant.mp4'

  },

  {

    id: 'resume',

    name: 'Resume Builder',

    icon: FileText,

    description: 'Create professional resumes in minutes',

    videoPreview: '/videos/resume-builder.mp4'

  },

  {

    id: 'pdf',

    name: 'PDF Converter',

    icon: FileUp,

    description: 'Convert images to high-quality PDF',

    videoPreview: '/videos/pdf-converter.mp4'

  },

  {

    id: 'age',

    name: 'Age Calculator',

    icon: Calendar,

    description: 'Calculate exact age and next birthday',

    videoPreview: '/videos/age-calculator.mp4'

  },

  {

    id: 'gpa',

    name: 'GPA Calculator',

    icon: Calculator,

    description: 'Check your academic performance',

    videoPreview: '/videos/gpa-calculator.mp4'

  },

  {

    id: 'caption',

    name: 'AI Caption Gen',

    icon: MessageSquare,

    description: 'Engaging captions for social media',

    videoPreview: '/videos/caption-generator.mp4'

  },

  {

    id: 'youtube',

    name: 'YT Title Gen',

    icon: Youtube,

    description: 'Optimize your videos for high CTR',

    videoPreview: '/videos/youtube-titles.mp4'

  },

  {

    id: 'blog',

    name: 'Blog',

    icon: BookOpen,

    description: 'Career tips, interview advice & job search strategies',

    videoPreview: '/videos/blog.mp4'

  },

  // Job Toolkit

  {

    id: 'ats',

    name: 'ATS Checker',

    icon: BarChart3,

    description: 'Optimize your resume for machine parsers',

    category: 'Job Toolkit',

    videoPreview: '/videos/ats-checker.mp4'

  },

  {

    id: 'tracker',

    name: 'Job Tracker',

    icon: ListTodo,

    description: 'Track your applications from sent to signed',

    category: 'Job Toolkit',

    videoPreview: '/videos/job-tracker.mp4'

  },

  {

    id: 'interview',

    name: 'Interview Prep',

    icon: BrainCircuit,

    description: 'Personalized coaching and Q&A drills',

    category: 'Job Toolkit',

    videoPreview: '/videos/interview-prep.mp4'

  },

  {

    id: 'cover-letter',

    name: 'Cover Letter AI',

    icon: Mail,

    description: 'Tailored letters that grab attention',

    category: 'Job Toolkit',

    videoPreview: '/videos/cover-letter.mp4'

  },

  {

    id: 'contact',

    name: 'Support & Suggest',

    icon: MessageSquare,

    description: 'Help us improve your toolkit suite',

    category: 'System',

    videoPreview: '/videos/contact.mp4'

  }

];

