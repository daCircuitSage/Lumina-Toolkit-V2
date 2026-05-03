/**
 * Production-Grade ATS Scoring Engine
 * Implements weighted scoring with multiple factors and transparent breakdown
 */

import { ParsedResume } from './ResumeParser';
import { KeywordExtractionResult, ExtractedKeyword } from './KeywordExtractor';
import { MistralAnalysisResult } from './MistralIntegration';
import { keywordStuffingDetector, KeywordStuffingResult } from './KeywordStuffingDetector';
import { formattingAnalyzer, FormattingAnalysis } from './FormattingAnalyzer';

export interface ScoringFactors {
  keywordMatch: {
    score: number;
    weight: number;
    directMatches: string[];
    semanticMatches: string[];
    missingCritical: string[];
  };
  experienceRelevance: {
    score: number;
    weight: number;
    yearsMatch: number;
    seniorityMatch: number;
    industryAlignment: number;
  };
  formattingCompatibility: {
    score: number;
    weight: number;
    sectionStructure: number;
    readability: number;
    atsFriendliness: number;
  };
  contentQuality: {
    score: number;
    weight: number;
    quantifiableAchievements: number;
    actionVerbUsage: number;
    skillValidation: number;
  };
  semanticAlignment: {
    score: number;
    weight: number;
    contextualRelevance: number;
    transferableSkills: number;
    skillGapPenalty: number;
  };
  keywordStuffing: {
    score: number;
    weight: number;
    riskLevel: 'low' | 'medium' | 'high';
    penaltyScore: number;
    suspiciousKeywords: string[];
  };
}

export interface DetailedScore {
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  factors: ScoringFactors;
  breakdown: {
    totalPossible: number;
    achieved: number;
    percentage: number;
  };
  recommendations: {
    critical: string[];
    important: string[];
    suggested: string[];
  };
  confidence: number;
}

export class ScoringEngine {
  private readonly WEIGHTS = {
    keywordMatch: 0.25,
    experienceRelevance: 0.20,
    formattingCompatibility: 0.15,
    contentQuality: 0.20,
    semanticAlignment: 0.15,
    keywordStuffing: 0.05
  };

  private readonly GRADE_THRESHOLDS = {
    'A+': 95,
    'A': 90,
    'B+': 85,
    'B': 80,
    'C+': 75,
    'C': 70,
    'D': 60,
    'F': 0
  };

  calculateScore(
    resume: ParsedResume,
    keywordExtraction: KeywordExtractionResult,
    mistralAnalysis: MistralAnalysisResult,
    jobKeywords?: string[]
  ): DetailedScore {
    const factors = this.calculateAllFactors(resume, keywordExtraction, mistralAnalysis, jobKeywords);
    const overallScore = this.calculateOverallScore(factors);
    const grade = this.determineGrade(overallScore);
    const recommendations = this.generateRecommendations(factors, overallScore);
    const confidence = this.calculateConfidence(factors, mistralAnalysis);

    return {
      overallScore,
      grade,
      factors,
      breakdown: {
        totalPossible: 100,
        achieved: overallScore,
        percentage: overallScore
      },
      recommendations,
      confidence
    };
  }

  private calculateAllFactors(
    resume: ParsedResume,
    keywordExtraction: KeywordExtractionResult,
    mistralAnalysis: MistralAnalysisResult,
    jobKeywords?: string[]
  ): ScoringFactors {
    const keywordStuffingResult = keywordStuffingDetector.detectKeywordStuffing(
      resume.rawText,
      keywordExtraction.keywords
    );
    
    const formattingAnalysis = formattingAnalyzer.analyzeFormatting(resume.rawText);
    
    return {
      keywordMatch: this.calculateKeywordMatch(keywordExtraction, mistralAnalysis, jobKeywords),
      experienceRelevance: this.calculateExperienceRelevance(mistralAnalysis),
      formattingCompatibility: this.calculateFormattingCompatibility(resume, formattingAnalysis),
      contentQuality: this.calculateContentQuality(resume, keywordExtraction),
      semanticAlignment: this.calculateSemanticAlignment(mistralAnalysis),
      keywordStuffing: this.calculateKeywordStuffingScore(keywordStuffingResult)
    };
  }

