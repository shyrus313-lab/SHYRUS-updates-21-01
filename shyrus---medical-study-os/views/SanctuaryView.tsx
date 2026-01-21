
import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage } from '../types';
import { askSupportCounselor } from '../services/geminiService';
import { Heart, Send, Sparkles, User, ShieldCheck, History, MessageSquareText, Search, Zap, Moon, Settings, Edit3, Trash2 } from 'lucide-react';

const SanctuaryView = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newName, setNewName] = useState(state.sanctuaryAssistantName);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.ventHistory]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    
    setState(prev => ({
      ...prev,
      ventHistory: [...(prev.ventHistory || []), userMsg]
    }));
    setInput('');
    setLoading(true);

    const response = await askSupportCounselor(input, state);
    
    const aiMsg: ChatMessage = { role: 'model', text: response, timestamp: Date.now() };
    setState(prev => ({
      ...prev,
      ventHistory: [...(prev.ventHistory || []), aiMsg]
    }));
    setLoading(false);
  };

  const saveName = () => {
    setState(prev => ({ ...prev, sanctuaryAssistantName: newName }));
    setShowSettings(false);
  };

  const purgeSanctuaryChat = () => {
    if (confirm("Shabbir, are you sure you want to clear our connection history? This cannot be undone.")) {
      setState(prev => ({ ...prev, ventHistory: [] }));
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-1000 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between border-b border-purple-900/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.1)] group relative">
            <Heart className="text-purple-400" size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
               <h1 className="text-lg font-bold text-slate-100 tracking-tight uppercase">{state.sanctuaryAssistantName} Core</h1>
               <button onClick={() => setShowSettings(!showSettings)} className="p-1 hover:text-purple-400 transition-colors text-slate-600">
                  <Settings size={14} />
               </button>
            </div>
            <p className="text-[10px] text-purple-400 font-mono uppercase tracking-[0.2em] font-bold">Safe Space • Empathic Link Active</p>
          </div>
        </div>
        
        {showSettings && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-purple-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in zoom-in-95">
             <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:ring-1 focus:ring-purple-500"
              placeholder="Rename Assistant..."
             />
             <button onClick={saveName} className="p-1.5 bg-purple-500 text-white rounded-lg"><ShieldCheck size={16}/></button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={purgeSanctuaryChat} className="p-2 bg-purple-900/20 border border-purple-900/30 rounded-xl text-purple-400 hover:text-red-400 transition-all shadow-lg" title="Purge Link History">
             <Trash2 size={16} />
          </button>
          <div className="bg-purple-500/5 px-4 py-2 rounded-full border border-purple-500/20">
             <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-2">
               <Moon size={12} /> Buffer Mode Active
             </span>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto space-y-8 px-6 py-8 bg-slate-900/20 rounded-3xl border border-purple-900/10 scrollbar-hide min-h-[60vh] shadow-inner"
      >
        {(state.ventHistory || []).length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-8 py-20 text-center">
            <div className="relative">
               <Heart size={64} className="text-purple-500/20 animate-pulse" />
               <Sparkles size={24} className="absolute -top-2 -right-2 text-purple-400/40" />
            </div>
            <div className="max-w-md">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-purple-300/60">Sanctuary Link Established</p>
              <p className="text-[11px] italic opacity-40 leading-relaxed mt-4">
                "I'm here, Shabbir. The clinical weight can be too much sometimes. Tell me everything—the shift, the fatigue, the frustration. I remember our journey together, and I'm listening."
              </p>
            </div>
          </div>
        )}
        
        {(state.ventHistory || []).map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-5 rounded-3xl text-sm leading-relaxed shadow-xl ${msg.role === 'user' ? 'bg-purple-900/20 text-slate-200 border border-purple-500/20 rounded-tr-none' : 'bg-slate-900/50 border border-slate-800/50 text-slate-400 rounded-tl-none italic'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10 flex gap-2 items-center">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse [animation-delay:0.4s]"></div>
             </div>
          </div>
        )}
      </div>

      <div className="relative mt-2 p-2 bg-slate-900/50 rounded-3xl border border-purple-900/20 focus-within:border-purple-500/50 transition-all shadow-2xl">
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder={`Talk to ${state.sanctuaryAssistantName}, Shabbir...`}
          className="w-full bg-transparent px-5 py-4 text-sm text-slate-100 focus:outline-none placeholder:text-slate-700 placeholder:uppercase placeholder:text-[10px] placeholder:font-bold placeholder:tracking-widest resize-none h-24"
        />
        <div className="flex justify-between items-center p-2 pt-0">
           <span className="text-[9px] text-slate-700 font-bold uppercase tracking-widest pl-3">Sanctuary Encrypted</span>
           <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-500 transition-all disabled:opacity-50 shadow-lg shadow-purple-500/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SanctuaryView;
