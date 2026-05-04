import { ResumeData } from '../types';

export default function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="p-12 font-sans text-gray-800 leading-relaxed min-h-[1123px]">
      {/* Header */}
      <header className="mb-8 border-b-4 border-black pb-6 flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 uppercase">
            {personalInfo.fullName}
          </h1>
          <p className="text-xl font-medium text-gray-600 mt-1">{personalInfo.jobTitle}</p>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-500 font-medium">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
            {personalInfo.website && <span className="text-black">{personalInfo.website}</span>}
          </div>
        </div>
        {personalInfo.photo && (
           <div className="w-24 h-24 shrink-0 overflow-hidden rounded-xl border-2 border-black ml-8">
              <img src={personalInfo.photo} className="w-full h-full object-cover" />
           </div>
        )}
      </header>

      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-2 space-y-8">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-3 border-b border-gray-200 pb-1">
                Summary
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "{personalInfo.summary}"
              </p>
            </section>
          )}

          {/* Experience */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4 border-b border-gray-200 pb-1">
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900">{exp.role}</h3>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-gray-500 mb-2">{exp.company}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4 border-b border-gray-200 pb-1">
                Key Projects
              </h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between items-baseline mb-1">
                       <h3 className="font-bold text-gray-900">{proj.name}</h3>
                       <span className="text-xs text-gray-400 font-mono italic">{proj.link}</span>
                    </div>
                    <p className="text-sm text-gray-600">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Custom Sections */}
          {data.customSections.map(section => (
            <section key={section.id}>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4 border-b border-gray-200 pb-1">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map(item => (
                  <div key={item.id} className="grid grid-cols-4 gap-4">
                    <span className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</span>
                    <p className="col-span-3 text-sm text-gray-600 leading-relaxed">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="col-span-1 space-y-8">
          {/* Skills */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4 border-b border-gray-200 pb-1">
              Skillset
            </h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1 font-bold text-gray-700">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-black rounded-full" 
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-black mb-4 border-b border-gray-200 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-sm font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-xs font-bold text-gray-500">{edu.school}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1">{edu.period}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
