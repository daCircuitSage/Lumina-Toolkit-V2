/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  jobTitle: string;
  website: string;
  photo?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  period: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 to 100
}

export interface Project {
  id: string;
  name: string;
  link: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: { id: string; name: string; value: string }[];
}

export type TemplateId = 'modern' | 'minimal' | 'corporate' | 'creative' | 'sidebar';

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  customSections: CustomSection[];
  activeTemplate: TemplateId;
}
