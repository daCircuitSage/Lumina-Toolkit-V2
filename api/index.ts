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

        prompt = `You are an expert ATS (Applicant Tracking System) analyst with advanced NLP capabilities. Analyze this resume against the job description using production-grade intelligence.

ANALYSIS REQUIREMENTS:
1. Use semantic understanding - "deploy apps" should match Docker/CI/CD
2. Apply technical keyword validation - ignore generic words like "I", "use", "apps"
3. Implement conservative scoring - be realistic about skill gaps
4. Provide explainable breakdown - show WHY score is what it is

SCORING CRITERIA:
- Direct keyword matches (60% weight)
- Semantic understanding of related concepts (15% weight)
- Missing required skills (25% penalty)
- Technical vocabulary validation

TECHNICAL FOCUS:
- Only count VALID technical skills (Docker, Kubernetes, React, Python, etc.)
- Ignore resume noise words (experience, team, project, etc.)
- Apply semantic mapping for related concepts
- Ensure score reflects REAL job match accuracy

Provide analysis in this exact format:

ATS Score: [0-100]
Summary: [Explain score with specific skill counts and gaps]
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

