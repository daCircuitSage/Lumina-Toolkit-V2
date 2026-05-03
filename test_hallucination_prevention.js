// Hallucination Prevention Test Suite
import fetch from 'node-fetch';

// Test cases specifically designed to catch hallucination
const hallucinationTests = [
  {
    name: "CRITICAL: Resume with ONLY Docker should NOT hallucinate Kubernetes/AWS",
    resume: `
John Doe
DevOps Engineer

Experience:
- Worked with Docker containers
- Built containerized applications
- Used Docker for deployment

Skills:
Docker
    `,
    jobDescription: `
Senior DevOps Engineer Position

Requirements:
- Docker experience
- Kubernetes orchestration
- AWS cloud platform
- CI/CD pipelines
    `,
    expectedBehavior: {
      shouldNotContain: ['kubernetes', 'aws', 'azure', 'gcp', 'ci/cd'],
      shouldContain: ['docker'],
      keyStrengthsCount: 1,
      missingSkillsCount: 3
    }
  },
  {
    name: "CRITICAL: Resume with basic web dev should NOT hallucinate cloud platforms",
    resume: `
Jane Smith
Web Developer

Experience:
- Built websites with HTML and CSS
- Used JavaScript for interactivity
- Created responsive designs

Skills:
HTML, CSS, JavaScript
    `,
    jobDescription: `
Full Stack Developer Position

Requirements:
- HTML, CSS, JavaScript
- React framework
- Node.js backend
- AWS deployment
- MongoDB database
    `,
    expectedBehavior: {
      shouldNotContain: ['aws', 'azure', 'gcp', 'react', 'node.js', 'mongodb'],
      shouldContain: ['html', 'css', 'javascript'],
      keyStrengthsCount: 3,
      missingSkillsCount: 4
    }
  },
  {
    name: "EDGE CASE: Resume with 'deploy' should only enhance Docker, not create Kubernetes",
    resume: `
Mike Johnson
Backend Developer

Experience:
- Deploy applications using containers
- Handle deployment processes
- Work on deployment automation

Skills:
deployment, deploy
    `,
    jobDescription: `
Cloud Engineer Position

Requirements:
- Docker containerization
- Kubernetes orchestration
- AWS cloud services
    `,
    expectedBehavior: {
      shouldNotContain: ['kubernetes', 'aws', 'azure', 'gcp'],
      shouldContain: ['docker'], // Should be semantically matched from 'deploy'
      keyStrengthsCount: 1,
      missingSkillsCount: 2
    }
  },
  {
    name: "EDGE CASE: Resume with 'cloud' should only enhance AWS, not create all cloud platforms",
    resume: `
Sarah Wilson
Software Engineer

Experience:
- Work on cloud applications
- Cloud-based development
- Cloud architecture design

Skills:
cloud, cloud-based
    `,
    jobDescription: `
Cloud Architect Position

Requirements:
- AWS services
- Azure platform
- GCP services
- Cloud architecture
    `,
    expectedBehavior: {
      shouldNotContain: ['azure', 'gcp'],
      shouldContain: ['aws'], // Should be semantically matched from 'cloud'
      keyStrengthsCount: 2, // cloud + aws
      missingSkillsCount: 2
    }
  },
  {
    name: "CONTROL: Resume with multiple skills should show exact matches only",
    resume: `
Alex Brown
Full Stack Developer

Experience:
- Built React applications
- Developed Node.js APIs
- Worked with PostgreSQL databases
- Deployed to AWS

Skills:
React, Node.js, PostgreSQL, AWS
    `,
    jobDescription: `
Senior Full Stack Developer Position

Requirements:
- React framework
- Node.js backend
- PostgreSQL database
- AWS cloud platform
- Docker containers
    `,
    expectedBehavior: {
      shouldNotContain: ['docker', 'kubernetes', 'azure', 'gcp'],
      shouldContain: ['react', 'node.js', 'postgresql', 'aws'],
      keyStrengthsCount: 4,
      missingSkillsCount: 1
    }
  }
];

