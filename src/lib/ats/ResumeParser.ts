/**
 * Production-Grade Resume Parser
 * Handles document parsing, section detection, and content extraction
 */

export interface ResumeSection {
  type: 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications' | 'other';
  title: string;
  content: string;
  startIndex: number;
  endIndex: number;
}

export interface ParsedResume {
  rawText: string;
  sections: ResumeSection[];
  contactInfo?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };
  metadata: {
    wordCount: number;
    sectionCount: number;
    hasQuantifiableAchievements: boolean;
    formattingScore: number;
  };
}

export class ResumeParser {
  private readonly SECTION_PATTERNS = {
    summary: [
      /^(summary|professional summary|about|profile|objective)/i,
      /^(executive summary|career summary|professional overview)/i
    ],
    experience: [
      /^(experience|work experience|professional experience|employment)/i,
      /^(work history|career history|relevant experience)/i
    ],
    skills: [
      /^(skills|technical skills|core competencies|expertise)/i,
      /^(technical expertise|key skills|skill summary|abilities)/i
    ],
    education: [
      /^(education|academic background|qualifications)/i,
      /(education|degrees|academic|university|college)/i
    ],
    projects: [
      /^(projects|personal projects|portfolio)/i,
      /^(key projects|notable projects|project experience)/i
    ],
    certifications: [
      /^(certifications|certificates|credentials)/i,
      /(certified|certificate|certification)/i
    ]
  };

  private readonly CONTACT_PATTERNS = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/g,
    linkedin: /linkedin\.com\/in\/[\w-]+/gi,
    github: /github\.com\/[\w-]+/gi
  };

  parseResume(text: string): ParsedResume {
    const cleanText = this.cleanText(text);
    const sections = this.detectSections(cleanText);
    const contactInfo = this.extractContactInfo(cleanText);
    const metadata = this.generateMetadata(cleanText, sections);

    return {
      rawText: cleanText,
      sections,
      contactInfo,
      metadata
    };
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([a-zA-Z])(\d)/g, '$1 $2')
      .replace(/(\d)([a-zA-Z])/g, '$1 $2')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private detectSections(text: string): ResumeSection[] {
    const lines = text.split('\n');
    const sections: ResumeSection[] = [];
    let currentSection: ResumeSection | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const sectionType = this.identifySectionType(line);
      
      if (sectionType && sectionType !== 'other') {
        // Close previous section
        if (currentSection) {
          currentSection.endIndex = i - 1;
          currentSection.content = this.extractSectionContent(
            lines, 
            currentSection.startIndex, 
            currentSection.endIndex
          );
          sections.push(currentSection);
        }

        // Start new section
        currentSection = {
          type: sectionType,
          title: line,
          content: '',
          startIndex: i,
          endIndex: i
        };
      }
    }

    // Close final section
    if (currentSection) {
      currentSection.endIndex = lines.length - 1;
      currentSection.content = this.extractSectionContent(
        lines, 
        currentSection.startIndex, 
        currentSection.endIndex
      );
      sections.push(currentSection);
    }

    return sections.length > 0 ? sections : [{
      type: 'other',
      title: 'Content',
      content: text,
      startIndex: 0,
      endIndex: lines.length - 1
    }];
  }

  private identifySectionType(line: string): ResumeSection['type'] | null {
    for (const [type, patterns] of Object.entries(this.SECTION_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          return type as ResumeSection['type'];
        }
      }
    }
    return 'other';
  }

  private extractSectionContent(lines: string[], startIndex: number, endIndex: number): string {
    const content = lines.slice(startIndex + 1, endIndex + 1).join('\n');
    return content.trim();
  }

  private extractContactInfo(text: string): ParsedResume['contactInfo'] {
    const email = text.match(this.CONTACT_PATTERNS.email)?.[0];
    const phone = text.match(this.CONTACT_PATTERNS.phone)?.[0];
    const linkedin = text.match(this.CONTACT_PATTERNS.linkedin)?.[0];
    const github = text.match(this.CONTACT_PATTERNS.github)?.[0];

    return {
      email,
      phone,
      linkedin,
      github
    };
  }

  private generateMetadata(text: string, sections: ResumeSection[]): ParsedResume['metadata'] {
    const wordCount = text.split(/\s+/).length;
    const sectionCount = sections.length;
    const hasQuantifiableAchievements = this.hasQuantifiableAchievements(text);
    const formattingScore = this.calculateFormattingScore(text, sections);

    return {
      wordCount,
      sectionCount,
      hasQuantifiableAchievements,
      formattingScore
    };
  }

  private hasQuantifiableAchievements(text: string): boolean {
    const quantifiablePatterns = [
      /\d+%|\d+ percent/gi,
      /\$\d+[\d,]*/g,
      /\d+\s*(year|years|month|months|week|weeks|day|days)/gi,
      /\d+\s*(project|projects|team|teams|member|members)/gi,
      /\d+x|\d+ fold|\d+ times/gi
    ];

    return quantifiablePatterns.some(pattern => pattern.test(text));
  }

  private calculateFormattingScore(text: string, sections: ResumeSection[]): number {
    let score = 50; // Base score

    // Bonus for standard section headings
    const standardSections = ['summary', 'experience', 'skills', 'education'];
    const hasStandardSections = standardSections.some(sectionType =>
      sections.some(section => section.type === sectionType)
    );
    if (hasStandardSections) score += 20;

    // Penalty for potential formatting issues
    const potentialIssues = [
      /\t{2,}/, // Multiple tabs
      / {5,}/, // Multiple spaces
      /[|*]/g, // Special characters that might indicate tables
      /\.{3,}/ // Multiple periods
    ];

    potentialIssues.forEach(issue => {
      if (issue.test(text)) score -= 5;
    });

    // Bonus for proper structure
    const lines = text.split('\n');
    const bulletPointLines = lines.filter(line => /^[-*•]\s/.test(line.trim()));
    if (bulletPointLines.length > 0) score += 10;

    return Math.max(0, Math.min(100, score));
  }
}

export const resumeParser = new ResumeParser();
