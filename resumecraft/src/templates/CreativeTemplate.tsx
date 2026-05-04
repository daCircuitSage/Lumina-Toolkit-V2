import { ResumeData } from '../types';

export default function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects } = data;

  return (
    <div className="flex min-h-[1123px] font-sans text-[#2D3436]">
      {/* Left Sidebar */}
      <div className="w-[35%] bg-[#0984E3] text-white p-10 flex flex-col">
        <div className="mb-12">
          <div className="w-32 h-32 bg-white/20 rounded-2xl mb-6 backdrop-blur-md border border-white/30 flex items-center justify-center overflow-hidden">
             {personalInfo.photo ? (
               <img src={personalInfo.photo} className="w-full h-full object-cover" />
             ) : (
               <span className="text-4xl font-black">{personalInfo.fullName.split(' ').map(n => n[0]).join('')}</span>
             )}
          </div>
          <h1 className="text-3xl font-black leading-tight tracking-tighter mb-2 italic">
            {personalInfo.fullName}
          </h1>
          <p className="text-blue-100 font-bold tracking-widest text-xs uppercase opacity-80">
            {personalInfo.jobTitle}
          </p>
        </div>

        <section className="mt-auto space-y-8">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-4 opacity-100">
              Contact Detail
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-200 opacity-70 uppercase tracking-widest">Email</span>
                <span className="font-bold">{personalInfo.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-200 opacity-70 uppercase tracking-widest">Phone</span>
                <span className="font-bold">{personalInfo.phone}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-200 opacity-70 uppercase tracking-widest">Address</span>
                <span className="font-bold">{personalInfo.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-4">
              Expertise
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-white/10 px-2 py-1 rounded border border-white/10 font-bold">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white p-12">
        <section className="mb-12">
           <h2 className="text-5xl font-black tracking-tighter text-gray-200 absolute -top-4 -left-4 opacity-50 select-none">Summary</h2>
           <div className="relative z-10">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#0984E3] mb-4">Profile Summary</h2>
              <p className="text-gray-500 leading-relaxed font-medium">
                {personalInfo.summary}
              </p>
           </div>
        </section>

        <section className="mb-12">
           <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#0984E3] mb-6">Work Experience</h2>
           <div className="space-y-10 relative">
              <div className="absolute left-[-2px] inset-y-0 w-px bg-gray-100" />
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6">
                  <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-[#0984E3]" />
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-lg font-black text-gray-800 leading-tight">{exp.role}</h3>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">{exp.period}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0984E3] mb-3">{exp.company}</h4>
                  <p className="text-sm text-gray-500 font-medium leading-normal">{exp.description}</p>
                </div>
              ))}
           </div>
        </section>

        <section>
           <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#0984E3] mb-6">Education</h2>
           <div className="grid grid-cols-1 gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="bg-gray-50 p-4 rounded-xl border-l-4 border-[#0984E3]">
                   <h3 className="font-black text-gray-800">{edu.degree}</h3>
                   <p className="text-xs font-bold text-[#0984E3] uppercase tracking-wider mt-1">{edu.school}</p>
                   <p className="text-xs text-gray-400 mt-2 font-bold">{edu.period}</p>
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
}
