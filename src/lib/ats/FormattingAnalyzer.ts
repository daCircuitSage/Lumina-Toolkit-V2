/**
 * Advanced ATS Formatting Compatibility Analyzer
 * Detects formatting risks that could cause ATS parsing issues
 */

export interface FormattingRisk {
  type: 'critical' | 'warning' | 'info';
  category: 'tables' | 'columns' | 'icons' | 'fonts' | 'spacing' | 'structure' | 'content';
  description: string;
  severity: number; // 1-10 scale
  recommendation: string;
}

export interface FormattingAnalysis {
  overallRisk: 'low' | 'medium' | 'high';
  risks: FormattingRisk[];
  compatibilityScore: number;
  recommendations: string[];
  sectionAnalysis: {
    hasStandardSections: boolean;
    missingSections: string[];
    weakSections: string[];
    sectionCount: number;
  };
}

export class FormattingAnalyzer {
  private readonly CRITICAL_RISK_PATTERNS = [
    // Table-related patterns
    {
      pattern: /\|[\s\S]+[\s\S]+[\s\S]*\|/g,
      type: 'critical' as const,
      category: 'tables' as const,
      description: 'Table formatting detected',
      recommendation: 'Remove tables and convert to bullet points'
    },
    // Multi-column layouts
    {
      pattern: /\t{3,}|\s{5,}/g,
      type: 'critical' as const,
      category: 'columns' as const,
      description: 'Multi-column formatting detected',
      recommendation: 'Use single-column layout with clear sections'
    },
    // Special characters/symbols
    {
      pattern: /[►▼■●▪▫✓✗×]/g,
      type: 'critical' as const,
      category: 'icons' as const,
      description: 'Special icons or symbols detected',
      recommendation: 'Replace icons with standard text'
    }
  ];

  private readonly WARNING_RISK_PATTERNS = [
    // Excessive spacing
    {
      pattern: /\n{3,}/g,
      type: 'warning' as const,
      category: 'spacing' as const,
      description: 'Excessive line breaks detected',
      recommendation: 'Use consistent spacing between sections'
    },
    // Inconsistent section headers
    {
      pattern: /^[A-Z][a-z]+.*:$/gm,
      type: 'warning' as const,
      category: 'structure' as const,
      description: 'Inconsistent section capitalization',
      recommendation: 'Use standard section headers (Summary, Experience, Skills, etc.)'
    },
    // Very short lines (possible fragmented content)
    {
      pattern: /^.{1,10}$/gm,
      type: 'warning' as const,
      category: 'content' as const,
      description: 'Very short lines detected',
      recommendation: 'Ensure complete sentences and proper formatting'
    }
  ];

  private readonly STANDARD_SECTIONS = [
    'summary', 'professional summary', 'about', 'profile', 'objective',
    'experience', 'work experience', 'professional experience', 'employment',
    'skills', 'technical skills', 'core competencies', 'expertise', 'abilities',
    'education', 'academic background', 'qualifications', 'degrees',
    'projects', 'personal projects', 'portfolio', 'key projects',
    'certifications', 'certificates', 'credentials', 'certified'
  ];

  analyzeFormatting(resumeText: string): FormattingAnalysis {
    const risks = this.detectRisks(resumeText);
    const sectionAnalysis = this.analyzeSections(resumeText);
    const compatibilityScore = this.calculateCompatibilityScore(risks, sectionAnalysis);
    const overallRisk = this.determineOverallRisk(compatibilityScore);
    const recommendations = this.generateRecommendations(risks, sectionAnalysis);

    return {
      overallRisk,
      risks,
      compatibilityScore,
      recommendations,
      sectionAnalysis
    };
  }

