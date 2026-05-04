import { TemplateId } from '../types';
import { cn } from '../lib/utils';

interface TemplateSelectorProps {
  activeTemplate: TemplateId;
  onSelect: (id: TemplateId) => void;
}

const TEMPLATES: { id: TemplateId; name: string }[] = [
  { id: 'modern', name: 'Modern' },
  { id: 'corporate', name: 'Corporate' },
  { id: 'creative', name: 'Creative' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'sidebar', name: 'Executive' },
];

export default function TemplateSelector({ activeTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <>
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={cn(
            "group cursor-pointer flex flex-col items-center gap-1.5 transition-all outline-none shrink-0",
            activeTemplate !== template.id && "opacity-40 hover:opacity-100"
          )}
        >
          <div className={cn(
            "w-12 h-16 rounded transition-all flex flex-col gap-1.5 p-1.5 overflow-hidden",
            activeTemplate === template.id 
              ? "border-2 border-indigo-600 bg-indigo-50/50 shadow-sm" 
              : "border border-slate-300 bg-white"
          )}>
            <div className={cn("w-1/2 h-1 rounded-full", activeTemplate === template.id ? "bg-indigo-300" : "bg-slate-300")} />
            <div className="w-full h-0.5 bg-slate-200 rounded-full" />
            <div className="w-full h-0.5 bg-slate-200 rounded-full" />
            <div className="w-3/4 h-0.5 bg-slate-200 rounded-full" />
            <div className="w-full h-0.5 bg-slate-200 rounded-full" />
            <div className="w-1/2 h-0.5 bg-slate-200 rounded-full" />
          </div>
          <span className={cn(
            "text-[10px] uppercase tracking-tighter font-bold",
            activeTemplate === template.id ? "text-indigo-600" : "text-slate-500"
          )}>
            {template.name}
          </span>
        </button>
      ))}
    </>
  );
}
