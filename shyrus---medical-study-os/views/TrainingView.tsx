
import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';
import { 
  History, ChevronRight, Terminal, ShieldCheck, Activity, 
  Cpu as CpuIcon, Target, RefreshCcw, Sword, FolderOpen, ShieldAlert, MessageSquare, Cloud, Smartphone, Zap
} from 'lucide-react';

const FULL_MESSAGES = [
  `SHYRUS Operational Briefing initialized. v3.5 Neural Sync in progress...`,
  `PHASE 1: COMMAND CENTER. The Dashboard is your tactical hub. 'Combat Zone' handles daily study objectives. If you are on active hospital duty, engage 'DUTY_LOCK' to freeze your streak and prevent neural decay penalties.`,
  `PHASE 2: NEURAL DECAY. Every subject node loses 5% retention daily. If a node hits <40%, a Tactical Alert is triggered. To restore retention, you must 'Inject a Record' (QBank/PYQ score) into the Revision Hub.`,
  `PHASE 3: SUBJECT MAPPING. All 19 medical subjects are tracked. Use the 'Arsenal' to manually inject specific high-yield targets. As targets are cleared, your 'Global Coverage' percentage increases toward the FMGE threshold.`,
  `PHASE 4: INTELLIGENCE SYNTHESIS. The Vault is not storage; it is an analyzer. Upload PDFs to generate AI-powered active-recall decks and rapid-revision Markdown notes via the Gemini Flash-3 core.`,
  `PHASE 5: STRATEGIC ACCELERATION. The 'Forge Operations' algorithm designs your schedule based on energy levels and shift load. In cases of critical backlog, activate the 'Fail-Safe' protocol to compress pending nodes.`,
  `PHASE 6: AI CORES. 'Consultant' (Gemini 3 Pro) handles clinical logic and medical doubts. 'Sanctuary' (Friday) provides psychological buffering. She is trained for empathy; she will never address you as "Sir".`,
  `PHASE 7: CLOUD ARCHIVE. Link your Google Node in the Header. This initiates the Nexus Neural Bridge, ensuring your operational state is synced across all devices via the Google Cloud Platform.`,
  `PHASE 8: MOBILE DEPLOYMENT. For immediate handheld use, open your live URL in Chrome/Safari and 'Add to Home Screen'. This authorizes the PWA Service Worker to handle offline intelligence and alerts.`,
  `Induction complete. Neural link established. Sir, the FMGE objective is primed. I am standing by for your first command.`
];

