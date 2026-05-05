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
          className="w-full max-w-xl glass-card p-6 md:p-10 shadow-2xl shadow-indigo-500/5"
        >
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 md:mb-10 text-center sm:text-left">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Calendar size={28} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Chronological Age Calculator</h1>
              <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400">Use this online chronological age calculator to calculate your exact age and key life milestones</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[2px] px-1 flex items-center gap-2">
                <Calendar size={14} />
                Select Your Birth Date
              </label>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Day Selector */}
                <div className="relative">
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className="w-full h-14 md:h-16 px-4 bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl text-lg md:text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <option value="" className="text-slate-400 dark:text-slate-500">Day</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d} className="bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100">{d.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 pointer-events-none" />
                </div>

                {/* Month Selector */}
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full h-14 md:h-16 px-4 bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl text-lg md:text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <option value="" className="text-slate-400 dark:text-slate-500">Month</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m} className="bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100">{format(new Date(2000, m - 1, 1), 'MMM')}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 pointer-events-none" />
                </div>

                {/* Year Selector */}
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full h-14 md:h-16 px-4 bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-700 rounded-xl text-lg md:text-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20"
                  >
                    <option value="" className="text-slate-400 dark:text-slate-500">Year</option>
                    {Array.from({ length: 120 }, (_, i) => new Date().getFullYear() - i).map(y => (
                      <option key={y} value={y} className="bg-white text-slate-900 dark:bg-slate-700 dark:text-slate-100">{y}</option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 pointer-events-none" />
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
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all transform hover:scale-105"
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
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105"
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
                  className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all transform hover:scale-105"
                >
                  30 Years Ago
                </button>
              </div>
            </div>

            <motion.button 
              onClick={calculate}
              disabled={!day || !month || !year}
              className="w-full h-14 md:h-16 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
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
                  <div className="p-6 md:p-8 bg-indigo-600 rounded-[32px] text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="text-center md:text-left">
                        <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[3px] mb-2">Total Chronological Age</div>
                        <div className="text-4xl md:text-5xl font-black flex items-baseline justify-center md:justify-start gap-3">
                          {result.years} <span className="text-sm font-bold opacity-70 uppercase tracking-widest">Yrs</span>
                          {result.months > 0 && <>{result.months} <span className="text-sm font-bold opacity-70 uppercase tracking-widest">Mo</span></>}
                        </div>
                        <p className="text-xs font-bold text-indigo-100 mt-2 opacity-80">
                          {result.days} days since your last birthday
                        </p>
                      </div>
                      <div className="w-px h-12 bg-white/10 hidden md:block" />
                      <div className="text-center md:text-right">
                        <div className="text-[10px] font-black text-indigo-200 uppercase tracking-[3px] mb-2">Birth Weekday</div>
                        <div className="text-xl md:text-2xl font-black">{result.birthDay}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-[28px] bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900">
                      <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[3px] mb-3 flex items-center gap-2">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" /> Countdown
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{result.nextDays} <span className="text-[10px] font-bold text-slate-400 uppercase">Days Left</span></div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Until your next birthday</p>
                    </div>

                    <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-[28px] bg-white dark:bg-slate-900 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-900">
                      <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[3px] mb-3 flex items-center gap-2">
                        <Info size={14} className="text-indigo-500" /> Life stats
                      </div>
                      <div className="text-sm font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                        You have lived approximately <span className="text-slate-900 dark:text-white font-black">{(result.years * 365 + result.days).toLocaleString()}</span> days on Earth.
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 p-6 md:p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[32px] flex items-center justify-center text-center border-2 border-dashed border-slate-100 dark:border-slate-800"
                >
                   <div className="space-y-2">
                     <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Ready to calculate?</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
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
