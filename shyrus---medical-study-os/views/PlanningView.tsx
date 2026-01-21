
import React, { useState } from 'react';
import { Target, Battery, Clock, Stethoscope, Sparkles, BrainCircuit, RefreshCcw, ShieldAlert, Zap, CalendarDays, Milestone, ChevronRight, ListOrdered, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { AppState, DailyLog, Quest, ScheduleEntry, LongTermGoal } from '../types';
import { getAdaptivePlan, getFailSafePlan } from '../services/geminiService';

const PlanningView = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const [activeTab, setActiveTab] = useState<'Tactical' | 'Strategic'>('Tactical');
  const [energy, setEnergy] = useState<'Fresh' | 'Average' | 'Exhausted'>('Average');
  const [hours, setHours] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [failSafeText, setFailSafeText] = useState<string | null>(null);

  // Strategic/Monthly Goal Form
  const [newLongTerm, setNewLongTerm] = useState({ title: '', date: '', type: 'Milestone' as LongTermGoal['type'] });

  const generatePlan = async () => {
    setIsGenerating(true);
    setAiMessage(null);
    setFailSafeText(null);
    
    const result = await getAdaptivePlan(state, energy, hours);
    
    if (result) {
      const newQuests: Quest[] = result.quests.map((q: any, i: number) => ({
        id: `quest-ai-${Date.now()}-${i}`,
        ...q,
        completed: false
      }));

      // Automatically generate schedule blocks for the first 3 quests
      const newScheduleEntries: ScheduleEntry[] = result.quests.slice(0, 3).map((q: any, i: number) => {
        const startHour = 8 + (i * 3);
        return {
          id: `sched-ai-${Date.now()}-${i}`,
          startTime: `${startHour.toString().padStart(2, '0')}:00`,
          endTime: `${(startHour + 2).toString().padStart(2, '0')}:00`,
          label: q.title,
          type: 'Study',
          subject: q.subject
        };
      });

      setState(prev => ({
        ...prev,
        quests: [...prev.quests, ...newQuests],
        dailySchedule: [...prev.dailySchedule, ...newScheduleEntries].sort((a, b) => a.startTime.localeCompare(b.startTime))
      }));
      setAiMessage(result.encouragement + " Daily time table updated.");
    }
    
    setIsGenerating(false);
  };

  const activateFailSafe = async () => {
    setIsGenerating(true);
    const result = await getFailSafePlan(state);
    setFailSafeText(result);
    setIsGenerating(false);
  };

  const addLongTermGoal = () => {
    if (!newLongTerm.title || !newLongTerm.date) return;
    const goal: LongTermGoal = {
      id: `ltg-${Date.now()}`,
      title: newLongTerm.title,
      targetDate: newLongTerm.date,
      type: newLongTerm.type,
      completed: false
    };
    setState(prev => ({ ...prev, longTermGoals: [...prev.longTermGoals, goal].sort((a, b) => a.targetDate.localeCompare(b.targetDate)) }));
    setNewLongTerm({ title: '', date: '', type: 'Milestone' });
  };

  const deleteLongTermGoal = (id: string) => {
    setState(prev => ({ ...prev, longTermGoals: prev.longTermGoals.filter(g => g.id !== id) }));
  };

  const toggleLongTermGoal = (id: string) => {
    setState(prev => ({ ...prev, longTermGoals: prev.longTermGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g) }));
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
              <Target size={24} className="text-teal-400" />
              Tactics Forge
            </h1>
            <p className="text-sm text-slate-500">Operational planning and Strategic acceleration.</p>
          </div>
          
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button 
              onClick={() => setActiveTab('Tactical')}
              className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'Tactical' ? 'bg-teal-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Daily Forge
            </button>
            <button 
              onClick={() => setActiveTab('Strategic')}
              className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'Strategic' ? 'bg-teal-500 text-slate-950' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Strategic Map
            </button>
          </div>
        </div>

        {activeTab === 'Tactical' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Pre-Mission Configuration</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Tomorrow Deployment</span>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Battery size={14} className="text-teal-400" />
                      Anticipated Energy Capacity
                    </label>
                    <div className="flex gap-2">
                      {(['Exhausted', 'Average', 'Fresh'] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setEnergy(level)}
                          className={`flex-grow h-12 rounded-xl border transition-all flex items-center justify-center font-bold text-[10px] uppercase tracking-widest ${
                            energy === level ? 'bg-teal-500 border-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} className="text-teal-400" />
                      Daily Operational Hours: <span className="text-teal-400 ml-auto font-mono">{hours}H</span>
                    </label>
                    <input 
                      type="range" min="1" max="16" value={hours} 
                      onChange={(e) => setHours(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-teal-500 border border-slate-800"
                    />
                  </div>

                  <button 
                    onClick={generatePlan}
                    disabled={isGenerating}
                    className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-teal-500/10"
                  >
                    {isGenerating ? <RefreshCcw size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
                    <span className="uppercase tracking-[0.2em] text-xs font-black">{isGenerating ? 'Synthesizing...' : 'Forge Operations'}</span>
                  </button>
               </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              {aiMessage && (
                <div className="p-6 bg-teal-500/5 border border-teal-500/20 rounded-2xl animate-in zoom-in-95 duration-500">
                  <Sparkles className="text-teal-400 mb-2" size={20} />
                  <p className="text-xs text-teal-200/80 leading-relaxed italic">"{aiMessage}"</p>
                </div>
              )}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ListOrdered size={14} /> Schedule Sync Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="uppercase tracking-widest">Schedule Entries</span>
                    <span className="font-mono text-teal-400 font-bold">{state.dailySchedule.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400">
                    <span className="uppercase tracking-widest">Active Quests</span>
                    <span className="font-mono text-slate-200">{state.quests.filter(q => !q.completed).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                      <Milestone size={16} className="text-teal-400" />
                      Monthly Milestones (Long-Term)
                    </h3>
                 </div>

                 {/* Add Goal Form */}
                 <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                    <input 
                      type="text" 
                      placeholder="Goal Title (e.g. Finish Anatomy First Pass)" 
                      value={newLongTerm.title}
                      onChange={(e) => setNewLongTerm(p => ({...p, title: e.target.value}))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-teal-500"
                    />
                    <div className="flex gap-2">
                       <input 
                         type="date" 
                         value={newLongTerm.date}
                         onChange={(e) => setNewLongTerm(p => ({...p, date: e.target.value}))}
                         className="flex-grow bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-[10px] text-slate-400 outline-none"
                       />
                       <button onClick={addLongTermGoal} className="px-4 py-2 bg-teal-500 text-slate-950 rounded-lg text-[10px] font-black uppercase tracking-widest">Add</button>
                    </div>
                 </div>

                 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                    {state.longTermGoals.map(goal => (
                      <div key={goal.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                           <button onClick={() => toggleLongTermGoal(goal.id)} className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${goal.completed ? 'bg-teal-500 border-teal-500 text-slate-950' : 'border-slate-700 text-transparent hover:border-teal-500/50'}`}>
                             <CheckCircle2 size={14} />
                           </button>
                           <div>
                             <span className={`text-xs font-bold ${goal.completed ? 'text-slate-600 line-through' : 'text-slate-200'}`}>{goal.title}</span>
                             <p className="text-[9px] font-mono text-slate-500 uppercase">{goal.targetDate}</p>
                           </div>
                        </div>
                        <button onClick={() => deleteLongTermGoal(goal.id)} className="p-1.5 text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {state.longTermGoals.length === 0 && (
                      <p className="text-center py-10 text-[10px] uppercase font-bold text-slate-700 tracking-widest">No Strategic Milestones Defined</p>
                    )}
                 </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert size={16} />
                      Fail-Safe core
                    </h3>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed mb-8 uppercase tracking-tight">
                   Subject coverage analysis in progress. Activate Fail-Safe to initiate high-yield compression of pending nodes.
                 </p>
                 <button 
                  onClick={activateFailSafe}
                  className="mt-auto py-3 bg-red-500/10 border border-red-500/40 text-red-400 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                 >
                   <Zap size={14} />
                   Acceleration Sequence
                 </button>
              </div>
            </div>

            {failSafeText && (
              <div className="p-8 bg-slate-900 border border-red-500/30 rounded-2xl animate-in fade-in duration-500">
                 <div className="flex items-center gap-3 mb-4">
                    <BrainCircuit className="text-red-400" size={20} />
                    <h4 className="text-xs font-bold text-red-400 uppercase tracking-[0.2em]">Operational Compression Results</h4>
                 </div>
                 <div className="text-[11px] text-slate-300 leading-relaxed font-mono whitespace-pre-wrap bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-inner">
                   {failSafeText}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanningView;
