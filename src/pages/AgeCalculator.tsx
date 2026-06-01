import React, { useState } from 'react';
import { Calendar, RefreshCw, Star, Info, ChevronDown } from 'lucide-react';
import { format, differenceInYears, differenceInMonths, differenceInDays, addYears, isAfter, isBefore } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import SeoContent from '../components/SeoContent';
import InternalLinks from '../components/InternalLinks';

export default function AgeCalculator() {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    if (!day || !month || !year) return;
    
    const birth = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const now = new Date();

    if (isAfter(birth, now)) {
      alert("Birth date cannot be in the future!");
      return;
    }

    const years = differenceInYears(now, birth);
    const months = differenceInMonths(now, birth) % 12;
    
    // Exact days calculation
    const birthdayThisYear = addYears(birth, years);
    const lastBirthday = isBefore(birthdayThisYear, now) ? birthdayThisYear : addYears(birth, years - 1);
    const days = differenceInDays(now, lastBirthday);

    // Next birthday countdown
    let nextBirthday = addYears(birth, years + (isBefore(birthdayThisYear, now) ? 1 : 0));
    const nextDays = differenceInDays(nextBirthday, now);

    setResult({ years, months, days, nextDays, birthDay: format(birth, 'EEEE') });
  };

  return (
    <div className="tool-container pb-20">
      <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-xl bg-canvas border border-hairline rounded-sm p-6 md:p-10"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 md:mb-10 text-center sm:text-left">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-sm bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Calendar size={28} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-normal text-ink tracking-tight">Chronological Age Calculator</h1>
              <p className="text-xs md:text-sm font-normal text-body">Use this online chronological age calculator to calculate your exact age and key life milestones</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[11px] font-normal text-body uppercase tracking-[2px] px-1 flex items-center gap-2">
                <Calendar size={14} />
                Select Your Birth Date
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Day Selector */}
                <div className="relative">
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full h-14 md:h-16 px-4 bg-canvas border border-hairline rounded-sm text-lg md:text-xl font-normal text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer hover:bg-canvas-soft"
                  >
                    <option value="" className="text-body">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d} className="bg-canvas text-ink">{d.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                </div>

                {/* Month Selector */}
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full h-14 md:h-16 px-4 bg-canvas border border-hairline rounded-sm text-lg md:text-xl font-normal text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer hover:bg-canvas-soft"
                  >
                    <option value="" className="text-body">Month</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m} className="bg-canvas text-ink">{format(new Date(2000, m - 1, 1), 'MMM')}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                </div>

                {/* Year Selector */}
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full h-14 md:h-16 px-4 bg-canvas border border-hairline rounded-sm text-lg md:text-xl font-normal text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer hover:bg-canvas-soft"
                  >
                    <option value="" className="text-body">Year</option>
                    {Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i).map(y => (
                      <option key={y} value={y} className="bg-canvas text-ink">{y}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none" />
                </div>
              </div>

              {/* Quick Date Selection */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    setDay(today.getDate().toString());
                    setMonth((today.getMonth() + 1).toString());
                    setYear((today.getFullYear() - 25).toString());
                  }}
                  className="px-3 py-1.5 text-xs font-normal bg-canvas text-ink rounded-sm hover:bg-canvas-soft transition-all transform hover:scale-105"
                >
                  25 Years Ago
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    setDay(today.getDate().toString());
                    setMonth((today.getMonth() + 1).toString());
                    setYear((today.getFullYear() - 18).toString());
                  }}
                  className="px-3 py-1.5 text-xs font-normal bg-canvas text-ink rounded-sm hover:bg-canvas-soft transition-all transform hover:scale-105"
                >
                  18 Years Ago
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    setDay(today.getDate().toString());
                    setMonth((today.getMonth() + 1).toString());
                    setYear((today.getFullYear() - 30).toString());
                  }}
                  className="px-3 py-1.5 text-xs font-normal bg-canvas text-ink rounded-sm hover:bg-canvas-soft transition-all transform hover:scale-105"
                >
                  30 Years Ago
                </button>
              </div>
            </div>

            <motion.button 
              onClick={calculate}
              disabled={!day || !month || !year}
              className="w-full h-14 md:h-16 bg-canvas text-ink rounded-sm font-normal uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-canvas-soft active:scale-[0.98] transition-all disabled:opacity-50"
              whileHover={{ scale: day && month && year ? 1.02 : 1 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={18} className={day && month && year ? "animate-spin-slow" : ""} />
              Calculate My Age
            </motion.button>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-4"
                >
                  <div className="p-6 md:p-8 bg-canvas text-ink rounded-sm relative overflow-hidden group transition-all">
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <div className="text-[10px] font-normal text-body uppercase tracking-[3px] mb-2">Total Chronological Age</div>
                        <div className="text-4xl md:text-5xl font-normal flex items-baseline justify-center md:justify-start gap-3">
                          {result.years} <span className="text-sm font-normal opacity-70 uppercase tracking-widest">Yrs</span>
                          {result.months > 0 && <>{result.months} <span className="text-sm font-normal opacity-70 uppercase tracking-widest">Mo</span></>}
                        </div>
                        <p className="text-xs font-normal text-body mt-2 opacity-80">
                          {result.days} days since your last birthday
                        </p>
                      </div>
                      <div className="w-px h-12 bg-primary/10 hidden md:block" />
                      <div className="text-center md:text-right">
                        <div className="text-[10px] font-normal text-body uppercase tracking-[3px] mb-2">Birth Weekday</div>
                        <div className="text-xl md:text-2xl font-normal">{result.birthDay}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 border border-hairline rounded-sm bg-canvas transition-all hover:border-primary/30">
                      <div className="text-[10px] font-normal text-body uppercase tracking-[3px] mb-3 flex items-center gap-2">
                        <Star size={14} className="text-primary fill-primary" /> Countdown
                      </div>
                      <div className="text-2xl md:text-3xl font-normal text-ink">{result.nextDays} <span className="text-[10px] font-normal text-body uppercase">Days Left</span></div>
                      <p className="text-[10px] font-normal text-body mt-1 uppercase">Until your next birthday</p>
                    </div>

                    <div className="p-6 border border-hairline rounded-sm bg-canvas transition-all hover:border-primary/30">
                      <div className="text-[10px] font-normal text-body uppercase tracking-[3px] mb-3 flex items-center gap-2">
                        <Info size={14} className="text-primary" /> Life stats
                      </div>
                      <div className="text-sm font-normal text-body leading-relaxed">
                        You have lived approximately <span className="text-ink font-normal">{(result.years * 365 + result.days).toLocaleString()}</span> days on Earth.
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 p-6 md:p-8 bg-canvas-soft rounded-sm flex items-center justify-center text-center border border-hairline"
                >
                   <div className="space-y-2">
                     <p className="text-sm font-normal text-body">Ready to calculate?</p>
                     <p className="text-[10px] font-normal text-body uppercase tracking-widest leading-relaxed">
                       Input your birth data above to begin
                     </p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <SeoContent 
        className="mt-12 md:mt-20 max-w-4xl mx-auto px-4"
        title="Chronological Age Calculator: Calculate Exact Age Online"
        description="Use our chronological age calculator to calculate your exact age in years, months, and days. This online chronological age calculator also shows your next birthday, total days lived, and other useful age details instantly."
        features={[
            "Exact Age Calculation: Calculate your precise age in years, months, and days.",
            "Next Birthday Countdown: See how many days are left until your next birthday.",
            "Total Days Lived: Find the approximate total number of days since your birth date.",
            "Birth Day Finder: Discover the day of the week you were born.",
            "Future Date Validation: Prevents selecting invalid future birth dates.",
            "Mobile Friendly: Works smoothly on desktop, tablet, and mobile devices."
          ]}
        steps={[
          "Select your birth year, month, and day.",
          "Click the 'Calculate Age' button.",
          "View your exact age in years, months, and days.",
          "Check how many days remain until your next birthday.",
          "See your total days lived and other age details."
        ]}
        benefits={[
          "Get instant and accurate age calculations.",
          "Useful for forms, applications, and official documents.",
          "Simple and easy-to-use interface.",
          "100% free with no sign-up required.",
          "Quickly find your next birthday and age milestones."
        ]}
        faq={[
    { q: "What is a chronological age calculator?", a: "A chronological age calculator measures your exact age based on your birth date and the current date." },
    { q: "How accurate is this age calculator?", a: "This calculator accounts for leap years, month lengths, and date differences to provide accurate results." },
    { q: "Can I use this for official documents?", a: "Yes. The chronological age shown here is suitable for most standard forms and official age calculations." },
    { q: "Does this online chronological age calculator save my birth date?", a: "No. Your birth date is processed in your browser and is not stored on our servers." },
    { q: "Can I use this calculator on mobile?", a: "Yes. This age calculator is fully responsive and works well on phones, tablets, and desktops." }
  ]}
        ctaTitle="Calculate Your Exact Age Instantly"
      />
      
      {/* Internal Links for SEO */}
      <div className="mt-12">
        <InternalLinks currentToolId="age" title="Related Calculator Tools" />
      </div>
    </div>
  );
}
