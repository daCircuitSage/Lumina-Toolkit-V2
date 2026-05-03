/**
 * Anti-Keyword Stuffing Detection Module
 * Detects and penalizes suspicious keyword manipulation
 */

export interface KeywordStuffingResult {
  riskLevel: 'low' | 'medium' | 'high';
  suspiciousKeywords: string[];
  keywordDensityIssues: string[];
  contextlessMentions: string[];
  penaltyScore: number;
  recommendations: string[];
}

export class KeywordStuffingDetector {
  private readonly HIGH_RISK_THRESHOLD = 5;
  private readonly MEDIUM_RISK_THRESHOLD = 3;
  private readonly DENSITY_WARNING_THRESHOLD = 0.15;
  private readonly CONTEXT_WINDOW_SIZE = 100;

  detectKeywordStuffing(
    resumeText: string, 
    extractedKeywords: Array<{ keyword: string; frequency: number }>
  ): KeywordStuffingResult {
    const normalizedText = resumeText.toLowerCase();
    const totalWords = normalizedText.split(/\s+/).length;
    
    const suspiciousKeywords = this.detectSuspiciousFrequency(extractedKeywords, totalWords);
    const keywordDensityIssues = this.detectKeywordDensityIssues(extractedKeywords, totalWords);
    const contextlessMentions = this.detectContextlessMentions(normalizedText, extractedKeywords);
    
    const riskLevel = this.calculateRiskLevel(
      suspiciousKeywords.length,
      keywordDensityIssues.length,
      contextlessMentions.length
    );
    
    const penaltyScore = this.calculatePenaltyScore(riskLevel);
    const recommendations = this.generateRecommendations(
      suspiciousKeywords,
      keywordDensityIssues,
      contextlessMentions
    );

    return {
      riskLevel,
      suspiciousKeywords,
      keywordDensityIssues,
      contextlessMentions,
      penaltyScore,
      recommendations
    };
  }

  private detectSuspiciousFrequency(
    keywords: Array<{ keyword: string; frequency: number }>,
    totalWords: number
  ): string[] {
    return keywords
      .filter(kw => kw.frequency > this.HIGH_RISK_THRESHOLD)
      .map(kw => kw.keyword);
  }

  private detectKeywordDensityIssues(
    keywords: Array<{ keyword: string; frequency: number }>,
    totalWords: number
  ): string[] {
    return keywords
      .filter(kw => {
        const density = kw.frequency / totalWords;
        return density > this.DENSITY_WARNING_THRESHOLD;
      })
      .map(kw => kw.keyword);
  }

  private detectContextlessMentions(
    text: string,
    keywords: Array<{ keyword: string; frequency: number }>
  ): string[] {
    const contextlessKeywords: string[] = [];
    
    for (const keywordObj of keywords) {
      const keyword = keywordObj.keyword.toLowerCase();
      const occurrences = this.findKeywordOccurrences(text, keyword);
      
      for (const occurrence of occurrences) {
        const context = text.substring(
          Math.max(0, occurrence.start - this.CONTEXT_WINDOW_SIZE),
          Math.min(text.length, occurrence.end + this.CONTEXT_WINDOW_SIZE)
        );
        
        if (!this.hasValidContext(context, keyword)) {
          contextlessKeywords.push(keyword);
          break; // Only count each keyword once
        }
      }
    }
    
    return contextlessKeywords;
  }

  private findKeywordOccurrences(text: string, keyword: string): Array<{ start: number; end: number }> {
    const occurrences: Array<{ start: number; end: number }> = [];
    let index = text.indexOf(keyword);
    
    while (index !== -1) {
      occurrences.push({ start: index, end: index + keyword.length });
      index = text.indexOf(keyword, index + 1);
    }
    
    return occurrences;
  }

  private hasValidContext(context: string, keyword: string): boolean {
    // Check if keyword appears in a meaningful context
    const contextWords = context.split(/\s+/);
    
    // Look for action verbs, project descriptions, or experience indicators
    const contextIndicators = [
      'developed', 'implemented', 'created', 'managed', 'led', 'built',
      'designed', 'architected', 'optimized', 'improved', 'launched',
      'project', 'experience', 'worked', 'responsible', 'achieved',
      'years', 'months', 'team', 'company', 'role'
    ];
    
    return contextWords.some(word => 
      contextIndicators.some(indicator => word.includes(indicator))
    );
  }

  private calculateRiskLevel(
    suspiciousCount: number,
    densityIssueCount: number,
    contextlessCount: number
  ): 'low' | 'medium' | 'high' {
    const totalIssues = suspiciousCount + densityIssueCount + contextlessCount;
    
    if (totalIssues >= 5) return 'high';
    if (totalIssues >= 2) return 'medium';
    return 'low';
  }

  private calculatePenaltyScore(riskLevel: 'low' | 'medium' | 'high'): number {
    switch (riskLevel) {
      case 'high': return 25;
      case 'medium': return 15;
      case 'low': return 5;
      default: return 0;
    }
  }

  private generateRecommendations(
    suspiciousKeywords: string[],
    keywordDensityIssues: string[],
    contextlessMentions: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    if (suspiciousKeywords.length > 0) {
      recommendations.push(
        `Reduce repetition of keywords: ${suspiciousKeywords.join(', ')}`
      );
    }
    
    if (keywordDensityIssues.length > 0) {
      recommendations.push(
        'Lower keyword density by focusing on natural language and context'
      );
    }
    
    if (contextlessMentions.length > 0) {
      recommendations.push(
        'Add proper context and experience descriptions for your skills'
      );
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Your keyword usage appears natural and well-balanced');
    }
    
    return recommendations;
  }
}

export const keywordStuffingDetector = new KeywordStuffingDetector();
