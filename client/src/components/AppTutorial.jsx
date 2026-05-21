import React, { useState, useEffect } from 'react';
import translations from '../translations';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Target, BookOpen, Flame, Compass, ArrowRight, HelpCircle } from 'lucide-react';
const cardVariants = {
  initial: (active) => ({
    opacity: 0,
    scale: 0.95,
    x: '-50%',
    y: active ? 10 : '-45%'
  }),
  animate: (active) => ({
    opacity: 1,
    scale: 1,
    x: '-50%',
    y: active ? 0 : '-50%'
  }),
  exit: (active) => ({
    opacity: 0,
    scale: 0.95,
    x: '-50%',
    y: active ? -10 : '-55%'
  })
};

const AppTutorial = () => {
  const { user } = useAuth();
  // Tutorial key is per-user so new logins from existing accounts are unaffected
  const tutorialKey = user?.id ? `hasSeenTutorial_${user.id}` : 'hasSeenTutorial';
  const [step, setStep] = useState(-1); // -1 means checking if needed
  const [activeRect, setActiveRect] = useState(null);
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang]?.tutorial || translations.EN.tutorial;

  const steps = [
    { id: null, key: 'welcome', icon: 'welcome' },
    { id: 'tut-stats', key: 'stats', icon: 'stats' },
    { id: 'tut-daily', key: 'daily', icon: 'daily' },
    { id: 'tut-contest', key: 'contest', icon: 'contest' },
    { id: 'tut-modes', key: 'modes', icon: 'modes' },
    { id: 'tut-radar', key: 'radar', icon: 'radar' },
    { id: 'tut-nav', key: 'nav', icon: 'nav' }
  ];

  useEffect(() => {
    // Only run after user is resolved
    if (!user) return;
    const hasSeen = localStorage.getItem(tutorialKey);
    if (!hasSeen) {
      setTimeout(() => setStep(0), 1200);
    }
  }, [user, tutorialKey]);

  useEffect(() => {
    if (step >= 0 && step < steps.length) {
      const targetId = steps[step].id;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          const updateRect = () => {
            const rect = el.getBoundingClientRect();
            setActiveRect(rect);
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          };
          // Brief timeout to let page render/scroll adapt
          const timer = setTimeout(updateRect, 100);
          
          window.addEventListener('resize', updateRect);
          return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateRect);
          };
        } else {
          setActiveRect(null);
        }
      } else {
        setActiveRect(null);
      }
    }
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem(tutorialKey, 'true');
      setStep(-2); // Finished
    }
  };

  const handleSkip = () => {
    localStorage.setItem(tutorialKey, 'true');
    setStep(-2);
  };

  const getStepIcon = (iconName) => {
    switch (iconName) {
      case 'welcome':
        return <Sparkles className="text-amber-400 animate-pulse shrink-0" size={28} />;
      case 'stats':
        return <Flame className="text-orange-500 animate-bounce shrink-0" size={28} />;
      case 'daily':
        return <Target className="text-rose-500 shrink-0 animate-pulse" size={28} />;
      case 'contest':
        return <Trophy className="text-amber-400 shrink-0 animate-bounce" size={28} />;
      case 'modes':
        return <BookOpen className="text-sky-400 shrink-0" size={28} />;
      case 'radar':
        return <Compass className="text-emerald-400 shrink-0 animate-pulse" size={28} />;
      case 'nav':
        return <Compass className="text-indigo-400 shrink-0 animate-spin-slow" size={28} />;
      default:
        return <HelpCircle className="text-slate-400 shrink-0" size={28} />;
    }
  };

  if (step < 0) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden select-none">
      {/* Dimmed Overlay with cutout */}
      <div 
        className="absolute inset-0 bg-black/75 transition-all duration-500 pointer-events-auto"
        style={{
          clipPath: activeRect 
            ? `polygon(0% 0%, 0% 100%, ${activeRect.left}px 100%, ${activeRect.left}px ${activeRect.top}px, ${activeRect.right}px ${activeRect.top}px, ${activeRect.right}px ${activeRect.bottom}px, ${activeRect.left}px ${activeRect.bottom}px, ${activeRect.left}px 100%, 100% 100%, 100% 0%)`
            : 'none'
        }}
      />

      {/* Interactive clickable overlay over the spotlight area */}
      {activeRect && (
        <div 
          className="absolute pointer-events-auto z-[99999] group flex items-center justify-center"
          style={{
            top: activeRect.top - 4,
            left: activeRect.left - 4,
            width: activeRect.width + 8,
            height: activeRect.height + 8,
            cursor: 'pointer'
          }}
          onClick={handleNext}
        >
          {/* Subtle pulse hint inside spotlight */}
          <div className="absolute inset-0 rounded-xl border border-sky-400/30 group-hover:bg-sky-400/5 transition-all" />
          <div className="absolute -inset-1 rounded-xl bg-sky-400/10 opacity-0 group-hover:opacity-100 blur transition-all duration-300" />
        </div>
      )}

      {/* Spotlight Ripple indicator */}
      {activeRect && (
        <div 
          className="absolute border-2 border-sky-400 rounded-xl transition-all duration-500 z-[1000]"
          style={{
            top: activeRect.top - 4,
            left: activeRect.left - 4,
            width: activeRect.width + 8,
            height: activeRect.height + 8,
            boxShadow: '0 0 30px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(56, 189, 248, 0.2)'
          }}
        >
          <span className="absolute -inset-4 rounded-xl border-2 border-sky-400/30 animate-ping pointer-events-none" />
        </div>
      )}

      {/* Tooltip Card */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          custom={!!activeRect}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25 }}
          className={`absolute z-[10000] w-[90%] max-w-sm p-6 rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-md shadow-2xl pointer-events-auto flex flex-col gap-4 ${
            activeRect ? '' : 'top-1/2 left-1/2'
          }`}
          style={activeRect ? {
            top: activeRect.bottom + 24 > window.innerHeight - 240 ? activeRect.top - 230 : activeRect.bottom + 24,
            left: '50%'
          } : {}}
        >
          {/* Floating AI Guide Label */}
          <div className="flex justify-between items-center pb-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-sky-500/20 flex items-center justify-center border border-sky-500/30">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {lang === 'HI' ? 'अध्ययन गाइड सिया' : 'AI Guide Sia'}
              </span>
            </div>
            <button 
              onClick={handleSkip} 
              className="text-[10px] font-bold text-slate-500 hover:text-rose-400 uppercase tracking-wider transition-colors"
            >
              {t.skip}
            </button>
          </div>

          <div className="flex items-start gap-4">
            {/* Step Icon */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
              {getStepIcon(current.icon)}
            </div>

            <div className="space-y-1 flex-1">
              <h3 className="text-lg font-black text-white leading-tight">
                {t[current.key]}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {t[`${current.key}Desc`]}
              </p>
            </div>
          </div>

          {/* Interactive Hint for Highlighted Steps */}
          {activeRect && (
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider text-center bg-white/5 py-1.5 rounded-lg border border-white/5">
              💡 {lang === 'HI' ? 'आगे बढ़ने के लिए हाइलाइट किए गए क्षेत्र पर टैप करें' : 'Tip: You can also tap the highlighted area to proceed!'}
            </p>
          )}

          {/* Progress and Button Footer */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-white/5">
            {/* Progress dots bar */}
            <div className="flex gap-1.5">
              {steps.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setStep(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === step ? 'w-5 bg-sky-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to step ${idx + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="premium-button px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>{step === steps.length - 1 ? t.finish : t.next || 'Next'}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AppTutorial;
