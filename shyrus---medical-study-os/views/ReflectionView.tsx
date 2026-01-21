
import React, { useState } from 'react';
import { History, ShieldCheck, Send, AlertTriangle, FileWarning, Target, ChevronRight, Zap } from 'lucide-react';
import { AppState, Reflection } from '../types';
import { Link } from 'react-router-dom';

// Added gainXp to props to fix type error in App.tsx and integrate leveling logic
const ReflectionView = ({ state, setState, gainXp }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, gainXp: (amount: number) => void }) => {
  const [planned, setPlanned] = useState('');
  const [actual, setActual] = useState('');
  const [distraction, setDistraction] = useState<Reflection['distraction']>('None');
  const [insight, setInsight] = useState('');

  const handleSave = () => {
    const isSuccess = distraction === 'None' && actual.length > planned.length * 0.7;
    const isCritical = distraction !== 'None' && distraction !== 'Hospital' && actual.length < planned.length * 0.3;
    
    const status = isSuccess ? 'Success' : (isCritical ? 'Critical' : 'Compromised');

    const newReflection: Reflection = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      planned,
      actual,
      distraction,
      insight,
      status
    };

    // Update reflections and discipline rating
    setState(prev => ({
      ...prev,
      reflections: [newReflection, ...prev.reflections],
      profile: {
        ...prev.profile,
        disciplineRating: status === 'Success' ? Math.min(100, prev.profile.disciplineRating + 2) : Math.max(0, prev.profile.disciplineRating - 5)
      }
    }));

    // Use centralized gainXp for reward and leveling logic
    gainXp(200);

    setPlanned('');
    setActual('');
    setDistraction('None');
    setInsight('');
    alert("Tactical AAR Committed. XP Awarded.");
  };

  const lastReflection = state.reflections[0];

  return (
    <div className="h-full space-y-8 animate-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-end border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2 uppercase tracking-[0.2em]">
            <FileWarning className="text-amber-500" size={24} />
            Post-Mission AAR
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Neural synchronization recovery & damage limitation.</p>
        </div>
      </div>

      {lastReflection?.status === 'Critical' && (
        <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-between shadow-[0_0_30px_rgba(239,68,68,0.1)]">
           <div className="flex items-center gap-4">
              <AlertTriangle className="text-red-500" size={32} />
              <div>
                 <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Fail-Safe Protocol Recommended</h3>
                 <p className="text-[10px] text-slate-400 uppercase tracking-tight mt-1">Latest mission analysis shows critical target failure. Activate compression immediately.</p>
              </div>
           </div>
           <Link to="/plan" className="px-6 py-2 bg-red-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-400 transition-all flex items-center gap-2">
              <Zap size={14}/> Initiate Fail-Safe
           </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Report Input */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5">
             <Target size={150} />
           </div>

           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment Plan</label>
                   <textarea 
                     value={planned}
                     onChange={(e) => setPlanned(e.target.value)}
                     placeholder="State original mission parameters..."
                     className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 focus:ring-1 focus:ring-teal-500 resize-none font-mono"
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Execution Reality</label>
                   <textarea 
                     value={actual}
                     onChange={(e) => setActual(e.target.value)}
                     placeholder="State actual clinical/study output..."
                     className="w-full h-32 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 focus:ring-1 focus:ring-teal-500 resize-none font-mono"
                   />
                </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Primary Friction Factor</label>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {(['None', 'Phone', 'Fatigue', 'Anxiety', 'Hospital', 'Procrastination'] as const).map(d => (
                      <button 
                        key={d}
                        onClick={() => setDistraction(d)}
                        className={`py-2.5 text-[9px] font-black uppercase tracking-widest rounded-xl border transition-all ${distraction === d ? 'bg-amber-500 border-amber-500 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                      >
                        {d}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Strategic Counter-Measure</label>
                 <input 
                   value={insight}
                   onChange={(e) => setInsight(e.target.value)}
                   placeholder="Identify one procedural change for next engagement..."
                   className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs text-slate-300 font-mono italic"
                 />
              </div>

              <button 
               onClick={handleSave}
               className="w-full py-5 bg-teal-500 text-slate-950 font-black rounded-2xl uppercase tracking-[0.3em] text-[10px] flex items-center justify-center gap-3 hover:bg-teal-400 shadow-xl shadow-teal-500/10 active:scale-95 transition-all"
              >
                <ShieldCheck size={18} />
                Finalize AAR Report
              </button>
           </div>
        </div>

        {/* Intelligence Archive */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col overflow-hidden h-full shadow-xl">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <History size={14} className="text-teal-500" />
                Report Archives
              </h2>
              <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                 {state.reflections.map(ref => (
                   <div key={ref.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800/50 space-y-3 relative overflow-hidden group hover:border-slate-600 transition-all">
                      <div className={`absolute top-0 right-0 w-1.5 h-full ${ref.status === 'Success' ? 'bg-teal-500' : (ref.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500')}`}></div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-slate-600 font-black tracking-widest">{ref.date}</span>
                        <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-tighter ${ref.status === 'Success' ? 'text-teal-400' : (ref.status === 'Critical' ? 'text-red-400' : 'text-amber-400')}`}>
                          STATUS_{ref.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed">"{ref.actual}"</p>
                        </div>
                      </div>
                      {ref.insight && (
                        <div className="pt-2 border-t border-slate-900 flex items-center gap-2">
                          <Zap size={10} className="text-teal-500" />
                          <p className="text-[9px] text-slate-500 italic font-mono truncate">{ref.insight}</p>
                        </div>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectionView;
