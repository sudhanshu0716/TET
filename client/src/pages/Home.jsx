import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  
  // Detect language from localStorage with real-time updates
  const [lang, setLang] = useState(localStorage.getItem('appLang') || 'EN');

  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('appLang') || 'EN');
    };
    window.addEventListener('languageChanged', handleLangChange);
    return () => window.removeEventListener('languageChanged', handleLangChange);
  }, []);

  const isHi = lang === 'HI';
  
  const t = {
    master: isHi ? 'TET परीक्षा' : 'Master',
    tetExams: isHi ? 'में महारत' : 'TET Exams',
    subtitle: isHi 
      ? 'UPTET और CTET में निश्चित सफलता के लिए आपका अंतिम AI-संचालित तैयारी साथी।' 
      : 'The ultimate AI-powered preparation companion for UPTET & CTET success.',
    enterDash: isHi ? 'डैशबोर्ड पर जाएँ' : 'Enter Dashboard',
    startFree: isHi ? 'मुफ़्त यात्रा शुरू करें' : 'Start Free Journey',
    alreadyMember: isHi ? 'पहले से सदस्य हैं? साइन इन करें' : 'Already a member? Sign In',
    elevate: isHi ? 'अपनी शिक्षा को उत्कृष्ट बनाएं' : 'Elevate Your Learning'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4 w-full relative overflow-hidden -mt-16 bg-[#030712] selection:bg-sky-500/30">
      
      {/* Refined Ambient Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-sky-500/10 via-indigo-500/5 to-transparent rounded-full blur-[80px]" />
      </div>

      {/* Main Glassmorphic Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm relative z-10 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] shadow-[0_0_80px_-20px_rgba(14,165,233,0.15)] backdrop-blur-2xl flex flex-col items-center text-center space-y-8"
      >
        {/* Floating Sparkles around icon */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 bg-gradient-to-tr from-sky-500/20 to-fuchsia-500/20 rounded-full blur-xl"
          />
          <div className="relative w-20 h-20 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl flex items-center justify-center shadow-inner">
            <GraduationCap size={36} className="text-sky-400 drop-shadow-md" />
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles size={14} className="text-amber-400" />
            </motion.div>
          </div>
        </div>
        
        {/* Typography */}
        <div className="space-y-3">
          <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
            {t.master} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              {t.tetExams}
            </span>
          </h1>
          <p className="text-slate-400/90 text-[15px] font-medium leading-relaxed px-2">
            {t.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3.5 w-full pt-4">
          {user ? (
            <Link
              to="/dashboard"
              className="relative group overflow-hidden w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-sky-500/25 bg-gradient-to-r from-sky-500 to-indigo-600 flex justify-center items-center active:scale-95 transition-all"
            >
              <span className="relative flex items-center text-base">
                {t.enterDash}
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="relative group w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-sky-500/20 bg-gradient-to-r from-sky-500 to-indigo-600 flex justify-center items-center active:scale-95 transition-all overflow-hidden border border-sky-400/30 hover:shadow-sky-500/40"
              >
                {/* Shine effect that triggers on hover */}
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[30deg] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                <span className="relative flex items-center text-base">
                  {t.startFree}
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                to="/login"
                className="text-[13px] font-bold text-slate-500 hover:text-white transition-colors uppercase tracking-[0.15em] block py-2"
              >
                {t.alreadyMember}
              </Link>
            </>
          )}
        </div>
      </motion.div>
      
      {/* Minimal New Footer Replacement */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute bottom-10 left-0 w-full text-center z-10 flex flex-col items-center gap-1.5"
      >
        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500/80 uppercase tracking-[0.2em]">
          <Sparkles size={12} className="text-sky-500/70" />
          <span>{t.elevate}</span>
          <Sparkles size={12} className="text-sky-500/70" />
        </div>
      </motion.div>
      
    </div>
  );
};

export default Home;
