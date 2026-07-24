import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { BookOpen, CheckCircle, ChevronRight, ChevronLeft, Loader2, Sparkles, Target, Lightbulb, X, BookMarked, ArrowLeft, FileText } from 'lucide-react';
import AnalysisModal from '../components/AnalysisModal';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function SessionReader() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const navigate = useNavigate();

  // Highlight state
  const [selectedText, setSelectedText] = useState('');
  const [highlightPos, setHighlightPos] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`/plans/${planId}`);
        setPlan(response.data.plan);
        setSessions(response.data.sessions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [planId]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!plan) return;
      if (e.key === 'ArrowRight' && currentDay < plan.durationDays) {
        setCurrentDay(d => d + 1);
      } else if (e.key === 'ArrowLeft' && currentDay > 1) {
        setCurrentDay(d => d - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentDay, plan]);

  // Handle Text Selection
  const handleSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && text.length > 5) {
      const range = selection.getRangeAt(0).getBoundingClientRect();
      if (contentRef.current && contentRef.current.contains(selection.anchorNode)) {
        setSelectedText(text);
        setHighlightPos({
          top: range.top - 50,
          left: range.left + (range.width / 2)
        });
      }
    } else {
      setHighlightPos(null);
      setSelectedText('');
    }
  };

  const handleAnalyzeHighlight = async () => {
    if (!selectedText) return;
    setAnalyzing(true);
    try {
      const currentSession = sessions.find(s => s.dayNumber === currentDay);
      const response = await axios.post('/highlights/analyze', {
        selectedText,
        language: plan.language,
        bookId: plan.book._id,
        sessionId: currentSession._id
      });
      setAiAnalysis(response.data.highlight);
      setHighlightPos(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze text');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!plan) return <div className="p-8 text-center text-red-500 font-bold text-xl">Plan not found</div>;

  const currentSession = sessions.find(s => s.dayNumber === currentDay);

  const handleToggleComplete = async () => {
    try {
      const res = await axios.patch(`/sessions/${currentSession._id}/complete`);
      setSessions(sessions.map(s => s._id === currentSession._id ? res.data.session : s));
      toast.success(res.data.session.completed ? 'Session completed!' : 'Session marked incomplete.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update session status');
    }
  };

  const handleGenerateNotes = async () => {
    setGeneratingNotes(true);
    try {
      const response = await axios.post(`/sessions/${currentSession._id}/notes`);
      setSessions(sessions.map(s => s._id === currentSession._id ? { ...s, readingNotes: response.data.notes } : s));
      toast.success('Reading notes generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate reading notes');
    } finally {
      setGeneratingNotes(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Selection Tooltip */}
      <AnimatePresence>
        {highlightPos && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 transform -translate-x-1/2 -translate-y-full bg-slate-900/90 backdrop-blur-md text-white px-5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 cursor-pointer hover:bg-blue-600 transition-colors border border-white/10"
            style={{ top: highlightPos.top, left: highlightPos.left }}
            onClick={handleAnalyzeHighlight}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" /> 
            <span className="font-semibold text-sm">Analyze deeply</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Modal */}
      <AnalysisModal 
        analyzing={analyzing} 
        aiAnalysis={aiAnalysis} 
        onClose={() => setAiAnalysis(null)} 
      />

      {/* Sidebar for Days Navigation */}
      <div className="w-72 glass-panel border-r border-white/40 overflow-y-auto z-10 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 border-b border-white/50 bg-white/40">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <BookMarked className="text-white w-6 h-6" />
          </div>
          <h2 className="font-extrabold text-2xl text-slate-900 leading-tight mb-2 line-clamp-2">{plan.book.title}</h2>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/50 inline-flex px-3 py-1 rounded-full mb-4">
            {plan.readingMode} • {plan.durationDays} Days
          </div>
          <div className="w-full bg-white/60 rounded-full h-2 shadow-inner overflow-hidden border border-white/40">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(sessions.filter(s => s.completed).length / plan.durationDays) * 100}%` }}></div>
          </div>
        </div>
        <div className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
          {sessions.map((session) => (
            <motion.button
              whileHover={{ x: 4 }}
              key={session._id}
              onClick={() => setCurrentDay(session.dayNumber)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                currentDay === session.dayNumber 
                ? 'bg-white shadow-sm border border-slate-200 text-blue-700 font-bold' 
                : 'hover:bg-white/60 text-slate-600 font-medium'
              }`}
            >
              <span>Day {session.dayNumber}</span>
              {session.completed && <CheckCircle className="w-5 h-5 text-emerald-500" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8 lg:p-16 z-10 custom-scrollbar" onMouseUp={handleSelection}>
        <AnimatePresence mode="wait">
          {currentSession && (
            <motion.div
              key={currentDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto space-y-10 pb-24"
            >
              <div className="mb-12 text-center relative">
                <span className="inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-extrabold rounded-full text-sm mb-6 tracking-widest uppercase shadow-lg shadow-blue-500/30">
                  Day {currentDay} of {plan.durationDays}
                </span>
                <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">Today's Reading</h1>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="mt-10"
                >
                  <p ref={contentRef} className="text-xl md:text-2xl text-slate-800 leading-relaxed font-serif glass-panel p-10 md:p-12 rounded-[2rem] text-left border-white/60 shadow-xl relative overflow-hidden">
                    {/* Decorative quote mark */}
                    <span className="absolute top-4 left-6 text-8xl text-blue-100 font-serif leading-none opacity-50 select-none">"</span>
                    <span className="relative z-10">{currentSession.content}</span>
                  </p>
                  <p className="text-sm font-semibold text-slate-400 mt-6 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400"/> Highlight any sentence inside the card for a deep AI explanation.
                  </p>
                </motion.div>
              </div>

              {/* Detailed Reading Notes */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="glass-panel p-8 md:p-12 rounded-[2rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-emerald-500"></div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-blue-50 transition-colors">
                    <FileText className="text-blue-600 w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Detailed Reading Notes</h3>
                </div>
                
                {currentSession.readingNotes ? (
                  <div className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:text-slate-800 prose-a:text-blue-600">
                    <ReactMarkdown>{currentSession.readingNotes}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-blue-500" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-800 mb-2">Ready to dive deep?</h4>
                    <p className="text-slate-500 mb-8 max-w-md">Generate a comprehensive, fully detailed reading summary for today's assignment, powered by AI.</p>
                    <button 
                      onClick={handleGenerateNotes}
                      disabled={generatingNotes}
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingNotes ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating Notes...</> : <><Sparkles className="w-5 h-5" /> Generate Reading Notes</>}
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Summary Card */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-panel p-8 md:p-10 rounded-[2rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    <BookOpen className="text-blue-600 w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Simplified Explanation</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg md:text-xl font-medium">{currentSession.summary}</p>
              </motion.div>

              {/* Insight Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-8 rounded-[2rem] border border-amber-100/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-amber-100 rounded-xl">
                      <Lightbulb className="text-amber-600 w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-900">Core Philosophy</h3>
                  </div>
                  <p className="text-amber-800/90 leading-relaxed text-lg font-medium">{currentSession.keyIdea}</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50/50 p-8 rounded-[2rem] border border-purple-100/50 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Sparkles className="text-purple-600 w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-900">Metaphor Analysis</h3>
                  </div>
                  <p className="text-purple-800/90 leading-relaxed text-lg font-medium">{currentSession.metaphor}</p>
                </motion.div>
              </div>

              {/* Actionable & Reflection */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-emerald-50 to-teal-50/50 p-8 md:p-10 rounded-[2rem] border border-emerald-100/50 shadow-sm relative overflow-hidden"
              >
                <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <Target className="text-emerald-600 w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-900">Practical Implementation</h3>
                </div>
                <p className="text-emerald-800 text-xl leading-relaxed font-medium relative z-10">{currentSession.implementationTask}</p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                className="bg-slate-900 p-10 md:p-12 rounded-[2rem] shadow-2xl text-white relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 pointer-events-none"></div>
                <h3 className="text-sm font-extrabold text-blue-400 mb-6 uppercase tracking-widest relative z-10 flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-blue-400"></span> Deep Reflection
                </h3>
                <p className="text-3xl md:text-4xl font-serif text-white italic leading-tight relative z-10">"{currentSession.reflectionQuestion}"</p>
              </motion.div>

              {/* Navigation Footer */}
              <div className="flex justify-between items-center mt-16 pt-8 border-t border-slate-200/60">
                <button
                  disabled={currentDay === 1}
                  onClick={() => setCurrentDay(d => d - 1)}
                  className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 shadow-sm rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:-translate-y-1 transition-all disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                <button
                  onClick={handleToggleComplete}
                  className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl hover:-translate-y-1 ${currentSession.completed ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  <CheckCircle className={`w-5 h-5 ${currentSession.completed ? 'text-emerald-500' : 'text-slate-400'}`} /> {currentSession.completed ? 'Completed' : 'Mark as Complete'}
                </button>
                <button
                  disabled={currentDay === plan.durationDays}
                  onClick={() => setCurrentDay(d => d + 1)}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 shadow-xl shadow-slate-900/20 hover:shadow-blue-600/30 hover:-translate-y-1 transition-all disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                >
                  Next Day <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
