/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import SeoHead from '../components/SeoHead';

// Lazily load pages
const Homepage = React.lazy(() => import('../pages/Homepage'));
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const ResumeBuilder = React.lazy(() => import('../pages/ResumeBuilder'));
const PdfConverter = React.lazy(() => import('../pages/PdfConverter'));
const AgeCalculator = React.lazy(() => import('../pages/AgeCalculator'));
const GpaCalculator = React.lazy(() => import('../pages/GpaCalculator'));
const AiCaption = React.lazy(() => import('../pages/AiCaption'));
const YoutubeTitles = React.lazy(() => import('../pages/YoutubeTitles'));
const AiChat = React.lazy(() => import('../pages/AiChat'));
const AtsChecker = React.lazy(() => import('../pages/JobToolkit/AtsChecker'));
const JobTracker = React.lazy(() => import('../pages/JobToolkit/JobTracker'));
const InterviewPrep = React.lazy(() => import('../pages/JobToolkit/InterviewPrep'));
const CoverLetter = React.lazy(() => import('../pages/JobToolkit/CoverLetter'));
const Contact = React.lazy(() => import('../pages/Contact'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-[calc(100vh-64px)] md:h-screen">
    <div className="relative">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 w-8 h-8 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
    </div>
  </div>
);

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="Lumina Toolkit - Free Productivity Tools & AI Assistants"
              description="Access 14+ free AI-powered tools including resume builders, PDF converters, calculators, and job search assistants. Boost your productivity today."
            />
            <Suspense fallback={<LoadingFallback />}>
              <Homepage />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/all-tools" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="All Tools - Lumina Toolkit"
              description="Explore our complete collection of free productivity tools, AI assistants, and utilities for work and study."
            />
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/ai-assistant" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="AI Assistant - Free Chat & Productivity Help | Lumina Toolkit"
              description="Chat with your personal AI productivity companion for instant help with tasks, writing, and problem-solving."
            />
            <Suspense fallback={<LoadingFallback />}>
              <AiChat />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/resume-builder" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="Resume Builder - Create Professional Resumes Free | Lumina Toolkit"
              description="Build professional resumes in minutes with our free resume builder. Multiple templates and AI-powered suggestions."
            />
            <Suspense fallback={<LoadingFallback />}>
              <ResumeBuilder />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/pdf-converter" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="PDF Converter - Convert Images to PDF Free | Lumina Toolkit"
              description="Convert images and documents to high-quality PDF files instantly. Free, secure, and no registration required."
            />
            <Suspense fallback={<LoadingFallback />}>
              <PdfConverter />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/age-calculator" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="Age Calculator - Calculate Exact Age & Birthday | Lumina Toolkit"
              description="Calculate your exact age in years, months, and days. Find out when your next birthday is and more."
            />
            <Suspense fallback={<LoadingFallback />}>
              <AgeCalculator />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/gpa-calculator" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="GPA Calculator - Calculate Grade Point Average Free | Lumina Toolkit"
              description="Calculate your GPA instantly with our free calculator. Supports multiple grading scales and weighted courses."
            />
            <Suspense fallback={<LoadingFallback />}>
              <GpaCalculator />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/ai-caption-generator" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="AI Caption Generator - Create Engaging Social Media Captions | Lumina Toolkit"
              description="Generate compelling captions for social media posts using AI. Perfect for Instagram, Facebook, Twitter, and more."
            />
            <Suspense fallback={<LoadingFallback />}>
              <AiCaption />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/youtube-title-generator" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="YouTube Title Generator - Optimize Video Titles for CTR | Lumina Toolkit"
              description="Create catchy, SEO-optimized YouTube titles that increase click-through rates and video visibility."
            />
            <Suspense fallback={<LoadingFallback />}>
              <YoutubeTitles />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/ats-resume-checker" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="ATS Resume Checker - Optimize Resume for ATS Systems | Lumina Toolkit"
              description="Analyze and optimize your resume for Applicant Tracking Systems (ATS). Increase your chances of getting interviews."
            />
            <Suspense fallback={<LoadingFallback />}>
              <AtsChecker />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/job-tracker" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="Job Tracker - Track Job Applications Free | Lumina Toolkit"
              description="Monitor your job applications from submission to interview. Stay organized and never miss an opportunity."
            />
            <Suspense fallback={<LoadingFallback />}>
              <JobTracker />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/interview-prep" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="Interview Preparation - Practice Questions & Coaching | Lumina Toolkit"
              description="Prepare for job interviews with AI-powered coaching, practice questions, and personalized feedback."
            />
            <Suspense fallback={<LoadingFallback />}>
              <InterviewPrep />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/cover-letter-generator" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="Cover Letter Generator - AI-Powered Cover Letters | Lumina Toolkit"
              description="Create tailored, professional cover letters in minutes with AI. Customize for any job application."
            />
            <Suspense fallback={<LoadingFallback />}>
              <CoverLetter />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
      
      <Route path="/contact" element={
        <AnimatedPage>
          <Layout>
            <SeoHead
              title="Contact Us - Support & Feedback | Lumina Toolkit"
              description="Get help, suggest features, or report issues. We're here to improve your toolkit experience."
            />
            <Suspense fallback={<LoadingFallback />}>
              <Contact />
            </Suspense>
          </Layout>
        </AnimatedPage>
      } />
    </Routes>
  );
};

export default AppRoutes;
