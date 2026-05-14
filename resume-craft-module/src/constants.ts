/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ResumeData } from './types';

export const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    jobTitle: 'Senior Software Engineer',
    email: 'john.doe@example.com',
    phone: '+1 (555) 000-0000',
    address: 'San Francisco, CA',
    website: 'linkedin.com/in/johndoe',
    summary: 'Passionate software engineer with 8+ years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture.',
  },
  education: [
    {
      id: '1',
      school: 'University of Technology',
      degree: 'B.Sc. in Computer Science',
      period: '2012 - 2016',
      description: 'Graduated with honors. Specialized in Distributed Systems.',
    },
  ],
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      role: 'Senior Developer',
      period: '2019 - Present',
      description: 'Led a team of 5 developers to rebuild the core API, improving performance by 40%. Implemented CI/CD pipelines and microservices architecture.',
    },
    {
      id: '2',
      company: 'App Studio',
      role: 'Full Stack Engineer',
      period: '2016 - 2019',
      description: 'Developed and maintained 10+ client applications using React and Firebase. Collaborated with designers to ensure high-quality UX.',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript', level: 90 },
    { id: '2', name: 'TypeScript', level: 85 },
    { id: '3', name: 'React', level: 95 },
    { id: '4', name: 'Node.js', level: 80 },
    { id: '5', name: 'PostgreSQL', level: 75 },
    { id: '6', name: 'AWS', level: 70 },
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      link: 'github.com/johndoe/shop',
      description: 'Built a full-featured e-commerce platform with Stripe integration and server-side rendering.',
    },
  ],
  customSections: [],
  activeTemplate: 'modern',
};
