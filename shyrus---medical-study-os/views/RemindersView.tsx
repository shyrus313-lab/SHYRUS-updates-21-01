
import React, { useState } from 'react';
import { AppState, TacticalReminder } from '../types';
import { 
  AlarmClock, Plus, Trash2, Bell, BellOff, 
  Calendar, Clock, ShieldCheck, Zap, Info,
  AlertTriangle, CalendarDays, ListFilter
} from 'lucide-react';

const RemindersView = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const [activeTab, setActiveTab] = useState<'Alarms' | 'Reminders'>('Alarms');
  const [showForm, setShowForm] = useState(false);
  const [reminderType, setReminderType] = useState<'Alarm' | 'Reminder'>('Alarm');
  
  const [newReminder, setNewReminder] = useState<Partial<TacticalReminder>>({
    label: '',
    time: '08:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    date: '',
    active: true
  });

  const dayOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const alarms = state.reminders.filter(r => !r.date);
  const reminders = state.reminders.filter(r => !!r.date);

  const addReminder = () => {
    if (!newReminder.label) return;
    
    const reminder: TacticalReminder = {
      id: `rem-${Date.now()}`,
      label: newReminder.label!,
      time: newReminder.time!,
      days: reminderType === 'Alarm' ? newReminder.days! : [],
      date: reminderType === 'Reminder' ? newReminder.date : undefined,
      active: true
    };

    setState(prev => ({
      ...prev,
      reminders: [...prev.reminders, reminder].sort((a, b) => a.time.localeCompare(b.time))
    }));
    
    setNewReminder({ label: '', time: '08:00', days: dayOptions, date: '', active: true });
    setShowForm(false);

    if (Notification.permission === 'denied') {
      alert("Note: Notification permission is denied. Alarms will show in-app but won't trigger phone/system alerts.");
    }
  };

  const removeReminder = (id: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.filter(r => r.id !== id)
    }));
  };

  const toggleReminder = (id: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, active: !r.active } : r)
    }));
  };

  const toggleDay = (day: string) => {
    setNewReminder(prev => {
      const days = prev.days || [];
      if (days.includes(day)) {
        return { ...prev, days: days.filter(d => d !== day) };
      } else {
        return { ...prev, days: [...days, day] };
      }
    });
  };

  return (
    <div className="h-full space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2 uppercase tracking-tighter">
            <AlarmClock className="text-teal-400" size={24} />
            Tactical Alarms & Reminders
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Operational Alerts for Study Nodes & Ward Duties.</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 flex-grow md:flex-grow-0">
            <button 
              onClick={() => setActiveTab('Alarms')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'Alarms' ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Alarms
            </button>
            <button 
              onClick={() => setActiveTab('Reminders')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'Reminders' ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Reminders
            </button>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="p-2.5 bg-teal-500 text-slate-950 rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/10"
          >
            {showForm ? <Trash2 size={20}/> : <Plus size={20}/>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {showForm && (
            <div className="bg-slate-900 border border-teal-500/20 p-8 rounded-3xl space-y-6 shadow-2xl animate-in zoom-in-95 duration-300 border-l-4 border-l-teal-500">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={14} className="text-teal-400" /> Authorized New Deployment
                  </h3>
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                    <button 
                      onClick={() => setReminderType('Alarm')}
                      className={`px-3 py-1 rounded text-[8px] font-black uppercase transition-all ${reminderType === 'Alarm' ? 'bg-slate-800 text-teal-400' : 'text-slate-600'}`}
                    >
                      Recurring
                    </button>
                    <button 
                      onClick={() => setReminderType('Reminder')}
                      className={`px-3 py-1 rounded text-[8px] font-black uppercase transition-all ${reminderType === 'Reminder' ? 'bg-slate-800 text-teal-400' : 'text-slate-600'}`}
                    >
                      One-time
                    </button>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tactical Identifier (Label)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Morning MCQ Sprint"
                      value={newReminder.label}
                      onChange={(e) => setNewReminder(p => ({...p, label: e.target.value}))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Zero Hour (Time)</label>
                      <input 
                        type="time" 
                        value={newReminder.time}
                        onChange={(e) => setNewReminder(p => ({...p, time: e.target.value}))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-teal-400"
                      />
                    </div>
                    {reminderType === 'Reminder' && (
                      <div className="space-y-2 animate-in slide-in-from-top-2">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Deployment Date</label>
                        <input 
                          type="date" 
                          value={newReminder.date}
                          onChange={(e) => setNewReminder(p => ({...p, date: e.target.value}))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:ring-1 focus:ring-teal-500"
                        />
                      </div>
                    )}
                  </div>

                  {reminderType === 'Alarm' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Frequency Calibration</label>
                      <div className="flex flex-wrap gap-2">
                        {dayOptions.map(day => (
                          <button 
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`w-10 h-10 rounded-lg border text-[9px] font-black uppercase transition-all ${newReminder.days?.includes(day) ? 'bg-teal-500 border-teal-500 text-slate-950 shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                          >
                            {day.substring(0, 1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={addReminder} className="w-full py-4 bg-teal-500 text-slate-950 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-teal-400 active:scale-95 transition-all">
                    Authorize Signal Node
                  </button>
               </div>
            </div>
          )}

          <div className="space-y-4">
            {(activeTab === 'Alarms' ? alarms : reminders).length === 0 && !showForm && (
              <div className="py-20 flex flex-col items-center gap-6 opacity-20 text-center bg-slate-900/50 border border-dashed border-slate-800 rounded-3xl">
                <BellOff size={48} />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest">No {activeTab} Synchronized</p>
                  <p className="text-[10px] italic mt-2">Design your alerting protocol to enforce neural discipline.</p>
                </div>
              </div>
            )}
            {(activeTab === 'Alarms' ? alarms : reminders).map(rem => (
              <div key={rem.id} className={`p-6 bg-slate-900 border rounded-3xl flex items-center justify-between group transition-all ${rem.active ? 'border-slate-800' : 'border-slate-800/50 opacity-50 grayscale'}`}>
                 <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-2xl border transition-all ${rem.active ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
                       {rem.date ? <CalendarDays size={28} /> : <AlarmClock size={28} className={rem.active ? 'animate-pulse' : ''} />}
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">{rem.label}</h3>
                       <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-lg font-mono font-bold text-teal-500">{rem.time}</span>
                          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-tighter">
                            {rem.date ? rem.date : rem.days.join(' • ')}
                          </span>
                       </div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <button onClick={() => toggleReminder(rem.id)} className={`p-2 rounded-xl border transition-all ${rem.active ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                       {rem.active ? <Bell size={18} /> : <BellOff size={18} />}
                    </button>
                    <button onClick={() => removeReminder(rem.id)} className="p-2 text-slate-700 hover:text-red-400 transition-colors">
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <Info size={14} className="text-teal-400" />
                 Tactical Protocol
              </h3>
              <div className="space-y-4">
                 <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3">
                    <ShieldCheck className="text-teal-500 shrink-0" size={16} />
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">
                       PWA Alarms are handled via the browser service worker. For mobile, authorize notifications to receive system-level rings.
                    </p>
                 </div>
                 <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3">
                    <Zap className="text-amber-500 shrink-0" size={16} />
                    <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-tight">
                       One-time reminders are automatically archived after the zero hour passes.
                    </p>
                 </div>
              </div>
           </div>
           
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <ListFilter size={14} className="text-purple-400" />
                 Operational Statistics
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Total Active Alarms</span>
                  <span className="text-xs font-mono font-bold text-teal-400">{alarms.filter(a => a.active).length}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Pending Reminders</span>
                  <span className="text-xs font-mono font-bold text-purple-400">{reminders.filter(r => r.active).length}</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RemindersView;
