
import React from 'react';
import { Shield, Lock, Unlock, ChevronRight, Search } from 'lucide-react';
import { AppState, Subject } from '../types';

const SubjectsView = ({ state, updateSubject }: { state: AppState, updateSubject: (id: string, updates: Partial<Subject>) => void }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">Subject Arsenal</h1>
          <p className="text-sm text-slate-500">Master the 19 pillars of clinical medicine.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          <input 
            type="text" 
            placeholder="Search subjects..." 
            className="bg-slate-900 border border-slate-800 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 w-full md:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.subjects.map(subj => (
          <SubjectCard key={subj.id} subject={subj} />
        ))}
      </div>
    </div>
  );
};

// Use React.FC to properly support standard attributes like 'key' in TypeScript when used in maps
const SubjectCard: React.FC<{ subject: Subject }> = ({ subject }) => {
  const isLocked = subject.status === 'Locked';
  
  return (
    <div className={`relative overflow-hidden bg-slate-900 border border-slate-800 p-5 rounded-lg group transition-all ${isLocked ? 'opacity-60 grayscale' : 'hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/5'}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-slate-100">{subject.name}</h3>
          <div className="flex gap-2 mt-1">
            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest ${
              subject.priority === 'High' ? 'bg-red-500/10 text-red-400' : 
              subject.priority === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'
            }`}>
              {subject.priority} PRIO
            </span>
          </div>
        </div>
        {isLocked ? <Lock size={16} className="text-slate-600" /> : <Unlock size={16} className="text-teal-500" />}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Coverage</span>
          <span className="text-xs font-mono text-slate-300">{subject.coverage}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${subject.coverage > 70 ? 'bg-teal-500' : 'bg-slate-500'}`} 
            style={{ width: `${subject.coverage}%` }}
          ></div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-600 uppercase font-bold tracking-widest">Revisions</span>
          <span className="text-xs font-mono text-slate-300">#{subject.revisionCount}</span>
        </div>
        <button className={`p-1.5 rounded-full border transition-all ${isLocked ? 'border-slate-800 bg-slate-950 text-slate-700 cursor-not-allowed' : 'border-slate-800 bg-slate-800 text-slate-300 group-hover:bg-teal-500 group-hover:text-slate-950 group-hover:border-teal-500'}`}>
          <ChevronRight size={16} />
        </button>
      </div>

      {isLocked && (
        <div className="absolute inset-0 bg-slate-950/20 backdrop-grayscale flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-900 px-3 py-1.5 border border-slate-800 rounded">Requires Level {subject.id.includes('4') ? '5' : '2'}</span>
        </div>
      )}
    </div>
  );
};

export default SubjectsView;
