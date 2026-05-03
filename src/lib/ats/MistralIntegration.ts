/**
 * Mistral AI Integration for Semantic ATS Analysis
 * Provides intelligent semantic understanding and contextual analysis
 */

export interface MistralAnalysisRequest {
  resumeText: string;
  jobDescription?: string;
  extractedKeywords: string[];
  experienceLevel?: string;
}

export interface SemanticMatch {
  skill: string;
  confidence: number;
  context: string;
  category: 'direct' | 'semantic' | 'inferred';
  evidence: string[];
  industryRelevance: number;
}

export interface SkillGapAnalysis {
  missingCritical: string[];
  missingRecommended: string[];
  transferableSkills: string[];
  skillLevelMismatch: string[];
}

export interface ExperienceAlignment {
  relevanceScore: number;
  yearsOfExperience: number;
  seniorityMatch: 'under' | 'match' | 'over';
  industryAlignment: number;
  projectRelevance: number;
  careerProgression: number;
}

export interface MistralAnalysisResult {
  semanticMatches: SemanticMatch[];
  skillGapAnalysis: SkillGapAnalysis;
  experienceAlignment: ExperienceAlignment;
  contextualRelevance: number;
  industrySpecificInsights: string[];
  recommendations: string[];
  confidence: number;
  keywordStuffingRisk: 'low' | 'medium' | 'high';
  skillValidationScore: number;
}

export class MistralIntegration {
  private apiKey: string;
  private baseUrl: string = 'https://api.mistral.ai/v1';

