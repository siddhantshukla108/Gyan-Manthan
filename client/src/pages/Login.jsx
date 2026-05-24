import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      toast.error('Failed to log in: ' + err.message);
    }
  }

  async function handleGoogleLogin() {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      toast.error('Failed to log in: ' + err.message);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 relative"
    >
      <div className="max-w-5xl w-full glass-panel rounded-3xl overflow-hidden flex shadow-2xl relative z-10">
        
        {/* Left Side: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="flex items-center gap-2 mb-12">
            <BookOpen className="text-blue-600 w-8 h-8" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Gyan Manthan</h1>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
          <p className="text-slate-500 mb-8">Sign in to continue your learning journey.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="email" placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 glass-input rounded-xl"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <button type="button" onClick={() => toast("Forgot password flow not implemented yet.", { icon: 'ℹ️' })} className="text-xs font-semibold text-blue-600 hover:underline">Forgot Password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input type="password" placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 glass-input rounded-xl"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            
            <div className="pt-2 flex flex-col gap-3">
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                Sign In <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="relative flex py-4 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-slate-400 text-sm">or</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <button type="button" onClick={handleGoogleLogin} className="w-full py-3 glass-panel text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Continue with Google
              </button>
            </div>
          </form>
          
          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <button type="button" onClick={async () => {
              try { await signup(email, password); navigate('/'); }
              catch(err) { toast.error('Failed to sign up: ' + err.message); }
            }} className="text-blue-600 font-bold hover:underline">
              Sign up
            </button>
          </p>
        </div>
        
        {/* Right Side: Abstract Visuals */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 relative items-center justify-center overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10 p-12 text-center text-white">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl inline-block mb-8"
            >
              <Sparkles className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Churn Wisdom from Every Page</h2>
              <p className="text-blue-100/80">AI-powered reading plans tailored to your learning journey.</p>
            </motion.div>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
