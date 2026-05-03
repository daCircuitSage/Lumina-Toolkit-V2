/**
 * Section-Specific Recommendations Engine
 * Provides targeted improvement suggestions based on ATS analysis
 */

import { ParsedResume } from './ResumeParser';
import { KeywordExtractionResult } from './KeywordExtractor';
import { MistralAnalysisResult } from './MistralIntegration';
import { FormattingAnalysis } from './FormattingAnalyzer';
import { KeywordStuffingResult } from './KeywordStuffingDetector';

export interface SectionRecommendation {
  section: 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications' | 'formatting' | 'overall';
  priority: 'critical' | 'important' | 'suggested';
  title: string;
  description: string;
  actionableSteps: string[];
  examples?: string[];
}

export interface SuggestionsResult {
  recommendations: SectionRecommendation[];
  improvementRoadmap: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  quickWins: string[];
}

export class SuggestionsEngine {
  generateSuggestions(
    resume: ParsedResume,
    keywordExtraction: KeywordExtractionResult,
    mistralAnalysis: MistralAnalysisResult,
    formattingAnalysis?: FormattingAnalysis,
    keywordStuffing?: KeywordStuffingResult
  ): SuggestionsResult {
    const recommendations: SectionRecommendation[] = [];
    
    // Section-specific recommendations
    recommendations.push(...this.analyzeSummary(resume, mistralAnalysis));
    recommendations.push(...this.analyzeExperience(resume, mistralAnalysis));
    recommendations.push(...this.analyzeSkills(resume, keywordExtraction, mistralAnalysis));
    recommendations.push(...this.analyzeEducation(resume));
    recommendations.push(...this.analyzeProjects(resume));
    recommendations.push(...this.analyzeCertifications(resume));
    
    // Formatting recommendations
    if (formattingAnalysis) {
      recommendations.push(...this.analyzeFormatting(formattingAnalysis));
    }
    
    // Keyword stuffing recommendations
    if (keywordStuffing) {
      recommendations.push(...this.analyzeKeywordStuffing(keywordStuffing));
    }
    
    // Overall recommendations
    recommendations.push(...this.generateOverallRecommendations(resume, mistralAnalysis));

    const improvementRoadmap = this.generateRoadmap(recommendations);
    const quickWins = this.generateQuickWins(recommendations);

    return {
      recommendations: recommendations.sort((a, b) => {
        const priorityOrder = { critical: 0, important: 1, suggested: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }),
      improvementRoadmap,
      quickWins
    };
  }

  private analyzeSummary(resume: ParsedResume, mistralAnalysis: MistralAnalysisResult): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];
    const summarySection = resume.sections.find(s => s.type === 'summary');

    if (!summarySection) {
      recommendations.push({
        section: 'summary',
        priority: 'critical',
        title: 'Missing Professional Summary',
        description: 'A well-crafted summary is crucial for ATS systems and first impressions.',
        actionableSteps: [
          'Add a 2-3 sentence professional summary highlighting your key qualifications',
          'Include your years of experience and primary expertise',
          'Mention key achievements that align with target roles'
        ],
        examples: [
          'Senior Software Engineer with 8+ years of experience developing scalable web applications...',
          'Results-driven Product Manager with 5 years of experience leading cross-functional teams...'
        ]
      });
    } else if (summarySection.content.length < 100) {
      recommendations.push({
        section: 'summary',
        priority: 'important',
        title: 'Expand Professional Summary',
        description: 'Your summary is too brief to effectively showcase your qualifications.',
        actionableSteps: [
          'Expand to 2-3 comprehensive sentences',
          'Add specific metrics and achievements',
          'Include industry-specific keywords relevant to target roles'
        ],
        examples: [
          'Increased team productivity by 40% through implementing agile methodologies...',
          'Led development of 5 major products resulting in $2M+ revenue...'
        ]
      });
    }