  private calculateKeywordMatch(
    keywordExtraction: KeywordExtractionResult,
    mistralAnalysis: MistralAnalysisResult,
    jobKeywords?: string[]
  ): ScoringFactors['keywordMatch'] {
    if (!jobKeywords || jobKeywords.length === 0) {
      return {
        score: 50,
        weight: this.WEIGHTS.keywordMatch,
        directMatches: [],
        semanticMatches: [],
        missingCritical: []
      };
    }

    const resumeKeywords = keywordExtraction.keywords.map(k => k.keyword.toLowerCase());
    const jobKeywordsLower = jobKeywords.map(k => k.toLowerCase());

    // Direct matches
    const directMatches = jobKeywordsLower.filter(jk => 
      resumeKeywords.some(rk => rk.includes(jk) || jk.includes(rk))
    );

    // Semantic matches from Mistral
    const semanticMatches = mistralAnalysis.semanticMatches
      .filter(match => match.category === 'semantic')
      .map(match => match.skill)
      .filter(skill => !directMatches.includes(skill));

    // Missing critical skills
    const missingCritical = jobKeywordsLower.filter(jk => 
      !directMatches.includes(jk) && 
      !semanticMatches.some(sm => sm.toLowerCase().includes(jk))
    );

    // Calculate score
    const totalRequired = jobKeywords.length;
    const matchedCount = directMatches.length + semanticMatches.length;
    const missingPenalty = missingCritical.length * 5;

    let score = (matchedCount / totalRequired) * 100;
    score = Math.max(0, score - missingPenalty);
    score = Math.min(100, score);

    return {
      score,
      weight: this.WEIGHTS.keywordMatch,
      directMatches,
      semanticMatches,
      missingCritical
    };
  }

  private calculateExperienceRelevance(mistralAnalysis: MistralAnalysisResult): ScoringFactors['experienceRelevance'] {
    const { experienceAlignment } = mistralAnalysis;
    
    // Calculate seniority match score
    let seniorityScore = 50;
    switch (experienceAlignment.seniorityMatch) {
      case 'match': seniorityScore = 100; break;
      case 'under': seniorityScore = 60; break;
      case 'over': seniorityScore = 40; break;
    }

    // Weighted average of experience factors
    const score = (
      experienceAlignment.relevanceScore * 40 +
      experienceAlignment.industryAlignment * 30 +
      experienceAlignment.projectRelevance * 20 +
      seniorityScore * 10
    ) / 100;

    return {
      score,
      weight: this.WEIGHTS.experienceRelevance,
      yearsMatch: experienceAlignment.relevanceScore * 100,
      seniorityMatch: seniorityScore,
      industryAlignment: experienceAlignment.industryAlignment * 100
    };
  }

  private calculateFormattingCompatibility(resume: ParsedResume, formattingAnalysis?: FormattingAnalysis): ScoringFactors['formattingCompatibility'] {
    const { metadata, sections } = resume;
    
    // Section structure score
    const standardSections = ['summary', 'experience', 'skills', 'education'];
    const hasStandardSections = standardSections.some(sectionType =>
      sections.some(section => section.type === sectionType)
    );
    const sectionStructureScore = hasStandardSections ? 100 : 60;

    // Readability score based on word count and structure
    let readabilityScore = 50;
    if (metadata.wordCount >= 200 && metadata.wordCount <= 600) {
      readabilityScore = 100;
    } else if (metadata.wordCount >= 150 && metadata.wordCount <= 800) {
      readabilityScore = 80;
    } else if (metadata.wordCount >= 100 && metadata.wordCount <= 1000) {
      readabilityScore = 60;
    }

    // ATS friendliness from metadata and formatting analysis
    let atsFriendlinessScore = metadata.formattingScore;
    
    if (formattingAnalysis) {
      // Adjust based on formatting risks
      atsFriendlinessScore = formattingAnalysis.compatibilityScore;
    }

    // Weighted average
    const score = (
      sectionStructureScore * 40 +
      readabilityScore * 30 +
      atsFriendlinessScore * 30
    ) / 100;

    return {
      score,
      weight: this.WEIGHTS.formattingCompatibility,
      sectionStructure: sectionStructureScore,
      readability: readabilityScore,
      atsFriendliness: atsFriendlinessScore
    };
  }

  private calculateContentQuality(
    resume: ParsedResume,
    keywordExtraction: KeywordExtractionResult
  ): ScoringFactors['contentQuality'] {
    // Quantifiable achievements
    const quantifiableScore = resume.metadata.hasQuantifiableAchievements ? 100 : 30;

    // Action verb usage (simplified detection)
    const actionVerbs = ['managed', 'led', 'developed', 'implemented', 'created', 'optimized', 'improved'];
    const resumeText = resume.rawText.toLowerCase();
    const actionVerbCount = actionVerbs.filter(verb => resumeText.includes(verb)).length;
    const actionVerbScore = Math.min(100, actionVerbCount * 20);

    // Skill validation (based on keyword extraction quality)
    const hardSkillRatio = keywordExtraction.summary.hardSkills / Math.max(1, keywordExtraction.summary.totalKeywords);
    const skillValidationScore = hardSkillRatio * 100;

    // Weighted average
    const score = (
      quantifiableScore * 40 +
      actionVerbScore * 30 +
      skillValidationScore * 30
    ) / 100;

    return {
      score,
      weight: this.WEIGHTS.contentQuality,
      quantifiableAchievements: quantifiableScore,
      actionVerbUsage: actionVerbScore,
      skillValidation: skillValidationScore
    };
  }

