
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Square, Timer, History, Zap, BrainCircuit } from 'lucide-react';
import { AppState, FocusSession } from '../types';

const FocusView = ({ state, setState, gainXp }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, gainXp: (amt: number) => void }) => {
  const DEFAULT_TIME = 150 * 60; // 150 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(state.subjects[0]?.name || 'General');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleStart = () => setIsActive(true);
  const handleStop = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIME);
  };

  const handleComplete = () => {
    setIsActive(false);
    const newSession: FocusSession = {
      id: Date.now().toString(),
      startTime: Date.now() - (DEFAULT_TIME * 1000),
      duration: 150,
      subject: selectedSubject,
      completed: true
    };
    setState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions]
    }));
    
    gainXp(500);
    setTimeLeft(DEFAULT_TIME);
    alert("Mission Accomplished. Deep Focus Block Recorded.");
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((DEFAULT_TIME - timeLeft) / DEFAULT_TIME) * 100;

  return (
    <div className="h-full space-y-8 animate-in fade-in duration-700 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 uppercase tracking-tighter">
            <Zap className="text-teal-400" size={24} />
            Deep Focus Protocol
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Standard Block: 150 Minutes (2.5h)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-950">
             <div className="h-full bg-teal-500 transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="flex flex-col items-center">
             <div className="text-6xl font-mono font-bold text-slate-100 tracking-tighter mb-2">
               {formatTime(timeLeft)}
             </div>
             <div className="text-[10px] font-bold text-teal-500 uppercase tracking-[0.3em]">Operational Time Remaining</div>
          </div>

          <div className="w-full space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active Mission Subject</label>
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={isActive}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                {state.subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            </div>

            <div className="flex gap-4">
              {!isActive ? (
                <button 
                  onClick={handleStart}
                  className="flex-grow py-3 bg-teal-500 text-slate-950 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-teal-400 transition-all active:scale-95"
                >
                  <Play size={18} />
                  LOCK IN
                </button>
              ) : (
                <button 
                  onClick={handleStop}
                  className="flex-grow py-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-red-500/30 transition-all active:scale-95"
                >
                  <Square size={18} />
                  INTERRUPT
                </button>
              )}
              <button 
                onClick={handleReset}
                className="p-3 bg-slate-950 border border-slate-800 text-slate-500 rounded-lg hover:text-slate-200 transition-all"
              >
                <History size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <History size={16} className="text-slate-500" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Mission Records</h3>
          </div>
          <div className="flex-grow overflow-y-auto space-y-3 scrollbar-hide pr-2">
            {state.sessions.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                <BrainCircuit size={32} />
                <p className="text-[10px] uppercase font-bold tracking-widest mt-3">No focus records found</p>
              </div>
            )}
            {state.sessions.map(session => (
              <div key={session.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800/50 flex justify-between items-center group">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-slate-200">{session.subject}</span>
                  <span className="text-[9px] font-mono text-slate-600 uppercase">
                    {new Date(session.startTime).toLocaleDateString()} • 150M MISSION
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                  <span className="text-[10px] font-bold text-teal-500/80 uppercase">COMPLETED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusView;
