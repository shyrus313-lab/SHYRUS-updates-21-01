
import React, { useState } from 'react';
import { AppState, EDiaryEntry } from '../types';
import { Book, Save, Plus, Trash2, Calendar, Coffee, Moon, Sun, History, Heart } from 'lucide-react';

const EDiaryView = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<EDiaryEntry['mood']>('Determined');
  const [shiftType, setShiftType] = useState<EDiaryEntry['shiftType']>('None');

  const handleSave = () => {
    if (!content.trim()) return;
    const entry: EDiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content,
      mood,
      shiftType
    };

    setState(prev => ({
      ...prev,
      eDiary: [entry, ...prev.eDiary]
    }));
    setContent('');
    setMood('Determined');
    setShiftType('None');
    alert("Nexus Log Commit Successful.");
  };

  const deleteEntry = (id: string) => {
    setState(prev => ({
      ...prev,
      eDiary: prev.eDiary.filter(e => e.id !== id)
    }));
  };

  return (
    <div className="h-full space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 uppercase tracking-tighter">
            <Book className="text-amber-500" size={24} />
            Nexus Log
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Daily clinical experiences & psychological telemetry.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Entry Creator */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
             <Book size={120} />
           </div>
           
           <div className="space-y-2">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Entry Content</label>
             <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="Capture the day's clinical patterns, hospital interactions, or personal focus struggles..."
               className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none leading-relaxed"
             />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shift Protocol</label>
                 <div className="flex gap-2">
                   {(['None', 'Day', 'Night', 'Double'] as const).map(s => (
                     <button 
                       key={s}
                       onClick={() => setShiftType(s)}
                       className={`flex-grow p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${shiftType === s ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                     >
                       {s === 'Day' && <Sun size={12} />}
                       {s === 'Night' && <Moon size={12} />}
                       {s === 'Double' && <Coffee size={12} />}
                       <span className="text-[8px] font-bold uppercase">{s}</span>
                     </button>
                   ))}
                 </div>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Psy-Mood</label>
                 <div className="flex gap-2">
                   {(['Exhausted', 'Determined', 'Anxious', 'Victorious'] as const).map(m => (
                     <button 
                       key={m}
                       onClick={() => setMood(m)}
                       className={`flex-grow p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${mood === m ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                     >
                       <span className="text-[8px] font-bold uppercase">{m}</span>
                     </button>
                   ))}
                 </div>
              </div>
           </div>

           <button 
            onClick={handleSave}
            className="w-full py-4 bg-amber-500 text-slate-950 font-black rounded-xl uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10 active:scale-95"
           >
             <Save size={16} />
             Commit to Nexus Log
           </button>
        </div>

        {/* History Area */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col overflow-hidden max-h-[700px]">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <History size={14} className="text-amber-500" />
                   Log Archives
                 </h2>
                 <span className="text-[10px] font-mono text-slate-600 uppercase">{state.eDiary.length} Entries</span>
              </div>
              <div className="flex-grow overflow-y-auto space-y-4 scrollbar-hide pr-2">
                 {state.eDiary.length === 0 && (
                   <div className="py-20 flex flex-col items-center gap-4 opacity-20 text-center">
                     <Book size={48} />
                     <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Nexus Log Empty</p>
                     <p className="text-[9px] italic">Begin clinical recording to build strategic timeline.</p>
                   </div>
                 )}
                 {state.eDiary.map(entry => (
                   <div key={entry.id} className="bg-slate-950 border border-slate-800/50 rounded-xl p-5 space-y-3 group hover:border-amber-500/20 transition-all relative">
                      <div className="flex justify-between items-start">
                         <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono text-slate-600 font-bold">{entry.date}</span>
                            <div className="flex gap-2">
                               <span className="text-[8px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-slate-400 uppercase font-bold tracking-tighter">SHIFT: {entry.shiftType}</span>
                               <span className="text-[8px] px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/10 rounded uppercase font-bold tracking-tighter">{entry.mood}</span>
                            </div>
                         </div>
                         <button onClick={() => deleteEntry(entry.id)} className="text-slate-800 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={14} />
                         </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">"{entry.content}"</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EDiaryView;
