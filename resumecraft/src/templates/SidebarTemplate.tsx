import { ResumeData } from '../types';

export default function SidebarTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="flex min-h-[1123px] font-sans text-gray-800 bg-white">
      {/* Sidebar */}
      <div className="w-[300px] bg-slate-900 text-white p-10 flex flex-col shrink-0">
        <div className="mb-12">
          {personalInfo.photo && (
            <div className="w-24 h-24 mb-6 rounded-2xl overflow-hidden border border-white/20">
              <img src={personalInfo.photo} className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="text-3xl font-bold leading-tight mb-2">
            {personalInfo.fullName}
          </h1>
          <p className="text-slate-400 font-semibold tracking-wider text-xs uppercase">
            {personalInfo.jobTitle}
          </p>
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4 pb-2 border-b border-white/10">
              Contact
            </h2>
            <div className="space-y-4 text-xs font-medium text-slate-300">
              <p className="break-all">{personalInfo.email}</p>
              <p>{personalInfo.phone}</p>
              <p>{personalInfo.address}</p>
              {personalInfo.website && <p className="text-white">{personalInfo.website}</p>}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4 pb-2 border-b border-white/10">
              Skills
            </h2>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-200 uppercase tracking-tighter">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400 rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-4 pb-2 border-b border-white/10">
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="text-xs font-bold text-white leading-tight mb-1">{edu.degree}</p>
                  <p className="text-[10px] font-bold text-slate-400 italic mb-2">{edu.school}</p>
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{edu.period}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 bg-white">
        <section className="mb-12">
           <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-3">
             <div className="w-2 h-2 bg-slate-900 rounded-full" />
             Profile Summary
           </h2>
           <p className="text-sm text-slate-600 leading-relaxed font-medium">
             {personalInfo.summary}
           </p>
        </section>

        <section className="mb-12">
           <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
             <div className="w-2 h-2 bg-slate-900 rounded-full" />
             Professional History
           </h2>
           <div className="space-y-10 relative pl-4 border-l-2 border-slate-50 ml-1">
              {experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="absolute left-[-1.3rem] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-slate-900" />
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{exp.role}</h3>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exp.period}</span>
                  </div>
                  <h4 className="text-sm font-black text-cyan-600 mb-4 uppercase tracking-tighter">{exp.company}</h4>
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">{exp.description}</p>
                </div>
              ))}
           </div>
        </section>

        {projects.length > 0 && (
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-3">
              <div className="w-2 h-2 bg-slate-900 rounded-full" />
              Noteworthy Projects
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 italic font-medium">
                   <div className="flex justify-between items-baseline mb-2 not-italic">
                      <h3 className="font-black text-slate-900">{proj.name}</h3>
                      <span className="text-[10px] text-cyan-600 font-mono tracking-tighter uppercase">{proj.link}</span>
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
