import React, { useState } from 'react';
import { Calculator, Plus, Trash2, Rocket, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SeoContent from '../components/SeoContent';

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: string;
}

const GRADE_VALUES: Record<string, number> = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0
};

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', grade: 'A', credits: '3' }
  ]);
  const [cgpaData, setCgpaData] = useState({ prevGpa: '', prevCredits: '' });

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', grade: 'A', credits: '3' }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length === 1) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(c => {
      const g = GRADE_VALUES[c.grade] || 0;
      const cr = parseFloat(c.credits) || 0;
      totalPoints += g * cr;
      totalCredits += cr;
    });

    const currentGpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

    // CGPA Calculation
    const prevG = parseFloat(cgpaData.prevGpa) || 0;
    const prevC = parseFloat(cgpaData.prevCredits) || 0;
    const finalCgpa = (prevC + totalCredits) > 0 
      ? ((prevG * prevC) + totalPoints) / (prevC + totalCredits) 
      : currentGpa;

    return { currentGpa: currentGpa.toFixed(2), finalCgpa: finalCgpa.toFixed(2), totalCredits };
  };

  const { currentGpa, finalCgpa, totalCredits } = calculateGpa();

  return (
    <div className="tool-container">
      <header className="mb-12">
        <h1 className="text-3xl font-normal flex items-center gap-3 text-ink transition-colors">
          <Calculator className="text-ink" /> GPA & CGPA Calculator
        </h1>
        <p className="text-body-mid mt-2">Professional academic performance tracking system.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-canvas-card border border-hairline rounded-sm overflow-hidden transition-colors">
            <div className="p-4 md:p-6 border-b border-hairline flex justify-between items-center bg-canvas-soft">
              <h2 className="font-normal text-ink">Course List</h2>
              <button 
                onClick={addCourse}
                className="flex items-center gap-2 text-sm font-normal text-ink hover:text-primary transition-colors"
              >
                <Plus size={16} /> <span className="hidden sm:inline">Add Course</span><span className="sm:hidden">Add</span>
              </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-4">
              <AnimatePresence>
                {courses.map((course) => (
                  <motion.div 
                    key={course.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex flex-col sm:flex-row gap-4 p-4 border border-hairline rounded-sm bg-canvas-soft group relative transition-colors"
                  >
                    <div className="flex-1">
                      <label className="text-[10px] font-normal text-body-mid uppercase tracking-widest block mb-2 px-1">Course Name</label>
                      <input 
                        placeholder="e.g. Advanced Mathematics"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                        className="w-full h-11 px-4 bg-canvas border border-hairline text-ink rounded-sm text-sm focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1 sm:w-32">
                        <label className="text-[10px] font-normal text-body-mid uppercase tracking-widest block mb-2 px-1">Grade</label>
                        <select 
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full h-11 px-4 bg-canvas border border-hairline text-ink rounded-sm text-sm focus:outline-none focus:border-white appearance-none transition-colors"
                        >
                          {Object.keys(GRADE_VALUES).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="text-[10px] font-normal text-body-mid uppercase tracking-widest block mb-1 px-1">Credits</label>
                        <input 
                          type="number"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                          className="w-full h-11 px-4 bg-canvas border border-hairline text-ink rounded-sm text-sm focus:outline-none focus:border-white transition-colors"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeCourse(course.id)}
                      className="absolute -top-2 -right-2 sm:static sm:mt-6 p-2 text-body-mid hover:text-red-500 transition-colors bg-canvas-soft sm:bg-transparent rounded-sm border border-hairline sm:border-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-canvas-card border border-hairline rounded-sm p-6 md:p-8 transition-colors">
            <h3 className="font-normal text-ink mb-6 flex items-center gap-2">
              <Rocket size={18} className="text-ink" /> Previous History (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-normal text-body-mid uppercase px-1">Cumulative GPA</label>
                <input 
                  type="number"
                  placeholder="0.00"
                  value={cgpaData.prevGpa}
                  onChange={(e) => setCgpaData({...cgpaData, prevGpa: e.target.value})}
                  className="w-full h-12 px-4 bg-canvas border border-hairline text-ink rounded-sm text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-normal text-body-mid uppercase px-1">Completed Credits</label>
                <input 
                  type="number"
                  placeholder="0"
                  value={cgpaData.prevCredits}
                  onChange={(e) => setCgpaData({...cgpaData, prevCredits: e.target.value})}
                  className="w-full h-12 px-4 bg-canvas border border-hairline text-ink rounded-sm text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white text-black rounded-sm p-6 md:p-8">
              <div className="flex justify-between items-start mb-10 text-center sm:text-left">
                <div className="w-12 h-12 rounded-sm bg-canvas-soft flex items-center justify-center mx-auto sm:mx-0">
                  <Calculator size={24} />
                </div>
                <button 
                  onClick={() => {
                    setCourses([{ id: '1', name: '', grade: 'A', credits: '3' }]);
                    setCgpaData({ prevGpa: '', prevCredits: '' });
                  }}
                  className="p-2 hover:bg-canvas-soft rounded-sm transition-colors"
                >
                  <RotateCcw size={18} />
                </button>
              </div>

              <div className="space-y-8 text-center sm:text-left">
                <div>
                  <label className="text-[10px] font-normal uppercase tracking-[2px] opacity-70 block mb-2">Semester GPA</label>
                  <div className="text-5xl md:text-6xl font-normal tracking-tight">{currentGpa}</div>
                </div>

                <div className="pt-8 border-t border-hairline">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-normal opacity-70 uppercase tracking-widest">Final CGPA</span>
                    <span className="text-xl font-normal">{finalCgpa}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-normal opacity-70 uppercase tracking-widest">Credits</span>
                    <span className="text-xl font-normal">{parseFloat(cgpaData.prevCredits || '0') + totalCredits}</span>
                  </div>
                </div>
              </div>
           </div>

           <div className="p-6 bg-canvas-card rounded-sm text-ink">
              <h4 className="text-sm font-normal mb-4 text-body-mid">Quick Tips</h4>
              <ul className="space-y-3">
                 <li className="text-xs text-body-mid leading-relaxed">• Grade points are calculated on a standard 4.0 scale.</li>
                 <li className="text-xs text-body-mid leading-relaxed">• Ensure all credits match your university's weighting.</li>
                 <li className="text-xs text-body-mid leading-relaxed">• Target a 3.5+ for Dean's List inclusion.</li>
              </ul>
           </div>
        </div>
      </div>

      <SeoContent 
        title="GPA Calculator – Calculate College & Cumulative GPA Online Free | Lumina Toolkit"
        description="Calculate your GPA online with our GPA calculator. Use this college GPA calculator to check semester grades, cumulative GPA, and learn how to calculate GPA quickly and accurately."
        features={[
          "GPA Calculator: Instantly calculate your GPA using a standard 4.0 grading scale.",
          "College GPA Calculator: Track your semester-wise academic performance with ease.",
          "Cumulative GPA Calculator: Combine all semesters to calculate your overall CGPA.",
          "High School GPA Support: Works for both high school and college grading systems.",
          "Dynamic Course System: Add or remove courses with credits and grades in real time.",
          "Instant Results: See updated GPA immediately as you enter or change data."
        ]}
        steps={[
          "Add your subjects using the 'Add Course' option.",
          "Enter your grade and credit hours for each course.",
          "If needed, input previous GPA and total completed credits for cumulative calculation.",
          "View your GPA instantly in the results panel.",
          "Adjust or reset inputs to recalculate anytime."
        ]}
        benefits={[
          "Quickly calculate GPA without manual formulas.",
          "Understand your academic standing in real time.",
          "Useful for college, university, and high school students.",
          "Helps plan scholarship and academic goals.",
          "100% free GPA calculator with no login required."
        ]}
        faq={[
    { 
      q: "What is a GPA calculator?", 
      a: "A GPA calculator helps you calculate your Grade Point Average based on your grades and credit hours." 
    },
    { 
      q: "How to calculate GPA?", 
      a: "GPA is calculated by dividing total grade points by total credit hours." 
    },
    { 
      q: "Can I use this as a college GPA calculator?", 
      a: "Yes, this tool is fully optimized as a college GPA calculator for semester and cumulative GPA." 
    },
    { 
      q: "Does it support high school GPA calculation?", 
      a: "Yes, it works as a high school GPA calculator as well using the standard 4.0 scale." 
    },
    { 
      q: "What is cumulative GPA?", 
      a: "Cumulative GPA is the overall average of all semesters combined." 
    }
  ]}
        ctaTitle="Calculate Your GPA Instantly with Accuracy."
      />
    </div>
  );
}
