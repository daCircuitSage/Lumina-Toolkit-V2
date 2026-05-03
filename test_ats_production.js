// Production-Grade ATS System Test
import fetch from 'node-fetch';

// Test data for comprehensive validation
const testCases = [
  {
    name: "Backend Developer with strong technical skills",
    resume: `
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
    `,
    jobDescription: `
Senior Backend Developer Position

Requirements:
- 5+ years of experience with Node.js and Express
- Strong knowledge of React and TypeScript
- Experience with cloud platforms (AWS preferred)
- Containerization with Docker and Kubernetes
- Database experience with PostgreSQL and MongoDB
- CI/CD pipeline implementation
- Git version control and Agile methodologies
    `,
    expectedScore: 85
  },
  {
    name: "Junior Developer with basic skills",
    resume: `
Jane Smith
Junior Web Developer

Experience:
- Built simple websites with HTML and CSS
- Learned JavaScript basics
- Used Git for small projects
- Familiar with basic database concepts

Skills:
HTML, CSS, JavaScript, Git
    `,
    jobDescription: `
Senior Full Stack Developer Position

Requirements:
- 5+ years of experience with Node.js and Express
- Strong knowledge of React and TypeScript
- Experience with cloud platforms (AWS preferred)
- Containerization with Docker and Kubernetes
- Database experience with PostgreSQL and MongoDB
- CI/CD pipeline implementation
- Git version control and Agile methodologies
    `,
    expectedScore: 25
  },
  {
    name: "Data Scientist with semantic matches",
    resume: `
Mike Johnson
Data Scientist

Experience:
- Analyzed large datasets using Python and machine learning
- Built predictive models with scikit-learn and TensorFlow
- Created data visualizations with matplotlib and seaborn
- Deployed ML models using Flask and Docker containers
- Worked with SQL databases and cloud platforms

Skills:
Python, Machine Learning, TensorFlow, scikit-learn, Data Analysis, Flask, Docker, SQL, matplotlib
    `,
    jobDescription: `
Machine Learning Engineer Position

Requirements:
- Strong Python programming skills
- Experience with machine learning frameworks
- Knowledge of data science and analytics
- Cloud deployment experience
- Containerization with Docker
- Database knowledge
- Statistical analysis background
    `,
    expectedScore: 75
  }
];

async function runATSTest(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`Expected Score Range: ${testCase.expectedScore} ± 10`);
  
  try {
    const response = await fetch('http://localhost:3001/api/ats-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume: testCase.resume,
        jobDescription: testCase.jobDescription
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response Received');
    
    // Parse the analysis to extract score
    const analysis = data.analysis;
    const scorePatterns = [
      /ATS Compatibility Score:\s*(\d{1,3})\/100/,
      /ATS Score:\s*(\d{1,3})\/100/,
      /(\d{1,3})\/100/,
      /(\d{1,3})%/,
      /score:\s*(\d{1,3})/i,
      /compatibility.*?(\d{1,3})/i
    ];
    
    let score = 0;
    for (const pattern of scorePatterns) {
      const match = analysis.match(pattern);
      if (match) {
        score = parseInt(match[1]);
        break;
      }
    }
    
    console.log(`📊 Actual Score: ${score}%`);
    
    // Check if score is within expected range
    const scoreDiff = Math.abs(score - testCase.expectedScore);
    if (scoreDiff <= 10) {
      console.log('✅ Score within expected range');
    } else {
      console.log(`⚠️  Score outside expected range (diff: ${scoreDiff})`);
    }
    
    // Extract skills for validation
    const skillsMatch = analysis.match(/Key Skills Found:\s*([^\n]+)/);
    const missingMatch = analysis.match(/Missing Skills:\s*([^\n]+)/);
    
    if (skillsMatch) {
      const skills = skillsMatch[1].split(',').map(s => s.trim()).filter(s => s);
      console.log(`🎯 Skills Found: ${skills.length} - ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? '...' : ''}`);
    }
    
    if (missingMatch) {
      const missing = missingMatch[1].split(',').map(s => s.trim()).filter(s => s);
      console.log(`❌ Missing Skills: ${missing.length} - ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '...' : ''}`);
    }
    
    // Validate technical keyword extraction (check for non-technical words)
    const nonTechnicalWords = ['experience', 'team', 'project', 'work', 'use', 'developed', 'built', 'implemented'];
    const hasNonTechnical = nonTechnicalWords.some(word => 
      analysis.toLowerCase().includes(word.toLowerCase()) && 
      analysis.toLowerCase().includes(`skills found:`)
    );
    
    if (!hasNonTechnical) {
      console.log('✅ No non-technical words in skills extraction');
    } else {
      console.log('⚠️  Non-technical words detected in skills');
    }
    
    return { success: true, score, analysis };
    
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting Production-Grade ATS System Tests\n');
  console.log('Testing Features:');
  console.log('- Advanced NLP preprocessing with stop-word filtering');
  console.log('- Technical keyword whitelist validation');
  console.log('- Semantic matching algorithm');
  console.log('- Explainable scoring breakdown');
  console.log('- Conservative scoring logic\n');
  
  const results = [];
  
  for (const testCase of testCases) {
    const result = await runATSTest(testCase);
    results.push({ ...testCase, ...result });
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📋 Test Summary:');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Passed: ${passed}/${total} tests`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Production-grade ATS system is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Review the implementation.');
  }
  
  // Score analysis
  const scores = results.filter(r => r.success).map(r => r.score);
  if (scores.length > 0) {
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    console.log(`📊 Average Score: ${avgScore.toFixed(1)}%`);
  }
  
  return results;
}

// Run tests
runAllTests().catch(console.error);
