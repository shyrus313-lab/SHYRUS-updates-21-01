
import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage } from '../types';
import { askMedicalDoubt } from '../services/geminiService';
import { MessageSquare, Send, Sparkles, User, BrainCircuit, ShieldAlert, History, MessageSquareText, Search, Zap, Trash2 } from 'lucide-react';

const ConsultantView = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>> }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.chatHistory]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    
    setState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg]
    }));
    setInput('');
    setLoading(true);

    const response = await askMedicalDoubt(input, state);
    
    const aiMsg: ChatMessage = { role: 'model', text: response, timestamp: Date.now() };
    setState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, aiMsg]
    }));
    setLoading(false);
  };

  const purgeConsultantChat = () => {
    if (confirm("Sir, this will permanently wipe all clinical logic archives from this core. Proceed?")) {
      setState(prev => ({ ...prev, chatHistory: [] }));
    }
  };

  const userMessages = state.chatHistory.filter(m => m.role === 'user');
  const filteredArchive = userMessages.filter(m => m.text.toLowerCase().includes(sidebarSearch.toLowerCase()));

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 animate-in fade-in duration-700 max-w-[1400px] mx-auto">
      <div className="lg:w-80 shrink-0 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden max-h-[85vh]">
        <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <History size={14} className="text-teal-400" />
            Tactical History
          </h2>
          <button onClick={purgeConsultantChat} className="p-1.5 hover:text-red-400 text-slate-600 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input 
              type="text" 
              placeholder="Filter archives..." 
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-md py-1.5 pl-8 pr-3 text-[10px] text-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto space-y-1 p-2 scrollbar-hide">
          {filteredArchive.length === 0 && (
            <p className="text-[10px] text-slate-700 italic text-center py-10 uppercase tracking-widest font-bold">No engagement logs</p>
          )}
          {filteredArchive.slice().reverse().map((msg, i) => (
            <button 
              key={i}
              onClick={() => {
                const el = document.getElementById(`msg-${msg.timestamp}`);
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700/50 group"
            >
              <div className="flex items-start gap-2">
                <MessageSquareText size={12} className="text-slate-600 mt-0.5 group-hover:text-teal-400 transition-colors" />
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] text-slate-300 truncate font-medium leading-tight">{msg.text}</p>
                  <p className="text-[8px] text-slate-600 mt-1 uppercase font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.2)] animate-pulse">
              <BrainCircuit className="text-teal-400" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100 tracking-tight uppercase">SHYRUS Consultant</h1>
              <p className="text-[10px] text-teal-500 font-mono uppercase tracking-[0.2em] font-bold">Medical Expert Core v3.2</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 shadow-inner">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Neural Link Synchronized</span>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto space-y-6 px-4 py-4 bg-slate-950/40 rounded-2xl border border-slate-900 scrollbar-hide min-h-[50vh] max-h-[70vh] shadow-inner"
        >
          {state.chatHistory.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-6 py-20">
              <div className="relative">
                 <Sparkles size={48} className="text-slate-800" />
                 <Zap size={24} className="absolute -top-2 -right-2 text-teal-500/50 animate-bounce" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">Tactical Medical Interface Active</p>
                <p className="text-[10px] italic opacity-40 uppercase tracking-widest mt-2">Ready for clinical consultation or high-yield data extraction.</p>
              </div>
            </div>
          )}
          
          {state.chatHistory.map((msg, i) => (
            <div key={i} id={`msg-${msg.timestamp}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 shrink-0 rounded-lg border flex items-center justify-center shadow-md ${msg.role === 'user' ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-teal-500/10 border border-teal-500/40 text-teal-400'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <BrainCircuit size={14} />}
                </div>
                <div className={`p-5 rounded-2xl text-sm leading-relaxed shadow-xl ${msg.role === 'user' ? 'bg-slate-900 text-slate-200 rounded-tr-none' : 'bg-slate-900/50 border border-slate-800/50 text-slate-300 rounded-tl-none'}`}>
                  {msg.text.split('\n').map((line, j) => (
                    <p key={j} className={line.trim() === '' ? 'h-2' : 'mb-1 last:mb-0'}>{line}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="max-w-[85%] flex gap-4">
                  <div className="w-8 h-8 rounded-lg border bg-teal-500/10 border-teal-500/40 flex items-center justify-center">
                     <BrainCircuit size={14} className="text-teal-400 animate-pulse" />
                  </div>
                  <div className="p-4 bg-slate-900/30 rounded-xl rounded-tl-none border border-slate-800/50 flex gap-1.5 items-center">
                     <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
               </div>
            </div>
          )}
        </div>

        <div className="relative mt-2 p-1 bg-slate-900/50 rounded-2xl border border-slate-800 focus-within:border-teal-500/50 transition-all shadow-2xl">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Consult SHYRUS regarding medical logic..."
            className="w-full bg-transparent px-5 py-4 text-sm text-slate-100 focus:outline-none placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px] placeholder:font-bold placeholder:tracking-widest"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-teal-500 text-slate-950 rounded-xl hover:bg-teal-400 transition-all disabled:opacity-50 shadow-lg shadow-teal-500/10"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultantView;
