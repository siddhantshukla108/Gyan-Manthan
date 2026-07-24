import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, Compass, ArrowRight, Loader2, Book as BookIcon } from 'lucide-react';
import axios from '../api/axios';
import { useQuery } from '@tanstack/react-query';

export default function Dashboard() {
  const { currentUser } = useAuth();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await axios.get('/sessions/user/plans');
      return response.data;
    }
  });
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-8 max-w-6xl mx-auto"
    >
      <div className="mb-12 text-center mt-10">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/20 transform rotate-3"
        >
          <Sparkles className="text-white w-10 h-10" />
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Welcome back, Explorer.
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Ready to dive into a new book? Generate a personalized, AI-guided reading plan and master any topic in days.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Link to="/search" className="h-full">
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel p-8 rounded-3xl h-full flex flex-col items-center justify-center text-center cursor-pointer group hover:border-blue-200 transition-all duration-300 border-dashed border-2 border-slate-300/50 bg-slate-50/30"
          >
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors">
              <Compass className="text-blue-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Start a New Journey</h2>
            <p className="text-slate-500 mb-6">Search our library to create a roadmap.</p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold group-hover:bg-blue-600 transition-colors">
              Search Library <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>
        </Link>
        
        {isLoading ? (
          <div className="glass-panel p-8 rounded-3xl flex items-center justify-center h-full col-span-1 md:col-span-1 lg:col-span-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : plans.map((plan) => (
          <Link to={`/plan/${plan._id}`} key={plan._id} className="h-full">
            <motion.div 
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="glass-panel p-6 rounded-3xl h-full flex flex-col hover:border-purple-200 transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-purple-500"></div>
              <div className="flex gap-4 mb-4">
                {plan.book.thumbnail ? (
                  <img src={plan.book.thumbnail} alt={plan.book.title} className="w-16 h-24 object-cover rounded-lg shadow-md" />
                ) : (
                  <div className="w-16 h-24 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shadow-inner">
                    <BookIcon className="w-6 h-6 opacity-50" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-extrabold text-lg text-slate-900 line-clamp-2 leading-tight">{plan.book.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{plan.readingMode}</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="font-semibold text-slate-500">Progress</span>
                  <span className="font-bold text-blue-600">{plan.completedSessions}/{plan.totalSessions} Days</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(plan.completedSessions / plan.totalSessions) * 100}%` }}></div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
