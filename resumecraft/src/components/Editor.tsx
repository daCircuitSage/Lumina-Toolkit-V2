import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Code, 
  Layers, Plus, Trash2, ChevronDown, 
  ChevronUp, GripVertical, Globe, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, Experience, Education, Skill, Project } from '../types';
import { cn } from '../lib/utils';

interface EditorProps {
  data: ResumeData;
  onChange: (newData: Partial<ResumeData>) => void;
}

export default function Editor({ data, onChange }: EditorProps) {
  const [activeSection, setActiveSection] = useState<string>('personal');

  const toggleSection = (id: string) => {
    setActiveSection(activeSection === id ? '' : id);
  };

  const handlePersonalInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ personalInfo: { ...data.personalInfo, [name]: value } });
  };

  const addItem = (field: keyof ResumeData, emptyItem: any) => {
    const current = (data[field] as any[]) || [];
    onChange({ [field]: [...current, { ...emptyItem, id: crypto.randomUUID() }] });
  };

  const removeItem = (field: keyof ResumeData, id: string) => {
    const current = (data[field] as any[]) || [];
    onChange({ [field]: current.filter((item) => item.id !== id) });
  };

  const updateItem = (field: keyof ResumeData, id: string, updates: any) => {
    const current = (data[field] as any[]) || [];
    onChange({
      [field]: current.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ personalInfo: { ...data.personalInfo, photo: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  const addCustomSection = () => {
    onChange({
      customSections: [
        ...data.customSections,
        { id: crypto.randomUUID(), title: 'New Section', items: [{ id: crypto.randomUUID(), name: '', value: '' }] }
      ]
    });
  };

  const updateCustomSection = (id: string, updates: any) => {
    onChange({
      customSections: data.customSections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-6 lg:px-12 space-y-4">
      {/* Personal Info */}
      <CollapsibleSection
        title="Personal Information"
        icon={<User className="w-5 h-5" />}
        isActive={activeSection === 'personal'}
        onToggle={() => toggleSection('personal')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalInfo} />
          <Input label="Job Title" name="jobTitle" value={data.personalInfo.jobTitle} onChange={handlePersonalInfo} />
          <Input label="Email" name="email" value={data.personalInfo.email} onChange={handlePersonalInfo} />
          <Input label="Phone" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfo} />
          <Input label="Address" name="address" value={data.personalInfo.address} onChange={handlePersonalInfo} />
          <Input label="Website / Portfolio" name="website" value={data.personalInfo.website} onChange={handlePersonalInfo} />
          
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Profile Photo</label>
            <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
               {data.personalInfo.photo ? (
                 <div className="relative group">
                    <img src={data.personalInfo.photo} className="w-16 h-16 rounded-lg object-cover" />
                    <button 
                      onClick={() => onChange({ personalInfo: { ...data.personalInfo, photo: undefined } })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                 </div>
               ) : (
                 <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                    <User className="w-8 h-8" />
                 </div>
               )}
               <label className="flex-1 cursor-pointer">
                  <div className="py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:border-black hover:text-black transition-all text-center">
                    Choose Photo
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
               </label>
            </div>
          </div>

          <div className="sm:col-span-2">
             <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Summary</label>
             <textarea
               name="summary"
               value={data.personalInfo.summary}
               onChange={handlePersonalInfo}
               className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all min-h-[100px]"
             />
          </div>
        </div>
      </CollapsibleSection>

      {/* Experience */}
      <CollapsibleSection
        title="Work Experience"
        icon={<Briefcase className="w-5 h-5" />}
        isActive={activeSection === 'experience'}
        onToggle={() => toggleSection('experience')}
      >
        <div className="space-y-6">
          {data.experience.map((exp) => (
            <div key={exp.id} className="p-4 bg-gray-50 rounded-xl relative group border border-gray-100">
               <button 
                 onClick={() => removeItem('experience', exp.id)}
                 className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Input label="Company" value={exp.company} onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })} />
                 <Input label="Role" value={exp.role} onChange={(e) => updateItem('experience', exp.id, { role: e.target.value })} />
                 <Input label="Period" value={exp.period} placeholder="e.g. 2019 - Present" onChange={(e) => updateItem('experience', exp.id, { period: e.target.value })} />
                 <div className="sm:col-span-2">
                   <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Description</label>
                   <textarea
                     value={exp.description}
                     onChange={(e) => updateItem('experience', exp.id, { description: e.target.value })}
                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all min-h-[80px]"
                   />
                 </div>
               </div>
            </div>
          ))}
          <AddButton label="Add Experience" onClick={() => addItem('experience', { company: '', role: '', period: '', description: '' })} />
        </div>
      </CollapsibleSection>

      {/* Education */}
      <CollapsibleSection
        title="Education"
        icon={<GraduationCap className="w-5 h-5" />}
        isActive={activeSection === 'education'}
        onToggle={() => toggleSection('education')}
      >
        <div className="space-y-6">
          {data.education.map((edu) => (
            <div key={edu.id} className="p-4 bg-gray-50 rounded-xl relative group border border-gray-100">
               <button 
                 onClick={() => removeItem('education', edu.id)}
                 className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Input label="School" value={edu.school} onChange={(e) => updateItem('education', edu.id, { school: e.target.value })} />
                 <Input label="Degree / Certificate" value={edu.degree} onChange={(e) => updateItem('education', edu.id, { degree: e.target.value })} />
                 <Input label="Period" value={edu.period} onChange={(e) => updateItem('education', edu.id, { period: e.target.value })} />
                 <div className="sm:col-span-2">
                   <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Description (Optional)</label>
                   <textarea
                     value={edu.description}
                     onChange={(e) => updateItem('education', edu.id, { description: e.target.value })}
                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all min-h-[80px]"
                   />
                 </div>
               </div>
            </div>
          ))}
          <AddButton label="Add Education" onClick={() => addItem('education', { school: '', degree: '', period: '', description: '' })} />
        </div>
      </CollapsibleSection>

      {/* Skills */}
      <CollapsibleSection
        title="Skills"
        icon={<Code className="w-5 h-5" />}
        isActive={activeSection === 'skills'}
        onToggle={() => toggleSection('skills')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-2 group p-2 bg-gray-50 rounded-lg border border-gray-100">
              <input
                value={skill.name}
                onChange={(e) => updateItem('skills', skill.id, { name: e.target.value })}
                placeholder="Skill name"
                className="flex-1 bg-transparent border-none text-sm focus:ring-0 outline-none"
              />
              <input
                type="number"
                min="0"
                max="100"
                value={skill.level}
                onChange={(e) => updateItem('skills', skill.id, { level: parseInt(e.target.value) || 0 })}
                className="w-16 h-8 text-center bg-white border border-gray-200 rounded-md text-xs"
              />
              <button 
                onClick={() => removeItem('skills', skill.id)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <AddButton label="Add Skill" onClick={() => addItem('skills', { name: '', level: 80 })} />
        </div>
      </CollapsibleSection>

      {/* Projects */}
      <CollapsibleSection
        title="Projects"
        icon={<Layers className="w-5 h-5" />}
        isActive={activeSection === 'projects'}
        onToggle={() => toggleSection('projects')}
      >
        <div className="space-y-6">
          {data.projects.map((project) => (
            <div key={project.id} className="p-4 bg-gray-50 rounded-xl relative group border border-gray-100">
               <button 
                 onClick={() => removeItem('projects', project.id)}
                 className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Input label="Project Name" value={project.name} onChange={(e) => updateItem('projects', project.id, { name: e.target.value })} />
                 <Input label="Link" value={project.link} onChange={(e) => updateItem('projects', project.id, { link: e.target.value })} />
                 <div className="sm:col-span-2">
                   <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Description</label>
                   <textarea
                     value={project.description}
                     onChange={(e) => updateItem('projects', project.id, { description: e.target.value })}
                     className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all min-h-[80px]"
                   />
                 </div>
               </div>
            </div>
          ))}
          <AddButton label="Add Project" onClick={() => addItem('projects', { name: '', link: '', description: '' })} />
        </div>
      </CollapsibleSection>

      {/* Custom Sections */}
      <CollapsibleSection
        title="Custom Sections"
        icon={<Settings className="w-5 h-5" />}
        isActive={activeSection === 'custom'}
        onToggle={() => toggleSection('custom')}
      >
        <div className="space-y-6">
          {data.customSections.map((section) => (
            <div key={section.id} className="p-4 bg-gray-50 rounded-xl relative group border border-gray-100">
               <button 
                 onClick={() => onChange({ customSections: data.customSections.filter(s => s.id !== section.id) })}
                 className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
               <div className="space-y-4">
                  <Input 
                    label="Section Title" 
                    value={section.title} 
                    onChange={(e) => updateCustomSection(section.id, { title: e.target.value })} 
                  />
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div key={item.id} className="flex gap-2">
                        <input
                          placeholder="Item Name (e.g. Award)"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = section.items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i);
                            updateCustomSection(section.id, { items: newItems });
                          }}
                          className="w-1/3 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
                        />
                        <input
                          placeholder="Item Description"
                          value={item.value}
                          onChange={(e) => {
                            const newItems = section.items.map(i => i.id === item.id ? { ...i, value: e.target.value } : i);
                            updateCustomSection(section.id, { items: newItems });
                          }}
                          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-black"
                        />
                        <button 
                          onClick={() => {
                            const newItems = section.items.filter(i => i.id !== item.id);
                            updateCustomSection(section.id, { items: newItems });
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                         const newItems = [...section.items, { id: crypto.randomUUID(), name: '', value: '' }];
                         updateCustomSection(section.id, { items: newItems });
                      }}
                      className="text-xs font-bold text-gray-400 hover:text-black flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Item
                    </button>
                  </div>
               </div>
            </div>
          ))}
          <AddButton label="Add Custom Section" onClick={addCustomSection} />
        </div>
      </CollapsibleSection>
    </div>
  );
}

function CollapsibleSection({ title, icon, children, isActive, onToggle }: { 
  title: string; icon: React.ReactNode; children: React.ReactNode; 
  isActive: boolean; onToggle: () => void 
}) {
  return (
    <div className={cn(
      "border-b border-slate-100 transition-all",
      isActive ? "bg-white" : "bg-transparent"
    )}>
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-8 h-8 rounded flex items-center justify-center transition-colors",
            isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
          )}>
            {icon}
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-slate-900">{title}</span>
        </div>
        {isActive ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-3 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-400 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 mt-2"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}
