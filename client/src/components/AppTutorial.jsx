import React, { useState, useEffect } from 'react';
import translations from '../translations';

const AppTutorial = () => {
  const [step, setStep] = useState(-1); // -1 means checking if needed
  const [activeRect, setActiveRect] = useState(null);
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang]?.tutorial || translations.EN.tutorial;

  const steps = [
    { id: null, key: 'welcome' },
    { id: 'tut-stats', key: 'stats' },
    { id: 'tut-daily', key: 'daily' },
    { id: 'tut-modes', key: 'modes' },
    { id: 'tut-radar', key: 'radar' },
    { id: 'tut-nav', key: 'nav' }
  ];

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenTutorial');
    if (!hasSeen) {
      setTimeout(() => setStep(0), 1000);
    }
  }, []);

  useEffect(() => {
    if (step >= 0 && step < steps.length) {
      const targetId = steps[step].id;
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          const rect = el.getBoundingClientRect();
          setActiveRect(rect);
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
      localStorage.setItem('hasSeenTutorial', 'true');
      setStep(-2); // Finished
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenTutorial', 'true');
    setStep(-2);
  };

  if (step < 0) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Dimmed Overlay with Hole */}
      <div 
        className="absolute inset-0 bg-black/60 transition-all duration-500 pointer-events-auto"
        style={{
          clipPath: activeRect 
            ? `polygon(0% 0%, 0% 100%, ${activeRect.left}px 100%, ${activeRect.left}px ${activeRect.top}px, ${activeRect.right}px ${activeRect.top}px, ${activeRect.right}px ${activeRect.bottom}px, ${activeRect.left}px ${activeRect.bottom}px, ${activeRect.left}px 100%, 100% 100%, 100% 0%)`
            : 'none'
        }}
      />

      {/* Tooltip Card */}
      <div 
        className={`absolute z-[10000] w-[85%] max-w-sm p-6 glass-card bg-slate-900 border-sky-500/30 shadow-2xl pointer-events-auto transition-all duration-500 ${activeRect ? '' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}
        style={activeRect ? {
          top: activeRect.bottom + 20 > window.innerHeight - 200 ? activeRect.top - 200 : activeRect.bottom + 20,
          left: '50%',
          transform: 'translateX(-50%)'
        } : {}}
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">
            Step {step + 1} / {steps.length}
          </span>
          <button onClick={handleSkip} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-wider">
            {t.skip}
          </button>
        </div>
        
        <h3 className="text-xl font-black text-white mb-2">{t[current.key]}</h3>
        <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
          {t[`${current.key}Desc`]}
        </p>

        <div className="flex gap-3">
          <button 
            onClick={handleNext}
            className="flex-1 bg-sky-500 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
          >
            {step === steps.length - 1 ? t.finish : t.next}
          </button>
        </div>
      </div>

      {/* Spotlight Border (Subtle) */}
      {activeRect && (
        <div 
          className="absolute border-2 border-sky-400/50 rounded-xl transition-all duration-500 shadow-[0_0_20px_rgba(56,189,248,0.3)]"
          style={{
            top: activeRect.top - 4,
            left: activeRect.left - 4,
            width: activeRect.width + 8,
            height: activeRect.height + 8
          }}
        />
      )}
    </div>
  );
};

export default AppTutorial;
