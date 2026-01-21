
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Target, BarChart3, Stethoscope, User, MessageSquare, 
  FolderOpen, Sword, Clock, History, Zap, Calendar, Activity, 
  Heart, Book, Bell, X, Info, FileWarning, Download, Upload, Database, RefreshCw,
  Cloud, LogOut, CheckCircle, RefreshCcw, AlertTriangle, Trash2,
  BellRing, AlarmClock, ChevronDown, ChevronRight, Award, TrendingUp, CalendarDays, Medal, Trophy,
  ShieldCheck, Sparkles, UserCircle
} from 'lucide-react';
import { INITIAL_PROFILE, INITIAL_SUBJECTS, INITIAL_QUESTS, INITIAL_LONG_TERM_GOALS, INITIAL_HOSPITAL_TASKS } from './constants';
import { AppState, Subject, TacticalNotification, UserProfile, HospitalTask, ScheduleEntry } from './types';
import Dashboard from './views/Dashboard';
import ArsenalView from './views/ArsenalView';
import StatsView from './views/StatsView';
import PlanningView from './views/PlanningView';
import ConsultantView from './views/ConsultantView';
import VaultView from './views/VaultView';
import FocusView from './views/FocusView';
import ReflectionView from './views/ReflectionView';
import CalendarView from './views/CalendarView';
import SanctuaryView from './views/SanctuaryView';
import EDiaryView from './views/EDiaryView';
import TrainingView from './views/TrainingView';
import RevisionView from './views/RevisionView';
import RemindersView from './views/RemindersView';
import RankView from './views/RankView';
import { cloudSync, CloudIdentity } from './services/cloudStorage';

const BatLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12,6.5L11.5,8L10.5,8.2C8.5,8.5 6.5,7.5 4,6C5.5,9.5 5,12.5 6,15C4.5,16.5 3.5,18 3.5,20C6,20 8,18.5 10,18.5C11,19.5 11.5,20 12,21C12.5,20 13,19.5 14,18.5C16,18.5 18,20 20.5,20C20.5,18 19.5,16.5 18,15C19,12.5 18.5,9.5 20,6C17.5,7.5 15.5,8.5 13.5,8.2L12.5,8L12,6.5Z" />
  </svg>
);

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }
        return prev + 4;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center space-y-12">
      <div className="relative">
        <div className="absolute inset-0 blur-3xl bg-teal-500/40 animate-pulse"></div>
        <BatLogo size={180} className="text-teal-400 relative z-10 animate-in zoom-in-50 duration-1000" />
      </div>
      <div className="w-64 space-y-6">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] animate-pulse">Initializing OS</span>
          <span className="text-[10px] font-mono text-teal-700">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-1">
          <div className="h-full bg-teal-500 transition-all duration-300 shadow-[0_0_15px_rgba(45,212,191,1)] rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="space-y-1 text-center">
          <p className="text-[9px] text-teal-500/80 font-mono uppercase tracking-[0.2em] leading-relaxed">
            SHYRUS_NEURAL_LINK // ACTIVE
          </p>
          <p className="text-[8px] text-slate-600 font-mono uppercase tracking-widest leading-loose">
            ENCRYPTION: BATMAN_INIT_6.0
          </p>
        </div>
      </div>
    </div>
  );
};

const MilestoneRewardOverlay = ({ level, onDismiss }: { level: number, onDismiss: () => void }) => {
  const getMedalData = (lvl: number) => {
    if (lvl <= 10) return { name: "Iron Vanguard", bonus: "+500 XP", icon: <ShieldCheck size={64} className="text-slate-400" /> };
    if (lvl <= 20) return { name: "Bronze Specialist", bonus: "+5 Focus", icon: <Award size={64} className="text-amber-600" /> };
    if (lvl <= 30) return { name: "Silver Consultant", bonus: "+5 Discipline", icon: <Medal size={64} className="text-slate-300" /> };
    return { name: "Golden Master", bonus: "+1000 XP", icon: <Trophy size={64} className="text-yellow-400" /> };
  };

  const data = getMedalData(level);
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl animate-in fade-in duration-500 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent"></div>
      
      <div className="w-full max-w-lg bg-slate-900 border border-teal-500/30 rounded-[3rem] p-12 text-center relative overflow-hidden shadow-[0_0_100px_rgba(45,212,191,0.2)] animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-full h-2 bg-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.8)]"></div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-[2.5rem] bg-slate-950 border border-teal-500/20 flex items-center justify-center shadow-2xl relative">
              <div className="absolute inset-0 bg-teal-500/5 rounded-[2.5rem] animate-pulse"></div>
              {data.icon}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Promotion</h2>
            <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.5em]">Neural Tier {level} Authenticated</p>
          </div>

          <div className="p-8 bg-slate-950/80 border border-slate-800 rounded-3xl space-y-4">
             <div className="flex flex-col items-center gap-2">
               <span className="text-2xl font-black text-slate-100 uppercase tracking-widest">{data.name}</span>
               <div className="h-px w-20 bg-teal-500/40"></div>
               <span className="text-xs font-bold text-teal-500 font-mono uppercase tracking-widest">Permanent Medal Awarded</span>
             </div>
          </div>

          <button 
            onClick={onDismiss}
            className="w-full py-5 bg-teal-500 text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-400 active:scale-95 transition-all shadow-xl shadow-teal-500/20"
          >
            Acknowledge Rank
          </button>
        </div>
      </div>
    </div>
  );
};

