import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';

// Lazy load pages for better performance (Code Splitting)
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BookSearch = lazy(() => import('./pages/BookSearch'));
const PlanCreator = lazy(() => import('./pages/PlanCreator'));
const SessionReader = lazy(() => import('./pages/SessionReader'));

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

// Global Suspense Fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
    </div>
  );
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
        {/* Wildcard 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
            <Suspense fallback={<LoadingFallback />}>
              <AnimatedRoutes />
            </Suspense>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