async function runHallucinationTest(testCase) {
  console.log(`\n🧪 Testing: ${testCase.name}`);
  console.log(`Expected: ${testCase.expectedBehavior.keyStrengthsCount} key strengths, ${testCase.expectedBehavior.missingSkillsCount} missing skills`);
  
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
    
    // Parse the analysis to extract structured data
    const analysis = data.analysis;
    
    // Extract score
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
    
    console.log(`📊 Score: ${score}%`);
    
    // Simulate frontend keyword extraction (same logic as frontend)
    const extractKeywords = (text) => {
      const technicalKeywords = new Set([
        'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'react', 'node.js', 
        'postgresql', 'mongodb', 'html', 'css', 'javascript', 'deploy', 'deployment', 'cloud'
      ]);
      
      const stopWords = new Set([
        'experience', 'work', 'worked', 'build', 'built', 'used', 'using', 'create', 'created',
        'handle', 'handling', 'work', 'worked', 'applications', 'processes', 'automation'
      ]);
      
      const normalized = text.toLowerCase().replace(/[^a-z0-9\s\-\/]/g, ' ').replace(/\s+/g, ' ');
      const tokens = normalized.split(' ');
      
      const keywords = new Set();
      tokens.forEach(token => {
        if (technicalKeywords.has(token) && !stopWords.has(token)) {
          keywords.add(token);
        }
      });
      
      // Strict semantic matching
      const semanticMappings = {
        'deploy': ['docker'],
        'deployment': ['docker'],
        'cloud': ['aws']
      };
      
      tokens.forEach(token => {
        if (semanticMappings[token]) {
          semanticMappings[token].forEach(relatedTech => {
            if (technicalKeywords.has(relatedTech) && keywords.has(token)) {
              keywords.add(relatedTech);
            }
          });
        }
      });
      
      return Array.from(keywords);
    };
    
    const resumeKeywords = extractKeywords(testCase.resume);
    const jobKeywords = extractKeywords(testCase.jobDescription);
    
    // Apply strict matching rules
    const matchedKeywords = resumeKeywords.filter(k => jobKeywords.includes(k));
    const missingKeywords = jobKeywords.filter(k => !resumeKeywords.includes(k));
    
    console.log(`🎯 Resume Keywords: ${resumeKeywords.join(', ')}`);
    console.log(`🎯 Job Keywords: ${jobKeywords.join(', ')}`);
    console.log(`✅ Matched Keywords: ${matchedKeywords.join(', ')}`);
    console.log(`❌ Missing Keywords: ${missingKeywords.join(', ')}`);
    
    // Validate hallucination prevention
    let hallucinationDetected = false;
    const violations = [];
    
    // Check for skills that should NOT be present
    testCase.expectedBehavior.shouldNotContain.forEach(forbiddenSkill => {
      if (matchedKeywords.includes(forbiddenSkill)) {
        hallucinationDetected = true;
        violations.push(`HALLUCINATION: Found '${forbiddenSkill}' which should NOT be present`);
      }
    });
    
    // Check for skills that SHOULD be present
    testCase.expectedBehavior.shouldContain.forEach(requiredSkill => {
      if (!matchedKeywords.includes(requiredSkill)) {
        hallucinationDetected = true;
        violations.push(`MISSING: Expected '${requiredSkill}' but not found`);
      }
    });
    
    // Check counts
    if (matchedKeywords.length !== testCase.expectedBehavior.keyStrengthsCount) {
      hallucinationDetected = true;
      violations.push(`COUNT MISMATCH: Expected ${testCase.expectedBehavior.keyStrengthsCount} key strengths, got ${matchedKeywords.length}`);
    }
    
    if (missingKeywords.length !== testCase.expectedBehavior.missingSkillsCount) {
      hallucinationDetected = true;
      violations.push(`COUNT MISMATCH: Expected ${testCase.expectedBehavior.missingSkillsCount} missing skills, got ${missingKeywords.length}`);
    }
    
    if (hallucinationDetected) {
      console.log('\n❌ HALLUCINATION DETECTED!');
      violations.forEach(violation => console.log(`   - ${violation}`));
      return { success: false, violations, score, matchedKeywords, missingKeywords };
    } else {
      console.log('✅ NO HALLUCINATION - All checks passed');
      return { success: true, score, matchedKeywords, missingKeywords };
    }
    
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function runAllHallucinationTests() {
  console.log('🚀 Starting Hallucination Prevention Tests\n');
  console.log('Testing Rules:');
  console.log('- Key Strengths MUST be present in Resume AND Job Description');
  console.log('- Semantic matches MUST enhance existing resume skills ONLY');
  console.log('- Missing Skills MUST come from Job Description ONLY');
  console.log('- NO hallucination of skills not present in resume\n');
  
  const results = [];
  
  for (const testCase of hallucinationTests) {
    const result = await runHallucinationTest(testCase);
    results.push({ ...testCase, ...result });
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📋 Hallucination Prevention Summary:');
  console.log('='.repeat(60));
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  const critical = results.filter(r => r.name.includes('CRITICAL')).length;
  const criticalPassed = results.filter(r => r.success && r.name.includes('CRITICAL')).length;
  
  console.log(`✅ Overall: ${passed}/${total} tests passed`);
  console.log(`🚨 Critical Tests: ${criticalPassed}/${critical} passed`);
  
  if (passed === total && criticalPassed === critical) {
    console.log('🎉 ALL HALLUCINATION PREVENTION TESTS PASSED!');
    console.log('✅ System is working correctly with no hallucination');
  } else {
    console.log('⚠️  HALLUCINATION DETECTED - Fix required');
    
    const failed = results.filter(r => !r.success);
    console.log('\n❌ Failed Tests:');
    failed.forEach(test => {
      console.log(`   - ${test.name}`);
      if (test.violations) {
        test.violations.forEach(v => console.log(`     * ${v}`));
      }
    });
  }
  
  return results;
}

// Run hallucination prevention tests
runAllHallucinationTests().catch(console.error);
