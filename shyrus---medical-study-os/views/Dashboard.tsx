
import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, ShieldAlert, CheckCircle2, ChevronRight, Flame, Plus, 
  Trash2, BrainCircuit, Target, Bell, X, BookOpen, Stethoscope, 
  Microscope, Pill, UserCheck, Sword, FileWarning, Activity, Calendar, Edit3, Clock,
  AlarmClock, Award, ShieldCheck, Settings2, CalendarDays, ClipboardList, Info,
  UserCircle, Medal
} from 'lucide-react';
import { AppState, Quest, ChatMessage, HospitalTask } from '../types';
import { interactWithAssistant } from '../services/geminiService';
import { MEDICAL_SUBJECTS } from '../constants';
import { Link } from 'react-router-dom';

const Dashboard = ({ 
  state, 
  setState, 
  completeQuest,
  completeHospitalTask 
}: { 
  state: AppState, 
  setState: React.Dispatch<React.SetStateAction<AppState>>, 
  completeQuest: (id: string) => void,
  completeHospitalTask: (id: string) => void 
}) => {
  const [assistantInput, setAssistantInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [showDutyForm, setShowDutyForm] = useState(false);
  const [showObjectiveConfig, setShowObjectiveConfig] = useState(false);
  
  const [manualMission, setManualMission] = useState({ title: '', subject: MEDICAL_SUBJECTS[0], duration: 45 });
  const [manualDuty, setManualDuty] = useState({ label: '', category: 'Ward' as HospitalTask['category'] });
  
  const [tempProfile, setTempProfile] = useState({ 
    exam: state.profile.exam, 
    examDate: state.profile.examDate 
  });

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const activeQuests = state.quests.filter(q => !q.completed);
  const activeDutyTasks = state.hospitalLog.filter(t => !t.completed);
  const activeAlarms = state.reminders.filter(r => r.active);

  const examTimestamp = new Date(state.profile.examDate).getTime();
  const currentTimestamp = new Date().getTime();
  const daysRemaining = Math.max(0, Math.ceil((examTimestamp - currentTimestamp) / (1000 * 60 * 60 * 24)));

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [state.chatHistory]);

  const saveObjective = () => {
    setState(prev => ({ 
      ...prev, 
      profile: { 
        ...prev.profile, 
        exam: tempProfile.exam, 
        examDate: tempProfile.examDate 
      } 
    }));
    setShowObjectiveConfig(false);
  };

  const handleAssistantSend = async () => {
    if (!assistantInput.trim() || isAiLoading) return;
    const userMsg: ChatMessage = { role: 'user', text: assistantInput, timestamp: Date.now() };
    setState(prev => ({ ...prev, chatHistory: [...prev.chatHistory, userMsg] }));
    const currentInput = assistantInput;
    setAssistantInput('');
    setIsAiLoading(true);

    const result = await interactWithAssistant(currentInput, state);
    if (result.action && result.action.type !== 'NONE') {
      const { type, payload } = result.action;
      if (type === 'ADD_QUEST' && payload.title) {
        const quest: Quest = { id: `ai-q-${Date.now()}`, title: payload.title, subject: payload.subject || 'General', duration: payload.duration || 45, type: 'Main', completed: false };
        setState(prev => ({ ...prev, quests: [quest, ...prev.quests] }));
      } else if (type === 'ADD_HOSPITAL_TASK' && payload.label) {
        const task: HospitalTask = { id: `ai-h-${Date.now()}`, label: payload.label, category: 'Ward', completed: false };
        setState(prev => ({ ...prev, hospitalLog: [task, ...prev.hospitalLog] }));
      }
    }

    const aiMsg: ChatMessage = { role: 'model', text: result.text, timestamp: Date.now() };
    setState(prev => ({ ...prev, chatHistory: [...prev.chatHistory, aiMsg] }));
    setIsAiLoading(false);
  };

  const deleteQuest = (id: string) => {
    setState(prev => ({ ...prev, quests: prev.quests.filter(q => q.id !== id) }));
  };

  const deleteDutyTask = (id: string) => {
    setState(prev => ({ ...prev, hospitalLog: prev.hospitalLog.filter(t => t.id !== id) }));
  };

  const rankTitle = state.profile.level < 10 ? "Field Medic" : state.profile.level < 20 ? "Senior Resident" : state.profile.level < 30 ? "Attending Surgeon" : "Consultant Envoy";

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      {/* Tactical Identity Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Award size={120} />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <Link to="/ranks" className="w-16 h-16 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center hover:bg-teal-500/20 transition-all group/icon">
               <ShieldCheck size={32} className="text-teal-400 group-hover/icon:scale-110 transition-transform" />
            </Link>
            <div>
               <h2 className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] mb-1">Authenticated Rank</h2>
               <p className="text-2xl font-black text-white tracking-tighter uppercase">{rankTitle}</p>
               <div className="flex gap-2 mt-2">
                 <span className="text-[9px] font-black px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-500 rounded">Tier_{state.profile.level}</span>
                 <Link to="/ranks" className="text-[9px] px-2 py-0.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded font-bold uppercase tracking-widest hover:bg-teal-500/20 transition-all flex items-center gap-1.5">
                   <Medal size={10} /> {state.profile.medals.length} Medals
                 </Link>
               </div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end">
             <div className="flex items-center gap-2 mb-1">
               <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest leading-none">Objective: <span className="text-slate-300">{state.profile.exam}</span></p>
               <button onClick={() => setShowObjectiveConfig(!showObjectiveConfig)} className="p-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-teal-400 transition-all">
                  <Settings2 size={12} />
               </button>
             </div>
             <p className="text-3xl font-black text-white tracking-tighter leading-none">{daysRemaining} <span className="text-sm text-slate-500 uppercase">Days To Zero</span></p>
          </div>
        </div>
      </div>

      {/* Objective Configuration Panel */}
      {showObjectiveConfig && (
        <div className="bg-slate-900 border border-teal-500/20 p-6 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                <Target size={16} className="text-teal-400" /> Operational Parameter Config
              </h3>
              <button onClick={() => setShowObjectiveConfig(false)} className="text-slate-500 hover:text-white"><X size={16} /></button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Exam Target Identification</label>
                 <input 
                   type="text" 
                   value={tempProfile.exam} 
                   onChange={(e) => setTempProfile(p => ({...p, exam: e.target.value}))}
                   placeholder="e.g. FMGE June 2024"
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-teal-500 outline-none"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Zero Hour (Exam Date)</label>
                 <input 
                   type="date" 
                   value={tempProfile.examDate} 
                   onChange={(e) => setTempProfile(p => ({...p, examDate: e.target.value}))}
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:ring-1 focus:ring-teal-500 outline-none"
                 />
              </div>
           </div>
           <button 
             onClick={saveObjective} 
             className="w-full mt-4 py-3 bg-teal-500 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-teal-500/10 active:scale-95 transition-all"
           >
              Update Objective Node
           </button>
        </div>
      )}

      {/* Tactical Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<Flame className="text-amber-500" />} 
          label="Streak" 
          value={`${state.profile.streak} d`} 
          sub={state.isHospitalMode ? "Protected by Duty Mode" : "Activity maintained"} 
        />
        <StatCard 
          icon={<Stethoscope className={state.isHospitalMode ? "text-amber-500" : "text-blue-400"} />} 
          label="Duty Mode" 
          value={state.isHospitalMode ? 'ENGAGED' : 'STANDBY'} 
          sub={state.isHospitalMode ? "Streaks Locked" : "Toggle in Header"} 
        />
        <StatCard icon={<AlarmClock className="text-cyan-400" />} label="Alarms" value={activeAlarms.length} sub="Nodes active" />
        <StatCard icon={<Zap className="text-teal-400" />} label="XP Pool" value={state.profile.xp} sub={`Goal: ${state.profile.maxXp}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mission/Duty Zone */}
        <div className="lg:col-span-8 space-y-6">
          {/* Mission Log (Study) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-slate-100 uppercase tracking-[0.3em] flex items-center gap-2">
                <Sword size={16} className="text-teal-500" /> Study Missions
              </h2>
              <button 
                onClick={() => setShowMissionForm(!showMissionForm)} 
                className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${showMissionForm ? 'bg-slate-800 text-slate-400' : 'bg-slate-950 border border-slate-800 text-teal-400 hover:border-teal-500/50'}`}
              >
                {showMissionForm ? 'Abort' : 'Inject Mission'}
              </button>
            </div>

            {showMissionForm && (
              <div className="mb-6 p-4 bg-slate-950 border border-teal-500/20 rounded-xl space-y-4 animate-in zoom-in-95">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Objective..." 
                    value={manualMission.title} 
                    onChange={(e) => setManualMission(p => ({...p, title: e.target.value}))} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none" 
                  />
                  <select 
                    value={manualMission.subject}
                    onChange={(e) => setManualMission(p => ({...p, subject: e.target.value}))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none" 
                  >
                    {MEDICAL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <button onClick={() => {
                  if (!manualMission.title) return;
                  const quest: Quest = { id: `q-man-${Date.now()}`, title: manualMission.title, subject: manualMission.subject, duration: manualMission.duration, type: 'Main', completed: false };
                  setState(prev => ({ ...prev, quests: [quest, ...prev.quests] }));
                  setManualMission({ title: '', subject: MEDICAL_SUBJECTS[0], duration: 45 });
                  setShowMissionForm(false);
                }} className="w-full px-6 py-2.5 bg-teal-500 text-slate-950 rounded-lg font-black uppercase text-[10px] tracking-widest">Authorize Mission</button>
              </div>
            )}

            <div className="space-y-3">
              {activeQuests.map(q => (
                <div key={q.id} className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800/50 rounded-xl group hover:border-teal-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <button onClick={() => completeQuest(q.id)} className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center text-transparent hover:text-teal-400 hover:border-teal-400 transition-all bg-slate-900">
                      <CheckCircle2 size={18} />
                    </button>
                    <div>
                      <p className="text-xs font-bold text-slate-200">{q.title}</p>
                      <span className="text-[9px] font-mono text-slate-600 uppercase font-black">{q.subject}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteQuest(q.id)} className="p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {activeQuests.length === 0 && (
                <div className="py-8 flex flex-col items-center gap-3 opacity-20 text-center">
                  <Target size={32} className="text-slate-600" />
                  <p className="text-[10px] uppercase font-bold tracking-widest">No Active Missions</p>
                </div>
              )}
            </div>
          </div>

          {/* Duty Tasks Log (Hospital) */}
          <div className={`bg-slate-900 border rounded-2xl p-6 transition-all shadow-2xl relative overflow-hidden ${state.isHospitalMode ? 'border-amber-500/30' : 'border-slate-800 opacity-40 grayscale pointer-events-none'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black text-slate-100 uppercase tracking-[0.3em] flex items-center gap-2">
                <ClipboardList size={16} className="text-amber-500" /> Ward Protocol
              </h2>
              {state.isHospitalMode && (
                <button 
                  onClick={() => setShowDutyForm(!showDutyForm)} 
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${showDutyForm ? 'bg-slate-800 text-slate-400' : 'bg-slate-950 border border-slate-800 text-amber-500 hover:border-amber-500/50'}`}
                >
                  {showDutyForm ? 'Abort' : 'Add Duty Task'}
                </button>
              )}
            </div>

            {!state.isHospitalMode ? (
              <div className="py-12 flex flex-col items-center gap-4 text-center">
                 <ShieldAlert size={48} className="text-slate-800" />
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Duty Mode Standby</p>
                    <p className="text-[8px] italic text-slate-700 mt-1 max-w-[200px]">Engage DUTY_PROTOCOL to unlock hospital task management and lock streaks.</p>
                 </div>
              </div>
            ) : (
              <>
                {showDutyForm && (
                  <div className="mb-6 p-4 bg-slate-950 border border-amber-500/20 rounded-xl space-y-4 animate-in zoom-in-95">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Task Label (e.g. Ward Round)..." 
                        value={manualDuty.label} 
                        onChange={(e) => setManualDuty(p => ({...p, label: e.target.value}))} 
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none" 
                      />
                      <select 
                        value={manualDuty.category}
                        onChange={(e) => setManualDuty(p => ({...p, category: e.target.value as any}))}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white outline-none"
                      >
                        <option value="Ward">Ward</option>
                        <option value="Lab">Lab</option>
                        <option value="Drug">Drug</option>
                        <option value="Round">Round</option>
                      </select>
                    </div>
                    <button onClick={() => {
                      if (!manualDuty.label) return;
                      const task: HospitalTask = { id: `h-man-${Date.now()}`, label: manualDuty.label, category: manualDuty.category, completed: false };
                      setState(prev => ({ ...prev, hospitalLog: [task, ...prev.hospitalLog] }));
                      setManualDuty({ label: '', category: 'Ward' });
                      setShowDutyForm(false);
                    }} className="w-full px-6 py-2.5 bg-amber-500 text-slate-950 rounded-lg font-black uppercase text-[10px] tracking-widest">Commit Duty Task</button>
                  </div>
                )}
                <div className="space-y-3">
                  {activeDutyTasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800/50 rounded-xl group hover:border-amber-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <button onClick={() => completeHospitalTask(t.id)} className="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center text-transparent hover:text-amber-500 hover:border-amber-500 transition-all bg-slate-900">
                          <CheckCircle2 size={18} />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-slate-200">{t.label}</p>
                          <span className="text-[9px] font-mono text-slate-600 uppercase font-black">{t.category} PROTOCOL</span>
                        </div>
                      </div>
                      <button onClick={() => deleteDutyTask(t.id)} className="p-2 text-slate-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {activeDutyTasks.length === 0 && (
                    <div className="py-8 flex flex-col items-center gap-3 opacity-20 text-center">
                       <Pill size={32} className="text-slate-600" />
                       <p className="text-[10px] uppercase font-bold tracking-widest">No Active Protocol</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* AI Neural Sync Panel */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[520px] lg:h-full lg:max-h-[800px] overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit size={16} className="text-teal-400" />
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Link</h2>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-mono text-teal-500 font-bold uppercase">Ready</span>
              </div>
            </div>
            <div ref={chatScrollRef} className="flex-grow p-4 overflow-y-auto space-y-4 scrollbar-hide bg-slate-950/20">
               {state.chatHistory.slice(-15).map((msg, i) => (
                 <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl text-[10px] leading-relaxed max-w-[85%] ${msg.role === 'user' ? 'bg-slate-800 text-slate-100 rounded-tr-none' : 'bg-teal-500/10 border border-teal-500/20 text-teal-300 italic rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                 </div>
               ))}
               {isAiLoading && (
                 <div className="flex justify-start">
                    <div className="flex gap-1 items-center p-2 bg-slate-900/50 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                 </div>
               )}
            </div>
            <div className="p-3 bg-slate-950/50 border-t border-slate-800 flex gap-2">
               <input 
                  type="text" 
                  value={assistantInput} 
                  onChange={(e) => setAssistantInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleAssistantSend()} 
                  placeholder="Issue command to AI..." 
                  className="flex-grow bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-inner" 
               />
               <button onClick={handleAssistantSend} className="p-2.5 bg-teal-500 text-slate-950 rounded-xl hover:bg-teal-400 active:scale-90 transition-all shadow-lg shadow-teal-500/10">
                  <Target size={16}/>
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: any, label: string, value: any, sub: string }) => (
  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 group hover:border-teal-500/30 transition-all">
    <div className="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 shrink-0 shadow-inner group-hover:bg-slate-900 transition-colors">{icon}</div>
    <div>
      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-xl font-black text-slate-100 leading-none">{value}</p>
      <p className="text-[7px] font-mono text-slate-600 mt-1 uppercase tracking-tight leading-tight">{sub}</p>
    </div>
  </div>
);

export default Dashboard;
