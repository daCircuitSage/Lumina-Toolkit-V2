import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  FaRocket as Rocket,
  FaShieldAlt as Shield,
  FaUsers as Users,
  FaLightbulb as Lightbulb,
  FaArrowRight as ArrowRight
} from 'react-icons/fa';
import newLogo from '../assets/logo/newlogo.png';

export default function About() {
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
              About <span className="text-primary">Lumina Toolkit</span>
            </h1>
            <p className="body-md text-lg max-w-3xl mx-auto leading-relaxed">
              Empowering professionals with AI-powered tools to boost productivity and achieve more in less time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-normal mb-6">
                Our <span className="text-primary">Mission</span>
              </h2>
              <p className="body-md mb-6 leading-relaxed">
                At Lumina Toolkit, we believe that everyone deserves access to powerful productivity tools without barriers. Our mission is to democratize AI-powered tools, making them free, accessible, and easy to use for professionals worldwide.
              </p>
              <p className="body-md leading-relaxed">
                We're committed to building tools that solve real problems—whether you're crafting the perfect resume, preparing for interviews, or managing your job search journey.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card-feature-sage p-8 md:p-12"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-normal text-primary mb-2">14+</div>
                  <div className="text-sm body-sm">Free Tools</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-normal text-primary mb-2">10K+</div>
                  <div className="text-sm body-sm">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-normal text-primary mb-2">100%</div>
                  <div className="text-sm body-sm">Free Forever</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-normal text-primary mb-2">24/7</div>
                  <div className="text-sm body-sm">Available</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-canvas-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-normal mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="body-md text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Lightbulb, 
                title: "Innovation", 
                description: "Constantly improving and adding new tools to stay ahead of your needs" 
              },
              { 
                icon: Shield, 
                title: "Privacy First", 
                description: "Your data stays secure. We never sell or share your personal information" 
              },
              { 
                icon: Users, 
                title: "Accessibility", 
                description: "Powerful tools should be available to everyone, regardless of budget" 
              },
              { 
                icon: Rocket, 
                title: "Speed", 
                description: "Fast, efficient tools that respect your time and boost productivity" 
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card-content p-6 hover:border-primary/30 transition-all duration-300"
              >
                <motion.div 
                  className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <value.icon className="w-6 h-6 text-ink" />
                </motion.div>
                <h3 className="font-normal text-lg mb-2">{value.title}</h3>
                <p className="body-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative card-feature-dark p-8 md:p-16 text-center overflow-hidden"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-6">
              Ready to Get <span className="text-primary">Started</span>?
            </h2>
            <p className="body-md text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already using Lumina Toolkit to achieve more.
            </p>
            
            <motion.button
              onClick={() => navigate('/all-tools')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary-active text-on-primary font-normal rounded-xl transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
            >
              Explore All Tools
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