  constructor() {
    // Support both development (VITE_MISTRAL_API_KEY) and production (MISTRAL_API_KEY)
    this.apiKey = import.meta.env.VITE_MISTRAL_API_KEY || import.meta.env.MISTRAL_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Mistral API key not found. Set VITE_MISTRAL_API_KEY for development or MISTRAL_API_KEY for production.');
    }
  }

  async analyzeResume(request: MistralAnalysisRequest): Promise<MistralAnalysisResult> {
    if (!this.apiKey) {
      throw new Error('Mistral API key is required for semantic analysis');
    }

    try {
      const prompt = this.buildAnalysisPrompt(request);
      const response = await this.callMistralAPI(prompt);
      return this.parseMistralResponse(response);
    } catch (error) {
      console.error('Mistral analysis failed:', error);
      // Fallback to basic analysis if API fails
      return this.getFallbackAnalysis(request);
    }
  }

  private buildAnalysisPrompt(request: MistralAnalysisRequest): string {
    const { resumeText, jobDescription, extractedKeywords, experienceLevel } = request;
    
    // Detect industry from job description and resume
    const detectedIndustry = this.detectIndustry(resumeText, jobDescription);
    
    let prompt = `You are an expert ATS analyst with deep knowledge of recruitment technology, semantic analysis, and industry-specific hiring patterns. Analyze the following resume and job description with production-grade accuracy.

RESUME TEXT:
${resumeText.substring(0, 2000)}...

EXTRACTED KEYWORDS:
${extractedKeywords.join(', ')}

EXPERIENCE LEVEL: ${experienceLevel || 'Not specified'}
DETECTED INDUSTRY: ${detectedIndustry}

`;

    if (jobDescription) {
      prompt += `JOB DESCRIPTION:
${jobDescription.substring(0, 1500)}...

`;
    }

    prompt += `CRITICAL ANALYSIS REQUIREMENTS:

1. INDUSTRY-SPECIFIC SEMANTIC CLUSTERS:
   - Software Engineering: React/Vue/Angular, Node.js/Python/Java, AWS/Azure/GCP, PostgreSQL/MongoDB
   - Data Science: Python/R, TensorFlow/PyTorch, Pandas/NumPy, Jupyter, ML/DL
   - DevOps: Docker/Kubernetes, CI/CD, Terraform, Monitoring, Cloud Infrastructure
   - Product Management: Roadmapping, Analytics, User Research, Agile/Scrum, KPIs
   - Design: Figma/Sketch, UI/UX, Prototyping, Design Systems, User Research

2. ANTI-KEYWORD STUFFING DETECTION:
   - Flag suspicious keyword repetition (>3 times for same skill)
   - Detect unnatural keyword density
   - Identify contextless skill mentions
   - Validate skill claims with experience evidence

3. EXPERIENCE VALIDATION:
   - Cross-reference claimed skills with actual experience
   - Validate seniority level against years of experience
   - Check for skill progression and growth
   - Identify skill gaps for target role

4. SEMANTIC MATCHING RULES:
   - Direct match: Exact skill name (React, Python)
   - Semantic match: Related concepts (React ↔ Frontend Development)
   - Inferred match: Implied skills (Led team of 5 engineers → Leadership)
   - Transferable skills: Cross-applicable abilities

5. CONSERVATIVE SCORING PRINCIPLES:
   - Require evidence for skill claims
   - Penalize keyword stuffing
   - Reward contextual relevance
   - Consider industry standards

Provide detailed analysis in this JSON format:

{
  "semanticMatches": [
    {
      "skill": "skill name",
      "confidence": 0.95,
      "context": "brief context where skill was found",
      "category": "direct|semantic|inferred",
      "evidence": ["specific evidence from resume"],
      "industryRelevance": 0.9
    }
  ],
  "skillGapAnalysis": {
    "missingCritical": ["must-have skills missing with priority"],
    "missingRecommended": ["nice-to-have skills for competitive edge"],
    "transferableSkills": ["applicable skills from other domains"],
    "skillLevelMismatch": ["skills mentioned but at inappropriate level"]
  },
  "experienceAlignment": {
    "relevanceScore": 0.85,
    "yearsOfExperience": 5,
    "seniorityMatch": "under|match|over",
    "industryAlignment": 0.90,
    "projectRelevance": 0.80,
    "careerProgression": 0.75
  },
  "contextualRelevance": 0.88,
  "industrySpecificInsights": ["industry-specific observations and trends"],
  "recommendations": ["specific, actionable recommendations with priority"],
  "confidence": 0.92,
  "keywordStuffingRisk": "low|medium|high",
  "skillValidationScore": 0.85
}

ANALYSIS FOCUS:
1. Industry-specific skill validation and terminology
2. Contextual relevance over keyword frequency
3. Experience validation and seniority alignment
4. Anti-manipulation detection
5. Actionable, prioritized recommendations
6. Conservative, evidence-based scoring

Be thorough but conservative. Only claim skills with clear evidence. Provide specific, actionable insights that help job seekers improve their ATS compatibility.`;

    return prompt;
  }

  private detectIndustry(resumeText: string, jobDescription?: string): string {
    const combinedText = `${resumeText} ${jobDescription || ''}`.toLowerCase();
    
    const industryKeywords = {
      'Software Engineering': ['react', 'javascript', 'node.js', 'python', 'java', 'aws', 'docker', 'kubernetes', 'api', 'backend', 'frontend'],
      'Data Science': ['machine learning', 'python', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'jupyter', 'data analysis', 'statistics'],
      'DevOps': ['docker', 'kubernetes', 'ci/cd', 'terraform', 'aws', 'azure', 'jenkins', 'deployment', 'infrastructure'],
      'Product Management': ['product', 'roadmap', 'agile', 'scrum', 'kpi', 'analytics', 'user research', 'stakeholders'],
      'Design': ['figma', 'sketch', 'ui', 'ux', 'prototype', 'design system', 'user research', 'wireframe'],
      'Marketing': ['seo', 'sem', 'social media', 'content marketing', 'analytics', 'campaign', 'brand'],
      'Sales': ['crm', 'salesforce', 'lead generation', 'pipeline', 'closing', 'account management'],
      'Finance': ['financial modeling', 'excel', 'accounting', 'investment', 'risk management', 'compliance']
    };

    let maxScore = 0;
    let detectedIndustry = 'General';

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const score = keywords.filter(keyword => combinedText.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        detectedIndustry = industry;
      }
    }

    return detectedIndustry;
  }

  private async callMistralAPI(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private parseMistralResponse(response: string): MistralAnalysisResult {
    try {
      const parsed = JSON.parse(response);
      
      // Validate and sanitize response
      return {
        semanticMatches: this.validateSemanticMatches(parsed.semanticMatches || []),
        skillGapAnalysis: this.validateSkillGapAnalysis(parsed.skillGapAnalysis || {}),
        experienceAlignment: this.validateExperienceAlignment(parsed.experienceAlignment || {}),
        contextualRelevance: Math.max(0, Math.min(1, parsed.contextualRelevance || 0)),
        industrySpecificInsights: Array.isArray(parsed.industrySpecificInsights) 
          ? parsed.industrySpecificInsights.slice(0, 5) 
          : [],
        recommendations: Array.isArray(parsed.recommendations) 
          ? parsed.recommendations.slice(0, 8) 
          : [],
        confidence: Math.max(0, Math.min(1, parsed.confidence || 0)),
        keywordStuffingRisk: ['low', 'medium', 'high'].includes(parsed.keywordStuffingRisk) 
          ? parsed.keywordStuffingRisk 
          : 'low',
        skillValidationScore: Math.max(0, Math.min(1, parsed.skillValidationScore || 0))
      };
    } catch (error) {
      console.error('Failed to parse Mistral response:', error);
      throw new Error('Invalid response format from Mistral API');
    }
  }

  private validateSemanticMatches(matches: any[]): SemanticMatch[] {
    return matches
      .filter(match => match.skill && typeof match.confidence === 'number')
      .map(match => ({
        skill: String(match.skill),
        confidence: Math.max(0, Math.min(1, match.confidence)),
        context: String(match.context || ''),
        category: ['direct', 'semantic', 'inferred'].includes(match.category) 
          ? match.category 
          : 'semantic',
        evidence: Array.isArray(match.evidence) ? match.evidence.map(String) : [],
        industryRelevance: Math.max(0, Math.min(1, match.industryRelevance || 0.8))
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 15);
  }

  private validateSkillGapAnalysis(analysis: any): SkillGapAnalysis {
    return {
      missingCritical: Array.isArray(analysis.missingCritical) 
        ? analysis.missingCritical.map(String).slice(0, 8) 
        : [],
      missingRecommended: Array.isArray(analysis.missingRecommended) 
        ? analysis.missingRecommended.map(String).slice(0, 8) 
        : [],
      transferableSkills: Array.isArray(analysis.transferableSkills) 
        ? analysis.transferableSkills.map(String).slice(0, 6) 
        : [],
      skillLevelMismatch: Array.isArray(analysis.skillLevelMismatch) 
        ? analysis.skillLevelMismatch.map(String).slice(0, 6) 
        : []
    };
  }

  private validateExperienceAlignment(alignment: any): ExperienceAlignment {
    return {
      relevanceScore: Math.max(0, Math.min(1, alignment.relevanceScore || 0)),
      yearsOfExperience: Math.max(0, Math.floor(alignment.yearsOfExperience || 0)),
      seniorityMatch: ['under', 'match', 'over'].includes(alignment.seniorityMatch) 
        ? alignment.seniorityMatch 
        : 'match',
      industryAlignment: Math.max(0, Math.min(1, alignment.industryAlignment || 0)),
      projectRelevance: Math.max(0, Math.min(1, alignment.projectRelevance || 0)),
      careerProgression: Math.max(0, Math.min(1, alignment.careerProgression || 0.7))
    };
  }

  private getFallbackAnalysis(request: MistralAnalysisRequest): MistralAnalysisResult {
    // Basic keyword-based fallback when API is unavailable
    const resumeText = request.resumeText.toLowerCase();
    const keywords = request.extractedKeywords.map(k => k.toLowerCase());
    
    const semanticMatches: SemanticMatch[] = keywords.slice(0, 10).map(keyword => ({
      skill: keyword,
      confidence: 0.7,
      context: 'Basic keyword extraction',
      category: 'direct' as const,
      evidence: [keyword],
      industryRelevance: 0.8
    }));

    return {
      semanticMatches,
      skillGapAnalysis: {
        missingCritical: [],
        missingRecommended: [],
        transferableSkills: [],
        skillLevelMismatch: []
      },
      experienceAlignment: {
        relevanceScore: 0.5,
        yearsOfExperience: 0,
        seniorityMatch: 'match' as const,
        industryAlignment: 0.5,
        projectRelevance: 0.5,
        careerProgression: 0.5
      },
      contextualRelevance: 0.5,
      industrySpecificInsights: ['AI analysis unavailable - using basic keyword matching'],
      recommendations: [
        'Consider adding more specific technical keywords',
        'Quantify your achievements with metrics',
        'Include relevant certifications and training'
      ],
      confidence: 0.3,
      keywordStuffingRisk: 'low',
      skillValidationScore: 0.6
    };
  }

  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;
    
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const mistralIntegration = new MistralIntegration();
