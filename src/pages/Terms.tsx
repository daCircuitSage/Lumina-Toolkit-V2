import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight as ArrowRight } from 'react-icons/fa';
import newLogo from '../assets/logo/newlogo.png';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-hidden">
      {/* Navigation */}
      <nav className="relative z-50 px-4 py-6 md:px-8 md:py-8 bg-canvas border-b border-hairline">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center cursor-pointer"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img 
              src={newLogo} 
              alt="Lumina Toolkit Logo"
              className="h-16 w-auto object-contain"
            />
          </motion.div>
          
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-canvas-soft border border-hairline rounded-xl hover:bg-canvas transition-all duration-200 text-sm font-normal cursor-pointer"
          >
            Back to Home
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-canvas-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal mb-6">
              Terms and <span className="text-primary">Conditions</span>
            </h1>
            <p className="body-md text-lg max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using Lumina Toolkit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            {/* Introduction */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">1. Introduction</h2>
              <p className="body-md leading-relaxed mb-4">
                Welcome to Lumina Toolkit. By accessing or using our services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our service.
              </p>
              <p className="body-md leading-relaxed">
                Lumina Toolkit provides free AI-powered tools for productivity, career growth, and content creation. These terms govern your use of our platform and services.
              </p>
            </div>

            {/* Acceptance of Terms */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">2. Acceptance of Terms</h2>
              <p className="body-md leading-relaxed mb-4">
                By accessing and using Lumina Toolkit, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="body-md leading-relaxed">
                We reserve the right to modify these terms at any time. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
              </p>
            </div>

            {/* User Responsibilities */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">3. User Responsibilities</h2>
              <p className="body-md leading-relaxed mb-4">
                As a user of Lumina Toolkit, you agree to:
              </p>
              <ul className="space-y-3 body-md list-disc list-inside">
                <li>Use the service for lawful purposes only</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not use the service to distribute malware or harmful content</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Not interfere with the proper working of the service</li>
                <li>Provide accurate information when required</li>
              </ul>
            </div>

            {/* Privacy and Data Protection */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">4. Privacy and Data Protection</h2>
              <p className="body-md leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs the service and describes how we collect, use, and protect your personal data.
              </p>
              <p className="body-md leading-relaxed">
                We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">5. Intellectual Property</h2>
              <p className="body-md leading-relaxed mb-4">
                All content, features, and functionality of Lumina Toolkit are owned by us and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="body-md leading-relaxed">
                You may not reproduce, distribute, or create derivative works of our content without our express written permission.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">6. Limitation of Liability</h2>
              <p className="body-md leading-relaxed mb-4">
                To the fullest extent permitted by law, Lumina Toolkit shall not be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
              <p className="body-md leading-relaxed">
                We provide our service "as is" without any warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>
            </div>

            {/* Termination */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">7. Termination</h2>
              <p className="body-md leading-relaxed mb-4">
                We reserve the right to terminate or suspend your access to the service at any time, without prior notice, for any reason, including but not limited to breach of these Terms.
              </p>
              <p className="body-md leading-relaxed">
                Upon termination, your right to use the service will immediately cease.
              </p>
            </div>

            {/* Governing Law */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">8. Governing Law</h2>
              <p className="body-md leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Lumina Toolkit operates, without regard to its conflict of law provisions.
              </p>
            </div>

            {/* Contact Information */}
            <div className="card-content p-8">
              <h2 className="text-2xl font-normal mb-4">9. Contact Information</h2>
              <p className="body-md leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us through our contact page or via email.
              </p>
              <motion.button
                onClick={() => navigate('/contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-primary hover:bg-primary-active text-on-primary font-normal rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Last Updated */}
            <div className="text-center body-sm text-mute">
              <p>Last updated: June 2026</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
