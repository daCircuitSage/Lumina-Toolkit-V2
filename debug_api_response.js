// Debug API Response
import fetch from 'node-fetch';

async function debugAPI() {
  const testResume = `
John Doe
Senior Full Stack Developer

Experience:
- Developed REST APIs using Node.js, Express, and MongoDB
- Built React applications with TypeScript and Redux
- Deployed applications using Docker and Kubernetes on AWS
- Implemented CI/CD pipelines with Jenkins and GitHub Actions
- Worked with PostgreSQL databases and Redis caching
- Used Git for version control and collaborated in Agile teams

Skills:
JavaScript, TypeScript, React, Node.js, Python, Docker, Kubernetes, AWS, MongoDB, PostgreSQL, Redis, Jenkins, CI/CD, Git, Agile
  `;

  const testJob = `
Senior Backend Developer Position

Requirements:
- 5+ years of experience with Node.js and Express
- Strong knowledge of React and TypeScript
- Experience with cloud platforms (AWS preferred)
- Containerization with Docker and Kubernetes
- Database experience with PostgreSQL and MongoDB
- CI/CD pipeline implementation
- Git version control and Agile methodologies
  `;

  try {
    console.log('🔍 Debugging API Response...');
    
    const response = await fetch('http://localhost:3001/api/ats-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume: testResume,
        jobDescription: testJob
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Raw API Response:');
    console.log('='.repeat(50));
    console.log(data.analysis);
    console.log('='.repeat(50));
    
    // Test different score extraction patterns
    const patterns = [
      /ATS Score:\s*(\d+)/,
      /(\d{1,3})\/100/,
      /(\d{1,3})%/,
      /score:\s*(\d{1,3})/i,
      /compatibility.*?(\d{1,3})/i
    ];
    
    console.log('\n🎯 Testing Score Extraction Patterns:');
    patterns.forEach((pattern, i) => {
      const match = data.analysis.match(pattern);
      console.log(`Pattern ${i + 1}: ${pattern} -> ${match ? match[1] : 'No match'}`);
    });
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  }
}

debugAPI();
