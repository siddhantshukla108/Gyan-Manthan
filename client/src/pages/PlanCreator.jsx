import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Settings, Globe, Clock, Loader2, Wand2, Check, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function PlanCreator() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  
  const [durationDays, setDurationDays] = useState(7);
  const [readingMode, setReadingMode] = useState('Deep Study');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/plans/generate', {
        bookId,
        durationDays,
        readingMode,
        language
      });
      navigate(`/plan/${response.data.planId}`);
    } catch (err) {
      const errorMsg = err.response?.data?.details?.error?.message || err.response?.data?.details || err.response?.data?.error || err.message;
      toast.error(`Failed to generate plan. Error: ${JSON.stringify(errorMsg)}`);
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto p-6 mt-10 relative z-10"
    >
      <div className="glass-panel p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
        {/* Decorative background glow inside the panel */}
        <div className="absolute top-[-50%] left-[-10%] w-[150%] h-[150%] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-full pointer-events-none filter blur-3xl"></div>
        
        <div className="relative z-10">
          <button onClick={() => navigate('/search')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Search
          </button>

          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Wand2 className="text-white w-6 h-6" />
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Craft Your Journey</h2>
          </div>
          <p className="text-lg text-slate-500 mb-10 pl-16">Configure your reading preferences to generate an AI-tailored roadmap.</p>
          
          <form onSubmit={handleGenerate} className="space-y-8 pl-0 md:pl-16">
            
            {/* Duration Segmented Control */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-800 font-bold text-xl">
                <Clock className="w-6 h-6 text-blue-600" /> Plan Duration
              </div>
              <div className="grid grid-cols-3 gap-4 bg-white/50 p-2 rounded-2xl backdrop-blur-md border border-white/60">
                {[7, 15, 30].map(days => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDurationDays(days)}
                    className="relative py-4 rounded-xl font-bold text-lg transition-colors outline-none"
                  >
                    {durationDays === days && (
                      <motion.div 
                        layoutId="durationHighlight"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center justify-center gap-2 ${durationDays === days ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
                      {days} Days
                      {durationDays === days && <Check className="w-4 h-4" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Reading Mode Segmented Control */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-800 font-bold text-xl">
                <Settings className="w-6 h-6 text-purple-600" /> Reading Mode
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/50 p-2 rounded-2xl backdrop-blur-md border border-white/60">
                {['Fast Track', 'Deep Study', 'Exam', 'Productivity'].map(mode => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setReadingMode(mode)}
                    className="relative py-4 rounded-xl font-bold text-sm transition-colors outline-none"
                  >
                    {readingMode === mode && (
                      <motion.div 
                        layoutId="modeHighlight"
                        className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center justify-center gap-2 ${readingMode === mode ? 'text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}>
                      {mode}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-800 font-bold text-xl">
                <Globe className="w-6 h-6 text-pink-600" /> Output Language
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-4 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-md font-bold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-pink-500/20 transition-all appearance-none shadow-sm cursor-pointer"
              >
                {['English', 'Hindi', 'Tamil', 'Telugu', 'Urdu', 'Bengali', 'Spanish', 'French'].map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl font-extrabold text-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex justify-center items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" /> 
                  Generating AI Roadmap...
                </>
              ) : (
                <>
                  <Wand2 className="w-6 h-6" /> 
                  Generate AI Roadmap
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