const Navigation = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Base', icon: LayoutDashboard },
    { path: '/ranks', label: 'Dossier', icon: UserCircle },
    { path: '/arsenal', label: 'Arsenal', icon: Sword },
    { path: '/revision', label: 'Revision', icon: RefreshCcw },
    { path: '/calendar', label: 'Schedule', icon: Calendar },
    { path: '/reminders', label: 'Alarms', icon: AlarmClock },
    { path: '/focus', label: 'Focus', icon: Clock },
    { path: '/vault', label: 'Vault', icon: FolderOpen },
    { path: '/diary', label: 'Log', icon: Book },
    { path: '/aar', label: 'AAR', icon: FileWarning },
    { path: '/vent', label: 'Sanctuary', icon: Heart },
    { path: '/training', label: 'Briefing', icon: Info },
    { path: '/consult', label: 'Consult', icon: MessageSquare },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:left-0 lg:top-0 lg:h-full lg:w-20 bg-slate-900 border-t lg:border-t-0 lg:border-r border-slate-800 z-50 flex lg:flex-col items-center justify-around lg:justify-start lg:pt-8 pb-4 lg:pb-0 px-4 lg:px-0 overflow-x-auto scrollbar-hide">
      <div className="hidden lg:flex items-center justify-center mb-10">
        <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center text-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.25)]">
          <BatLogo size={24} />
        </div>
      </div>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link 
            key={item.path}
            to={item.path}
            className={`flex flex-col lg:mb-6 items-center shrink-0 min-w-[60px] group transition-all ${isActive ? 'text-teal-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <item.icon size={18} className={isActive ? 'animate-pulse' : ''} />
            <span className="text-[8px] mt-1 font-medium uppercase tracking-widest text-center">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

const Header = ({ 
  state, 
  toggleHospitalMode, 
  cloudLink, 
  isSyncing,
  resetSystem
}: { 
  state: AppState, 
  toggleHospitalMode: () => void, 
  cloudLink: () => void,
  isSyncing: boolean,
  resetSystem: () => void
}) => {
  const xpPercentage = (state.profile.xp / state.profile.maxXp) * 100;
  const [showSync, setShowSync] = useState(false);
  const [showLevelPopover, setShowLevelPopover] = useState(false);
  const syncRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowLevelPopover(false);
      }
      if (syncRef.current && !syncRef.current.contains(event.target as Node)) {
        setShowSync(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const rankTitle = state.profile.level < 10 ? "Field Medic" : state.profile.level < 20 ? "Senior Resident" : state.profile.level < 30 ? "Attending Surgeon" : "Consultant Envoy";
  const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <BatLogo size={28} className="text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
          <div>
            <h1 className="text-sm font-black text-slate-100 uppercase tracking-[0.2em] leading-none">SHYRUS</h1>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">Tier_{state.profile.level}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={syncRef}>
          <button 
            onClick={() => setShowSync(!showSync)} 
            className={`p-2 rounded-xl border transition-all flex items-center gap-2 ${showSync ? 'bg-teal-500/10 border-teal-500 text-teal-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-teal-400'}`}
          >
            {isSyncing ? <RefreshCw className="animate-spin" size={16} /> : <Database size={16} />}
          </button>
          {showSync && (
             <>
               <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] lg:hidden" onClick={() => setShowSync(false)}></div>
               <div className="fixed lg:absolute top-16 right-4 lg:top-12 lg:right-0 w-[calc(100vw-2rem)] lg:w-80 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-top-4 duration-200">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Bridge</h3>
                    <button onClick={() => setShowSync(false)}><X size={14}/></button>
                  </div>
                  <div className="space-y-4">
                    <button onClick={cloudLink} className="w-full flex items-center justify-center gap-2 p-3 bg-teal-500 text-slate-950 rounded-xl font-black text-[10px] uppercase tracking-widest">Link Google Node</button>
                    <button onClick={resetSystem} className="w-full p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-[9px] font-bold uppercase">Purge Memory</button>
                  </div>
               </div>
             </>
          )}
        </div>

        <button onClick={toggleHospitalMode} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${state.isHospitalMode ? 'bg-amber-500/10 border-amber-500/40 text-amber-500' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
          <Stethoscope size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{state.isHospitalMode ? 'DUTY_ON' : 'DUTY_OFF'}</span>
        </button>

        <div className="relative" ref={popoverRef}>
          <button 
            onClick={() => setShowLevelPopover(!showLevelPopover)} 
            className={`flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full transition-all active:scale-95 ${showLevelPopover ? 'border-teal-500/50 shadow-lg shadow-teal-500/10' : ''}`}
          >
            <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">LVL_{state.profile.level}</span>
            <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
               <User size={12} />
            </div>
          </button>

          {showLevelPopover && (
            <>
              <div className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] lg:hidden" onClick={() => setShowLevelPopover(false)}></div>
              
              <div className="fixed lg:absolute top-16 right-4 lg:top-12 lg:right-0 w-[calc(100vw-2rem)] lg:w-72 bg-slate-900/95 backdrop-blur-xl border border-teal-500/30 rounded-[2rem] p-6 shadow-[0_0_50px_rgba(0,0,0,0.5),0_0_20px_rgba(45,212,191,0.1)] z-50 animate-in slide-in-from-top-4 duration-200">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent"></div>
                 
                 <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                       <div>
                          <p className="text-[8px] font-black text-teal-500 uppercase tracking-[0.2em]">Operational Date</p>
                          <p className="text-xs font-mono font-bold text-slate-300">{todayStr}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</p>
                          <p className="text-[10px] font-mono font-bold text-teal-400">NOMINAL</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-5">
                       <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-teal-500/20 flex items-center justify-center shadow-lg relative overflow-hidden group">
                          <div className="absolute inset-0 bg-teal-500/5 group-hover:bg-teal-500/10 transition-colors"></div>
                          <span className="text-3xl font-black text-teal-400 relative z-10">{state.profile.level}</span>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Neural Tier</p>
                          <h3 className="text-lg font-black text-slate-100 uppercase tracking-tighter leading-none italic">{rankTitle}</h3>
                       </div>
                    </div>

                    <div className="space-y-2.5">
                       <div className="flex justify-between items-end">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">XP Progression</p>
                          <p className="text-[10px] font-mono font-bold text-teal-500">{Math.round(xpPercentage)}%</p>
                       </div>
                       <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800/50 p-0.5 shadow-inner overflow-hidden">
                          <div 
                             className="h-full bg-teal-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(45,212,191,0.6)] relative" 
                             style={{ width: `${xpPercentage}%` }}
                          >
                             <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%,transparent)] bg-[size:10px_10px]"></div>
                          </div>
                       </div>
                       <div className="flex justify-between text-[8px] font-mono text-slate-600 font-bold uppercase">
                          <span>{state.profile.xp} XP</span>
                          <span>{state.profile.maxXp} XP TARGET</span>
                       </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-600 uppercase">Efficiency</span>
                          <span className="text-xs font-mono font-bold text-slate-400">{state.profile.consistency}%</span>
                       </div>
                       <Link 
                          to="/ranks" 
                          onClick={() => setShowLevelPopover(false)}
                          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-400 hover:border-teal-500/40 transition-all flex items-center gap-2"
                       >
                          Ranks <ChevronRight size={10} />
                       </Link>
                    </div>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const NotificationToast: React.FC<{ notification: TacticalNotification, onDismiss: (id: string) => void }> = ({ notification, onDismiss }) => (
  <div className="fixed top-6 right-6 z-[100] w-72 bg-slate-900 border border-slate-800 border-l-4 border-l-teal-500 rounded-xl shadow-2xl p-4 animate-in slide-in-from-right-8">
    <div className="flex justify-between items-start mb-2">
      <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Tactical Alert</span>
      <button onClick={() => onDismiss(notification.id)} className="text-slate-600 hover:text-white"><X size={14}/></button>
    </div>
    <p className="text-xs text-slate-300 font-medium italic">"{notification.message}"</p>
  </div>
);

export default function App() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [cloudIdentity, setCloudIdentity] = useState<CloudIdentity | null>(null);

  const getInitialState = (): AppState => ({
    profile: INITIAL_PROFILE,
    subjects: INITIAL_SUBJECTS,
    quests: INITIAL_QUESTS,
    hospitalLog: INITIAL_HOSPITAL_TASKS,
    logs: [],
    isHospitalMode: false,
    dutyDates: [],
    longTermGoals: [],
    weeklyGoals: [],
    todoList: [],
    chatHistory: [],
    ventHistory: [],
    vaultFiles: [],
    sessions: [],
    reflections: [],
    reminders: [],
    dailySchedule: [],
    eDiary: [],
    qbankRecords: [],
    volatileNodes: [],
    notifications: [],
    trainingLevel: 1,
    showTrainingOverlay: false,
    sanctuaryAssistantName: 'Friday',
    showMilestoneOverlay: null
  });

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('shyrus_state_v3.6_master');
    const initial = getInitialState();
    if (!saved) return initial;
    try {
        const parsed = JSON.parse(saved);
        return {
            ...initial,
            ...parsed,
            profile: { ...initial.profile, ...parsed.profile },
            subjects: parsed.subjects || initial.subjects,
            quests: parsed.quests || [],
            hospitalLog: parsed.hospitalLog || [],
            volatileNodes: parsed.volatileNodes || [],
            notifications: parsed.notifications || [],
            chatHistory: parsed.chatHistory || [],
            ventHistory: parsed.ventHistory || [],
            dailySchedule: parsed.dailySchedule || [],
            eDiary: parsed.eDiary || [],
            qbankRecords: parsed.qbankRecords || [],
            vaultFiles: parsed.vaultFiles || [],
            reminders: parsed.reminders || []
        };
    } catch (e) {
        return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem('shyrus_state_v3.6_master', JSON.stringify(state));
  }, [state]);

  // Timeline Sentinel: Background checker for schedule reminders
  useEffect(() => {
    const checkScheduleReminders = () => {
      const now = new Date();
      const currentHHmm = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const todayStr = now.toISOString().split('T')[0];

      const dueEntries = state.dailySchedule.filter(entry => 
        entry.startTime === currentHHmm && entry.lastNotified !== todayStr
      );

      if (dueEntries.length > 0) {
        const newNotifications: TacticalNotification[] = dueEntries.map(entry => ({
          id: `notif-sch-${Date.now()}-${entry.id}`,
          message: `Sir, your ${entry.type} session "${entry.label}" is starting now. Deploy immediately.`,
          timestamp: Date.now(),
          read: false,
          type: 'SCHEDULE'
        }));

        setState(prev => ({
          ...prev,
          notifications: [...prev.notifications, ...newNotifications],
          dailySchedule: prev.dailySchedule.map(s => 
            dueEntries.some(de => de.id === s.id) ? { ...s, lastNotified: todayStr } : s
          )
        }));
      }
    };

    const interval = setInterval(checkScheduleReminders, 30000); 
    return () => clearInterval(interval);
  }, [state.dailySchedule]);

  const updateStreak = (currentState: AppState): UserProfile => {
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = currentState.profile.lastActivityDate;
    
    if (currentState.isHospitalMode || currentState.dutyDates.includes(today)) {
      return { ...currentState.profile, lastActivityDate: today };
    }

    if (lastActivity === today) return currentState.profile;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = currentState.profile.streak;
    if (lastActivity === yesterdayStr) {
      newStreak += 1;
    } else {
      newStreak = 1; 
    }
    return { ...currentState.profile, streak: newStreak, lastActivityDate: today };
  };

  const gainXp = (amount: number) => {
    setState(prev => {
      const profileWithStreak = updateStreak(prev);
      let newXp = profileWithStreak.xp + amount;
      let newLevel = profileWithStreak.level;
      let newMaxXp = profileWithStreak.maxXp;
      let milestoneLevel: number | null = null;
      let newMedals = [...profileWithStreak.medals];
      let newFocus = profileWithStreak.focusRating;
      let newDiscipline = profileWithStreak.disciplineRating;
      while (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = Math.floor(newMaxXp * 1.2); 
        if (newLevel % 10 === 0) {
          milestoneLevel = newLevel;
          if (newLevel === 10) { newMedals.push("Iron Vanguard"); newXp += 500; }
          if (newLevel === 20) { newMedals.push("Bronze Specialist"); newFocus = Math.min(100, newFocus + 5); }
          if (newLevel === 30) { newMedals.push("Silver Consultant"); newDiscipline = Math.min(100, newDiscipline + 5); }
          if (newLevel >= 40) { newMedals.push(`Gold Tier ${newLevel/10}`); newXp += 1000; }
        }
      }
      return {
        ...prev,
        showMilestoneOverlay: milestoneLevel || prev.showMilestoneOverlay,
        profile: {
          ...profileWithStreak,
          xp: newXp,
          level: newLevel,
          maxXp: newMaxXp,
          medals: newMedals,
          focusRating: newFocus,
          disciplineRating: newDiscipline
        }
      };
    });
  };

  const handleCloudLink = async () => {
    setIsSyncing(true);
    const res = await cloudSync.linkAccount();
    if (res) setCloudIdentity(res);
    setIsSyncing(false);
  };

  const resetSystem = () => { if (confirm("Wipe all data?")) setState(getInitialState()); };

  const completeQuest = (id: string) => {
    setState(prev => ({
      ...prev,
      quests: prev.quests.map(q => q.id === id ? { ...q, completed: true } : q)
    }));
    gainXp(150);
  };

  const completeHospitalTask = (id: string) => {
    setState(prev => ({
      ...prev,
      hospitalLog: prev.hospitalLog.map(t => t.id === id ? { ...t, completed: true } : t)
    }));
    gainXp(100); 
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 text-slate-200 lg:pl-20 pb-20 lg:pb-0 font-sans overflow-x-hidden">
        {isBooting && <BootSequence onComplete={() => setIsBooting(false)} />}
        {!isBooting && (
          <>
            <Navigation />
            {state.notifications.map(n => <NotificationToast key={n.id} notification={n} onDismiss={(id) => setState(p => ({...p, notifications: p.notifications.filter(x => x.id !== id)}))} />)}
            {state.showMilestoneOverlay && <MilestoneRewardOverlay level={state.showMilestoneOverlay} onDismiss={() => setState(p => ({...p, showMilestoneOverlay: null}))} />}
            
            <div className="flex flex-col min-h-screen">
              <Header state={state} toggleHospitalMode={() => setState(p => ({...p, isHospitalMode: !p.isHospitalMode}))} cloudLink={handleCloudLink} isSyncing={isSyncing} resetSystem={resetSystem} />
              <main className="flex-grow p-4 lg:p-8 max-w-7xl mx-auto w-full">
                <Routes>
                  <Route path="/" element={<Dashboard state={state} setState={setState} completeQuest={completeQuest} completeHospitalTask={completeHospitalTask} />} />
                  <Route path="/ranks" element={<RankView state={state} />} />
                  <Route path="/arsenal" element={<ArsenalView state={state} setState={setState} updateSubject={() => {}} />} />
                  <Route path="/revision" element={<RevisionView state={state} setState={setState} gainXp={gainXp} />} />
                  <Route path="/calendar" element={<CalendarView state={state} setState={setState} />} />
                  <Route path="/reminders" element={<RemindersView state={state} setState={setState} />} />
                  <Route path="/focus" element={<FocusView state={state} setState={setState} gainXp={gainXp} />} />
                  <Route path="/vault" element={<VaultView state={state} setState={setState} gainXp={gainXp} />} />
                  <Route path="/diary" element={<EDiaryView state={state} setState={setState} />} />
                  <Route path="/vent" element={<SanctuaryView state={state} setState={setState} />} />
                  <Route path="/training" element={<TrainingView state={state} setState={setState} gainXp={gainXp} />} />
                  <Route path="/aar" element={<ReflectionView state={state} setState={setState} gainXp={gainXp} />} />
                  <Route path="/consult" element={<ConsultantView state={state} setState={setState} />} />
                  <Route path="/stats" element={<StatsView state={state} />} />
                </Routes>
              </main>
            </div>
          </>
        )}
      </div>
    </HashRouter>
  );
}
