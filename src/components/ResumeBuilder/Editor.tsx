import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Code, 
  Layers, Plus, Trash2, ChevronDown, 
  ChevronUp, GripVertical, Globe, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData } from './types';
import { cn } from './utils';

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
        { id: crypto.randomUUID(), title: 'New Section', items: [{ id: crypto.randomUUID(), name: '', value: '' }] },
      ],
    });
  };

  const updateCustomSection = (id: string, updates: any) => {
    onChange({
      customSections: data.customSections.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-5">
      <CollapsibleSection
        title="Personal Information"
        icon={<User className="w-5 h-5" />}
        isActive={activeSection === 'personal'}
        onToggle={() => toggleSection('personal')}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full Name" name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalInfo} />
          <Input label="Job Title" name="jobTitle" value={data.personalInfo.jobTitle} onChange={handlePersonalInfo} />
          <Input label="Email" name="email" value={data.personalInfo.email} onChange={handlePersonalInfo} />
          <Input label="Phone" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfo} />
          <Input label="Address" name="address" value={data.personalInfo.address} onChange={handlePersonalInfo} />
          <Input label="Website / Portfolio" name="website" value={data.personalInfo.website} onChange={handlePersonalInfo} />

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2">Profile Photo</label>
            <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900">
                {data.personalInfo.photo ? (
                  <img src={data.personalInfo.photo} alt="Profile" className="h-full w-full rounded-3xl object-cover" />
                ) : (
                  <User className="h-8 w-8 text-slate-500" />
                )}
              </div>
              <div className="flex-1">
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <label
                  htmlFor="photo-upload"
                  className="inline-flex items-center gap-2 rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                >
                  <Plus className="h-4 w-4" />
                  Upload Photo
                </label>
                {data.personalInfo.photo && (
                  <button
                    type="button"
                    onClick={() => onChange({ personalInfo: { ...data.personalInfo, photo: undefined } })}
                    className="mt-3 inline-flex items-center gap-2 rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 transition hover:border-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="summary" className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2">
              Professional Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              value={data.personalInfo.summary}
              onChange={handlePersonalInfo}
              rows={5}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500"
              placeholder="Brief professional summary..."
            />
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Work Experience"
        icon={<Briefcase className="w-5 h-5" />}
        isActive={activeSection === 'experience'}
        onToggle={() => toggleSection('experience')}
      >
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Position {index + 1}</p>
                  <p className="text-sm text-slate-400">Use concise bullets for measurable results.</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem('experience', exp.id)}
                  className="inline-flex items-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="Company" value={exp.company} onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })} />
                <Input label="Role" value={exp.role} onChange={(e) => updateItem('experience', exp.id, { role: e.target.value })} />
                <Input label="Period" value={exp.period} onChange={(e) => updateItem('experience', exp.id, { period: e.target.value })} />
              </div>
              <textarea
                value={exp.description}
                onChange={(e) => updateItem('experience', exp.id, { description: e.target.value })}
                rows={4}
                className="mt-4 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('experience', { company: '', role: '', period: '', description: '' })}
            className="w-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-4 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Add Experience
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Education"
        icon={<GraduationCap className="w-5 h-5" />}
        isActive={activeSection === 'education'}
        onToggle={() => toggleSection('education')}
      >
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={edu.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Degree {index + 1}</p>
                  <p className="text-sm text-slate-400">Share the most recent or relevant qualifications first.</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem('education', edu.id)}
                  className="inline-flex items-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="School" value={edu.school} onChange={(e) => updateItem('education', edu.id, { school: e.target.value })} />
                <Input label="Degree" value={edu.degree} onChange={(e) => updateItem('education', edu.id, { degree: e.target.value })} />
                <Input label="Period" value={edu.period} onChange={(e) => updateItem('education', edu.id, { period: e.target.value })} />
              </div>
              <textarea
                value={edu.description}
                onChange={(e) => updateItem('education', edu.id, { description: e.target.value })}
                rows={3}
                className="mt-4 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500"
                placeholder="Describe your education..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('education', { school: '', degree: '', period: '', description: '' })}
            className="w-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-4 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Add Education
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Skills"
        icon={<Code className="w-5 h-5" />}
        isActive={activeSection === 'skills'}
        onToggle={() => toggleSection('skills')}
      >
        <div className="space-y-4">
          {data.skills.map((skill, index) => (
            <div key={skill.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-100">Skill {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeItem('skills', skill.id)}
                  className="inline-flex items-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="Skill Name" value={skill.name} onChange={(e) => updateItem('skills', skill.id, { name: e.target.value })} />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2">Proficiency</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateItem('skills', skill.id, { level: parseInt(e.target.value, 10) })}
                      className="h-2 w-full cursor-pointer rounded-full accent-sky-500"
                    />
                    <span className="w-12 text-right text-sm font-medium text-slate-300">{skill.level}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('skills', { name: '', level: 50 })}
            className="w-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-4 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Add Skill
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Projects"
        icon={<Layers className="w-5 h-5" />}
        isActive={activeSection === 'projects'}
        onToggle={() => toggleSection('projects')}
      >
        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <div key={project.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Project {index + 1}</p>
                  <p className="text-sm text-slate-400">Add the most relevant project that matches your role.</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem('projects', project.id)}
                  className="inline-flex items-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input label="Project Name" value={project.name} onChange={(e) => updateItem('projects', project.id, { name: e.target.value })} />
                <Input label="Link" value={project.link} onChange={(e) => updateItem('projects', project.id, { link: e.target.value })} />
              </div>
              <textarea
                value={project.description}
                onChange={(e) => updateItem('projects', project.id, { description: e.target.value })}
                rows={4}
                className="mt-4 w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-4 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500"
                placeholder="Describe the project..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem('projects', { name: '', link: '', description: '' })}
            className="w-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-4 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Add Project
          </button>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Custom Sections"
        icon={<Settings className="w-5 h-5" />}
        isActive={activeSection === 'custom'}
        onToggle={() => toggleSection('custom')}
      >
        <div className="space-y-4">
          {data.customSections.map((section) => (
            <div key={section.id} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Input
                  label="Section Title"
                  value={section.title}
                  onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                  className="font-semibold"
                />
                <button
                  type="button"
                  onClick={() => removeItem('customSections', section.id)}
                  className="inline-flex items-center gap-2 rounded-3xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Section
                </button>
              </div>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={item.id} className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Input
                        placeholder="Label"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...section.items];
                          newItems[itemIndex] = { ...item, name: e.target.value };
                          updateCustomSection(section.id, { items: newItems });
                        }}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={item.value}
                        onChange={(e) => {
                          const newItems = [...section.items];
                          newItems[itemIndex] = { ...item, value: e.target.value };
                          updateCustomSection(section.id, { items: newItems });
                        }}
                        className="flex-1"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const newItems = section.items.filter((i) => i.id !== item.id);
                        updateCustomSection(section.id, { items: newItems });
                      }}
                      className="inline-flex h-fit items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...section.items, { id: crypto.randomUUID(), name: '', value: '' }];
                    updateCustomSection(section.id, { items: newItems });
                  }}
                  className="w-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
                >
                  <Plus className="mr-2 inline h-4 w-4" />
                  Add Item
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addCustomSection}
            className="w-full rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 px-4 py-4 text-sm font-semibold text-slate-200 transition hover:border-sky-400 hover:text-white"
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Add Custom Section
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}

function Input({ label, value, onChange, className, ...props }: any) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 mb-2">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-500 ${className || ''}`}
        {...props}
      />
    </div>
  );
}

function CollapsibleSection({ title, icon, isActive, onToggle, children }: any) {
  return (
    <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 shadow-sm shadow-slate-950/10 overflow-hidden">
      <button
        type="button"
        aria-expanded={isActive}
        className="w-full px-6 py-5 flex items-center justify-between gap-4 hover:bg-slate-900 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 text-left">
          <span className="text-slate-300">{icon}</span>
          <div>
            <p className="text-base font-semibold text-white">{title}</p>
            <p className="text-xs text-slate-500">Tap to expand and edit</p>
          </div>
        </div>
        {isActive ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 1200, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