  private calculateSemanticAlignment(mistralAnalysis: MistralAnalysisResult): ScoringFactors['semanticAlignment'] {
    const { contextualRelevance, skillGapAnalysis } = mistralAnalysis;

    // Contextual relevance from Mistral
    const contextualScore = contextualRelevance * 100;

    // Transferable skills bonus
    const transferableScore = Math.min(100, skillGapAnalysis.transferableSkills.length * 15);

    // Skill gap penalty
    const gapPenalty = Math.min(50, skillGapAnalysis.missingCritical.length * 10);

    // Calculate final score
    let score = contextualScore * 0.6 + transferableScore * 0.4;
    score = Math.max(0, score - gapPenalty);
    score = Math.min(100, score);

    return {
      score,
      weight: this.WEIGHTS.semanticAlignment,
      contextualRelevance: contextualScore,
      transferableSkills: transferableScore,
      skillGapPenalty: gapPenalty
    };
  }

  private calculateKeywordStuffingScore(keywordStuffingResult: KeywordStuffingResult): ScoringFactors['keywordStuffing'] {
    // Base score is 100, reduced by penalty
    const score = Math.max(0, 100 - keywordStuffingResult.penaltyScore);

    return {
      score,
      weight: 0.05, // 5% weight for anti-manipulation
      riskLevel: keywordStuffingResult.riskLevel,
      penaltyScore: keywordStuffingResult.penaltyScore,
      suspiciousKeywords: keywordStuffingResult.suspiciousKeywords
    };
  }

  private calculateOverallScore(factors: ScoringFactors): number {
    const weightedScores = [
      factors.keywordMatch.score * factors.keywordMatch.weight,
      factors.experienceRelevance.score * factors.experienceRelevance.weight,
      factors.formattingCompatibility.score * factors.formattingCompatibility.weight,
      factors.contentQuality.score * factors.contentQuality.weight,
      factors.semanticAlignment.score * factors.semanticAlignment.weight,
      factors.keywordStuffing.score * factors.keywordStuffing.weight
    ];

    const totalWeight = Object.values(this.WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    const weightedSum = weightedScores.reduce((sum, score) => sum + score, 0);

    return Math.round(weightedSum / totalWeight);
  }

  private determineGrade(score: number): DetailedScore['grade'] {
    for (const [grade, threshold] of Object.entries(this.GRADE_THRESHOLDS)) {
      if (score >= threshold) {
        return grade as DetailedScore['grade'];
      }
    }
    return 'F';
  }

  private generateRecommendations(factors: ScoringFactors, overallScore: number): DetailedScore['recommendations'] {
    const critical: string[] = [];
    const important: string[] = [];
    const suggested: string[] = [];

    // Critical recommendations (score < 60)
    if (factors.keywordMatch.score < 50) {
      critical.push('Add more relevant keywords from the job description');
    }
    if (factors.experienceRelevance.score < 40) {
      critical.push('Ensure your experience level matches the job requirements');
    }
    if (factors.formattingCompatibility.score < 50) {
      critical.push('Fix formatting issues to improve ATS readability');
    }

    // Important recommendations (score < 80)
    if (factors.keywordMatch.missingCritical.length > 3) {
      important.push(`Address ${factors.keywordMatch.missingCritical.length} missing critical skills`);
    }
    if (factors.contentQuality.quantifiableAchievements < 50) {
      important.push('Add quantifiable achievements with specific metrics');
    }
    if (factors.semanticAlignment.contextualRelevance < 70) {
      important.push('Improve contextual relevance of your skills and experience');
    }

    // Suggested improvements
    if (factors.contentQuality.actionVerbUsage < 60) {
      suggested.push('Use more action verbs to describe your accomplishments');
    }
    if (factors.experienceRelevance.industryAlignment < 80) {
      suggested.push('Highlight industry-specific experience and terminology');
    }
    if (overallScore >= 80) {
      suggested.push('Fine-tune specific skills for optimal matching');
    }

    return { critical, important, suggested };
  }

  private calculateConfidence(factors: ScoringFactors, mistralAnalysis: MistralAnalysisResult): number {
    // Base confidence from Mistral
    let confidence = mistralAnalysis.confidence;

    // Adjust based on factor consistency
    const factorScores = [
      factors.keywordMatch.score,
      factors.experienceRelevance.score,
      factors.formattingCompatibility.score,
      factors.contentQuality.score,
      factors.semanticAlignment.score
    ];

    const variance = this.calculateVariance(factorScores);
    const consistencyBonus = Math.max(0, 1 - variance / 1000) * 0.2;

    confidence = Math.min(1, confidence + consistencyBonus);
    return Math.round(confidence * 100);
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  }
}

export const scoringEngine = new ScoringEngine();
