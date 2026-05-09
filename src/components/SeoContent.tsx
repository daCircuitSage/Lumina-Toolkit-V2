import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, HelpCircle, ArrowRight, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface SeoSectionProps {
  title: string;
  description: string;
  features: string[];
  steps: string[];
  benefits: string[];
  faq: { q: string; a: string }[];
  ctaTitle: string;
  className?: string;
}

export default function SeoContent({
  title,
  description,
  features,
  steps,
  benefits,
  faq,
  ctaTitle,
  className
}: SeoSectionProps) {
  return (
    <section className={cn("bg-black border-t border-[#2E2E2E] py-20", className)}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-16">
            {/* Intro */}
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-6">
                {title}
              </h2>
              <p className="text-lg text-[#A0A0A0] leading-relaxed font-medium">
                {description}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Star className="text-[#3ECF8E]" size={20} /> Key Features
                </h3>
                <ul className="space-y-4">
                  {features.map((f, i) => (
                    <li key={i} className="flex gap-3 text-sm font-bold text-[#A0A0A0]">
                      <CheckCircle2 size={18} className="text-[#3ECF8E] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <ArrowRight className="text-[#3ECF8E]" size={20} /> How It Works
                </h3>
                <div className="space-y-4">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center">
                        {i + 1}
                      </span>
                      <p className="text-sm font-bold text-[#A0A0A0]">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <HelpCircle className="text-[#3ECF8E]" size={24} /> Frequently Asked Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {faq.map((item, i) => (
                  <div key={i} className="p-6 bg-[#171717] border border-[#2E2E2E] rounded-2xl">
                    <h4 className="text-sm font-black text-white mb-2">{item.q}</h4>
                    <p className="text-xs font-medium text-[#A0A0A0] leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="p-8 bg-[#171717] border border-[#2E2E2E] rounded-[40px] shadow-2xl">
              <h3 className="text-2xl font-black tracking-tight mb-4 text-white">{ctaTitle}</h3>
              <ul className="space-y-4 mb-8">
                {benefits.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm font-bold text-[#A0A0A0]">
                    <CheckCircle2 size={18} className="text-[#3ECF8E] shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full py-4 bg-[#3ECF8E] hover:bg-[#3ECF8E]/90 text-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
              >
                Start Using Tool Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
