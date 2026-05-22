/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const routes = [
  '/',
  '/all-tools',
  '/resume-builder',
  '/ats-resume-checker',
  '/cover-letter-generator',
  '/job-tracker',
  '/interview-prep',
  '/pdf-converter',
  '/ai-assistant',
  '/ai-caption-generator',
  '/youtube-title-generator',
  '/age-calculator',
  '/gpa-calculator',
  '/contact',
  '/profile'
];

function prerender() {
  console.log('Starting prerendering...');
  
  for (const route of routes) {
    console.log(`Prerendering: ${route}`);
    
    // Read the built index.html
    const indexPath = path.resolve(process.cwd(), 'dist/index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    
    // Create a DOM to manipulate the HTML
    const dom = new JSDOM(indexHtml);
    const document = dom.window.document;
    const head = document.head;
    
    // Generate canonical URL for this route
    const canonicalUrl = `https://lumintoolkit.com${route}`;
    
    // Remove any existing canonical tag
    const existingCanonical = head.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }
    
    // Add new canonical tag
    const canonicalTag = document.createElement('link');
    canonicalTag.setAttribute('rel', 'canonical');
    canonicalTag.setAttribute('href', canonicalUrl);
    head.appendChild(canonicalTag);
    
    // Generate the final HTML
    const finalHtml = dom.serialize();
    
    // Write to the appropriate file
    const outputPath = route === '/' 
      ? path.resolve(process.cwd(), 'dist/index.html')
      : path.resolve(process.cwd(), 'dist', route.slice(1), 'index.html');
    
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, finalHtml);
    console.log(`✓ Generated: ${outputPath} with canonical: ${canonicalUrl}`);
  }
  
  console.log('Prerendering complete!');
}

prerender();
