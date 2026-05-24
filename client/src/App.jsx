import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, LogOut, Sparkles, Compass, ArrowRight, Loader2, Book as BookIcon } from 'lucide-react';
import axios from './api/axios';
import Login from './pages/Login';
import BookSearch from './pages/BookSearch';
import PlanCreator from './pages/PlanCreator';
import SessionReader from './pages/SessionReader';

// Sticky Glassmorphic Navbar
function Navbar() {
  const { currentUser, logout } = useAuth();
  if (!currentUser) return null;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-white/20 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        <BookOpen className="text-blue-600" />
        Gyan Manthan
      </Link>
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-sm font-medium text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full">
          {currentUser.email}
        </div>
        <button onClick={logout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors rounded-lg">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}

function Dashboard() {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/sessions/user/plans');
        setPlans(response.data);
      } catch (err) {
        console.error('Failed to fetch plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);
  
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
        
        {loading ? (
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

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><BookSearch /></PrivateRoute>} />
        <Route path="/plan/new/:bookId" element={<PrivateRoute><PlanCreator /></PrivateRoute>} />
        <Route path="/plan/:planId" element={<PrivateRoute><SessionReader /></PrivateRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Animated Background Mesh */}
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob" style={{ animationDelay: "2s" }}></div>
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob" style={{ animationDelay: "4s" }}></div>
        </div>
        
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 relative">
            <AnimatedRoutes />
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
