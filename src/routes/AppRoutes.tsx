/**

 * @license

 * SPDX-License-Identifier: Apache-2.0

 */



import React, { Suspense } from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import { motion } from 'motion/react';

import { AlertTriangle } from 'lucide-react';

import Layout from '../components/Layout';

import HomepageLayout from '../components/HomepageLayout';

import SeoHead from '../components/SeoHead';

import ErrorBoundary from '../components/ErrorBoundary';




// Lazily load pages

const Homepage = React.lazy(() => import('../pages/Homepage'));

const Dashboard = React.lazy(() => import('../pages/Dashboard'));

const ResumeBuilderStandalone = React.lazy(() => import('../pages/ResumeBuilderStandalone'));

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

const Profile = React.lazy(() => import('../pages/Profile'));

const Blog = React.lazy(() => import('../pages/Blog'));

const BlogPost = React.lazy(() => import('../pages/BlogPost'));




const LoadingFallback = () => (

  <div className="flex items-center justify-center h-[calc(100vh-64px)] md:h-screen">

    <div className="relative">

      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>

      <div className="absolute inset-0 w-8 h-8 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin animation-delay-150"></div>

    </div>

  </div>

);



const LazyLoadWrapper = ({ children }: { children: React.ReactNode }) => (

  <ErrorBoundary fallback={

    <div className="flex items-center justify-center h-[calc(100vh-64px)] md:h-screen">

      <div className="text-center">

        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full inline-block mb-4">

          <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />

        </div>

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">

          Failed to load page

        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4">

          Please refresh the page or try again later.

        </p>

        <button

          onClick={() => window.location.reload()}

          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"

        >

          Refresh Page

        </button>

      </div>

    </div>

  }>

    <Suspense fallback={<LoadingFallback />}>

      {children}

    </Suspense>

  </ErrorBoundary>

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

          <HomepageLayout>

            <SeoHead

              title="Lumina Toolkit - Free Productivity Tools & AI Assistants"

              description="Access 14+ free AI-powered tools including resume builders, PDF converters, calculators, and job search assistants. Boost your productivity today."

            />

            <LazyLoadWrapper>

              <Homepage />

            </LazyLoadWrapper>

          </HomepageLayout>

        </AnimatedPage>

      } />

      

      <Route path="/all-tools" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="All Free Tools – AI, Resume, ATS & Productivity Tools | Lumina Toolkit"

              description="Browse all free AI tools including resume builder, ATS checker, cover letter generator, and productivity utilities. Everything you need in one place at Lumina Toolkit."

            />

            <LazyLoadWrapper>

              <Dashboard />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

      <Route path="/ai-assistant" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="Free AI Chat Assistant for Writing & Productivity | Lumina Toolkit"

              description="Chat with a free AI assistant for writing, brainstorming, coding help, and productivity tasks. Get instant answers and boost your workflow with Lumina Toolkit."

            />

            <LazyLoadWrapper>

              <AiChat />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

      <Route path="/resume-builder" element={

        <AnimatedPage>

          <SeoHead

            title="Resume Builder - Create Professional Resumes Free | Lumina Toolkit"

            description="Build professional resumes in minutes with our free resume builder. Multiple templates and AI-powered suggestions."

          />

          <LazyLoadWrapper>

            <ResumeBuilderStandalone />

          </LazyLoadWrapper>

        </AnimatedPage>

      } />

      

      <Route path="/pdf-converter" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="PDF Converter - Convert Images to PDF Free | Lumina Toolkit"

              description="Convert images and documents to high-quality PDF files instantly. Free, secure, and no registration required."

            />

            <LazyLoadWrapper>

              <PdfConverter />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

      <Route path="/age-calculator" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="Chronological Age Calculator – Calculate Exact Age Online | Lumina Toolkit"

              description="Use our chronological age calculator to calculate your exact age in years, months, and days. Try this online chronological age calculator to find your next birthday and total age instantly."

            />

            <LazyLoadWrapper>

              <AgeCalculator />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

      <Route path="/gpa-calculator" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="GPA Calculator – College & Cumulative GPA Calculator | Lumina Toolkit"

              description="Use our GPA calculator to calculate your GPA instantly. This college GPA calculator helps you calculate semester and cumulative GPA quickly, with simple steps to understand how to calculate GPA accurately"

            />

            <LazyLoadWrapper>

              <GpaCalculator />

            </LazyLoadWrapper>

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

            <LazyLoadWrapper>

              <AiCaption />

            </LazyLoadWrapper>

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

            <LazyLoadWrapper>

              <YoutubeTitles />

            </LazyLoadWrapper>

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

            <LazyLoadWrapper>

              <AtsChecker />

            </LazyLoadWrapper>

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

            <LazyLoadWrapper>

              <JobTracker />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

      <Route path="/interview-prep" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="AI Interview Preparation Tool – Practice Job Interview Questions Free"

              description="Prepare for your next job interview with our free AI Interview Preparation tool. Practice common interview questions, improve behavioral answers using the STAR method, and get AI-powered mock interview coaching from an intelligent AI interviewer."

            />

            <LazyLoadWrapper>

              <InterviewPrep />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

      <Route path="/cover-letter-generator" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="Free AI Cover Letter Generator – Create Professional Cover Letters"

              description="Generate professional cover letters instantly with our free AI Cover Letter Generator. Create personalized job application letters, customize tone, export PDF files, and improve your chances of landing interviews with AI-powered writing."

            />

            <LazyLoadWrapper>

              <CoverLetter />

            </LazyLoadWrapper>

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

            <LazyLoadWrapper>

              <Contact />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

            
      
      
      <Route path="/profile" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="Profile - Manage Your Account | Lumina Toolkit"

              description="Access and manage your Lumina Toolkit profile, account settings, and preferences. Control your personal information and security settings."

            />

            <LazyLoadWrapper>

              <Profile />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

      <Route path="/blog" element={

        <AnimatedPage>

          <Layout>

            <LazyLoadWrapper>

              <Blog />

            </LazyLoadWrapper>

          </Layout>

        </AnimatedPage>

      } />

      

      <Route path="/blog/:slug" element={

        <AnimatedPage>

          <LazyLoadWrapper>

            <BlogPost />

          </LazyLoadWrapper>

        </AnimatedPage>

      } />

      

      {/* 404 Catch-all Route */}

      <Route path="*" element={

        <AnimatedPage>

          <Layout>

            <SeoHead

              title="Page Not Found | Lumina Toolkit"

              description="The page you're looking for doesn't exist. Explore our free productivity tools instead."

            />

            <div className="flex items-center justify-center h-[calc(100vh-64px)] md:h-screen">

              <div className="text-center max-w-md mx-auto px-4">

                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full inline-block mb-6">

                  <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />

                </div>

                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">

                  404

                </h1>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">

                  Page not found

                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-8">

                  The page you're looking for doesn't exist. Let's get you back to exploring our free productivity tools.

                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">

                  <Link

                    to="/"

                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"

                  >

                    Go Home

                  </Link>

                  <Link

                    to="/all-tools"

                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium"

                  >

                    Browse Tools

                  </Link>

                </div>

              </div>

            </div>

          </Layout>

        </AnimatedPage>

      } />

    </Routes>

  );

};



export default AppRoutes;

