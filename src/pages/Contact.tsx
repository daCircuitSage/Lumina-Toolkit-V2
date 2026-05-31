import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles, Bug, Lightbulb, AlertCircle } from 'lucide-react';
import SeoContent from '../components/SeoContent';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'suggestion',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      // Get EmailJS configuration from environment variables
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

      if (!publicKey || !serviceId || !templateId) {
        throw new Error('EmailJS configuration is missing. Please contact the administrator.');
      }

      // Initialize EmailJS with public key
      emailjs.init(publicKey);

      // Prepare template parameters
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message_type: formData.type,
        message: formData.message,
        to_email: 'contact@lumintoolkit.com' // Your receiving email
      };

      // Send email using EmailJS
      const response = await emailjs.send(serviceId, templateId, templateParams);
      
      if (response.status === 200) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', type: 'suggestion', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error('Failed to send message. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const types = [
    { id: 'suggestion', label: 'General Suggestion', icon: Sparkles, color: 'text-amber-500' },
    { id: 'fix', label: 'Bug Report', icon: Bug, color: 'text-rose-500' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'text-indigo-500' },
  ];

  return (
    <div className="tool-container pb-20">
      <div className="max-w-4xl mx-auto pt-12 md:pt-20 px-4">
        <header className="text-center mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-sm bg-white/10 text-white mb-6"
          >
            <MessageSquare size={32} />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-normal text-ink tracking-widest uppercase mb-6"
          >
            Shape the <span className="text-white">Future</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body-mid text-lg md:text-xl font-normal max-w-2xl mx-auto"
          >
            Found a bug? Have a brilliant idea? Or just want to say hello? 
            We're building this toolkit for you, and your input is our blueprint.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h3 className="text-[10px] font-normal uppercase tracking-[4px] text-body-mid px-1">Direct Access</h3>
              <a 
                href="mailto:hello@jobtoolkit.io"
                className="flex items-center gap-4 p-4 lg:p-0 bg-canvas-card border border-hairline lg:border-0 rounded-sm group transition-all"
              >
                <div className="w-12 h-12 rounded-sm bg-canvas-soft lg:bg-canvas-card border border-hairline flex items-center justify-center text-body-mid group-hover:text-white group-hover:border-white/30 transition-all">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-normal uppercase tracking-widest text-body-mid">Email Us</p>
                  <p className="text-sm font-normal text-ink">contact@lumintoolkit.com</p>
                </div>
              </a>
            </div>

            <div className="p-6 lg:p-8 bg-white text-black rounded-sm relative overflow-hidden group">
               <h4 className="text-lg font-normal mb-3 relative z-10">Why Feedback Matters?</h4>
               <p className="text-[11px] lg:text-xs font-normal text-body-mid leading-relaxed opacity-90 relative z-10">
                 Every great feature started as a user suggestion. We read every single message and prioritize our roadmap based on what you need most.
               </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-canvas-card border border-hairline rounded-sm p-6 md:p-8 lg:p-12"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-normal uppercase tracking-widest text-body-mid px-1">Your Identity</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Name or Alias"
                      className="w-full h-14 lg:h-16 px-6 bg-canvas border border-hairline rounded-sm text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all text-ink"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-normal uppercase tracking-widest text-body-mid px-1">Reply Address</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="w-full h-14 lg:h-16 px-6 bg-canvas border border-hairline rounded-sm text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all text-ink"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-normal uppercase tracking-widest text-body-mid px-1">Selection Category</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {types.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({...formData, type: type.id})}
                        className={`flex items-center sm:flex-col sm:items-start lg:flex-row lg:items-center gap-3 p-4 rounded-sm border text-[10px] font-normal uppercase tracking-widest transition-all ${
                          formData.type === type.id 
                            ? 'bg-white border-white text-black' 
                            : 'bg-canvas border-hairline text-body-mid hover:border-white/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-sm flex items-center justify-center shrink-0 ${formData.type === type.id ? 'bg-canvas-soft' : 'bg-canvas-soft'}`}>
                          <type.icon size={16} className={formData.type === type.id ? 'text-black' : 'text-white'} />
                        </div>
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-normal uppercase tracking-widest text-body-mid px-1">Detailed Message</label>
                  <textarea 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Provide details about your suggestion, bug report, or feature request..."
                    className="w-full h-40 lg:h-52 px-6 py-6 bg-canvas border border-hairline rounded-sm text-sm font-normal focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all text-ink resize-none leading-relaxed"
                  />
                </div>

                <button 
                  disabled={isSending || isSubmitted}
                  type="submit"
                  className="w-full h-16 bg-white text-black rounded-sm font-normal uppercase tracking-[4px] text-xs flex items-center justify-center gap-3 hover:bg-gray-100 active:scale-[0.98] transition-all disabled:opacity-50 relative overflow-hidden group"
                >
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.div 
                        key="success"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle2 size={18} /> Message Received
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                      >
                         {isSending ? (
                           <Sparkles size={18} className="animate-spin" />
                         ) : (
                           <Send size={18} />
                         )}
                         {isSending ? 'Sending Pulse...' : 'Send Message'}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 p-4 bg-canvas-card border border-hairline rounded-sm"
                    >
                      <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                      <p className="text-sm text-ink">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <SeoContent 
        className="mt-24 md:mt-32 max-w-4xl mx-auto px-4"
        title="Contact Job Toolkit Support: We Listen to Our Users"
        description="Have a question or want to report a bug? Use our contact form to reach the Job Toolkit team. We are committed to building the best open-source job search tools and your feedback is critical to our mission. Whether you have a feature request for the Resume Builder or found a parsing error in the ATS Checker, we want to hear from you."
        features={[
          "Bug Reporting: Get technical issues resolved quickly.",
          "Feature Requests: Influence our development roadmap.",
          "Custom Updates: Suggest UI or functionality improvements.",
          "Direct Email Access: Contact our team anonymously and easily.",
          "User-Centric Design: Built based on real-world search experience."
        ]}
        steps={[
          "Select the type of message you want to send.",
          "Provide your name and a valid email for follow-up.",
          "Describe your feedback or technical issue in detail.",
          "Click send and wait for our team to process your request.",
          "Receive updates as we implement your suggestions."
        ]}
        benefits={[
          "Fast response times for technical queries.",
          "See your ideas come to life in official updates.",
          "Help the community by identifying common issues.",
          "100% free support for all our web tools.",
          "Confidential handling of your professional queries."
        ]}
        faq={[
          { q: "How fast do you respond?", a: "We typically review all feedback within 48-72 hours. Serious bugs are prioritized for immediate fixes." },
          { q: "Can I request custom features?", a: "Absolutely! Most of our current tools were built based on direct user requests." },
          { q: "Is my feedback anonymous?", a: "We require an email only so we can ask follow-up questions if needed, but we never share your data." },
          { q: "Do you offer private coaching?", a: "Currently, we focus exclusively on building high-quality free tools for the job search community." }
        ]}
        ctaTitle="We're waiting for your pulse."
      />
    </div>
  );
}
