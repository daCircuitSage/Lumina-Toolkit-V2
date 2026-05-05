import React, { useState } from 'react';
import { 
  User, Briefcase, GraduationCap, Code, 
  Layers, Plus, Trash2, ChevronDown, 
  ChevronUp, GripVertical, Globe, Settings 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, Experience, Education, Skill, Project } from './types';
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
                 <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                   <User className="w-8 h-8 text-gray-400" />
                 </div>
               )}
               <div className="flex-1">
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handlePhotoUpload}
                   className="hidden"
                   id="photo-upload"
                 />
                 <label
                   htmlFor="photo-upload"
                   className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                 >
                   <Plus className="w-4 h-4" />
                   Upload Photo
                 </label>
               </div>
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Professional Summary</label>
            <textarea
              name="summary"
              value={data.personalInfo.summary}
              onChange={handlePersonalInfo}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Brief professional summary..."
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
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Position {index + 1}</span>
                </div>
                <button
                  onClick={() => removeItem('experience', exp.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={(e) => updateItem('experience', exp.id, { company: e.target.value })}
                />
                <Input
                  label="Role"
                  value={exp.role}
                  onChange={(e) => updateItem('experience', exp.id, { role: e.target.value })}
                />
                <Input
                  label="Period"
                  value={exp.period}
                  onChange={(e) => updateItem('experience', exp.id, { period: e.target.value })}
                />
              </div>
              <textarea
                value={exp.description}
                onChange={(e) => updateItem('experience', exp.id, { description: e.target.value })}
                rows={3}
                className="w-full mt-3 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          ))}
          <button
            onClick={() => addItem('experience', { company: '', role: '', period: '', description: '' })}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Experience
          </button>
        </div>
      </CollapsibleSection>

      {/* Education */}
      <CollapsibleSection
        title="Education"
        icon={<GraduationCap className="w-5 h-5" />}
        isActive={activeSection === 'education'}
        onToggle={() => toggleSection('education')}
      >
        <div className="space-y-4">
          {data.education.map((edu, index) => (
            <div key={edu.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Degree {index + 1}</span>
                </div>
                <button
                  onClick={() => removeItem('education', edu.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="School"
                  value={edu.school}
                  onChange={(e) => updateItem('education', edu.id, { school: e.target.value })}
                />
                <Input
                  label="Degree"
                  value={edu.degree}
                  onChange={(e) => updateItem('education', edu.id, { degree: e.target.value })}
                />
                <Input
                  label="Period"
                  value={edu.period}
                  onChange={(e) => updateItem('education', edu.id, { period: e.target.value })}
                />
              </div>
              <textarea
                value={edu.description}
                onChange={(e) => updateItem('education', edu.id, { description: e.target.value })}
                rows={2}
                className="w-full mt-3 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Describe your education..."
              />
            </div>
          ))}
          <button
            onClick={() => addItem('education', { school: '', degree: '', period: '', description: '' })}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Education
          </button>
        </div>
      </CollapsibleSection>

      {/* Skills */}
      <CollapsibleSection
        title="Skills"
        icon={<Code className="w-5 h-5" />}
        isActive={activeSection === 'skills'}
        onToggle={() => toggleSection('skills')}
      >
        <div className="space-y-4">
          {data.skills.map((skill, index) => (
            <div key={skill.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Skill {index + 1}</span>
                </div>
                <button
                  onClick={() => removeItem('skills', skill.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Skill Name"
                  value={skill.name}
                  onChange={(e) => updateItem('skills', skill.id, { name: e.target.value })}
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Proficiency</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) => updateItem('skills', skill.id, { level: parseInt(e.target.value) })}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium text-gray-600 w-12 text-right">{skill.level}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => addItem('skills', { name: '', level: 50 })}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Skill
          </button>
        </div>
      </CollapsibleSection>

      {/* Projects */}
      <CollapsibleSection
        title="Projects"
        icon={<Layers className="w-5 h-5" />}
        isActive={activeSection === 'projects'}
        onToggle={() => toggleSection('projects')}
      >
        <div className="space-y-4">
          {data.projects.map((project, index) => (
            <div key={project.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">Project {index + 1}</span>
                </div>
                <button
                  onClick={() => removeItem('projects', project.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Project Name"
                  value={project.name}
                  onChange={(e) => updateItem('projects', project.id, { name: e.target.value })}
                />
                <Input
                  label="Link"
                  value={project.link}
                  onChange={(e) => updateItem('projects', project.id, { link: e.target.value })}
                />
              </div>
              <textarea
                value={project.description}
                onChange={(e) => updateItem('projects', project.id, { description: e.target.value })}
                rows={3}
                className="w-full mt-3 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Describe the project..."
              />
            </div>
          ))}
          <button
            onClick={() => addItem('projects', { name: '', link: '', description: '' })}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Project
          </button>
        </div>
      </CollapsibleSection>

      {/* Custom Sections */}
      <CollapsibleSection
        title="Custom Sections"
        icon={<Settings className="w-5 h-5" />}
        isActive={activeSection === 'custom'}
        onToggle={() => toggleSection('custom')}
      >
        <div className="space-y-4">
          {data.customSections.map((section) => (
            <div key={section.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <Input
                  label="Section Title"
                  value={section.title}
                  onChange={(e) => updateCustomSection(section.id, { title: e.target.value })}
                  className="font-medium"
                />
                <button
                  onClick={() => removeItem('customSections', section.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={item.id} className="flex gap-2">
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
                    <button
                      onClick={() => {
                        const newItems = section.items.filter(i => i.id !== item.id);
                        updateCustomSection(section.id, { items: newItems });
                      }}
                      className="text-red-500 hover:text-red-700 transition-colors"
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
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors text-sm"
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  Add Item
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addCustomSection}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Custom Section
          </button>
        </div>
      </CollapsibleSection>
    </div>
  );
}

// Helper Components
function Input({ label, value, onChange, className, ...props }: any) {
  return (
    <div>
      {label && <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">{label}</label>}
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className || ''}`}
        {...props}
      />
    </div>
  );
}

function CollapsibleSection({ title, icon, isActive, onToggle, children }: any) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {isActive ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ maxHeight: 0, opacity: 0 }}
            animate={{ maxHeight: 2000, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
