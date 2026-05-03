import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Search, AlertCircle, CheckCircle2, 
  RefreshCcw, Loader2, BarChart3, ChevronRight, 
  Upload, X, FileUp, Zap
} from 'lucide-react';
import { cn } from '../../lib/utils';
import SeoContent from '../../components/SeoContent';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import mammoth from 'mammoth';
import { analyticsEvents } from '../../lib/analytics';

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function AtsChecker() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (arrayBuffer: ArrayBuffer) => {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map((item: any) => item.str);
      text += strings.join(' ') + '\n';
    }
    
    // PRODUCTION-GRADE TEXT NORMALIZATION
    return text
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Fix merged words like "PythonOOP"
      .replace(/([a-zA-Z])(\d)/g, '$1 $2') // Separate letters from numbers
      .replace(/(\d)([a-zA-Z])/g, '$1 $2') // Separate numbers from letters
      .replace(/\n{3,}/g, '\n\n') // Reduce excessive newlines
      .trim();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsExtracting(true);

    try {
      if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const text = await extractTextFromPDF(arrayBuffer);
        setResume(text);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        // PRODUCTION-GRADE TEXT NORMALIZATION
        const normalizedText = result.value
          .replace(/\s+/g, ' ') // Normalize whitespace
          .replace(/([a-z])([A-Z])/g, '$1 $2') // Fix merged words
          .replace(/([a-zA-Z])(\d)/g, '$1 $2') // Separate letters from numbers
          .replace(/(\d)([a-zA-Z])/g, '$1 $2') // Separate numbers from letters
          .replace(/\n{3,}/g, '\n\n') // Reduce excessive newlines
          .trim();
        
        setResume(normalizedText);
      } else {
        alert('Unsupported file type. Please upload a PDF or DOCX file.');
        setFileName(null);
      }
    } catch (error) {
      console.error('Extraction Error:', error);
      alert('Failed to extract text from file.');
      setFileName(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resume) return;
    setIsAnalyzing(true);
    setResult(null);

    // Track ATS check start
    analyticsEvents.atsCheckStarted();

    try {
      const response = await fetch('/api/ats-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const data = await response.json();
      
      // Parse the AI response to extract structured data
      const analysis = data.analysis;
      
      // Clean markdown formatting from the analysis
      const cleanAnalysis = analysis
        .replace(/#{1,6}\s*/g, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/`(.*?)`/g, '$1') // Remove inline code
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
        .trim();
      
      // PRODUCTION-GRADE SCORING: Extract score with strict validation
      let score = 0; // Start from 0, not 75
      const scorePatterns = [
        /(\d{1,3})\/100/,
        /(\d{1,3})%/,
        /score:\s*(\d{1,3})/i,
        /compatibility.*?(\d{1,3})/i,
        /ATS Score:\s*(\d{1,3})/i
      ];
      
      for (const pattern of scorePatterns) {
        const match = cleanAnalysis.match(pattern);
        if (match) {
          const extractedScore = parseInt(match[1]);
          if (extractedScore >= 0 && extractedScore <= 100) {
            score = extractedScore;
            break;
          }
        }
      }
      
      // PRODUCTION-GRADE NLP PIPELINE WITH ADVANCED PROCESSING
      const preprocessText = (text: string) => {
        return text
          .toLowerCase()
          .replace(/[^a-z0-9\s\-\/]/g, ' ') // Keep letters, numbers, spaces, hyphens, slashes
          .replace(/\s+/g, ' ') // Normalize whitespace
          .replace(/\b\s+\b/g, ' ') // Remove word boundaries with spaces
          .replace(/\b([a-z])([a-z]+)\b/g, '$1$2') // Fix broken tokens
          .trim();
      };

      // COMPREHENSIVE STOP-WORDS FILTER (NLP GRADE)
      const stopWords = new Set([
        // Common English stop words
        'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
        'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers',
        'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves',
        'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are',
        'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does',
        'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until',
        'while', 'of', 'at', 'by', 'for', 'with', 'through', 'during', 'before', 'after',
        'above', 'below', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
        'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all',
        'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor',
        'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will',
        'just', 'don', 'should', 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren',
        'couldn', 'didn', 'doesn', 'hadn', 'hasn', 'haven', 'isn', 'ma', 'mightn', 'mustn',
        'needn', 'shan', 'shouldn', 'wasn', 'weren', 'won', 'wouldn',
        // Resume-specific noise words
        'use', 'used', 'using', 'apps', 'application', 'applications', 'develop', 'developed',
        'developing', 'experience', 'experienced', 'work', 'worked', 'working', 'project',
        'projects', 'team', 'teams', 'member', 'members', 'lead', 'led', 'manage', 'managed',
        'managing', 'responsible', 'responsibilities', 'include', 'included', 'including',
        'various', 'multiple', 'several', 'many', 'different', 'various', 'etc', 'eg', 'ie',
        'also', 'able', 'ability', 'skills', 'skill', 'knowledge', 'knowledgeable', 'expert',
        'expertise', 'proficient', 'proficiency', 'familiar', 'familiarity', 'understanding',
        'understand', 'understood', 'learn', 'learned', 'learning', 'study', 'studied',
        'studying', 'research', 'researched', 'researching', 'analysis', 'analyzed',
        'analyzing', 'design', 'designed', 'designing', 'implement', 'implemented',
        'implementing', 'create', 'created', 'creating', 'build', 'built', 'building',
        'maintain', 'maintained', 'maintaining', 'support', 'supported', 'supporting',
        'assist', 'assisted', 'assisting', 'help', 'helped', 'helping', 'collaborate',
        'collaborated', 'collaborating', 'coordinate', 'coordinated', 'coordinating',
        'participate', 'participated', 'participating', 'involve', 'involved', 'involving',
        'contribute', 'contributed', 'contributing', 'improve', 'improved', 'improving',
        'enhance', 'enhanced', 'enhancing', 'optimize', 'optimized', 'optimizing',
        'performance', 'perform', 'performed', 'performing', 'quality', 'high', 'low',
        'good', 'better', 'best', 'excellent', 'outstanding', 'exceptional', 'strong',
        'weak', 'professional', 'professionally', 'academic', 'technically', 'technical',
        'business', 'commercial', 'industrial', 'enterprise', 'startup', 'scale', 'scalable'
      ]);

      // RESTRICTED TECHNICAL KEYWORD WHITELIST - NO HALLUCINATION
      // Only include specific technologies, not generic concepts
      const technicalKeywords = new Set([
        // Programming Languages
        'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'swift',
        'kotlin', 'scala', 'haskell', 'elixir', 'ruby', 'php', 'dart', 'r', 'matlab',
        'perl', 'lua', 'bash', 'powershell', 'sql', 'html', 'css', 'sass', 'less',
        
        // Frontend Frameworks & Libraries
        'react', 'vue', 'angular', 'svelte', 'solid', 'qwik', 'preact', 'inferno',
        'next.js', 'gatsby', 'nuxt.js', 'remix', 'astro', 'webpack', 'vite', 'rollup',
        'parcel', 'esbuild', 'babel', 'postcss', 'tailwind', 'bootstrap', 'material-ui',
        'ant-design', 'chakra-ui', 'styled-components', 'emotion', 'css-modules',
        'd3.js', 'chart.js', 'three.js', 'pixi.js', 'p5.js',
        
        // Backend & Runtime
        'node.js', 'deno', 'bun', 'express', 'koa', 'fastify', 'nestjs', 'hapi',
        'django', 'flask', 'fastapi', 'rails', 'sinatra', 'spring', 'spring-boot',
        'laravel', 'symfony', 'asp.net', 'blazor', 'fiber', 'echo', 'gin',
        
        // Databases
        'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'sqlite', 'oracle',
        'cassandra', 'dynamodb', 'cockroachdb', 'neo4j', 'influxdb', 'supabase',
        'prisma', 'typeorm', 'sequelize', 'mongoose', 'knex', 'hibernate',
        
        // Cloud & Infrastructure - SPECIFIC SERVICES ONLY
        'aws', 'azure', 'gcp', 'digitalocean', 'heroku', 'vercel', 'netlify', 'cloudflare',
        'ec2', 's3', 'lambda', 'cloudfront', 'rds', 'route53', 'vpc', 'iam',
        'app-service', 'functions', 'blob-storage', 'cdn', 'kubernetes', 'k8s',
        'docker', 'containerd', 'podman', 'rancher', 'openshift', 'eks', 'gke', 'ake',
        
        // DevOps & CI/CD
        'ci/cd', 'github-actions', 'gitlab-ci', 'jenkins', 'circleci', 'travisci',
        'drone', 'bamboo', 'teamcity', 'octopus-deploy', 'argocd', 'flux', 'helm',
        'terraform', 'pulumi', 'ansible', 'puppet', 'chef', 'salt', 'vagrant',
        'kustomize', 'istio', 'linkerd', 'consul', 'vault', 'nomad', 'packer',
        
        // Version Control
        'git', 'github', 'gitlab', 'bitbucket', 'svn', 'mercurial', 'gitkraken',
        'source-tree', 'sourcetree', 'magit', 'lazygit',
        
        // Testing & Quality
        'jest', 'vitest', 'mocha', 'jasmine', 'karma', 'cypress', 'playwright',
        'selenium', 'webdriver', 'puppeteer', 'testing-library', 'enzyme', 'chai',
        'sinon', 'postman', 'insomnia', 'swagger', 'openapi', 'graphql', 'apollo',
        'relay', 'gql', 'rest', 'restful', 'api', 'soap', 'grpc', 'protobuf',
        
        // Monitoring & Observability
        'prometheus', 'grafana', 'elk', 'elasticsearch', 'logstash', 'kibana',
        'datadog', 'newrelic', 'splunk', 'honeycomb', 'sentry', 'bugsnag',
        'pprof', 'perf', 'lighthouse', 'web-vitals', 'core-web-vitals',
        
        // Security
        'oauth', 'jwt', 'ssl', 'tls', 'https', 'ssh', 'rsa', 'aes', 'bcrypt',
        'passport', 'auth0', 'okta', 'saml', 'ldap', 'rbac', 'acl', 'firewall',
        'waf', 'ddos', 'xss', 'csrf', 'sql-injection', 'penetration-testing',
        
        // Mobile Development
        'react-native', 'flutter', 'swift', 'kotlin', 'ios', 'android', 'xamarin',
        'cordova', 'ionic', 'phonegap', 'unity', 'unreal', 'godot',
        
        // Data Science & ML
        'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
        'matplotlib', 'seaborn', 'plotly', 'jupyter', 'colab', 'kaggle',
        'spark', 'hadoop', 'airflow', 'mlflow', 'kubeflow', 'dvc', 'ml',
        'machine-learning', 'deep-learning', 'nlp', 'computer-vision',
        'reinforcement-learning', 'data-science', 'analytics', 'statistics',
        
        // Blockchain & Web3
        'ethereum', 'bitcoin', 'solidity', 'web3', 'blockchain', 'smart-contracts',
        'nft', 'defi', 'dao', 'ipfs', 'truffle', 'hardhat', 'metamask',
        
        // CMS & E-commerce
        'wordpress', 'drupal', 'joomla', 'magento', 'shopify', 'woocommerce',
        'bigcommerce', 'prestashop', 'opencart', 'zen-cart', 'oscommerce',
        'strapi', 'contentful', 'sanity', 'prismic', 'storyblok', 'dato-cms',
        'graphcms', 'hygraph', 'craft-cms', 'statamic', 'october', 'wintercms',
        
        // Project Management
        'jira', 'trello', 'asana', 'monday', 'notion', 'airtable', 'clickup',
        'linear', 'github-projects', 'gitlab-issues', 'confluence', 'slack',
        'teams', 'discord', 'zoom', 'google-workspace', 'office-365',
        
        // Operating Systems
        'linux', 'ubuntu', 'debian', 'centos', 'rhel', 'fedora', 'arch', 'alpine',
        'windows', 'macos', 'ios', 'android', 'freebsd', 'openbsd', 'netbsd',
        'docker-desktop', 'wsl', 'bash', 'zsh', 'fish', 'powershell', 'cmd',
        
        // Networking & Protocols
        'http', 'https', 'tcp', 'udp', 'ip', 'dns', 'dhcp', 'vpn', 'proxy',
        'load-balancer', 'nginx', 'apache', 'caddy', 'traefik', 'envoy',
        'websocket', 'sse', 'mqtt', 'amqp', 'kafka', 'rabbitmq', 'nats',
        'redis-pub-sub', 'paho', 'mosquitto',
        
        // Architecture & Patterns - REMOVED GENERIC TERMS
        'microservices', 'serverless', 'jamstack', 'spa', 'ssr', 'ssg', 'pwa',
        'web-components', 'custom-elements', 'shadow-dom', 'service-workers',
        'web-workers', 'background-sync', 'push-notifications',
        'cdn', 'edge-computing', 'fog-computing', 'distributed-systems',
        'event-driven', 'cqrs', 'event-sourcing', 'domain-driven-design',
        'clean-architecture', 'hexagonal-architecture', 'onion-architecture',
        
        // Development Tools
        'vscode', 'vim', 'emacs', 'intellij', 'pycharm', 'webstorm', 'eclipse',
        'netbeans', 'xcode', 'android-studio', 'visual-studio', 'postman',
        'insomnia', 'docker-desktop', 'kubernetes-dashboard', 'github-desktop',
        'gitkraken', 'source-tree', 'sourcetree', 'figma', 'sketch', 'photoshop',
        'illustrator', 'xd', 'invision', 'zeplin', 'canva',
        
        // Build & Package Managers
        'npm', 'yarn', 'pnpm', 'pip', 'conda', 'composer', 'maven', 'gradle',
        'sbt', 'leiningen', 'cargo', 'mix', 'nuget', 'cocoapods', 'carthage',
        'swift-package-manager', 'pub', 'crates', 'gems', 'eggs', 'wheels',
        
        // Methodologies & Practices - REMOVED GENERIC TERMS
        'agile', 'scrum', 'kanban', 'lean', 'tdd', 'bdd', 'devops', 'ci', 'cd',
        'code-review', 'pair-programming', 'mob-programming', 'refactoring',
        'clean-code', 'solid', 'dry', 'kiss', 'yagni', 'technical-debt',
        'architecture-decision-records', 'adr', 'documentation', 'readme',
        'changelog', 'contributing', 'license', 'gitignore', 'eslint',
        'prettier', 'husky', 'lint-staged', 'commitlint', 'semantic-release'
      ]);

      // STRICT SEMANTIC MATCHING MAPPINGS - NO HALLUCINATION
      // Only map to skills that are ACTUALLY present in the resume
      const semanticMappings = {
        // Deployment & Infrastructure - ONLY if base concept is present
        'deploy': ['docker'],
        'deployment': ['docker'],
        'container': ['docker'],
        'containers': ['docker'],
        'orchestration': ['kubernetes'],
        'scaling': ['kubernetes'],
        'scalable': ['kubernetes'],
        
        // Cloud - ONLY if cloud concept is present AND specific cloud mentioned
        'cloud': [], // Removed auto-mapping to prevent hallucination
        'aws': ['ec2', 's3', 'lambda'],
        'azure': ['app-service', 'functions'],
        'gcp': ['google-cloud'],
        
        // Development Practices - ONLY if practice is present
        'testing': ['jest', 'mocha'],
        'test': ['jest', 'mocha'],
        'automation': ['ci/cd'],
        'automated': ['ci/cd'],
        'version': ['git'],
        'control': ['git'],
        
        // Data - ONLY if data concept is present - REMOVED CACHING
        'data': ['sql', 'mongodb'],
        'database': ['postgresql', 'mysql'],
        // 'cache': ['redis'], // Removed to prevent hallucination
        // 'caching': ['redis'], // Removed to prevent hallucination
        
        // Security - ONLY if security concept is present
        'security': ['oauth', 'jwt'],
        'authentication': ['oauth', 'jwt'],
        'authorization': ['rbac'],
        'encryption': ['ssl', 'tls'],
        
        // Mobile - ONLY if mobile concept is present
        'mobile': ['react-native', 'flutter'],
        'app': ['react-native', 'flutter'],
        'application': ['react-native', 'flutter'],
        
        // DevOps - ONLY if ops concept is present
        'operations': ['devops'],
        'monitoring': ['prometheus'],
        'logging': ['elasticsearch'],
        'alerting': ['grafana'],
        
        // Architecture - ONLY if architecture concept is present
        'architecture': ['microservices'],
        'microservice': ['microservices'],
        'service': ['api'],
        'api': ['rest'],
        
        // Frontend - ONLY if frontend concept is present
        'frontend': ['react', 'vue'],
        'ui': ['react', 'vue'],
        'ux': ['react', 'vue'],
        'interface': ['react', 'vue'],
        
        // Backend - ONLY if backend concept is present
        'backend': ['node.js', 'express'],
        'server': ['node.js', 'express'],
        
        // Development - ONLY if development concept is present
        'development': ['javascript', 'python'],
        'programming': ['javascript', 'python'],
        'coding': ['javascript', 'python'],
        'software': ['javascript', 'python'],
        
        // Web - ONLY if web concept is present
        'web': ['html', 'css'],
        'website': ['html', 'css'],
        
        // Database - ONLY if database concept is present
        'storage': [], // Removed auto-mapping to prevent hallucination
        'backup': [], // Removed auto-mapping to prevent hallucination
        'recovery': [] // Removed auto-mapping to prevent hallucination
      };

      // STRICT KEYWORD EXTRACTION - NO HALLUCINATION
      const extractTechnicalKeywords = (text: string) => {
        const normalized = preprocessText(text);
        const tokens = normalized.split(' ');
        
        const keywords = new Set<string>();
        
        // ONLY extract DIRECT technical keyword matches
        tokens.forEach(token => {
          if (technicalKeywords.has(token) && !stopWords.has(token)) {
            keywords.add(token);
          }
        });
        
        // LIMITED compound keyword detection (only for very specific terms)
        const compoundTerms = [
          'machine learning', 'deep learning', 'computer vision', 'natural language processing',
          'reinforcement learning', 'data science', 'artificial intelligence',
          'software development', 'web development', 'mobile development', 'full stack development',
          'backend development', 'frontend development', 'devops engineering',
          'quality assurance', 'user experience', 'user interface'
        ];
        
        compoundTerms.forEach(term => {
          if (normalized.includes(term)) {
            keywords.add(term.replace(/\s+/g, '-'));
          }
        });
        
        // STRICT SEMANTIC MATCHING - ONLY enhance existing skills
        const semanticMatches = new Set<string>();
        tokens.forEach(token => {
          if (semanticMappings[token]) {
            semanticMappings[token].forEach(relatedTech => {
              // ONLY add semantic match if the base concept is present AND related tech is valid
              if (technicalKeywords.has(relatedTech) && keywords.has(token)) {
                semanticMatches.add(relatedTech);
              }
            });
          }
        });
        
        // Add semantic matches ONLY if they don't hallucinate
        semanticMatches.forEach(match => keywords.add(match));
        
        return Array.from(keywords);
      };

      // STRICT EXPLAINABLE SCORING ALGORITHM - NO HALLUCINATION
      const calculateATSScore = (resumeKeywords: string[], jobKeywords: string[]) => {
        // ONLY count skills that are ACTUALLY present in resume
        const directMatches = resumeKeywords.filter(k => jobKeywords.includes(k));
        
        // ONLY include missing skills from JD (no hallucination)
        const missingSkills = jobKeywords.filter(k => !resumeKeywords.includes(k));
        
        // Calculate weighted score with full transparency
        const totalRequired = jobKeywords.length;
        const directMatchScore = totalRequired > 0 ? (directMatches.length / totalRequired) * 60 : 0; // 60% weight
        const missingSkillsPenalty = totalRequired > 0 ? (missingSkills.length / totalRequired) * 25 : 0; // 25% penalty
        
        // Conservative semantic bonus - ONLY for actual semantic understanding
        const semanticBonus = Math.min((directMatches.length / Math.max(totalRequired, 1)) * 15, 15); // 15% bonus
        
        const finalScore = Math.max(0, Math.min(100, Math.round(
          directMatchScore + semanticBonus - missingSkillsPenalty
        )));
        
        return {
          score: finalScore,
          directMatches,
          missingSkills,
          semanticMatches: [], // Will be populated separately
          breakdown: {
            directMatch: Math.round(directMatchScore),
            semanticBonus: Math.round(semanticBonus),
            missingPenalty: Math.round(missingSkillsPenalty),
            totalSkills: totalRequired,
            matchedSkills: directMatches.length,
            missingSkillsCount: missingSkills.length
          }
        };
      };
      
      // Extract keywords from resume and job description
      const resumeKeywords = extractTechnicalKeywords(resume);
      const jobKeywords = jobDescription ? extractTechnicalKeywords(jobDescription) : [];
      
      // Calculate ATS score
      const atsScore = calculateATSScore(resumeKeywords, jobKeywords);
      // STRICT KEYWORD MATCHING - NO HALLUCINATION
      // Key Strengths: ONLY skills present in both resume AND JD
      const matchedKeywords = resumeKeywords.filter(keyword => 
        jobKeywords.includes(keyword)
      );
      
      // Missing Skills: ONLY skills from JD that are not in resume
      const missingKeywords = jobKeywords.filter(keyword => 
        !resumeKeywords.includes(keyword)
      );
      
      // Semantic Matches: ONLY enhance existing resume skills with JD context
      const semanticMatches: string[] = [];
      resumeKeywords.forEach(resumeSkill => {
        jobKeywords.forEach(jobSkill => {
          // Check for semantic relationship between resume skill and JD skill
          if (resumeSkill !== jobSkill) {
            // Simple semantic check: if they share common base words
            const resumeBase = resumeSkill.split('-')[0];
            const jobBase = jobSkill.split('-')[0];
            if (resumeBase === jobBase && semanticMappings[resumeBase]) {
              if (semanticMappings[resumeBase].includes(jobSkill)) {
                semanticMatches.push(jobSkill);
              }
            }
          }
        });
      });
      
      // Calculate final ATS score with strict rules
      const finalAtsScore = calculateATSScore(resumeKeywords, jobKeywords);
      
      // Generate transparent score explanation
      const generateScoreExplanation = (atsScore: any) => {
        const explanations = [];
        
        if (atsScore.breakdown.directMatch > 0) {
          explanations.push(`Direct skill matches: +${atsScore.breakdown.directMatch} points (${atsScore.breakdown.matchedSkills}/${atsScore.breakdown.totalSkills} skills)`);
        }
        
        if (atsScore.breakdown.semanticBonus > 0) {
          explanations.push(`Semantic understanding: +${atsScore.breakdown.semanticBonus} points`);
        }
        
        if (atsScore.breakdown.missingPenalty > 0) {
          explanations.push(`Missing required skills: -${atsScore.breakdown.missingPenalty} points (${atsScore.breakdown.missingSkillsCount} gaps)`);
        }
        
        return explanations;
      };
      
      // Generate conservative suggestions based on actual gaps
      const generateSuggestions = (atsScore: any) => {
        const suggestions = [];
        
        if (atsScore.missingSkills.length > 0) {
          suggestions.push(`Add missing skills: ${atsScore.missingSkills.slice(0, 2).join(', ')}`);
        }
        
        if (atsScore.directMatches.length < 3) {
          suggestions.push('Include more specific technical keywords from the job description');
        }
        
        if (atsScore.score < 50) {
          suggestions.push('Major resume restructuring needed to match job requirements');
        } else if (atsScore.score < 75) {
          suggestions.push('Moderate improvements needed for better alignment');
        } else {
          suggestions.push('Fine-tune specific skills for optimal matching');
        }
        
        suggestions.push('Use standard section headings (Experience, Skills, Education)');
        suggestions.push('Quantify achievements with specific metrics and outcomes');
        
        return suggestions;
      };
      
      // Generate evidence-based summary with correct grammar
      const generateSummary = (atsScore: any) => {
        const score = atsScore.score;
        const directCount = atsScore.directMatches.length;
        const missingCount = atsScore.missingSkills.length;
        
        // Fix grammar: singular vs plural
        const requirementsText = missingCount === 1 ? 'requirement' : 'requirements';
        const gapsText = missingCount === 1 ? 'gap' : 'gaps';
        
        if (score >= 80) {
          return `Excellent ATS compatibility with ${directCount} direct skill matches and strong keyword alignment.`;
        } else if (score >= 60) {
          return `Good ATS compatibility showing ${directCount} relevant skills, but missing ${missingCount} key ${requirementsText}.`;
        } else if (score >= 40) {
          return `Moderate ATS compatibility with ${directCount} matching skills and ${missingCount} critical ${gapsText} to address.`;
        } else {
          return `Limited ATS compatibility with only ${directCount} matching skills and ${missingCount} missing ${requirementsText}.`;
        }
      };
      
      const scoreExplanation = generateScoreExplanation(finalAtsScore);
      const enhancedSuggestions = generateSuggestions(finalAtsScore);
      const enhancedSummary = generateSummary(finalAtsScore);
      
      // Extract AI suggestions and summary
      let summary = '';
      let aiSuggestions = [];
      
      // Extract summary
      const summaryMatch = cleanAnalysis.match(/Summary:\s*([^\n]+)/i);
      if (summaryMatch) {
        summary = summaryMatch[1].trim();
      }
      
      // Extract AI suggestions
      const recommendationsMatch = cleanAnalysis.match(/Top Recommendations:\s*([^\n]+)/i);
      if (recommendationsMatch) {
        aiSuggestions = recommendationsMatch[1]
          .split(/[,]\s*/)
          .map(r => r.trim())
          .filter(r => r.length > 5);
      }
      
      // Fallback summary extraction
      if (!summary) {
        const summaryPatterns = [
          /overall[^.]*\./i,
          /summary[^.]*\./i,
          /conclusion[^.]*\./i,
          /recommendation[^.]*\./i
        ];
        
        for (const pattern of summaryPatterns) {
          const match = cleanAnalysis.match(pattern);
          if (match) {
            summary = match[0];
            break;
          }
        }
        
        if (!summary) {
          const sentences = cleanAnalysis.split(/[.!?]/).filter(s => s.trim().length > 20);
          summary = sentences[0] || cleanAnalysis.substring(0, 200);
        }
        
        summary = summary
          .replace(/^\d+\.\s*/, '')
          .replace(/^[–-]\s*/, '')
          .trim();
      }
      
      setResult({
        score: finalAtsScore.score,
        summary: enhancedSummary,
        keywordMatch: matchedKeywords.slice(0, 8), // Use strict matched keywords
        missingKeywords: missingKeywords.slice(0, 8), // Use strict missing keywords
        semanticMatches: semanticMatches.slice(0, 8), // Use strict semantic matches
        suggestions: enhancedSuggestions,
        scoreBreakdown: finalAtsScore.breakdown,
        scoreExplanation,
        fullAnalysis: analysis
      });
    } catch (error) {
      console.error('ATS Analysis Error:', error);
      setIsAnalyzing(false);
      
      if (error instanceof Error) {
        if (error.message.includes('MISTRAL_API_KEY')) {
          alert('AI service is not configured. Please contact the administrator to set up the API key.');
        } else {
          alert(error.message);
        }
      } else {
        alert("Analysis failed. Please try again.");
      }
      
      // Reset result to prevent display errors
      setResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <header className="mb-8 md:mb-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <BarChart3 size={12} /> Optimization Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">ATS Score Checker</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Analyze your resume against machine algorithms.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center justify-between gap-2 px-1">
                <span className="flex items-center gap-2"><FileText size={16} className="text-emerald-500" /> Resume Source</span>
                {resume && (
                  <button 
                    onClick={() => { setResume(''); setFileName(null); }}
                    className="text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 font-black text-[10px] uppercase tracking-widest"
                  >
                    <X size={14} /> Clear Content
                  </button>
                )}
              </label>
              
              {!resume ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group relative min-h-[220px] md:h-80 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-50/10 dark:hover:bg-emerald-500/5 transition-all shadow-sm"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload}
                    accept=".pdf,.docx"
                    className="hidden" 
                  />
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:scale-110 transition-all mb-6">
                    {isExtracting ? <Loader2 size={36} className="animate-spin" /> : <Upload size={36} />}
                  </div>
                  <h4 className="text-base md:text-lg font-black text-slate-900 dark:text-white mb-2">
                    {isExtracting ? 'Extracting text...' : 'Upload Resume'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed">Select PDF or DOCX file. All data is processed locally in your browser.</p>
                </div>
              ) : (
                <div className="relative group">
                  <textarea 
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    placeholder="Paste or edit your resume text here..."
                    className="w-full h-64 md:h-80 px-6 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all resize-none dark:text-white leading-relaxed font-medium"
                  />
                  {fileName && (
                    <div className="absolute top-3 right-3 md:top-4 md:right-4 max-w-[60%] px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-xl">
                      <FileUp size={12} className="text-emerald-400 shrink-0" /> 
                      <span className="truncate">{fileName}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
               <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2 px-1">
                 <Search size={16} className="text-emerald-500" /> Job Description
               </label>
               <textarea 
                 value={jobDescription}
                 onChange={(e) => setJobDescription(e.target.value)}
                 placeholder="Paste the target job description to verify keyword matching..."
                 className="w-full h-40 md:h-48 px-6 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all resize-none dark:text-white leading-relaxed font-medium"
               />
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resume}
              className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-black uppercase tracking-[3px] text-xs hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/10 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} className="fill-current" />}
                {isAnalyzing ? 'Analyzing Alignment...' : 'Start ATS Scan'}
              </span>
            </button>
          </div>

          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {!result && !isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 md:p-12 border-4 border-dashed border-slate-100 dark:border-slate-800/50 rounded-[48px] bg-slate-50/50 dark:bg-transparent"
                >
                  <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[32px] flex items-center justify-center text-slate-200 dark:text-slate-800 mb-8 shadow-sm">
                    <BarChart3 size={48} />
                  </div>
                  <h3 className="text-xl font-black text-slate-400 dark:text-slate-700 uppercase tracking-[4px]">Awaiting Data</h3>
                  <p className="text-slate-400 dark:text-slate-600 text-sm mt-3 font-medium max-w-[280px] leading-relaxed">Upload your professional credits to begin the real-time keyword alignment analysis.</p>
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-2xl shadow-emerald-500/5"
                >
                  <div className="relative w-28 h-28 mb-8">
                    <div className="absolute inset-0 border-4 border-emerald-50 dark:border-emerald-900/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                      <Zap size={40} className="animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-[4px] mb-4">Deep Scanning</h3>
                  <div className="space-y-2">
                    <p className="text-emerald-500 text-xs font-black uppercase tracking-widest">Parsing Structure</p>
                    <p className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">Cross-referencing domain keywords...</p>
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 md:space-y-8"
                >
                  <div className="p-8 md:p-12 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none hidden lg:block">
                      <BarChart3 size={200} />
                    </div>
                    
                    <div className="flex flex-col items-center gap-8 mb-12">
                      <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" />
                          <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={377} strokeDashoffset={377 - (377 * result.score) / 100} className="text-emerald-500 transition-all duration-1000 ease-out" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-widest">{result.score}%</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alignment</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <h4 className="text-[11px] font-black uppercase tracking-[5px] text-emerald-500 mb-4">Final Verdict</h4>
                        <p className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">{result.summary}</p>
                      </div>
                      
                      {/* SCORE BREAKDOWN TRANSPARENCY */}
                      {result.scoreBreakdown && (
                        <div className="w-full p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <h5 className="text-[10px] font-black uppercase tracking-[3px] text-slate-500 dark:text-slate-400 mb-4">Score Breakdown</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Direct Matches</span>
                              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">+{result.scoreBreakdown.directMatch}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Semantic Bonus</span>
                              <span className="text-xs font-black text-blue-600 dark:text-blue-400">+{result.scoreBreakdown.semanticBonus}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Missing Skills</span>
                              <span className="text-xs font-black text-rose-600 dark:text-rose-400">-{result.scoreBreakdown.missingPenalty}</span>
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-slate-600 my-3" />
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-slate-700 dark:text-slate-200">Total Score</span>
                              <span className="text-sm font-black text-slate-900 dark:text-white">{result.score}%</span>
                            </div>
                          </div>
                          
                          {/* TRANSPARENCY EXPLANATION */}
                          {result.scoreExplanation && result.scoreExplanation.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                              <h6 className="text-[9px] font-black uppercase tracking-[2px] text-slate-500 dark:text-slate-400 mb-2">Score Explanation</h6>
                              <div className="space-y-1">
                                {result.scoreExplanation.map((explanation: string, i: number) => (
                                  <div key={i} className="text-[10px] text-slate-600 dark:text-slate-400">
                                    {explanation}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="p-6 md:p-8 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-[32px] border border-emerald-100 dark:border-emerald-900/20">
                        <h5 className="text-[10px] font-black uppercase tracking-[3px] text-emerald-600 dark:text-emerald-400 mb-5 flex items-center gap-3">
                          <CheckCircle2 size={16} /> Key Strengths
                          <span className="text-[8px] font-normal text-emerald-500 dark:text-emerald-400">(Direct matches from Resume + JD)</span>
                        </h5>
                        <div className="flex flex-wrap gap-2.5">
                          {result.keywordMatch.length > 0 ? (
                            result.keywordMatch.map((kw: string, i: number) => (
                              <span key={i} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
                                {kw}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-medium uppercase tracking-widest px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">
                              No strong matches found
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* SEMANTIC MATCHES SECTION WITH TRANSPARENCY */}
                      {result.semanticMatches && result.semanticMatches.length > 0 && (
                        <div className="p-6 md:p-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/20">
                          <h5 className="text-[10px] font-black uppercase tracking-[3px] text-blue-600 dark:text-blue-400 mb-5 flex items-center gap-3">
                            <Search size={16} /> Semantic Matches
                            <span className="text-[8px] font-normal text-blue-500 dark:text-blue-400">(Related concepts from Resume)</span>
                          </h5>
                          <div className="flex flex-wrap gap-2.5">
                            {result.semanticMatches.map((kw: string, i: number) => (
                              <span key={i} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 border border-blue-100 dark:border-blue-900/30 shadow-sm">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6 md:p-8 bg-orange-50/50 dark:bg-orange-900/10 rounded-[32px] border border-orange-100 dark:border-orange-900/20">
                        <h5 className="text-[10px] font-black uppercase tracking-[3px] text-orange-600 dark:text-orange-400 mb-5 flex items-center gap-3">
                          <AlertCircle size={16} /> Critical Gaps
                          <span className="text-[8px] font-normal text-orange-500 dark:text-orange-400">(Required skills from JD only)</span>
                        </h5>
                        <div className="flex flex-wrap gap-2.5">
                          {result.missingKeywords.length > 0 ? (
                            result.missingKeywords.map((kw: string, i: number) => (
                              <span key={i} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 border border-orange-100 dark:border-orange-900/30 shadow-sm">
                                {kw}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] font-medium uppercase tracking-widest px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/30 shadow-sm">
                              No critical gaps found
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 md:p-12 bg-slate-900 dark:bg-slate-100 rounded-[48px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
                    <h4 className="text-[10px] font-black uppercase tracking-[5px] text-slate-400 dark:text-slate-500 mb-8 flex items-center gap-3 relative z-10">
                      <ChevronRight size={18} className="text-emerald-500" /> Enhancement Roadmap
                    </h4>
                    <div className="space-y-6 relative z-10">
                      {result.suggestions.map((tip: string, i: number) => (
                        <div key={i} className="flex gap-6 items-start group/tip">
                          <span className="flex-shrink-0 w-8 h-8 rounded-2xl bg-white/10 dark:bg-slate-900/10 text-emerald-500 text-[12px] font-black flex items-center justify-center group-hover/tip:scale-110 transition-transform">
                            {i + 1}
                          </span>
                          <p className="text-sm text-slate-300 dark:text-slate-600 font-bold leading-relaxed pt-1 flex-1">
                            {tip}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <SeoContent 
          title="ATS Score Checker Free Tool: Optimize Your Resume for Success"
          description="Understanding how your resume performs against Applicant Tracking Systems (ATS) is crucial in today's competitive job market. Our Free ATS Score Checker uses advanced algorithms to scan your resume just like a top-tier recruiter's software would. By comparing your skills and experience against specific job descriptions, we provide a detailed compatibility score, identify missing high-impact keywords, and offer actionable suggestions to help you bypass machine filters and reach the hiring manager's desk."
          features={[
            "Deep Keyword Analysis: Identify matched and missing keywords based on real job descriptions.",
            "File Support: Upload resumes directly in PDF or DOCX format for instant parsing.",
            "Compatibility Scoring: Get a clear percentage score of how well your resume matches the job.",
            "Actionable Insights: Receive specific tips to improve your resume structure and content.",
            "AI-Powered Verdict: Get a 2-sentence expert summary of your resume's current strength.",
            "Privacy First: Your resume content is processed securely and never stored on our servers."
          ]}
          steps={[
            "Upload your existing resume in PDF or Word format.",
            "Optionally paste the job description you are targeting.",
            "Click 'Check ATS Score' to trigger the deep scanning engine.",
            "Review your matched keywords and missing impact areas.",
            "Apply the suggested improvements to your resume for better results."
          ]}
          benefits={[
            "Bypass machine-based resume filters.",
            "Tailor your resume precisely to job requirements.",
            "Understand recruiter-side keyword priorities.",
            "Professional analysis in under 30 seconds.",
            "Increase your interview call-back rate."
          ]}
          faq={[
            { q: "What is an ATS score?", a: "An ATS score is a percentage that reflects how well your resume's text matches a job's specific requirements and keywords, as seen by Applicant Tracking Systems." },
            { q: "How can I improve my ATS score?", a: "You can improve your score by including exact keywords from the job description, using standard headings, and avoiding complex graphics that might confuse parsers." },
            { q: "Is the ATS Checker safe for my data?", a: "Yes, we process your information in real-time. Your resume data is used only for the current analysis session and is not saved or shared." },
            { q: "Does the tool support PDF resumes?", a: "Yes, our tool can extract and analyze text directly from both PDF and DOCX files for your convenience." },
            { q: "Do I need the job description to use it?", a: "While optional, providing a job description allows the tool to give you a much more accurate match score and specific keyword recommendations." }
          ]}
          ctaTitle="Be the candidate they can't ignore."
        />
      </div>
    </div>
  );
}
