
import React, { useMemo, useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line,
  AreaChart, Area, ComposedChart, Cell
} from 'recharts';
import { AppState } from '../types';
import { Zap, Activity, Brain, Target, ShieldCheck, Flame, Clock8, TrendingUp, Award, BookOpen, ChevronRight, BarChart3 } from 'lucide-react';

const StatsView = ({ state }: { state: AppState }) => {
  const [selectedSubjName, setSelectedSubjName] = useState<string | null>(state.subjects[0]?.name || null);

  const radarData = useMemo(() => [
    { subject: 'Focus', value: state.profile.focusRating, fullMark: 100 },
    { subject: 'Discipline', value: state.profile.disciplineRating, fullMark: 100 },
    { subject: 'Consistency', value: state.profile.consistency, fullMark: 100 },
    { subject: 'Speed', value: 85, fullMark: 100 },
    { subject: 'Accuracy', value: 72, fullMark: 100 },
  ], [state]);

  const subjectMasteryData = useMemo(() => {
    return state.subjects.map(s => ({
      name: s.name,
      coverage: s.coverage,
      priority: s.priority,
      revisionCount: s.revisionCount,
      lastStudied: s.lastStudied
    })).sort((a, b) => b.coverage - a.coverage);
  }, [state]);

  const focusVolumeData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString();
    });

    return last7Days.map(date => {
      const daySessions = state.sessions.filter(s => 
        new Date(s.startTime).toLocaleDateString() === date
      );
      return {
        date,
        minutes: daySessions.reduce((acc, curr) => acc + curr.duration, 0),
      };
    });
  }, [state.sessions]);

  // Specific Analytics for selected subject
  const selectedSubjectAnalytics = useMemo(() => {
    if (!selectedSubjName) return null;
    const records = (state.qbankRecords || [])
      .filter(r => r.subject === selectedSubjName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const chartData = records.map(r => ({
      date: new Date(r.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      accuracy: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
      type: r.type
    }));

    const avgAccuracy = records.length > 0 
      ? Math.round(records.reduce((acc, r) => acc + (r.total > 0 ? (r.score/r.total) : 0), 0) / records.length * 100) 
      : 0;

    return { chartData, avgAccuracy, totalAttempts: records.length };
  }, [selectedSubjName, state.qbankRecords]);

  const activityData = [
    { day: 'Mon', study: 4, target: 6, efficiency: 80 },
    { day: 'Tue', study: 5, target: 6, efficiency: 92 },
    { day: 'Wed', study: 2, target: 3, efficiency: 65 },
    { day: 'Thu', study: 7, target: 6, efficiency: 88 },
    { day: 'Fri', study: 4, target: 6, efficiency: 75 },
    { day: 'Sat', study: 8, target: 10, efficiency: 95 },
    { day: 'Sun', study: 3, target: 10, efficiency: 40 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-100 tracking-tight flex items-center gap-2 uppercase tracking-tighter">
            <Activity className="text-teal-400" size={24} />
            Diagnostics
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 font-mono font-bold">Psychometric Telemetry Feed.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-lg">
            <Flame className="text-amber-500" size={16} />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Neural Streak</span>
              <span className="text-sm font-mono font-bold text-slate-100">{state.profile.streak} Cycles</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Brain size={14} className="text-teal-400" />
            Cognitive Profile
          </h2>
          <div className="h-[280px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Current Capacity"
                  dataKey="value"
                  stroke="#2dd4bf"
                  fill="#2dd4bf"
                  fillOpacity={0.15}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Target size={14} className="text-amber-500" />
            Operational Capacity
          </h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar name="Output (H)" dataKey="study" fill="#2dd4bf" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar name="Target (H)" dataKey="target" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={24} />
                <Line name="Eff %" type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col h-[520px]">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 sticky top-0 bg-slate-900 z-10 pb-2 border-b border-slate-800">
            <BookOpen size={14} className="text-teal-500" />
            Tactical Map Selection
          </h2>
          <div className="flex-grow overflow-y-auto space-y-2 pr-2 scrollbar-hide">
            {subjectMasteryData.map((s) => (
              <button 
                key={s.name} 
                onClick={() => setSelectedSubjName(s.name)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 group ${
                  selectedSubjName === s.name 
                    ? 'bg-teal-500/10 border-teal-500 shadow-[0_0_20px_rgba(45,212,191,0.1)]' 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight">
                    <span className={selectedSubjName === s.name ? 'text-teal-400' : 'text-slate-300'}>{s.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono">{s.coverage}%</span>
                      <ChevronRight size={12} className={`transition-transform ${selectedSubjName === s.name ? 'rotate-90 text-teal-400' : 'text-slate-700'}`} />
                    </div>
                 </div>
                 <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        s.coverage > 75 ? 'bg-teal-500' : s.coverage > 40 ? 'bg-amber-500' : 'bg-slate-700'
                      } ${selectedSubjName === s.name ? 'shadow-[0_0_8px_rgba(45,212,191,0.5)]' : ''}`}
                      style={{ width: `${s.coverage}%` }}
                    />
                 </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[520px]">
           <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-teal-400">
              <TrendingUp size={220} />
           </div>

           <div className="relative z-10 flex flex-col h-full">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center shadow-lg">
                       <Award size={28} className="text-teal-400 animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-100 uppercase tracking-tighter">{selectedSubjName || 'UNIDENTIFIED'}</h3>
                       <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] font-black">Node Accuracy Archetype</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-6">
                    <div className="text-right">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Avg Stability</p>
                       <p className="text-3xl font-mono font-bold text-teal-400 leading-none mt-1">{selectedSubjectAnalytics?.avgAccuracy}%</p>
                    </div>
                    <div className="text-right border-l border-slate-800 pl-6">
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sync Logs</p>
                       <p className="text-3xl font-mono font-bold text-slate-200 leading-none mt-1">{selectedSubjectAnalytics?.totalAttempts}</p>
                    </div>
                 </div>
              </div>

              <div className="flex-grow min-h-[300px] w-full bg-slate-950/30 rounded-3xl p-6 border border-slate-800/50 shadow-inner">
                {selectedSubjectAnalytics && selectedSubjectAnalytics.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedSubjectAnalytics.chartData}>
                      <defs>
                         <linearGradient id="colorSubj" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px'}}
                        itemStyle={{fontWeight: 'bold', color: '#2dd4bf'}}
                      />
                      <Area name="Node Stability" type="monotone" dataKey="accuracy" stroke="#2dd4bf" strokeWidth={4} fillOpacity={1} fill="url(#colorSubj)" dot={{ r: 5, fill: '#2dd4bf', strokeWidth: 2, stroke: '#0f172a' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-20 gap-6">
                    <BarChart3 size={64} className="text-slate-600" />
                    <div className="space-y-2">
                       <p className="text-xs font-black uppercase tracking-[0.3em]">Neural Feed Static</p>
                       <p className="text-[10px] max-w-[240px] italic font-medium uppercase tracking-widest mx-auto">Inject QBank or PYQ scoring telemetry for {selectedSubjName} to visualize accuracy trends.</p>
                    </div>
                    <button className="px-6 py-2 border border-slate-800 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest hover:border-slate-500 transition-all">INITIALIZE_FEED</button>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between shadow-xl">
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-teal-500" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Retention Threshold: {subjectMasteryData.find(s => s.name === selectedSubjName)?.coverage || 0}%</span>
                 </div>
                 <div className="flex gap-2">
                    <span className="text-[8px] px-2 py-1 bg-slate-900 border border-slate-800 rounded font-black text-slate-600 uppercase tracking-widest">DIAGNOSTIC_VER_3.5</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
           <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
            <Clock8 size={14} className="text-cyan-400" />
            Operational Focus Volume (Last 7 Cycles)
          </h2>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusVolumeData}>
                <defs>
                  <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '10px' }} />
                <Area name="Min Focused" type="monotone" dataKey="minutes" stroke="#22d3ee" fillOpacity={1} fill="url(#colorMin)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-5 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between shadow-inner">
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono font-black uppercase tracking-widest">
              Total High-Yield Focus: <span className="text-cyan-400">{focusVolumeData.reduce((acc, curr) => acc + curr.minutes, 0)} Minutes</span>
            </p>
            <Activity size={14} className="text-cyan-500 animate-pulse" />
          </div>
      </div>
    </div>
  );
};

export default StatsView;
