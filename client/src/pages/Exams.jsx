import React from 'react';
import { useNavigate } from 'react-router-dom';
import translations from '../translations';
import { 
  Trophy, 
  Target, 
  Zap, 
  Star, 
  Brain, 
  ChevronRight,
  Sparkles,
  Timer
} from 'lucide-react';
import { motion } from 'framer-motion';

const Exams = () => {
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  const subjects = [
    { name: t.subjects?.pedagogy || 'Pedagogy', id: 'pedagogy', icon: '🧠' },
    { name: t.subjects?.hindi || 'Hindi', id: 'hindi', icon: '📖' },
    { name: t.subjects?.english || 'English', id: 'english', icon: '🔤' },
    { name: t.subjects?.math || 'Math', id: 'math', icon: '➗' },
    { name: t.subjects?.evs || 'EVS', id: 'evs', icon: '🌱' },
    { name: t.subjects?.science || 'Science', id: 'science', icon: '🔬' },
    { name: t.subjects?.social || 'Social Science', id: 'social', icon: '⚖️' },
    { name: t.subjects?.sanskrit || 'Sanskrit', id: 'sanskrit', icon: '🕉️' },
    { name: t.subjects?.urdu || 'Urdu', id: 'urdu', icon: '🖋️' }
  ];

  const examModes = [
    {
      id: 'contest',
      title: 'Daily Contest',
      desc: 'Join the 8:30 PM battle for global ranking.',
      icon: <Trophy className="text-sky-400" size={24} />,
      path: '/contest-live',
      color: 'from-sky-500/20 to-sky-500/5',
      border: 'border-sky-500/20',
      badge: 'LIVE @ 8:30 PM'
    },
    {
      id: 'daily',
      title: t.dailyChallenge || 'Daily Mock Test',
      desc: t.dailyDesc || 'New questions every day to keep you sharp.',
      icon: <Zap className="text-amber-400" size={24} />,
      path: '/daily-exam',
      color: 'from-amber-500/20 to-amber-500/5',
      border: 'border-amber-500/20',
      badge: 'POPULAR'
    },

    {
      id: 'mock',
      title: t.fullMock || 'Full Length Mock',
      desc: '150 Questions, 150 Minutes. The real deal.',
      icon: <Trophy className="text-sky-400" size={24} />,
      path: '/full-mock',
      color: 'from-sky-500/20 to-sky-500/5',
      border: 'border-sky-500/20',
      badge: 'CHALLENGING'
    },
    {
      id: 'important',
      title: t.important || 'Important Questions',
      desc: 'Carefully curated most repeated TET questions.',
      icon: <Star className="text-purple-400" size={24} />,
      path: '/important',
      color: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/20',
      badge: 'RECOMMENDED'
    },
    {
      id: 'practice',
      title: t.subjectWise || 'Subject Practice',
      desc: 'Focus on your weak areas with subject-wise tests.',
      icon: <Target className="text-emerald-400" size={24} />,
      path: '#subjects-practice',
      color: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/20',
      isAnchor: true
    }
  ];

  return (
    <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <header className="space-y-1">
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
          Exam <span className="text-sky-400">Center</span> 🎯
        </h1>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Select your practice mode</p>
      </header>

      <div className="flex flex-col gap-4 mt-2">
        {examModes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => {
              if (mode.isAnchor) {
                const el = document.getElementById('subjects-practice');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              } else {
                navigate(mode.path);
              }
            }}
            className={`glass-card group relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all border-2 ${mode.border} bg-gradient-to-br ${mode.color} !p-5`}
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-110 transition-transform">
                  {mode.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[var(--text-primary)]">{mode.title}</h3>
                    {mode.badge && (
                      <span className="text-[8px] font-black bg-white/10 text-white px-2 py-0.5 rounded-full border border-white/10 tracking-widest">
                        {mode.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-[200px]">
                    {mode.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" size={20} />
            </div>

            {/* Background Decoration */}
            <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              {React.cloneElement(mode.icon, { size: 100 })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Previous Year Papers */}
      <div className="mt-4 space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Previous Year Papers</h4>
        <div className="grid grid-cols-4 gap-2">
          {[2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011].map((year) => (
            <button 
              key={year}
              onClick={() => navigate(`/year-test/${year}`)}
              className="glass-card !p-3 flex flex-col items-center justify-center gap-1 group active:scale-95 transition-all bg-gradient-to-br from-slate-500/10 to-transparent hover:border-sky-500/30 hover:bg-sky-500/5"
            >
              <span className="text-sm font-black text-[var(--text-primary)]">{year}</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Test</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Revision Section */}
      <div className="mt-4 space-y-4">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Quick Tools</h4>
        <div className="grid grid-cols-3 gap-2">
          <button 
            onClick={() => navigate('/flashcards')}
            className="glass-card !p-3 flex flex-col gap-3 group active:scale-95 transition-all bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20"
          >
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--text-primary)] leading-tight">Flashcards</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-1">Recall</p>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/cheatsheets')}
            className="glass-card !p-3 flex flex-col gap-3 group active:scale-95 transition-all bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20"
          >
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Timer size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--text-primary)] leading-tight">Last Minute</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-1">Notes</p>
            </div>
          </button>

          <button 
            onClick={() => navigate('/revision')}
            className="glass-card !p-3 flex flex-col gap-3 group active:scale-95 transition-all bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20"
          >
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <Star size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--text-primary)] leading-tight">{t.revisionZone || "Revision"}</p>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider leading-none mt-1">Mistakes</p>
            </div>
          </button>
        </div>
      </div>

      {/* Subject-wise MCQ Menu */}
      <div id="subjects-practice" className="mt-4 space-y-4 scroll-mt-6">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t.subjectWise}</h4>
        <div className="grid grid-cols-3 gap-3">
          {subjects.map(sub => (
            <div 
              key={sub.id} 
              className="glass-card !p-3 flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-90 transition-all hover:border-sky-500/30"
              onClick={() => navigate(`/practice/${sub.id}`)}
            >
              <span className="text-2xl">{sub.icon}</span>
              <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tighter text-center">{sub.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exams;