  private detectRisks(text: string): FormattingRisk[] {
    const risks: FormattingRisk[] = [];

    // Check critical patterns
    this.CRITICAL_RISK_PATTERNS.forEach(({ pattern, type, category, description, recommendation }) => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        risks.push({
          type,
          category,
          description,
          severity: 8,
          recommendation,
        });
      }
    });

    // Check warning patterns
    this.WARNING_RISK_PATTERNS.forEach(({ pattern, type, category, description, recommendation }) => {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        risks.push({
          type,
          category,
          description,
          severity: 5,
          recommendation,
        });
      }
    });

    // Check for font/encoding issues
    if (this.hasUnusualCharacters(text)) {
      risks.push({
        type: 'warning',
        category: 'fonts',
        description: 'Unusual characters or encoding detected',
        severity: 4,
        recommendation: 'Use standard ASCII characters and common fonts'
      });
    }

    // Check for dense formatting
    if (this.hasDenseFormatting(text)) {
      risks.push({
        type: 'warning',
        category: 'spacing',
        description: 'Dense formatting detected',
        severity: 3,
        recommendation: 'Add more white space and clear section breaks'
      });
    }

    return risks;
  }

  private analyzeSections(text: string): FormattingAnalysis['sectionAnalysis'] {
    const lines = text.split('\n');
    const sectionHeaders = this.extractSectionHeaders(lines);
    const detectedSections = sectionHeaders.map(header => 
      this.normalizeSectionName(header)
    );

    const hasStandardSections = this.STANDARD_SECTIONS.some(section =>
      detectedSections.some(detected => detected.includes(section))
    );

    const missingSections = this.STANDARD_SECTIONS.filter(section =>
      !detectedSections.some(detected => detected.includes(section))
    );

    const weakSections = this.identifyWeakSections(lines, sectionHeaders);

    return {
      hasStandardSections,
      missingSections,
      weakSections,
      sectionCount: sectionHeaders.length
    };
  }

  private extractSectionHeaders(lines: string[]): string[] {
    const headers: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Look for lines that might be section headers
      if (trimmed.length > 0 && trimmed.length < 50 && (
        /^[A-Z][a-z\s]+:/.test(trimmed) || // Capitalized words ending with colon
        /^[A-Z\s&\s]+$/.test(trimmed) || // All caps with ampersand
        /^[A-Z\s]+$/.test(trimmed) // All caps
      )) {
        headers.push(trimmed);
      }
    }

    return headers;
  }

  private normalizeSectionName(header: string): string {
    return header.toLowerCase()
      .replace(/[:\s]*$/, '') // Remove trailing colon and spaces
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }

  private identifyWeakSections(lines: string[], headers: string[]): string[] {
    const weakSections: string[] = [];
    let currentSection = '';
    let sectionContent = '';
    let contentLines = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (headers.includes(line)) {
        // Check previous section
        if (currentSection && contentLines < 3) {
          weakSections.push(currentSection);
        }
        
        currentSection = this.normalizeSectionName(line);
        sectionContent = '';
        contentLines = 0;
      } else if (line.length > 0) {
        sectionContent += line + ' ';
        contentLines++;
      }
    }

    // Check last section
    if (currentSection && contentLines < 3) {
      weakSections.push(currentSection);
    }

    return weakSections;
  }

  private hasUnusualCharacters(text: string): boolean {
    // Check for characters that might cause parsing issues
    const unusualPattern = /[^\x00-\x7F]/g; // Non-ASCII characters
    return unusualPattern.test(text);
  }

  private hasDenseFormatting(text: string): boolean {
    const lines = text.split('\n');
    const consecutiveNonEmptyLines = lines.filter(line => line.trim().length > 0).length;
    const totalLines = lines.length;
    
    // If most lines are content without proper spacing, it might be dense
    return consecutiveNonEmptyLines / totalLines > 0.8;
  }

  private calculateCompatibilityScore(
    risks: FormattingRisk[], 
    sectionAnalysis: FormattingAnalysis['sectionAnalysis']
  ): number {
    let score = 100;

    // Deduct points for risks
    risks.forEach(risk => {
      score -= risk.severity;
    });

    // Deduct points for section issues
    if (!sectionAnalysis.hasStandardSections) score -= 15;
    score -= sectionAnalysis.missingSections.length * 5;
    score -= sectionAnalysis.weakSections.length * 3;

    // Bonus for good structure
    if (sectionAnalysis.sectionCount >= 4 && sectionAnalysis.sectionCount <= 7) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  private determineOverallRisk(score: number): 'low' | 'medium' | 'high' {
    if (score >= 80) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  }

  private generateRecommendations(
    risks: FormattingRisk[], 
    sectionAnalysis: FormattingAnalysis['sectionAnalysis']
  ): string[] {
    const recommendations = new Set<string>();

    // Add risk-specific recommendations
    risks.forEach(risk => {
      recommendations.add(risk.recommendation);
    });

    // Add section-specific recommendations
    if (!sectionAnalysis.hasStandardSections) {
      recommendations.add('Use standard section headers: Summary, Experience, Skills, Education');
    }

    if (sectionAnalysis.missingSections.length > 0) {
      recommendations.add(`Consider adding missing sections: ${sectionAnalysis.missingSections.join(', ')}`);
    }

    if (sectionAnalysis.weakSections.length > 0) {
      recommendations.add('Expand weak sections with more detailed content and examples');
    }

    // General ATS best practices
    recommendations.add('Use single-column layout with clear section breaks');
    recommendations.add('Avoid tables, columns, and special characters');
    recommendations.add('Use standard fonts (Arial, Calibri, Times New Roman)');
    recommendations.add('Save as PDF or plain text for best compatibility');

    return Array.from(recommendations);
  }
}

export const formattingAnalyzer = new FormattingAnalyzer();
