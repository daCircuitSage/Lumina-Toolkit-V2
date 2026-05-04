import { ResumeData } from '../types';

export default function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="p-20 font-sans text-gray-900 min-h-[1123px] bg-white flex flex-col">
      {/* Impeccable Header */}
      <header className="mb-16">
        <h1 className="text-6xl font-light tracking-tighter text-black mb-4">
          {personalInfo.fullName}
        </h1>
        <div className="flex flex-col gap-1 text-sm font-medium text-gray-400">
          <p className="text-black uppercase tracking-[0.2em] font-bold text-xs mb-2">{personalInfo.jobTitle}</p>
          <div className="flex gap-4">
            <span>{personalInfo.email}</span>
            <span>&bull;</span>
            <span>{personalInfo.phone}</span>
          </div>
          <p>{personalInfo.address}</p>
        </div>
      </header>

      <div className="space-y-20">
        {/* About */}
        <section className="grid grid-cols-4 gap-8">
           <span className="col-span-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">About</span>
           <div className="col-span-3">
              <p className="text-lg font-medium leading-relaxed text-gray-700">
                {personalInfo.summary}
              </p>
           </div>
        </section>

        {/* Experience */}
        <section className="grid grid-cols-4 gap-8">
           <span className="col-span-1 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Archive</span>
           <div className="col-span-3 space-y-12">
              {experience.map((exp) => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-xl font-bold tracking-tight text-black">{exp.role}</h3>
                    <span className="text-xs font-mono text-gray-400">{exp.period}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 mb-4">{exp.company}</p>
                  <p className="text-base text-gray-600 leading-relaxed max-w-xl">{exp.description}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Footer info Grid */}
        <div className="mt-auto grid grid-cols-2 gap-20 pt-16 border-t border-gray-100">
           <section className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 block">Formation</span>
              <div className="space-y-6">
                 {education.map((edu) => (
                   <div key={edu.id}>
                      <h4 className="font-bold text-black">{edu.degree}</h4>
                      <p className="text-sm text-gray-500">{edu.school}</p>
                      <p className="text-xs text-gray-300 font-mono mt-1">{edu.period}</p>
                   </div>
                 ))}
              </div>
           </section>

           <section className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 block">Toolbox</span>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
                 {skills.map((skill) => (
                   <li key={skill.id} className="text-sm font-medium text-gray-600">
                      &mdash; {skill.name}
                   </li>
                 ))}
              </ul>
           </section>
        </div>
      </div>
    </div>
  );
}
