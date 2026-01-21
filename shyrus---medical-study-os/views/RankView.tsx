
import React from 'react';
import { AppState } from '../types';
import { 
  ShieldCheck, Award, Medal, Trophy, Star, Lock, 
  ChevronRight, Zap, Target, Flame, Brain, Shield,
  CheckCircle2, Sparkles, User, TrendingUp
} from 'lucide-react';

const RANKS = [
  { level: 1, title: "Field Medic", icon: <Shield size={24} className="text-slate-500" /> },
  { level: 10, title: "Senior Resident", icon: <Star size={24} className="text-amber-600" /> },
  { level: 20, title: "Attending Surgeon", icon: <Award size={24} className="text-slate-300" /> },
  { level: 30, title: "Consultant Envoy", icon: <Trophy size={24} className="text-yellow-400" /> },
  { level: 50, title: "Grand Surgeon Commander", icon: <Medal size={24} className="text-teal-400" /> }
];

const MEDALS_ARCHIVE = [
  { id: "Iron Vanguard", req: 10, reward: "+500 XP", icon: <ShieldCheck size={32} className="text-slate-400" /> },
  { id: "Bronze Specialist", req: 20, reward: "+5 Focus", icon: <Award size={32} className="text-amber-600" /> },
  { id: "Silver Consultant", req: 30, reward: "+5 Discipline", icon: <Medal size={32} className="text-slate-300" /> },
  { id: "Golden Master", req: 40, reward: "+1000 XP", icon: <Trophy size={32} className="text-yellow-400" /> }
];

