import express from "express";

import { createServer as createViteServer } from "vite";

import path from "path";

import { fileURLToPath } from "url";

import dotenv from "dotenv";



dotenv.config();



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);



export default async function handler(req: any, res: any) {

  const app = express();

  app.use(express.json());



  // Mistral AI API Routes

  app.post('/api/chat', async (req, res) => {

    try {

      const { message, history = [] } = req.body;

      

      if (!message) {

        return res.status(400).json({ error: 'Message is required' });

      }



      const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

      if (!MISTRAL_API_KEY) {

        throw new Error('MISTRAL_API_KEY is not configured');

      }



      const messages = [

        { role: 'system', content: 'You are a helpful, intelligent AI assistant inside a productivity SaaS platform called Lumina Toolkit. You help users with writing, coding, learning, and general questions. Keep responses clear, practical, and human-like.' },

        ...history.map((msg: any) => ({

          role: msg.role === 'user' ? 'user' : 'assistant',

          content: msg.content

        })),

        { role: 'user', content: message }

      ];



      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {

        method: 'POST',

        headers: {

          'Authorization': `Bearer ${MISTRAL_API_KEY}`,

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          model: 'mistral-small',

          messages: messages,

          temperature: 0.7,

          max_tokens: 2000,

        }),

      });



      if (!response.ok) {

        const errorData = await response.json().catch(() => ({}));

        throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);

      }



      const data = await response.json();

      

      if (!data.choices || data.choices.length === 0) {

        throw new Error('No response from Mistral API');

      }



      res.json({ response: data.choices[0].message.content });

    } catch (error) {

      console.error('AI Chat Error:', error);

      res.status(500).json({ 

        error: error instanceof Error ? error.message : 'AI service is temporarily unavailable' 

      });

    }

  });



  app.post('/api/ats-analyze', async (req, res) => {
    try {
      const { resume, jobDescription, extractedKeywords, experienceLevel } = req.body;
      
      if (!resume) {
        return res.status(400).json({ error: 'Resume is required' });
      }

      const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
      if (!MISTRAL_API_KEY) {
        throw new Error('MISTRAL_API_KEY is not configured');
      }

      // Enhanced prompt for production-grade analysis
      let prompt = `You are an expert ATS analyst with deep knowledge of recruitment technology and semantic analysis. Analyze the following resume and job description to provide detailed insights.

RESUME TEXT:
${resume.substring(0, 2000)}...

EXTRACTED KEYWORDS:
${extractedKeywords ? extractedKeywords.join(', ') : 'No keywords provided'}

EXPERIENCE LEVEL: ${experienceLevel || 'Not specified'}

`;

      if (jobDescription) {
        prompt += `JOB DESCRIPTION:
${jobDescription.substring(0, 1500)}...

`;
      }

      prompt += `Provide a detailed analysis in the following JSON format:

{
  "semanticMatches": [
    {
      "skill": "skill name",
      "confidence": 0.95,
      "context": "brief context where skill was found",
      "category": "direct|semantic|inferred",
      "evidence": ["specific evidence from resume"]
    }
  ],
  "skillGapAnalysis": {
    "missingCritical": ["must-have skills missing"],
    "missingRecommended": ["nice-to-have skills missing"],
    "transferableSkills": ["skills that can be applied"],
    "skillLevelMismatch": ["skills mentioned but at wrong level"]
  },
  "experienceAlignment": {
    "relevanceScore": 0.85,
    "yearsOfExperience": 5,
    "seniorityMatch": "under|match|over",
    "industryAlignment": 0.90,
    "projectRelevance": 0.80
  },
  "contextualRelevance": 0.88,
  "industrySpecificInsights": ["industry-specific observations"],
  "recommendations": ["specific, actionable recommendations"],
  "confidence": 0.92
}

Focus on:
1. Semantic understanding beyond keyword matching
2. Contextual skill validation
3. Experience level appropriateness
4. Industry-specific terminology
5. Transferable skill identification
6. Actionable improvement recommendations

Be conservative in scoring - prioritize accuracy over optimism. Only claim skills with clear evidence.`;

      const messages = [
        { role: 'system', content: 'You are an expert ATS analyst with deep knowledge of recruitment technology and semantic analysis. Provide accurate, conservative analysis with clear evidence for all claims.' },
        { role: 'user', content: prompt }
      ];

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: messages,
          temperature: 0.1,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Mistral API');
      }

      const analysisData = JSON.parse(data.choices[0].message.content);
      res.json({ analysis: analysisData });
    } catch (error) {
      console.error('ATS Analysis Error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'AI service is temporarily unavailable' 
      });
    }
  });

  app.post('/api/ats-check', async (req, res) => {

    try {

      const { resume, jobDescription } = req.body;
      

      if (!resume) {

        return res.status(400).json({ error: 'Resume is required' });

      }



      const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

      if (!MISTRAL_API_KEY) {

        throw new Error('MISTRAL_API_KEY is not configured');

      }



      let prompt;

      if (jobDescription && jobDescription.trim()) {

        prompt = `You are an expert ATS (Applicant Tracking System) analyst with advanced NLP capabilities and typo-tolerant matching. Analyze this resume against the job description using production-grade intelligence.

CRITICAL REQUIREMENTS:
1. IMPLEMENT FUZZY MATCHING - "backed engineer" ≈ "backend engineer"
2. TYPO TOLERANCE - Minor spelling errors should not cause 0% score
3. SEMANTIC CLUSTERING - Backend skills: Django, Python, REST API, PostgreSQL, FastAPI
4. NORMALIZATION - Lowercase, trim whitespace, normalize punctuation
5. NEVER 0% SCORE - If relevant skills exist, score must reflect that

NORMALIZATION PIPELINE:
- Convert all text to lowercase
- Remove extra whitespace and normalize punctuation
- Normalize compound words: "rest api" = "restful api"
- Normalize common variants: "javascript" = "javascript", "reactjs" = "react js"

FUZZY MATCHING RULES:
- backend ≈ backed
- javascript ≈ javasript  
- reactjs ≈ react js
- nodejs ≈ node js
- api ≈ apis
- database ≈ databases

SEMANTIC BACKEND CLUSTER:
If JD mentions "backend engineer", these resume skills should score positively:
- Django, Flask, FastAPI, Express, NestJS
- Python, JavaScript, TypeScript, Go
- REST API, GraphQL, gRPC
- PostgreSQL, MySQL, MongoDB, Redis
- Docker, Kubernetes, CI/CD
- AWS, Azure, GCP

SCORING ALGORITHM:
- Direct exact matches: 40% weight
- Fuzzy/tolerant matches: 20% weight  
- Semantic cluster matches: 20% weight
- Missing skills penalty: 20% weight
- NEVER allow single typo to collapse score to zero

Provide analysis in this exact format:

ATS Score: [0-100]
Summary: [Explain score with specific skill counts and semantic matches]
Key Skills Found: [list 3-5 VALID technical skills only]
Missing Skills: [list 3-5 missing technical skills from JD]
Top Recommendations: [list 2-3 specific, actionable technical improvements]

Resume:
${resume}

Job Description:
${jobDescription}`;

      } else {

        prompt = `You are an expert ATS (Applicant Tracking System) analyst with advanced NLP capabilities. Analyze this resume for ATS compatibility using production-grade intelligence.

ANALYSIS REQUIREMENTS:
1. Use technical keyword validation - ignore generic words
2. Apply conservative scoring - be realistic about skill level
3. Focus on actual technical skills, not soft skills
4. Provide actionable technical recommendations

SCORING CRITERIA:
- Technical keyword presence (40% weight)
- Resume structure and formatting (30% weight)
- Action verbs and quantifiable achievements (20% weight)
- Section organization (10% weight)

TECHNICAL FOCUS:
- Only count VALID technical skills (React, Python, Docker, etc.)
- Ignore generic resume words (experience, team, project, etc.)
- Validate technical vocabulary against industry standards
- Ensure score reflects actual ATS compatibility

Provide analysis in this exact format:

ATS Score: [0-100]
Summary: [Explain score with specific technical assessment]
Key Skills Found: [list 3-5 VALID technical skills only]
Areas to Improve: [list 3-5 specific technical areas]
Top Recommendations: [list 2-3 actionable technical improvements]

Resume:
${resume}`;

      }

      const messages = [
        { role: 'system', content: 'You are an expert ATS (Applicant Tracking System) analyst with advanced NLP capabilities and production-grade intelligence. Analyze resumes with semantic understanding, technical keyword validation, and conservative scoring. Focus on actual technical skills and provide explainable, actionable insights. Be realistic about skill gaps and don\'t inflate scores.' },
        { role: 'user', content: prompt }
      ];

      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-small',
          messages: messages,
          temperature: 0.1, // Very low temperature for consistent results
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response from Mistral API');
      }

      res.json({ analysis: data.choices[0].message.content });
    } catch (error) {
      console.error('ATS Check Error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'AI service is temporarily unavailable' 
      });
    }
  });



  app.post('/api/cover-letter', async (req, res) => {

    try {

      const { resume, jobDescription, tone = 'professional' } = req.body;

      

      if (!resume || !jobDescription) {

        return res.status(400).json({ error: 'Resume and job description are required' });

      }



      const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

      if (!MISTRAL_API_KEY) {

        throw new Error('MISTRAL_API_KEY is not configured');

      }



      const prompt = `Generate a ${tone} cover letter based on:

Resume: ${resume}

Job Description: ${jobDescription}



Make it compelling and tailored to the position.`;



      const messages = [

        { role: 'system', content: 'You are a professional cover letter writer. Create compelling, personalized cover letters that highlight relevant experience.' },

        { role: 'user', content: prompt }

      ];



      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {

        method: 'POST',

        headers: {

          'Authorization': `Bearer ${MISTRAL_API_KEY}`,

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          model: 'mistral-small',

          messages: messages,

          temperature: 0.7,

          max_tokens: 1500,

        }),

      });



      if (!response.ok) {

        const errorData = await response.json().catch(() => ({}));

        throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);

      }



      const data = await response.json();

      

      if (!data.choices || data.choices.length === 0) {

        throw new Error('No response from Mistral API');

      }



      res.json({ coverLetter: data.choices[0].message.content });

    } catch (error) {

      console.error('Cover Letter Error:', error);

      res.status(500).json({ 

        error: error instanceof Error ? error.message : 'AI service is temporarily unavailable' 

      });

    }

  });



  app.post('/api/interview', async (req, res) => {

    try {

      const { jobDescription, questionType = 'general' } = req.body;

      

      if (!jobDescription) {

        return res.status(400).json({ error: 'Job description is required' });

      }



      const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

      if (!MISTRAL_API_KEY) {

        throw new Error('MISTRAL_API_KEY is not configured');

      }



      const prompt = `Generate 5-7 ${questionType} interview questions for this position:

${jobDescription}



Include behavioral, technical, and situational questions.`;



      const messages = [

        { role: 'system', content: 'You are an expert interview coach. Generate relevant, challenging interview questions that help candidates prepare effectively.' },

        { role: 'user', content: prompt }

      ];



      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {

        method: 'POST',

        headers: {

          'Authorization': `Bearer ${MISTRAL_API_KEY}`,

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          model: 'mistral-small',

          messages: messages,

          temperature: 0.7,

          max_tokens: 1500,

        }),

      });



      if (!response.ok) {

        const errorData = await response.json().catch(() => ({}));

        throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);

      }



      const data = await response.json();

      

      if (!data.choices || data.choices.length === 0) {

        throw new Error('No response from Mistral API');

      }



      res.json({ questions: data.choices[0].message.content });

    } catch (error) {

      console.error('Interview Prep Error:', error);

      res.status(500).json({ 

        error: error instanceof Error ? error.message : 'AI service is temporarily unavailable' 

      });

    }

  });



  app.post('/api/caption', async (req, res) => {

    try {

      const { description, platform = 'Instagram', tone = 'Engaging' } = req.body;

      

      if (!description) {

        return res.status(400).json({ error: 'Description is required' });

      }



      const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

      if (!MISTRAL_API_KEY) {

        throw new Error('MISTRAL_API_KEY is not configured');

      }



      const prompt = `Generate 3 engaging social media captions for:

Platform: ${platform}

Tone: ${tone}

Description: ${description}



Separate each caption with [SEP]`;



      const messages = [

        { role: 'system', content: 'You are a professional social media copywriter. Generate engaging, platform-appropriate captions.' },

        { role: 'user', content: prompt }

      ];



      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {

        method: 'POST',

        headers: {

          'Authorization': `Bearer ${MISTRAL_API_KEY}`,

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          model: 'mistral-small',

          messages: messages,

          temperature: 0.8,

          max_tokens: 1000,

        }),

      });



      if (!response.ok) {

        const errorData = await response.json().catch(() => ({}));

        throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);

      }



      const data = await response.json();

      

      if (!data.choices || data.choices.length === 0) {

        throw new Error('No response from Mistral API');

      }



      res.json({ captions: data.choices[0].message.content });

    } catch (error) {

      console.error('Caption Generator Error:', error);

      res.status(500).json({ 

        error: error instanceof Error ? error.message : 'AI service is temporarily unavailable' 

      });

    }

  });



  app.post('/api/youtube-title', async (req, res) => {

    try {

      const { description, category = 'general' } = req.body;

      

      if (!description) {

        return res.status(400).json({ error: 'Description is required' });

      }



      const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

      if (!MISTRAL_API_KEY) {

        throw new Error('MISTRAL_API_KEY is not configured');

      }



      const prompt = `Generate 5 catchy YouTube titles for:

Category: ${category}

Description: ${description}



Make them SEO-friendly and engaging. Separate each title with [SEP]`;



      const messages = [

        { role: 'system', content: 'You are an expert YouTube content strategist. Generate catchy, SEO-friendly titles that attract viewers.' },

        { role: 'user', content: prompt }

      ];



      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {

        method: 'POST',

        headers: {

          'Authorization': `Bearer ${MISTRAL_API_KEY}`,

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          model: 'mistral-small',

          messages: messages,

          temperature: 0.8,

          max_tokens: 1000,

        }),

      });



      if (!response.ok) {

        const errorData = await response.json().catch(() => ({}));

        throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);

      }



      const data = await response.json();

      

      if (!data.choices || data.choices.length === 0) {

        throw new Error('No response from Mistral API');

      }



      res.json({ titles: data.choices[0].message.content });

    } catch (error) {

      console.error('YouTube Title Error:', error);

      res.status(500).json({ 

        error: error instanceof Error ? error.message : 'AI service is temporarily unavailable' 

      });

    }

  });



  app.post('/api/test-ai', async (req, res) => {

    try {

      const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;

      if (!MISTRAL_API_KEY) {

        throw new Error('MISTRAL_API_KEY is not configured');

      }



      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {

        method: 'POST',

        headers: {

          'Authorization': `Bearer ${MISTRAL_API_KEY}`,

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          model: 'mistral-small',

          messages: [

            { role: 'user', content: 'Hello! Please respond with "Mistral AI is working correctly!"' }

          ],

          temperature: 0.1,

          max_tokens: 100,

        }),

      });



      if (!response.ok) {

        const errorData = await response.json().catch(() => ({}));

        throw new Error(`Mistral API error: ${response.status} - ${errorData.error?.message || response.statusText}`);

      }



      const data = await response.json();

      

      if (!data.choices || data.choices.length === 0) {

        throw new Error('No response from Mistral API');

      }



      res.json({ 

        status: 'success',

        message: 'Mistral AI is working correctly!',

        response: data.choices[0].message.content 

      });

    } catch (error) {

      console.error('Test AI Error:', error);

      res.status(500).json({ 

        status: 'error',

        error: error instanceof Error ? error.message : 'AI service is temporarily unavailable' 

      });

    }

  });



  // Handle the request

  app(req, res);

}

