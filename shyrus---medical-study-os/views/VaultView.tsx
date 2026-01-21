
import React, { useState, useMemo, useRef } from 'react';
import { AppState, PDFFile, Flashcard, Annotation } from '../types';
import { generateFlashcards, generateRapidRevisionNotes } from '../services/geminiService';
import { 
  FolderOpen, FileText, Upload, Trash2, Search, Filter, 
  Highlighter, Sparkles, X, BrainCircuit, RefreshCcw, 
  ChevronRight, ChevronLeft, StickyNote, Tag, 
  Palette, History, Info, Save, Zap, BookOpen, Microscope, Eye,
  LayoutGrid, LayoutList, Share2, FileCode, CheckCircle2,
  Activity
} from 'lucide-react';

const VaultView = ({ state, setState, gainXp }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, gainXp: (amt: number) => void }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeDeckFile, setActiveDeckFile] = useState<PDFFile | null>(null);
  const [activeReaderFile, setActiveReaderFile] = useState<PDFFile | null>(null);
  const [synthesisLabFile, setSynthesisLabFile] = useState<PDFFile | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState<string | null>(null);
  const [vaultTab, setVaultTab] = useState<'ORIGINAL' | 'SYNTHESIS'>('ORIGINAL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredFiles = state.vaultFiles.filter(f => 
    (!selectedSubjectId || f.subjectId === selectedSubjectId) && 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const synthesizedFiles = state.vaultFiles.filter(f => 
    (f.flashcards && f.flashcards.length > 0) || (f.id === synthesisLabFile?.id && revisionNotes)
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSubjectId) return;

    const newFile: PDFFile = {
      id: Date.now().toString(),
      name: file.name,
      uploadDate: new Date().toLocaleDateString(),
      subjectId: selectedSubjectId,
      annotationsCount: 0,
      flashcards: [],
      annotations: [],
      originalUrl: 'simulated_local_path/' + file.name
    };

    setState(prev => ({
      ...prev,
      vaultFiles: [...prev.vaultFiles, newFile],
    }));
    
    gainXp(50);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateCards = async (file: PDFFile) => {
    setIsGenerating(true);
    const subj = state.subjects.find(s => s.id === file.subjectId)?.name || "General Medicine";
    const cards = await generateFlashcards(subj, file.name);
    setState(prev => ({
      ...prev,
      vaultFiles: prev.vaultFiles.map(f => f.id === file.id ? { ...f, flashcards: cards } : f)
    }));
    setIsGenerating(false);
    if (cards.length > 0) {
      setActiveDeckFile({ ...file, flashcards: cards });
      setCurrentCardIndex(0);
      setIsFlipped(false);
      gainXp(100);
    }
  };

  const handleSynthesizeNotes = async (file: PDFFile) => {
    setIsGenerating(true);
    const subj = state.subjects.find(s => s.id === file.subjectId)?.name || "General Medicine";
    const notes = await generateRapidRevisionNotes(subj, file.name);
    setRevisionNotes(notes);
    setIsGenerating(false);
    gainXp(100);
  };

  const openReader = (file: PDFFile) => {
    setActiveReaderFile(file);
    gainXp(50);
  };
  
  const openLab = (file: PDFFile) => { 
    setSynthesisLabFile(file); 
    setRevisionNotes(null); 
  };
  
  const removeFile = (id: string) => {
    if (confirm("Sir, this intelligence node will be permanently purged. Proceed?")) {
      setState(prev => ({ ...prev, vaultFiles: prev.vaultFiles.filter(f => f.id !== id) }));
    }
  };

  if (activeReaderFile) {
    return <SimulatedPDFReader file={activeReaderFile} onClose={() => setActiveReaderFile(null)} />;
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-right-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2 uppercase tracking-tighter">
            <FolderOpen className="text-amber-500" size={24} />
            Study Vault
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Material Intelligence & Primary Evidence Archive.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-amber-500 w-full md:w-64 text-white"
          />
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".pdf" 
            className="hidden" 
          />
          <button 
            onClick={() => selectedSubjectId ? fileInputRef.current?.click() : alert("Select a subject node first.")} 
            className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/10"
          >
            <Upload size={14} /> Import PDF
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button 
          onClick={() => setVaultTab('ORIGINAL')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${vaultTab === 'ORIGINAL' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Primary Evidence
        </button>
        <button 
          onClick={() => setVaultTab('SYNTHESIS')}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${vaultTab === 'SYNTHESIS' ? 'bg-teal-500 text-slate-950 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Neural Assets
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        <div className="lg:col-span-3 space-y-2 border-r border-slate-900/50 pr-4 overflow-y-auto max-h-[70vh] scrollbar-hide">
          <button onClick={() => setSelectedSubjectId(null)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${selectedSubjectId === null ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}>
            <Filter size={14} /> All Intelligence
          </button>
          {state.subjects.map(subj => (
            <button key={subj.id} onClick={() => setSelectedSubjectId(subj.id)} className={`w-full flex items-center gap-3 p-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedSubjectId === subj.id ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'bg-slate-900 border-slate-800/50 text-slate-400 hover:border-slate-700'}`}>
              <FolderOpen size={14} /> {subj.name}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 shadow-inner overflow-y-auto max-h-[70vh] scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(vaultTab === 'ORIGINAL' ? filteredFiles : synthesizedFiles).length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center h-full opacity-20 py-24 text-center">
                <FileText size={48} />
                <p className="mt-4 text-xs font-black uppercase tracking-widest">No Intelligence Nodes Found</p>
              </div>
            )}
            {(vaultTab === 'ORIGINAL' ? filteredFiles : synthesizedFiles).map(file => (
              <div key={file.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 group hover:border-teal-500/40 transition-all shadow-xl relative">
                <button 
                  onClick={() => removeFile(file.id)} 
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
                  title="Purge Intelligence Node"
                >
                  <Trash2 size={14} />
                </button>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${vaultTab === 'ORIGINAL' ? 'bg-amber-500/10 text-amber-500' : 'bg-teal-500/10 text-teal-400'} group-hover:scale-110 transition-transform`}>
                    {vaultTab === 'ORIGINAL' ? <FileText size={32} /> : <FileCode size={32} />}
                  </div>
                  <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${vaultTab === 'ORIGINAL' ? 'bg-slate-800 text-slate-500' : 'bg-teal-500/10 text-teal-500'}`}>
                    {vaultTab === 'ORIGINAL' ? 'PRIMARY_EVIDENCE' : 'NEURAL_ASSET'}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-200 truncate mb-1 uppercase tracking-tight">{file.name}</h4>
                <p className="text-[9px] text-slate-600 font-mono mb-6">{file.uploadDate}</p>
                
                <div className="space-y-2">
                  {vaultTab === 'ORIGINAL' ? (
                    <>
                      <button onClick={() => openReader(file)} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-all shadow-sm">
                        <Eye size={14} className="text-amber-500" /> View Detailed Reader
                      </button>
                      <button onClick={() => openLab(file)} className="w-full flex items-center justify-center gap-2 py-3 bg-teal-500/10 border border-teal-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-teal-400 hover:bg-teal-500/20 transition-all">
                        <Microscope size={14} /> Neural Synthesis Lab
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setSynthesisLabFile(file); handleSynthesizeNotes(file); }} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-800 transition-all">
                        <FileText size={14} className="text-teal-400" /> Open Revision Notes
                      </button>
                      {file.flashcards && file.flashcards.length > 0 && (
                        <button onClick={() => { setActiveDeckFile(file); setCurrentCardIndex(0); setIsFlipped(false); }} className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition-all">
                          <History size={14} /> Practice Flashcards
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {synthesisLabFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-4xl bg-slate-900 border border-teal-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
              <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                       <Microscope size={24} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest">Rapid Synthesis Lab</h3>
                       <p className="text-[10px] text-teal-500 font-mono mt-0.5 uppercase tracking-tighter">Analyzing Node Intelligence: {synthesisLabFile.name}</p>
                    </div>
                 </div>
                 <button onClick={() => setSynthesisLabFile(null)} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg"><X size={20} /></button>
              </div>
              <div className="p-10 flex flex-col items-center justify-center space-y-6 overflow-y-auto">
                 {isGenerating ? <div className="flex flex-col items-center gap-4 py-20">
                    <RefreshCcw className="animate-spin text-teal-500" size={48}/>
                    <p className="text-[10px] font-black uppercase text-teal-500 tracking-[0.2em] animate-pulse">Neural Extraction in progress...</p>
                 </div> : (
                   <>
                     {!revisionNotes && (
                       <div className="flex flex-col items-center gap-6 max-w-md text-center">
                          <BrainCircuit size={48} className="text-slate-800" />
                          <p className="text-xs text-slate-400 leading-relaxed uppercase tracking-tight">Execute neural extraction to generate FMGE-specific study nodes and active-recall decks from this intelligence file.</p>
                          <div className="flex gap-4 w-full">
                              <button onClick={() => handleSynthesizeNotes(synthesisLabFile)} className="flex-grow py-3 bg-teal-500 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-teal-500/10">Synthesize Notes</button>
                              <button onClick={() => handleGenerateCards(synthesisLabFile)} className="flex-grow py-3 bg-amber-500 text-slate-950 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-amber-500/10">Generate Deck</button>
                          </div>
                       </div>
                     )}
                   </>
                 )}
                 {revisionNotes && (
                    <div className="w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-teal-500 uppercase tracking-widest flex items-center gap-2">
                                <FileCode size={14} /> Extracted Logic Node
                            </h4>
                            <div className="flex items-center gap-2">
                               <CheckCircle2 size={12} className="text-teal-500" />
                               <span className="text-[9px] font-mono text-slate-500">SYNTHESIS_SUCCESS</span>
                            </div>
                        </div>
                        <div className="w-full p-8 bg-slate-950 border border-slate-800 rounded-2xl text-[13px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                            {revisionNotes}
                        </div>
                        <button onClick={() => setSynthesisLabFile(null)} className="w-full py-4 border border-slate-800 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-slate-600 transition-all">Store Node in Synthesis Vault</button>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      {activeDeckFile && activeDeckFile.flashcards && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/98 backdrop-blur-xl animate-in zoom-in-95 duration-300">
           <div className="w-full max-w-lg flex flex-col gap-8">
              <div className="flex justify-between items-center">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Neural Deck: {activeDeckFile.name}</span>
                    <span className="text-[9px] font-mono text-slate-600">Asset {currentCardIndex + 1} of {activeDeckFile.flashcards.length}</span>
                 </div>
                 <button onClick={() => setActiveDeckFile(null)} className="p-2 text-slate-500 hover:text-white bg-slate-900 rounded-xl"><X size={20} /></button>
              </div>

              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className={`w-full aspect-[3/4] cursor-pointer perspective-1000 transition-all duration-500 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
              >
                 <div className="relative w-full h-full text-center transition-transform duration-500 [transform-style:preserve-3d]">
                    {/* Front */}
                    <div className="absolute inset-0 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center shadow-2xl [backface-visibility:hidden]">
                       <div className="p-4 bg-amber-500/10 rounded-full text-amber-500 mb-8">
                          <Zap size={32} />
                       </div>
                       <p className="text-xl font-bold text-slate-100 leading-relaxed italic">
                          {activeDeckFile.flashcards[currentCardIndex].question}
                       </p>
                       <div className="mt-12 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Click to Flip Node</div>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 bg-teal-500 border-2 border-teal-400 rounded-[2.5rem] p-10 flex flex-col items-center justify-center shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                       <p className="text-xl font-black text-slate-950 leading-relaxed mb-6">
                          {activeDeckFile.flashcards[currentCardIndex].answer}
                       </p>
                       {activeDeckFile.flashcards[currentCardIndex].mnemonic && (
                         <div className="p-4 bg-slate-950/20 rounded-2xl border border-slate-950/10 mt-4">
                            <p className="text-[10px] font-black text-slate-950 uppercase tracking-widest mb-1 opacity-60">Mnemonic Key</p>
                            <p className="text-xs font-bold text-slate-950">{activeDeckFile.flashcards[currentCardIndex].mnemonic}</p>
                         </div>
                       )}
                       <div className="mt-12 text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] opacity-60">Logic Extracted</div>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button 
                  onClick={() => { setCurrentCardIndex(p => Math.max(0, p - 1)); setIsFlipped(false); }}
                  className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all flex-grow-0"
                 >
                    <ChevronLeft size={24} />
                 </button>
                 <button 
                  onClick={() => { 
                    if (currentCardIndex < activeDeckFile.flashcards!.length - 1) {
                      setCurrentCardIndex(p => p + 1);
                      setIsFlipped(false);
                    } else {
                      setActiveDeckFile(null);
                      alert("Sir, Deck Completed. Neural Synapse Reinforced.");
                      gainXp(50);
                    }
                  }}
                  className="flex-grow py-5 bg-teal-500 text-slate-950 font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl active:scale-95"
                 >
                    {currentCardIndex < activeDeckFile.flashcards!.length - 1 ? 'Next Synapse' : 'Finish Session'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SimulatedPDFReader = ({ file, onClose }: { file: PDFFile, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col animate-in fade-in duration-300">
      <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white bg-slate-800 rounded-lg transition-all"><X size={20} /></button>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <h2 className="text-xs font-black text-slate-100 uppercase tracking-widest">{file.name}</h2>
            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">Primary Evidence Archive • Session Rewards: +50 XP Active</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-3 py-1 bg-teal-500/10 border border-teal-500/20 rounded-lg text-teal-500">
              <Activity size={12} className="animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-tighter">Reading Active</span>
           </div>
           <button className="px-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest">Print / Export</button>
           <button className="px-4 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-[9px] font-black uppercase tracking-widest">Annotate Node</button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-10 bg-slate-950 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white min-h-[150vh] shadow-2xl p-20 text-slate-900 space-y-8 select-text">
           <div className="flex justify-between border-b border-slate-200 pb-4 mb-10">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Intelligence File: {file.id}</span>
              <span className="text-[10px] font-mono text-slate-400">RESTRICTED_ACCESS</span>
           </div>
           <h1 className="text-3xl font-black mb-10 text-slate-900 border-l-8 border-slate-900 pl-6">{file.name.replace('.pdf', '')} Clinical Review</h1>
           <p className="text-lg leading-relaxed text-justify font-serif">
             This original intelligence node contains the foundational pathophysiology and clinical criteria for <strong>{file.name}</strong>. FMGE high-yield patterns suggest a heavy emphasis on early diagnostic signs and gold-standard management protocols.
           </p>
           <p className="text-lg leading-relaxed text-justify font-serif">
             Clinical Case Study: A 45-year-old patient presents with acute onset symptoms consistent with the markers discussed in Section 4.2. Diagnostic confirmation via laboratory investigation is critical before commencing first-line pharmacological therapy.
           </p>
           <div className="p-8 bg-slate-100 border border-slate-300 rounded-xl my-10 space-y-4 font-mono text-sm">
             <p className="font-bold uppercase text-slate-600">High Yield Data Point [HY]</p>
             <p>Gold Standard: Contrast-Enhanced CT Scan (CECT) for definitive localization.</p>
             <p>Pathognomonic Sign: 'Target Sign' visible on ultrasonography in pediatric cases.</p>
           </div>
           <p className="text-lg leading-relaxed text-justify font-serif">
             Post-surgical management requires vigilant monitoring of vitals during the initial 12-hour recovery window. Escalation of care is necessary if patient status fails to stabilize. 
           </p>
           <div className="h-64 bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 font-mono uppercase text-xs">
              Simulated Image Area: Clinical Scans / Histopathology
           </div>
        </div>
      </div>
    </div>
  );
};

export default VaultView;