const RankView = ({ state }: { state: AppState }) => {
  const currentLevel = state.profile.level;
  const xpPercentage = (state.profile.xp / state.profile.maxXp) * 100;
  
  const currentRank = [...RANKS].reverse().find(r => r.level <= currentLevel) || RANKS[0];
  const nextRank = RANKS.find(r => r.level > currentLevel);

  return (
    <div className="h-full space-y-10 animate-in fade-in duration-700 pb-24 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-900 pb-8">
        <div>
           <h1 className="text-2xl font-black text-slate-100 flex items-center gap-3 uppercase tracking-tighter italic">
              <User className="text-teal-400" size={28} />
              Operator Dossier
           </h1>
           <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-2 font-bold font-mono">Neural Level Authorization: Tier_{currentLevel}</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-4">
              <Flame className="text-amber-500" size={20} />
              <div>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Streak</p>
                 <p className="text-lg font-black text-slate-100 leading-none">{state.profile.streak} Cycles</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Current Status & Medals */}
        <div className="lg:col-span-7 space-y-8">
           {/* Rank Identity Card */}
           <div className="bg-slate-900 border border-teal-500/20 rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                 {currentRank.icon}
              </div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/30 to-transparent"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                 <div className="w-32 h-32 rounded-[2rem] bg-slate-950 border border-teal-500/20 flex items-center justify-center shadow-2xl shrink-0 relative overflow-hidden group-hover:border-teal-500/40 transition-all">
                    <div className="absolute inset-0 bg-teal-500/5 group-hover:bg-teal-500/10 transition-colors"></div>
                    <span className="text-5xl font-black text-teal-400 relative z-10 italic">{currentLevel}</span>
                 </div>
                 
                 <div className="text-center md:text-left space-y-4">
                    <div>
                       <p className="text-[10px] font-black text-teal-500 uppercase tracking-[0.4em] mb-1">Authenticated Identity</p>
                       <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none italic">{currentRank.title}</h2>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between items-end">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">XP Progression to Tier {currentLevel + 1}</p>
                          <p className="text-xs font-mono font-bold text-teal-400">{Math.round(xpPercentage)}%</p>
                       </div>
                       <div className="h-3 w-full bg-slate-950 rounded-full border border-slate-800/50 p-0.5 overflow-hidden">
                          <div 
                             className="h-full bg-teal-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(45,212,191,0.5)]" 
                             style={{ width: `${xpPercentage}%` }}
                          />
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Medal Archive Gallery */}
           <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                 <Award size={18} className="text-amber-500" />
                 Medal Archive
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 {MEDALS_ARCHIVE.map(medal => {
                    const isEarned = state.profile.medals.includes(medal.id) || currentLevel >= medal.req;
                    return (
                       <div key={medal.id} className={`p-6 rounded-2xl border flex flex-col items-center text-center transition-all ${isEarned ? 'bg-slate-900 border-teal-500/20 shadow-lg' : 'bg-slate-950 border-slate-800 opacity-40 grayscale'}`}>
                          <div className={`mb-4 transition-transform ${isEarned ? 'scale-110' : ''}`}>
                             {isEarned ? medal.icon : <Lock size={24} className="text-slate-700" />}
                          </div>
                          <p className="text-[10px] font-black text-slate-100 uppercase tracking-tight leading-tight">{medal.id}</p>
                          {isEarned ? (
                             <span className="text-[8px] font-mono text-teal-500 font-bold mt-2 uppercase">Earned</span>
                          ) : (
                             <span className="text-[8px] font-mono text-slate-600 font-bold mt-2 uppercase">Lvl {medal.req}</span>
                          )}
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Right Column: Roadmap Timeline */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
           <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] mb-10 flex items-center gap-2">
              <TrendingUp size={18} className="text-teal-400" />
              Neural Progression Roadmap
           </h3>

           <div className="relative space-y-8 pl-10 border-l border-slate-800">
              {RANKS.map((r, i) => {
                 const isUnlocked = currentLevel >= r.level;
                 const isCurrent = currentRank.level === r.level;
                 
                 return (
                    <div key={r.level} className="relative">
                       <div className={`absolute left-[-50px] top-0 w-5 h-5 rounded-full border-4 border-slate-950 z-10 transition-colors ${isUnlocked ? 'bg-teal-500' : 'bg-slate-800'}`}>
                          {isCurrent && <div className="absolute inset-[-4px] rounded-full border border-teal-400 animate-ping"></div>}
                       </div>
                       
                       <div className={`p-5 rounded-2xl border transition-all ${isUnlocked ? (isCurrent ? 'bg-teal-500/10 border-teal-500 shadow-lg' : 'bg-slate-800/50 border-slate-700 opacity-60') : 'bg-slate-950/50 border-slate-800 opacity-40'}`}>
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-3">
                                {isUnlocked ? <div className="text-teal-400">{r.icon}</div> : <Lock size={18} className="text-slate-600" />}
                                <div>
                                   <h4 className={`text-xs font-black uppercase tracking-widest ${isUnlocked ? 'text-slate-100' : 'text-slate-500'}`}>{r.title}</h4>
                                   <p className="text-[9px] font-mono text-slate-600 uppercase mt-1">Unlock: Tier_{r.level}</p>
                                </div>
                             </div>
                             {isUnlocked && i < RANKS.length - 1 && <CheckCircle2 size={14} className="text-teal-500/50" />}
                             {isCurrent && <span className="px-2 py-0.5 bg-teal-500 text-slate-950 text-[7px] font-black uppercase rounded shadow-lg">Current</span>}
                          </div>
                          
                          {isUnlocked && i < RANKS.length - 1 && (
                             <div className="mt-4 flex flex-wrap gap-2">
                                <span className="text-[7px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-black text-slate-500 uppercase tracking-widest">Enhanced UI Permissions</span>
                                <span className="text-[7px] px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-black text-slate-500 uppercase tracking-widest">Logic Tier Increase</span>
                             </div>
                          )}
                       </div>
                    </div>
                 );
              })}
           </div>

           <div className="mt-12 p-6 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-4 shadow-inner">
              <Sparkles className="text-teal-400 shrink-0" size={20} />
              <div>
                 <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold italic">
                    Sir, every 10 tiers, a new Operational Medal is awarded along with permanent performance multipliers. High-Yield efficiency is the primary path to advancement.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RankView;
