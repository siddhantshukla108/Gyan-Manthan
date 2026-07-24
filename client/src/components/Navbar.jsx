import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, LogOut } from 'lucide-react';

export default function Navbar() {
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
