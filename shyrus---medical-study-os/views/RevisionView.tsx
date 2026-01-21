
import React, { useState, useMemo } from 'react';
import { 
  RefreshCcw, Brain, Target, LineChart as ChartIcon, 
  ChevronRight, Plus, Trash2, Zap, History,
  Activity, Award, BarChart3, TrendingUp, AlertCircle, Calendar,
  ShieldAlert, Radio, AlertTriangle, X, Radiation, ZapOff
} from 'lucide-react';
import { AppState, QBankRecord, Subject, VolatileNode } from '../types';
import { MEDICAL_SUBJECTS } from '../constants';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const RevisionView = ({ state, setState, gainXp }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, gainXp: (amt: number) => void }) => {
  const [activeTab, setActiveTab] = useState<'Protocol' | 'Analytics' | 'Records' | 'Volatile'>('Protocol');
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showVolatileForm, setShowVolatileForm] = useState(false);
  
  const [newRecord, setNewRecord] = useState<Partial<QBankRecord>>({
    subject: MEDICAL_SUBJECTS[0],
    type: 'QBank',
    score: 0,
    total: 100,
    topic: ''
  });

  const [newVolatile, setNewVolatile] = useState<Partial<VolatileNode>>({
    subject: MEDICAL_SUBJECTS[0],
    topic: '',
    criticality: 'High'
  });

  const subjectRetention = useMemo(() => {
    return state.subjects.map(subj => {
      if (!subj.lastStudied) return { ...subj, retention: 0, daysPassed: 0 };
      const last = new Date(subj.lastStudied).getTime();
      const now = Date.now();
      const daysPassed = (now - last) / (1000 * 60 * 60 * 24);
      const retention = Math.max(0, 100 - (daysPassed * 5)); 
      return { ...subj, retention: Math.round(retention), daysPassed: Math.floor(daysPassed) };
    }).sort((a, b) => a.retention - b.retention);
  }, [state.subjects]);

  const learningCurveData = useMemo(() => {
    return (state.qbankRecords || [])
      .slice(-15)
      .reverse()
      .map(r => ({
        date: new Date(r.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
        accuracy: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
        subject: r.subject
      }));
  }, [state.qbankRecords]);

  const addRecord = () => {
    if (!newRecord.topic || !newRecord.subject) {
      alert("Sir, mission topic and subject are required.");
      return;
    }
    
    const record: QBankRecord = {
      id: `record-${Date.now()}`,
      date: new Date().toISOString(),
      subject: newRecord.subject,
      topic: newRecord.topic,
      score: Number(newRecord.score) || 0,
      total: Number(newRecord.total) || 1,
      type: (newRecord.type as 'QBank' | 'PYQ') || 'QBank'
    };

    setState(prev => ({
      ...prev,
      qbankRecords: [record, ...(prev.qbankRecords || [])],
      subjects: prev.subjects.map(s => s.name === record.subject ? { 
        ...s, 
        lastStudied: record.date, 
        revisionCount: s.revisionCount + 1,
      } : s)
    }));

    gainXp(250);
    setNewRecord({ subject: MEDICAL_SUBJECTS[0], type: 'QBank', score: 0, total: 100, topic: '' });
    setShowEntryForm(false);
  };

  const addVolatileNode = () => {
    if (!newVolatile.topic) {
       alert("Sir, identify the volatile topic first.");
       return;
    }

    const node: VolatileNode = {
      id: `volatile-${Date.now()}`,
      subject: newVolatile.subject || MEDICAL_SUBJECTS[0],
      topic: newVolatile.topic,
      criticality: (newVolatile.criticality as 'High' | 'Critical') || 'High',
      addedDate: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      volatileNodes: [node, ...(prev.volatileNodes || [])]
    }));

    gainXp(100);
    setNewVolatile({ subject: MEDICAL_SUBJECTS[0], topic: '', criticality: 'High' });
    setShowVolatileForm(false);
  };

  const removeRecord = (id: string) => {
    if (confirm("Erase this scoring record?")) {
      setState(prev => ({
        ...prev,
        qbankRecords: prev.qbankRecords.filter(r => r.id !== id)
      }));
    }
  };

  const removeVolatile = (id: string) => {
    setState(prev => ({
      ...prev,
      volatileNodes: prev.volatileNodes.filter(n => n.id !== id)
    }));
  };

  return (
    <div className="h-full space-y-8 animate-in fade-in duration-700 pb-20 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2 uppercase tracking-tighter">
            <RefreshCcw className="text-teal-400" size={24} />
            Revision Hub
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Neural Maintenance & Performance Analysis.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-hide max-w-full">
          {(['Protocol', 'Analytics', 'Records', 'Volatile'] as const).map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab === 'Volatile' && <Radiation size={10} className="inline mr-1 mb-0.5" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'Protocol' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-8 gap-4">
                <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Brain size={16} className="text-teal-400 shrink-0" />
                  Neural Retention
                </h3>
                <span className="text-[10px] text-slate-500 font-mono hidden sm:block uppercase tracking-widest">Active Decay Scanned</span>
              </div>

              <div className="space-y-5 overflow-y-auto max-h-[500px] pr-2 scrollbar-hide">
                {subjectRetention.map((s) => (
                  <div key={s.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-teal-500/30 transition-all">
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-bold text-slate-100 uppercase">{s.name}</span>
                        <span className={`text-[9px] font-mono font-bold ${s.retention < 40 ? 'text-red-400' : 'text-teal-400'}`}>
                          {s.retention}% STABILITY
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${s.retention < 40 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-teal-500 shadow-[0_0_8px_rgba(45,212,191,0.5)]'}`}
                          style={{ width: `${s.retention}%` }}
                        ></div>
                      </div>
                      <p className="text-[8px] text-slate-600 mt-2 uppercase font-mono font-bold tracking-tight">
                        Last Sync: {s.daysPassed === 0 ? 'Recently Active' : `${s.daysPassed} Cycles Ago`} • Cycles: {s.revisionCount}
                      </p>
                    </div>
                    {s.retention < 60 && (
                      <button className="sm:ml-6 p-2 bg-amber-500/10 text-amber-500 rounded-lg hover:bg-amber-500 hover:text-slate-950 transition-all flex justify-center shadow-lg">
                        <Zap size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                 <AlertCircle size={80} className="text-amber-500" />
               </div>
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                 <AlertCircle size={14} className="text-amber-500" />
                 Revision Priority
               </h3>
               <div className="space-y-4 relative z-10">
                  {subjectRetention.slice(0, 3).map(s => (
                    <div key={s.id} className="flex items-center gap-3">
                       <div className={`w-1.5 h-1.5 rounded-full animate-pulse shrink-0 ${s.retention < 40 ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{s.name} NODE_DECAY</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-[9px] text-slate-500 leading-relaxed font-mono uppercase italic font-bold">
                      "Sir, synaptic strength in {subjectRetention[0]?.name || 'primary nodes'} is critical."
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Analytics' && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
                 <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <TrendingUp size={16} className="text-teal-400" />
                    Accuracy Telemetry
                 </h3>
                 <div className="h-64 w-full">
                    {learningCurveData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={learningCurveData}>
                            <defs>
                               <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                               </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                            <XAxis dataKey="date" hide />
                            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                            <Tooltip 
                              contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', fontSize: '10px'}}
                              itemStyle={{color: '#2dd4bf', fontWeight: 'bold'}}
                            />
                            <Area type="monotone" dataKey="accuracy" stroke="#2dd4bf" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={3} dot={{ r: 4, fill: '#2dd4bf', strokeWidth: 2, stroke: '#0f172a' }} />
                         </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                         <BarChart3 size={48} className="mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-widest">No Intelligence Records Found</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden">
                 <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-8 flex items-center gap-2">
                    <Award size={16} className="text-amber-500" />
                    Subject Mastery
                 </h3>
                 <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                    {MEDICAL_SUBJECTS.map(subj => {
                      const records = (state.qbankRecords || []).filter(r => r.subject === subj);
                      const avg = records.length > 0 ? Math.round(records.reduce((acc, curr) => acc + (curr.total > 0 ? curr.score / curr.total : 0), 0) / records.length * 100) : 0;
                      return (
                        <div key={subj} className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all ${avg > 75 ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : avg > 40 ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-700'}`}>
                           <span className="text-[7px] font-black uppercase text-center leading-tight px-1 truncate w-full">{subj}</span>
                           <span className="text-[10px] font-mono font-bold mt-1">{avg}%</span>
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'Records' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-500">
                   <Target size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Tactical Score Log</h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Manual node injection of session accuracy.</p>
                </div>
             </div>
             <button 
              onClick={() => setShowEntryForm(!showEntryForm)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${showEntryForm ? 'bg-slate-800 text-slate-400' : 'bg-teal-500 text-slate-950 hover:bg-teal-400'}`}
             >
               {showEntryForm ? <X size={14}/> : <Plus size={14}/>} {showEntryForm ? 'Abort' : 'Inject Record'}
             </button>
          </div>

          {showEntryForm && (
            <div className="bg-slate-900 border border-teal-500/20 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Format</label>
                    <select 
                      value={newRecord.type}
                      onChange={(e) => setNewRecord(p => ({...p, type: e.target.value as any}))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-teal-500/50"
                    >
                      <option value="QBank">QBank</option>
                      <option value="PYQ">PYQ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Pillar (Subject)</label>
                    <select 
                      value={newRecord.subject}
                      onChange={(e) => setNewRecord(p => ({...p, subject: e.target.value}))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-teal-500/50"
                    >
                      {MEDICAL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Node Topic</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Endocrine Pathology"
                      value={newRecord.topic}
                      onChange={(e) => setNewRecord(p => ({...p, topic: e.target.value}))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-teal-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Score</label>
                    <input 
                      type="number" 
                      value={newRecord.score}
                      onChange={(e) => setNewRecord(p => ({...p, score: Number(e.target.value)}))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Qs</label>
                    <input 
                      type="number" 
                      value={newRecord.total}
                      onChange={(e) => setNewRecord(p => ({...p, total: Number(e.target.value)}))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-2 flex items-end">
                     <button onClick={addRecord} className="w-full py-2.5 bg-teal-500 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-teal-400 active:scale-95 transition-all">Authorize Node Injection</button>
                  </div>
               </div>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl max-w-full">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment</th>
                    <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Pillar</th>
                    <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Target Topic</th>
                    <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Accuracy</th>
                    <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(state.qbankRecords || []).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/20 transition-all group">
                      <td className="p-4 text-[10px] font-mono text-slate-500">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className="text-[10px] font-black text-slate-200 uppercase tracking-tight">{r.subject}</span>
                        <span className="ml-2 text-[8px] px-1.5 py-0.5 rounded bg-slate-800 text-teal-400 uppercase font-black">{r.type}</span>
                      </td>
                      <td className="p-4 text-[10px] text-slate-400 font-medium truncate max-w-xs">{r.topic}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           <span className="text-xs font-mono font-bold text-slate-200">{r.total > 0 ? Math.round((r.score / r.total) * 100) : 0}%</span>
                           <div className="w-20 h-1 bg-slate-950 rounded-full overflow-hidden">
                              <div className="h-full bg-teal-500" style={{ width: `${r.total > 0 ? (r.score / r.total) * 100 : 0}%` }}></div>
                           </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <button onClick={() => removeRecord(r.id)} className="text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(state.qbankRecords || []).length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <History size={48} className="mx-auto text-slate-800 mb-4" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No Tactical Intelligence Found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Volatile' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl gap-4 border-l-4 border-l-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20">
                   <ShieldAlert size={24} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Radiation Zone (Volatile)</h3>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">High-risk topics prone to neural decay or volatility.</p>
                </div>
             </div>
             <button 
              onClick={() => setShowVolatileForm(!showVolatileForm)}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${showVolatileForm ? 'bg-slate-800 text-slate-400' : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/10'}`}
             >
               {showVolatileForm ? <X size={14}/> : <Plus size={14}/>} {showVolatileForm ? 'Abort' : 'Flag Volatile Topic'}
             </button>
          </div>

          {showVolatileForm && (
            <div className="bg-slate-900 border border-amber-500/20 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl animate-in zoom-in-95 duration-300">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Subject Pillar</label>
                    <select 
                      value={newVolatile.subject}
                      onChange={(e) => setNewVolatile(p => ({...p, subject: e.target.value}))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                    >
                      {MEDICAL_SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target Identifier</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cranial Nerves Foramen"
                      value={newVolatile.topic}
                      onChange={(e) => setNewVolatile(p => ({...p, topic: e.target.value}))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Volatility Level</label>
                    <div className="flex gap-2">
                       {(['High', 'Critical'] as const).map(c => (
                         <button 
                           key={c}
                           onClick={() => setNewVolatile(p => ({...p, criticality: c}))}
                           className={`flex-grow py-2 rounded-lg border text-[9px] font-black uppercase tracking-widest transition-all ${newVolatile.criticality === c ? (c === 'Critical' ? 'bg-red-500 border-red-500 text-slate-950 shadow-red-500/20' : 'bg-amber-500 border-amber-500 text-slate-950 shadow-amber-500/20') : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                         >
                           {c}
                         </button>
                       ))}
                    </div>
                  </div>
               </div>
               <button onClick={addVolatileNode} className="w-full py-3 bg-amber-500 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-amber-400 active:scale-95 transition-all">Commit to Radiation Zone</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {(state.volatileNodes || []).map((node) => (
               <div key={node.id} className={`bg-slate-900 border p-6 rounded-3xl relative overflow-hidden group hover:shadow-2xl transition-all ${node.criticality === 'Critical' ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)] bg-red-500/[0.02]' : 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)] bg-amber-500/[0.02]'}`}>
                  <div className={`absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity ${node.criticality === 'Critical' ? 'text-red-500' : 'text-amber-500'}`}>
                     <Radiation size={80} className="animate-spin-slow" />
                  </div>
                  
                  <div className="flex justify-between items-start mb-6">
                     <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${node.criticality === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                        {node.criticality} RISK
                     </div>
                     <button onClick={() => removeVolatile(node.id)} className="text-slate-800 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                     </button>
                  </div>

                  <div className="space-y-1">
                     <h4 className="text-sm font-black text-slate-100 uppercase tracking-tight leading-tight group-hover:text-amber-400 transition-colors">{node.topic}</h4>
                     <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-black italic">{node.subject}</p>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-800/50">
                     <span className="text-[8px] font-mono text-slate-600 font-black uppercase tracking-tighter">FLAGGED: {new Date(node.addedDate).toLocaleDateString()}</span>
                     <button 
                      onClick={() => removeVolatile(node.id)}
                      className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${node.criticality === 'Critical' ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-slate-950'}`}
                     >
                        Stabilize
                     </button>
                  </div>
               </div>
             ))}

             {(state.volatileNodes || []).length === 0 && (
               <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-20 text-center gap-6 border-2 border-dashed border-slate-800 rounded-3xl">
                  <Radiation size={48} className="text-slate-600" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.3em]">Radiation Zone Clear</p>
                    <p className="text-[10px] mt-2 italic font-medium uppercase tracking-widest">Flag unstable subject nodes to prevent unexpected decay.</p>
                  </div>
                  <button onClick={() => setShowVolatileForm(true)} className="px-6 py-2 border border-slate-700 rounded-xl text-[9px] font-black text-slate-500 hover:text-slate-300 hover:border-slate-500 transition-all">INITIALIZE MONITORING</button>
               </div>
             )}
          </div>
        </div>
      )}
      <style>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RevisionView;