    return recommendations;
  }

  private analyzeExperience(resume: ParsedResume, mistralAnalysis: MistralAnalysisResult): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];
    const experienceSection = resume.sections.find(s => s.type === 'experience');

    if (!experienceSection) {
      recommendations.push({
        section: 'experience',
        priority: 'critical',
        title: 'Missing Work Experience Section',
        description: 'Experience section is fundamental for ATS evaluation and job matching.',
        actionableSteps: [
          'Add professional experience with clear job titles and dates',
          'Include 3-5 bullet points per role with specific achievements',
          'Quantify results with metrics, percentages, or dollar amounts'
        ],
        examples: [
          '• Increased user engagement by 35% through UX improvements',
          '• Managed team of 8 developers, delivering projects 15% ahead of schedule'
        ]
      });
    } else {
      // Check for weak experience descriptions
      const hasQuantifiableAchievements = resume.metadata.hasQuantifiableAchievements;
      if (!hasQuantifiableAchievements) {
        recommendations.push({
          section: 'experience',
          priority: 'important',
          title: 'Add Quantifiable Achievements',
          description: 'ATS systems favor resumes with measurable accomplishments.',
          actionableSteps: [
            'Add specific numbers, percentages, or dollar amounts',
            'Use action verbs: "Led", "Increased", "Reduced", "Implemented"',
            'Focus on business impact and results'
          ],
          examples: [
            '• Reduced customer support tickets by 25% through automated responses',
            '• Generated $500K in new revenue by optimizing sales funnel'
          ]
        });
      }
    }

    // Experience relevance recommendations
    if (mistralAnalysis.experienceAlignment.relevanceScore < 0.7) {
      recommendations.push({
        section: 'experience',
        priority: 'suggested',
        title: 'Improve Experience Relevance',
        description: 'Your experience may not align well with target roles.',
        actionableSteps: [
          'Highlight more relevant projects and technologies',
          'Emphasize transferable skills from past roles',
          'Consider reordering experience to highlight most relevant roles first'
        ],
        examples: [
          'Relevant Experience: Cloud Architecture, Microservices, API Development',
          'Technologies: AWS, Docker, Kubernetes, Node.js, Python'
        ]
      });
    }

    return recommendations;
  }

  private analyzeSkills(
    resume: ParsedResume, 
    keywordExtraction: KeywordExtractionResult,
    mistralAnalysis: MistralAnalysisResult
  ): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];
    const skillsSection = resume.sections.find(s => s.type === 'skills');

    if (!skillsSection) {
      recommendations.push({
        section: 'skills',
        priority: 'critical',
        title: 'Missing Skills Section',
        description: 'Skills section is essential for ATS keyword matching.',
        actionableSteps: [
          'Create a dedicated skills section with technical competencies',
          'Group skills by category (Technical, Tools, Soft Skills)',
          'Include proficiency levels where appropriate'
        ],
        examples: [
          'Technical Skills: JavaScript, React, Node.js, Python, AWS',
          'Tools: Git, Docker, Jenkins, JIRA, VS Code'
        ]
      });
    }

    // Missing critical skills
    const missingCritical = mistralAnalysis.skillGapAnalysis.missingCritical;
    if (missingCritical.length > 0) {
      recommendations.push({
        section: 'skills',
        priority: 'critical',
        title: 'Add Missing Critical Skills',
        description: `Missing ${missingCritical.length} critical skills required for target roles.`,
        actionableSteps: [
          'Add missing skills from job description',
          'Consider online courses or certifications for skill gaps',
          'Highlight transferable skills that demonstrate aptitude'
        ],
        examples: [
          `Critical Skills to Add: ${missingCritical.slice(0, 3).join(', ')}`
        ]
      });
    }

    // Low hard skills ratio
    const hardSkillRatio = keywordExtraction.summary.hardSkills / Math.max(1, keywordExtraction.summary.totalKeywords);
    if (hardSkillRatio < 0.3) {
      recommendations.push({
        section: 'skills',
        priority: 'important',
        title: 'Increase Technical Skills Focus',
        description: 'Your resume could benefit from more technical skill emphasis.',
        actionableSteps: [
          'Add specific technical skills and technologies',
          'Include programming languages, frameworks, and tools',
          'Mention certifications and technical training'
        ],
        examples: [
          'Technical: Java, Spring Boot, PostgreSQL, Redis, Docker',
          'Frameworks: React, Angular, Vue.js, Express.js'
        ]
      });
    }

    return recommendations;
  }

  private analyzeEducation(resume: ParsedResume): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];
    const educationSection = resume.sections.find(s => s.type === 'education');

    if (!educationSection) {
      recommendations.push({
        section: 'education',
        priority: 'important',
        title: 'Add Education Section',
        description: 'Education background is important for many professional roles.',
        actionableSteps: [
          'Include degree, university, and graduation date',
          'Add relevant coursework or academic projects',
          'Mention honors, GPA (if strong), or academic achievements'
        ],
        examples: [
          'Bachelor of Science in Computer Science, Stanford University (2018)',
          'Relevant Coursework: Data Structures, Algorithms, Machine Learning'
        ]
      });
    }

    return recommendations;
  }

  private analyzeProjects(resume: ParsedResume): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];
    const projectsSection = resume.sections.find(s => s.type === 'projects');

    // For technical roles, projects are increasingly important
    if (!projectsSection) {
      recommendations.push({
        section: 'projects',
        priority: 'suggested',
        title: 'Add Projects Section',
        description: 'Projects demonstrate practical application of your skills.',
        actionableSteps: [
          'Include 2-3 significant projects with descriptions',
          'Use STAR method (Situation, Task, Action, Result)',
          'Include links to live projects or GitHub repositories'
        ],
        examples: [
          'E-commerce Platform: Full-stack application using React and Node.js',
          'Data Analytics Dashboard: Python-based visualization tool for business metrics'
        ]
      });
    }

    return recommendations;
  }

  private analyzeCertifications(resume: ParsedResume): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];
    const certificationsSection = resume.sections.find(s => s.type === 'certifications');

    // Certifications can differentiate candidates
    if (!certificationsSection) {
      recommendations.push({
        section: 'certifications',
        priority: 'suggested',
        title: 'Add Certifications Section',
        description: 'Professional certifications validate your expertise.',
        actionableSteps: [
          'Include relevant industry certifications',
          'Add cloud platform certifications (AWS, Azure, GCP)',
          'Mention security or specialized technical certifications'
        ],
        examples: [
          'AWS Certified Solutions Architect - Professional (2023)',
          'Certified Kubernetes Administrator (CKA) - 2022'
        ]
      });
    }

    return recommendations;
  }

  private analyzeFormatting(formattingAnalysis: FormattingAnalysis): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];

    if (formattingAnalysis.overallRisk === 'high') {
      recommendations.push({
        section: 'formatting',
        priority: 'critical',
        title: 'Fix Critical Formatting Issues',
        description: 'Your resume has formatting that may cause ATS parsing problems.',
        actionableSteps: formattingAnalysis.recommendations.slice(0, 3),
        examples: [
          'Use single-column layout with clear section headers',
          'Avoid tables, special characters, and complex formatting'
        ]
      });
    } else if (formattingAnalysis.overallRisk === 'medium') {
      recommendations.push({
        section: 'formatting',
        priority: 'important',
        title: 'Improve ATS Compatibility',
        description: 'Some formatting issues may affect ATS parsing.',
        actionableSteps: formattingAnalysis.recommendations.slice(0, 2),
        examples: [
          'Standardize section headers and spacing',
          'Remove unnecessary formatting elements'
        ]
      });
    }

    return recommendations;
  }

  private analyzeKeywordStuffing(keywordStuffing: KeywordStuffingResult): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];

    if (keywordStuffing.riskLevel === 'high') {
      recommendations.push({
        section: 'overall',
        priority: 'critical',
        title: 'Address Keyword Stuffing',
        description: 'Excessive keyword repetition may trigger ATS spam filters.',
        actionableSteps: keywordStuffing.recommendations,
        examples: [
          'Natural Integration: "Developed RESTful APIs using Node.js and Express"',
          'Avoid: "Node.js Node.js Express Node.js API REST API REST"'
        ]
      });
    } else if (keywordStuffing.riskLevel === 'medium') {
      recommendations.push({
        section: 'overall',
        priority: 'important',
        title: 'Optimize Keyword Usage',
        description: 'Some keyword patterns may appear unnatural to ATS systems.',
        actionableSteps: keywordStuffing.recommendations.slice(0, 2),
        examples: [
          'Balanced Approach: Mix technical skills with natural language',
          'Context-Rich: Describe how you applied skills in real projects'
        ]
      });
    }

    return recommendations;
  }

  private generateOverallRecommendations(resume: ParsedResume, mistralAnalysis: MistralAnalysisResult): SectionRecommendation[] {
    const recommendations: SectionRecommendation[] = [];

    // Confidence-based recommendations
    if (mistralAnalysis.confidence < 0.7) {
      recommendations.push({
        section: 'overall',
        priority: 'suggested',
        title: 'Strengthen Resume Content',
        description: 'Resume could benefit from more specific, verifiable information.',
        actionableSteps: [
          'Add more specific examples of work and achievements',
          'Include industry-specific terminology and keywords',
          'Consider adding measurable outcomes for each role'
        ],
        examples: [
          'Before: "Worked on web development projects"',
          'After: "Led development of 5 e-commerce platforms, increasing conversion by 25%"'
        ]
      });
    }

    // Industry alignment recommendations
    if (mistralAnalysis.experienceAlignment.industryAlignment < 0.7) {
      recommendations.push({
        section: 'overall',
        priority: 'suggested',
        title: 'Improve Industry Alignment',
        description: 'Your experience may not strongly align with target industry.',
        actionableSteps: [
          'Research industry-specific terminology and trends',
          'Highlight relevant industry experience and associations',
          'Consider industry-specific certifications or training'
        ],
        examples: [
          'Finance Industry: "Compliance, Risk Management, Financial Modeling"',
          'Healthcare Industry: "HIPAA, Electronic Health Records, Medical Devices"'
        ]
      });
    }

    return recommendations;
  }

  private generateRoadmap(recommendations: SectionRecommendation[]): SuggestionsResult['improvementRoadmap'] {
    const critical = recommendations.filter(r => r.priority === 'critical');
    const important = recommendations.filter(r => r.priority === 'important');
    const suggested = recommendations.filter(r => r.priority === 'suggested');

    return {
      immediate: critical.slice(0, 3).map(r => r.title),
      shortTerm: important.slice(0, 3).map(r => r.title),
      longTerm: suggested.slice(0, 3).map(r => r.title)
    };
  }

  private generateQuickWins(recommendations: SectionRecommendation[]): string[] {
    return recommendations
      .filter(r => r.priority === 'critical' || r.priority === 'important')
      .slice(0, 5)
      .map(r => r.actionableSteps[0] || r.description);
  }
}

export const suggestionsEngine = new SuggestionsEngine();