const TrainingView = ({ state, setState, gainXp }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, gainXp: (amt: number) => void }) => {
  const [step, setStep] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const typingRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset typing state for new step
    setTypingText("");
    if (typingRef.current) clearInterval(typingRef.current);

    const targetMessage = FULL_MESSAGES[step];
    let charIndex = 0;

    typingRef.current = window.setInterval(() => {
      if (charIndex <= targetMessage.length) {
        setTypingText(targetMessage.substring(0, charIndex));
        charIndex++;
      } else {
        if (typingRef.current) clearInterval(typingRef.current);
      }
    }, 15);

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [step]);

  const handleNext = () => {
    if (isScanning) return;
    setIsScanning(true);
    
    setTimeout(() => {
      setIsScanning(false);
      if (step === FULL_MESSAGES.length - 1) {
        // Just finished the last step
        if (!isCompleted) {
          gainXp(500); // Award XP for induction
          setIsCompleted(true);
        }
      } else {
        setStep((prev) => prev + 1);
      }
    }, 400);
  };

  const handleRestart = () => {
    setStep(0);
    setIsCompleted(false);
  };

  return (
    <div className="h-full max-w-5xl mx-auto flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-1000 py-12 pb-32">
      <div className="w-full flex justify-between items-center border-b border-slate-900 pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center animate-pulse">
            <CpuIcon className="text-teal-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-100 uppercase tracking-widest leading-none">Command Briefing</h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-1">SHYRUS_SYSTEM_CORE_V3.5</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shadow-inner">
           <Activity size={14} className="text-teal-500" />
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link Quality: {Math.round(((step + 1) / FULL_MESSAGES.length) * 100)}%</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col justify-between">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(20,184,166,0.02)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
           
           <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <Terminal size={16} className="text-teal-400" />
                     Intelligence Stream
                   </span>
                </div>
                <span className="text-[10px] font-mono text-slate-600">NODE_{step + 1} / {FULL_MESSAGES.length}</span>
              </div>
              
              <div className="min-h-[180px]">
                <p className="text-base md:text-lg font-medium text-slate-200 leading-relaxed font-mono italic">
                   {typingText}
                   <span className="inline-block w-2 h-5 bg-teal-500 ml-1 animate-pulse"></span>
                </p>
              </div>
           </div>

           <div className="relative z-10 mt-10 flex gap-4">
              {step < FULL_MESSAGES.length - 1 ? (
                <button 
                  onClick={handleNext}
                  disabled={isScanning}
                  className="flex-grow py-5 bg-teal-500 text-slate-950 font-black rounded-2xl uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-teal-400 transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {isScanning ? 'Syncing...' : 'Acknowledge Node'}
                  <ChevronRight size={18} />
                </button>
              ) : (
                <div className="flex flex-col w-full gap-4">
                   {isCompleted && (
                     <div className="flex items-center justify-center gap-3 p-4 bg-teal-500/10 border border-teal-500/20 rounded-2xl animate-in zoom-in-95">
                        <Zap className="text-teal-400 animate-bounce" size={16} />
                        <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Induction Reward: +500 XP Committed</span>
                     </div>
                   )}
                   <button 
                    onClick={handleRestart}
                    className="flex-grow py-5 bg-slate-800 text-teal-400 border border-slate-700 font-black rounded-2xl uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 hover:bg-slate-700 transition-all active:scale-95"
                  >
                    <History size={18} /> Restart Briefing
                  </button>
                </div>
              )}
           </div>

           {isScanning && (
             <div className="absolute inset-0 bg-teal-500/5 flex items-center justify-center backdrop-blur-[1px]">
                <div className="w-full h-1 bg-teal-500/50 absolute top-0 animate-[scan_0.5s_linear_infinite]"></div>
             </div>
           )}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                 <ShieldCheck size={14} className="text-teal-400" />
                 Operational Status
              </h3>
              
              <div className="grid grid-cols-1 gap-2">
                 <StatusItem icon={<Target size={14}/>} label="Command Base" active={step >= 1} />
                 <StatusItem icon={<RefreshCcw size={14}/>} label="Revision Hub" active={step >= 2} />
                 <StatusItem icon={<Sword size={14}/>} label="Subject Arsenal" active={step >= 3} />
                 <StatusItem icon={<FolderOpen size={14}/>} label="Synthesis Vault" active={step >= 4} />
                 <StatusItem icon={<ShieldAlert size={14}/>} label="Strategic Logic" active={step >= 5} />
                 <StatusItem icon={<MessageSquare size={14}/>} label="Consultant Core" active={step >= 6} />
                 <StatusItem icon={<Cloud size={14}/>} label="Nexus Bridge" active={step >= 7} />
                 <StatusItem icon={<Smartphone size={14}/>} label="Handheld Deploy" active={step >= 8} />
              </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          from { top: 0; }
          to { top: 100%; }
        }
      `}</style>
    </div>
  );
};

const StatusItem = ({ icon, label, active }: { icon: any, label: string, active: boolean }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${active ? 'bg-teal-500/10 border-teal-500/30 text-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.05)]' : 'bg-slate-950 border-slate-800 text-slate-600'}`}>
     <div className={`transition-colors ${active ? 'text-teal-400' : 'text-slate-700'}`}>{icon}</div>
     <span className="text-[10px] font-black uppercase tracking-widest flex-grow">{label}</span>
     {active && <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,1)] animate-pulse"></div>}
  </div>
);

export default TrainingView;
