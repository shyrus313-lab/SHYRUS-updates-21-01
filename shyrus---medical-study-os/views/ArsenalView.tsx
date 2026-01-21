
import React, { useState, useEffect } from 'react';
import { AppState, Subject, Topic, Quest } from '../types';
import { Sword, Plus, Trash2, Search, Brain, Target, Sparkles, X } from 'lucide-react';

const ArsenalView = ({ state, setState }: { state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>, updateSubject: any }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(state.subjects[0]?.id || null);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [search, setSearch] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [customSubjectName, setCustomSubjectName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredSubjects = state.subjects.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const currentSubject = state.subjects.find(s => s.id === selectedSubjectId);

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const addTopic = () => {
    if (!selectedSubjectId || !newTopicTitle.trim()) {
      alert("Please select a subject and enter a topic title.");
      return;
    }
    
    const newTopic: Topic = {
      id: `topic-${Date.now()}`,
      title: newTopicTitle,
      status: 'Not Started',
      difficulty: 3
    };

    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => {
        if (s.id !== selectedSubjectId) return s;
        const updatedTopics = [...s.topics, newTopic];
        return { 
          ...s, 
          topics: updatedTopics,
          coverage: updatedTopics.length > 0 ? Math.round((updatedTopics.filter(t => t.status === 'Completed').length / updatedTopics.length) * 100) : 0
        };
      })
    }));
    
    setFeedback(`Target Injected: ${newTopicTitle}`);
    setNewTopicTitle('');
  };

  const addCustomSubject = () => {
    if (!customSubjectName.trim()) return;
    const newSubject: Subject = {
      id: `subj-custom-${Date.now()}`,
      name: customSubjectName,
      coverage: 0,
      priority: 'Medium',
      revisionCount: 0,
      status: 'Active',
      topics: []
    };
    setState(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject]
    }));
    setCustomSubjectName('');
    setShowAddSubject(false);
    setSelectedSubjectId(newSubject.id);
    setFeedback(`Node Established: ${newSubject.name}`);
  };

  const removeTopic = (topicId: string) => {
    if (!selectedSubjectId) return;
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => {
        if (s.id !== selectedSubjectId) return s;
        const updatedTopics = s.topics.filter(t => t.id !== topicId);
        return { 
          ...s, 
          topics: updatedTopics,
          coverage: updatedTopics.length > 0 ? Math.round((updatedTopics.filter(t => t.status === 'Completed').length / updatedTopics.length) * 100) : 0
        };
      })
    }));
  };

  const toggleTopicStatus = (topicId: string) => {
    if (!selectedSubjectId) return;
    setState(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => {
        if (s.id !== selectedSubjectId) return s;
        const updatedTopics = s.topics.map(t => {
          if (t.id !== topicId) return t;
          const nextStatus: any = t.status === 'Not Started' ? 'In Progress' : (t.status === 'In Progress' ? 'Completed' : 'Not Started');
          return { ...t, status: nextStatus };
        });
        return { 
          ...s, 
          topics: updatedTopics,
          coverage: updatedTopics.length > 0 ? Math.round((updatedTopics.filter(t => t.status === 'Completed').length / updatedTopics.length) * 100) : 0
        };
      })
    }));
  };

  const deployAsMission = (topic: Topic) => {
    if (!currentSubject) return;
    const newQuest: Quest = {
      id: `q-manual-${Date.now()}`,
      title: `Mission: ${topic.title}`,
      subject: currentSubject.name,
      duration: 60,
      type: 'Main',
      completed: false,
      topicId: topic.id
    };
    setState(prev => ({
      ...prev,
      quests: [newQuest, ...prev.quests]
    }));
    setFeedback(`Mission Deployed: ${topic.title}`);
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2 uppercase tracking-tighter">
            <Sword className="text-teal-400" size={24} />
            Subject Arsenal
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Manual Intelligence: Injection of study targets.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-8 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500 w-full md:w-64 shadow-inner"
            />
          </div>
          <button 
            onClick={() => setShowAddSubject(true)}
            className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-teal-400 hover:bg-slate-800 transition-all shadow-lg"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-teal-500/20 border border-teal-500/40 p-2 rounded-lg text-center animate-in fade-in slide-in-from-top-2">
          <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles size={12} /> {feedback}
          </p>
        </div>
      )}

      {showAddSubject && (
        <div className="bg-slate-900 border border-teal-500/30 p-5 rounded-2xl flex flex-col md:flex-row gap-3 animate-in fade-in zoom-in-95 shadow-2xl">
          <input 
            type="text" 
            placeholder="Custom Subject Identifier" 
            value={customSubjectName}
            onChange={(e) => setCustomSubjectName(e.target.value)}
            className="flex-grow bg-slate-950 border border-slate-800 rounded px-4 py-2 text-xs text-slate-100"
          />
          <div className="flex gap-2">
            <button onClick={addCustomSubject} className="flex-grow bg-teal-500 text-slate-950 px-6 py-2 rounded text-xs font-black uppercase tracking-widest hover:bg-teal-400">Establish</button>
            <button onClick={() => setShowAddSubject(false)} className="flex-grow px-6 py-2 text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300"><X size={16}/></button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow overflow-hidden">
        {/* Left Sidebar: Subjects */}
        <div className="lg:col-span-1 space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 scrollbar-hide border-r border-slate-900/50">
          {filteredSubjects.map(subj => (
            <button 
              key={subj.id}
              onClick={() => setSelectedSubjectId(subj.id)}
              className={`w-full text-left p-4 rounded-xl transition-all border ${selectedSubjectId === subj.id ? 'bg-teal-500/10 border-teal-500/40 shadow-lg' : 'bg-slate-900 border-slate-800/50 hover:border-slate-700'}`}
            >
              <div className="flex justify-between items-center w-full mb-2">
                <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedSubjectId === subj.id ? 'text-teal-400' : 'text-slate-300'}`}>{subj.name}</span>
                <span className="text-[9px] font-mono text-slate-600">{subj.coverage}%</span>
              </div>
              <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-teal-500 transition-all duration-700" style={{ width: `${subj.coverage}%` }}></div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Panel: Topics */}
        <div className="lg:col-span-3 bg-slate-900/30 border border-slate-800 rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden min-h-[500px]">
          {currentSubject ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800 shadow-inner">
                <div>
                  <h2 className="text-xl font-bold text-slate-100 tracking-tight">{currentSubject.name} Node</h2>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">
                    {currentSubject.topics.length} Manual Targets Identified
                  </p>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto relative">
                  <input 
                    type="text" 
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTopic()}
                    placeholder="Input manual target..."
                    className="w-full md:w-80 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500 pr-12 shadow-inner"
                  />
                  <button 
                    onClick={addTopic} 
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-teal-500 text-slate-950 rounded-md hover:bg-teal-400 transition-colors shadow-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto scrollbar-hide flex-grow pr-2 pb-10">
                {currentSubject.topics.length === 0 ? (
                  <div className="col-span-2 py-24 flex flex-col items-center gap-6 opacity-30 text-center">
                    <Brain size={48} className="text-slate-600" />
                    <div>
                      <p className="text-xs uppercase font-bold tracking-[0.3em]">Operational Node Empty</p>
                      <p className="text-[10px] mt-2 italic">Inject manual study topics to begin tracking.</p>
                    </div>
                  </div>
                ) : (
                  currentSubject.topics.slice().reverse().map(topic => (
                    <div key={topic.id} className="bg-slate-950 border border-slate-800/80 p-5 rounded-xl flex items-center justify-between group hover:border-teal-500/40 transition-all shadow-md">
                      <div className="flex-grow min-w-0 pr-4">
                        <h4 className={`text-xs font-bold transition-all ${topic.status === 'Completed' ? 'text-slate-600 line-through' : 'text-slate-200'}`}>{topic.title}</h4>
                        <div className="flex gap-3 mt-4">
                          <button 
                            onClick={() => toggleTopicStatus(topic.id)}
                            className={`text-[9px] px-3 py-1.5 rounded-md uppercase font-bold tracking-widest transition-all border ${
                              topic.status === 'Completed' ? 'bg-teal-500 border-teal-500 text-slate-950' : 
                              topic.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/40' : 
                              'bg-slate-900 text-slate-600 border-slate-800'
                            }`}
                          >
                            {topic.status}
                          </button>
                          <button 
                            onClick={() => deployAsMission(topic)}
                            className="text-[9px] px-3 py-1.5 rounded-md bg-slate-900 text-teal-400 hover:bg-teal-400/10 border border-slate-800 hover:border-teal-500/30 transition-all flex items-center gap-2 uppercase font-bold"
                          >
                            <Target size={12} /> Mission
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeTopic(topic.id)}
                        className="p-2 text-slate-800 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-700 opacity-50 space-y-4 py-20 text-center">
              <Sword size={64} className="animate-pulse" />
              <p className="text-xs uppercase tracking-widest">Select a subject node to begin intelligence injection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArsenalView;
