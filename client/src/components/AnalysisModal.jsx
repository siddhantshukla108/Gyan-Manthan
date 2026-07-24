import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, BookOpen, Target } from 'lucide-react';

export default function AnalysisModal({ analyzing, aiAnalysis, onClose }) {
  if (!analyzing && !aiAnalysis) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[2rem] shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200/60 flex justify-between items-center bg-white/50">
            <h3 className="font-bold text-xl flex items-center gap-2 text-slate-800">
              <Sparkles className="text-blue-600 w-6 h-6"/> AI Insight
            </h3>
            {!analyzing && (
              <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            )}
          </div>
          
          <div className="p-8 overflow-y-auto custom-scrollbar">
            {analyzing ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin mb-6 text-blue-600" />
                <p className="font-medium animate-pulse text-lg">Extracting deep meaning...</p>
              </div>
            ) : aiAnalysis ? (
              <div className="space-y-8">
                <div className="bg-slate-100/50 p-5 rounded-2xl border-l-4 border-blue-500 italic text-slate-700 font-medium leading-relaxed">
                  "{aiAnalysis.selectedText}"
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500"/> Deep Explanation
                  </h4>
                  <p className="text-slate-600 leading-relaxed text-lg">{aiAnalysis.aiExplanation}</p>
                </div>
                <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5"/> Tone & Literary Devices
                  </h4>
                  <p className="text-purple-700 leading-relaxed">{aiAnalysis.metaphorType}</p>
                </div>
                <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5"/> How to Apply This
                  </h4>
                  <p className="text-emerald-800 leading-relaxed font-medium">{aiAnalysis.practicalApplication}</p>
                </div>
              </div>
            ) : null}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
