
import React, { useState } from 'react';
import { AppState, ScheduleEntry, WeeklyGoal, LongTermGoal } from '../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Stethoscope, 
  BookOpen, 
  Moon, 
  Coffee,
  Info,
  ShieldCheck,
  ShieldAlert,
  Zap,
  X,
  Target,
  CheckCircle2,
  TrendingUp,
  Milestone,
  Flag
} from 'lucide-react';

const CalendarView = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<ScheduleEntry>>({
    startTime: '08:00',
    endTime: '10:00',
    type: 'Study',
    label: ''
  });

  const [newWeeklyGoal, setNewWeeklyGoal] = useState('');
  const [newMonthlyGoal, setNewMonthlyGoal] = useState({ title: '', date: '' });

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const isSelectedDateDuty = state.dutyDates.includes(selectedDateStr);

  const toggleDutyForDate = () => {
    setState(prev => {
      const isDuty = prev.dutyDates.includes(selectedDateStr);
      const newDutyDates = isDuty 
        ? prev.dutyDates.filter(d => d !== selectedDateStr)
        : [...prev.dutyDates, selectedDateStr];
      return { ...prev, dutyDates: newDutyDates };
    });
  };

  const addScheduleEntry = () => {
    if (!newEntry.label) return;
    const entry: ScheduleEntry = {
      id: `sched-${Date.now()}`,
      startTime: newEntry.startTime!,
      endTime: newEntry.endTime!,
      label: newEntry.label!,
      type: (newEntry.type as any) || 'Study',
      subject: newEntry.subject
    };
    setState(prev => ({
      ...prev,
      dailySchedule: [...prev.dailySchedule, entry].sort((a, b) => a.startTime.localeCompare(b.startTime))
    }));
    setNewEntry({ startTime: '08:00', endTime: '10:00', type: 'Study', label: '' });
    setShowEntryForm(false);
  };

  const removeEntry = (id: string) => {
    setState(prev => ({
      ...prev,
      dailySchedule: prev.dailySchedule.filter(e => e.id !== id)
    }));
  };

  // Weekly Goal Helpers
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff)).toISOString().split('T')[0];
  };

  const currentWeekStart = getStartOfWeek(selectedDate);
  const weeklyObjectives = state.weeklyGoals.filter(g => g.weekStarting === currentWeekStart);

  const addWeeklyGoal = () => {
    if (!newWeeklyGoal.trim()) return;
    const goal: WeeklyGoal = {
      id: `week-${Date.now()}`,
      weekStarting: currentWeekStart,
      title: newWeeklyGoal,
      completed: false
    };
    setState(prev => ({ ...prev, weeklyGoals: [...prev.weeklyGoals, goal] }));
    setNewWeeklyGoal('');
  };

  const toggleWeeklyGoal = (id: string) => {
    setState(prev => ({ ...prev, weeklyGoals: prev.weeklyGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g) }));
  };

  const deleteWeeklyGoal = (id: string) => {
    setState(prev => ({ ...prev, weeklyGoals: prev.weeklyGoals.filter(g => g.id !== id) }));
  };

  // Monthly Goal Helpers
  const addMonthlyGoal = () => {
    if (!newMonthlyGoal.title.trim()) return;
    const goal: LongTermGoal = {
      id: `month-${Date.now()}`,
      title: newMonthlyGoal.title,
      targetDate: newMonthlyGoal.date || selectedDateStr,
      type: 'Milestone',
      completed: false
    };
    setState(prev => ({ ...prev, longTermGoals: [...prev.longTermGoals, goal].sort((a, b) => a.targetDate.localeCompare(b.targetDate)) }));
    setNewMonthlyGoal({ title: '', date: '' });
  };

  const toggleMonthlyGoal = (id: string) => {
    setState(prev => ({ ...prev, longTermGoals: prev.longTermGoals.map(g => g.id === id ? { ...g, completed: !g.completed } : g) }));
  };

  const deleteMonthlyGoal = (id: string) => {
    setState(prev => ({ ...prev, longTermGoals: prev.longTermGoals.filter(g => g.id !== id) }));
  };

  return (
    <div className="h-full space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 uppercase tracking-tighter">
            <CalendarIcon className="text-teal-400" size={24} />
            Command Timeline
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Strategic scheduling & Daily operational mapping.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-teal-500"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase">Study</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-2 h-2 rounded-full bg-amber-500"></div>
               <span className="text-[10px] font-bold text-slate-400 uppercase">Duty Day</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Grid and Strategic Hub */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><ChevronLeft size={16}/></button>
                <button onClick={handleNextMonth} className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><ChevronRight size={16}/></button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-slate-600 uppercase py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth(currentMonth) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
                const day = i + 1;
                const loopDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const loopDateStr = loopDate.toISOString().split('T')[0];
                const isToday = new Date().toDateString() === loopDate.toDateString();
                const isSelected = selectedDate.toDateString() === loopDate.toDateString();
                const isDuty = state.dutyDates.includes(loopDateStr);
                
                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedDate(loopDate)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all border ${
                      isSelected ? 'bg-teal-500 border-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' : 
                      isToday ? 'bg-slate-800 border-teal-500/50 text-teal-400' : 'bg-slate-950 border-slate-900 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-mono font-bold">{day}</span>
                    {isDuty && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-amber-500"></div>}
                  </button>
                );
              })}
            </div>

            {/* Manual Duty Toggler */}
            <div className="mt-8 p-6 bg-slate-950/50 border border-slate-800 rounded-2xl space-y-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                       <Stethoscope size={16} className={isSelectedDateDuty ? "text-amber-500" : "text-slate-600"} />
                       Duty Protocol
                     </h3>
                     <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{selectedDate.toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={toggleDutyForDate}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isSelectedDateDuty ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'bg-slate-800 text-slate-500 border border-slate-700 hover:border-slate-600'}`}
                  >
                     {isSelectedDateDuty ? 'ACTIVE_DUTY' : 'MARK_DUTY'}
                  </button>
               </div>
            </div>
          </div>

          {/* Monthly Objectives (Long-Term) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                   <Milestone size={16} className="text-teal-400" />
                   Monthly Strategic Goals
                </h3>
             </div>

             <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Set long-term monthly target..."
                  value={newMonthlyGoal.title}
                  onChange={(e) => setNewMonthlyGoal(p => ({...p, title: e.target.value}))}
                  onKeyDown={(e) => e.key === 'Enter' && addMonthlyGoal()}
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-teal-500"
                />
                <button onClick={addMonthlyGoal} className="p-2 bg-teal-500 text-slate-950 rounded-lg hover:bg-teal-400 transition-colors">
                  <Plus size={18} />
                </button>
             </div>

             <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-hide">
                {state.longTermGoals.map(goal => (
                  <div key={goal.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                       <button onClick={() => toggleMonthlyGoal(goal.id)} className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${goal.completed ? 'bg-teal-500 border-teal-500 text-slate-950' : 'border-slate-700 text-transparent hover:border-teal-500/50'}`}>
                          <CheckCircle2 size={14} />
                       </button>
                       <div>
                         <span className={`text-xs font-bold block ${goal.completed ? 'text-slate-600 line-through' : 'text-slate-200'}`}>{goal.title}</span>
                         <span className="text-[8px] font-mono text-slate-600 uppercase">By {goal.targetDate}</span>
                       </div>
                    </div>
                    <button onClick={() => deleteMonthlyGoal(goal.id)} className="p-1.5 text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                       <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {state.longTermGoals.length === 0 && (
                  <p className="text-center py-6 text-[9px] uppercase font-bold text-slate-700 tracking-widest">No Monthly Milestones</p>
                )}
             </div>
          </div>

          {/* Weekly Objectives (Short-Term) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                   <Flag size={16} className="text-purple-400" />
                   Weekly Objectives
                </h3>
                <span className="text-[9px] font-mono text-slate-600 uppercase">Week of {currentWeekStart}</span>
             </div>

             <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Set short-term weekly target..."
                  value={newWeeklyGoal}
                  onChange={(e) => setNewWeeklyGoal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addWeeklyGoal()}
                  className="flex-grow bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button onClick={addWeeklyGoal} className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors">
                  <Plus size={18} />
                </button>
             </div>

             <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 scrollbar-hide">
                {weeklyObjectives.map(goal => (
                  <div key={goal.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                       <button onClick={() => toggleWeeklyGoal(goal.id)} className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${goal.completed ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-700 text-transparent hover:border-purple-500/50'}`}>
                          <CheckCircle2 size={14} />
                       </button>
                       <span className={`text-xs font-bold ${goal.completed ? 'text-slate-600 line-through' : 'text-slate-200'}`}>{goal.title}</span>
                    </div>
                    <button onClick={() => deleteWeeklyGoal(goal.id)} className="p-1.5 text-slate-800 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                       <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {weeklyObjectives.length === 0 && (
                  <p className="text-center py-6 text-[9px] uppercase font-bold text-slate-700 tracking-widest">No Weekly Targets Defined</p>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Daily Time Table */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/50">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-[0.2em]">Daily Timeline</h2>
              <p className="text-[10px] font-mono text-slate-500 mt-1">{selectedDate.toDateString()}</p>
            </div>
            <button 
              onClick={() => setShowEntryForm(!showEntryForm)}
              className="px-4 py-2 bg-teal-500 text-slate-950 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-teal-400 transition-colors"
            >
              <Plus size={14} /> Add Block
            </button>
          </div>

          {showEntryForm && (
            <div className="mb-8 p-6 bg-slate-950 border border-teal-500/20 rounded-2xl space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-[10px] font-black text-teal-500 uppercase tracking-widest">New Time Block</h4>
                <button onClick={() => setShowEntryForm(false)} className="text-slate-500 hover:text-white"><X size={16}/></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Start Time</label>
                  <input 
                    type="time" 
                    value={newEntry.startTime}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">End Time</label>
                  <input 
                    type="time" 
                    value={newEntry.endTime}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Task Label</label>
                <input 
                  type="text" 
                  placeholder="e.g. Neuroanatomy MCQ Session"
                  value={newEntry.label}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, label: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-grow space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Block Type</label>
                  <select 
                    value={newEntry.type}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Study">Study Block</option>
                    <option value="Hospital">Hospital Duty</option>
                    <option value="Revision">Rapid Revision</option>
                    <option value="Rest">Rest / Sleep</option>
                  </select>
                </div>
                <button 
                  onClick={addScheduleEntry}
                  className="mt-auto px-8 py-2.5 bg-teal-500 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-teal-400 transition-colors shadow-lg active:scale-95"
                >
                  Commit
                </button>
              </div>
            </div>
          )}

          <div className="flex-grow space-y-4 relative pl-12 overflow-y-auto max-h-[500px] scrollbar-hide">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800"></div>
            
            {state.dailySchedule.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-4 opacity-20 text-center">
                <Clock size={48} />
                <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Operational Schedule Empty</p>
                <p className="text-[9px] italic">Design your daily routine using tactical time-blocks.</p>
              </div>
            ) : (
              state.dailySchedule.map((entry, i) => (
                <div key={entry.id} className="relative flex items-center gap-6 group">
                  <div className={`absolute left-[-21px] w-2.5 h-2.5 rounded-full border-2 border-slate-900 z-10 ${
                    entry.type === 'Study' ? 'bg-teal-500' : 
                    entry.type === 'Hospital' ? 'bg-amber-500' : 
                    entry.type === 'Revision' ? 'bg-purple-500' : 'bg-slate-600'
                  }`}></div>
                  
                  <div className="shrink-0 w-16 text-[10px] font-mono font-bold text-slate-600 uppercase text-right">
                    {entry.startTime}
                  </div>
                  
                  <div className={`flex-grow p-4 rounded-xl border flex justify-between items-center transition-all ${
                    entry.type === 'Study' ? 'bg-teal-500/10 border-teal-500/20' : 
                    entry.type === 'Hospital' ? 'bg-amber-500/10 border-amber-500/20' : 
                    entry.type === 'Revision' ? 'bg-purple-500/10 border-purple-500/20' : 'bg-slate-950 border-slate-800'
                  }`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-[0.3em] opacity-60">{entry.type}</span>
                        <span className="text-[8px] font-mono opacity-40">({entry.endTime})</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-200">{entry.label}</h4>
                    </div>
                    <button onClick={() => removeEntry(entry.id)} className="p-2 text-slate-800 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                       <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
