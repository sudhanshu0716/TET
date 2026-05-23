import React from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import DailyExam from './pages/DailyExam';
import Cheatsheets from './pages/Cheatsheets';
import AdminDashboard from './pages/AdminDashboard';
import CommunityUpload from './pages/CommunityUpload';
import AutomationPanel from './pages/AutomationPanel';
import ResultAnalysis from './pages/ResultAnalysis';
import Flashcards from './pages/Flashcards';
import Exams from './pages/Exams';
import Progress from './pages/Progress';
import Subscription from './pages/Subscription';
import SuperTricks from './pages/SuperTricks';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import AppTutorial from './components/AppTutorial';
import { useAuth } from './context/AuthContext';
import { Settings, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PremiumModal from './components/PremiumModal';
import { useState, useEffect } from 'react';

function AppContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const isAdmin = user?.role === 'admin';
  const location = useLocation();
  const isExamPage = ['/daily-exam', '/practice', '/full-mock', '/important', '/year-test', '/contest-live'].some(path => 
    location.pathname.startsWith(path)
  );

  useEffect(() => {
    // Role-based redirection
    if (user && !loading) {
      if (user.role === 'admin' && location.pathname === '/dashboard') {
        navigate('/admin');
      } else if (user.role !== 'admin' && location.pathname === '/admin') {
        navigate('/dashboard');
      }
    }

    // Check if premium expired
    if (user && !user.is_premium && !isAdmin) {
      const trialEnd = new Date(user.trial_end_date);
      const isExpired = trialEnd < new Date();
      
      // Don't show modal on profile page, subscription page, home, login or register
      const isExcludedPage = ['/profile', '/subscription', '/login', '/register', '/'].some(path => 
        location.pathname === path || location.pathname.startsWith(path + '/')
      );
      
      if (isExpired && !isExcludedPage) {
        setShowPremiumModal(true);
      } else {
        setShowPremiumModal(false);
      }
    } else {
      setShowPremiumModal(false);
    }
  }, [user, isAdmin, loading, location.pathname, navigate]);

  if (user?.is_maintenance_mode && !isAdmin) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.05),transparent_70%)]" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative space-y-8 max-w-sm"
        >
          <div className="relative inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
            <Settings className="animate-spin-slow" size={48} />
            <ShieldAlert className="absolute -top-2 -right-2 text-amber-500" size={24} />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black text-white tracking-tight leading-tight">
              Under <br/>
              <span className="text-amber-500">Maintenance</span>
            </h1>
            <p className="text-slate-400 font-medium leading-relaxed">
              We're currently performing scheduled updates to improve your learning experience. We'll be back shortly!
            </p>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Sparkles size={12} className="text-amber-500" />
              Upgrade in Progress
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-black text-xs uppercase tracking-widest active:scale-95 transition-all"
            >
              Refresh Status
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen selection:bg-sky-500/30">
        {!isAdmin && !isExamPage && <Navbar />}
        <main className="flex-1 w-full flex flex-col overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/exams" element={<Exams />} />
              <Route path="/daily-exam" element={<DailyExam type="daily" />} />
              <Route path="/practice/:subject" element={<DailyExam type="subject" />} />
              <Route path="/full-mock" element={<DailyExam type="full-mock" />} />
              <Route path="/important" element={<DailyExam type="important" />} />
              <Route path="/year-test/:year" element={<DailyExam type="year" />} />
              <Route path="/contest-live" element={<DailyExam type="contest" />} />
              <Route path="/contest-leaderboard" element={<Leaderboard />} />
              <Route path="/cheatsheets" element={<Cheatsheets />} />
              <Route path="/exam-result/:examId" element={<ResultAnalysis />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/automation" element={<AutomationPanel />} />
              <Route path="/upload" element={<CommunityUpload />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/super-tricks" element={<SuperTricks />} />
            </Route>
          </Routes>
        </main>
        {!isAdmin && !isExamPage && <BottomNav />}
        {!isAdmin && !isExamPage && <AppTutorial />}
        <PremiumModal 
          isOpen={showPremiumModal} 
          user={user} 
        />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
