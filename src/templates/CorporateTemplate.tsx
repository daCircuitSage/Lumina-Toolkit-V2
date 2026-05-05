import { ResumeData } from '../components/ResumeBuilder/types';

export default function CorporateTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="p-16 font-serif text-gray-900 min-h-[1123px] bg-white">
      {/* Header */}
      <header className="text-center mb-10 border-b border-double border-gray-300 pb-8">
        <h1 className="text-4xl font-light tracking-widest text-gray-900 uppercase mb-2">
          {personalInfo.fullName}
        </h1>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500 mb-6">
          {personalInfo.jobTitle}
        </p>
        
        <div className="flex justify-center flex-wrap gap-x-8 gap-y-2 text-xs font-medium text-gray-600">
          <span>{personalInfo.email}</span>
          <span>&bull;</span>
          <span>{personalInfo.phone}</span>
          <span>&bull;</span>
          <span>{personalInfo.address}</span>
          {personalInfo.website && (
             <>
               <span>&bull;</span>
               <span>{personalInfo.website}</span>
             </>
          )}
        </div>
      </header>

      <div className="space-y-10 max-w-3xl mx-auto">
        {/* Professional Summary */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 shrink-0">Summary</h2>
            <div className="h-px bg-gray-200 w-full" />
          </div>
          <p className="text-sm leading-relaxed text-gray-700 italic px-4">
            {personalInfo.summary}
          </p>
        </section>

        {/* Experience */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 shrink-0">Experience</h2>
            <div className="h-px bg-gray-200 w-full" />
          </div>
          <div className="space-y-8 px-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="font-bold text-base">{exp.company}</h3>
                  <span className="text-xs italic text-gray-500">{exp.period}</span>
                </div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-2">{exp.role}</p>
                <p className="text-sm text-gray-700 leading-relaxed indent-4">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
          {/* Education */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 shrink-0">Education</h2>
              <div className="h-px bg-gray-200 w-full" />
            </div>
            <div className="space-y-6 px-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-sm font-bold">{edu.school}</h3>
                  <p className="text-xs italic text-gray-600">{edu.degree}</p>
                  <p className="text-[10px] tracking-widest text-gray-400 mt-1 uppercase">{edu.period}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 shrink-0">Skills</h2>
              <div className="h-px bg-gray-200 w-full" />
            </div>
            <div className="flex flex-wrap gap-2 px-4">
              {skills.map((skill) => (
                <span 
                  key={skill.id} 
                  className="px-3 py-1 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-700 rounded shadow-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Custom Sections */}
      {data.customSections.length > 0 && (
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 shrink-0">Additional</h2>
            <div className="h-px bg-gray-200 w-full" />
          </div>
          <div className="space-y-8 px-4">
            {data.customSections.map(section => (
              <div key={section.id}>
                <h3 className="text-sm font-bold text-gray-900 mb-4">{section.title}</h3>
                <div className="space-y-3">
                  {section.items.map(item => (
                    <div key={item.id} className="grid grid-cols-3 gap-4">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{item.name}</span>
                      <p className="col-span-2 text-sm text-gray-700 leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
