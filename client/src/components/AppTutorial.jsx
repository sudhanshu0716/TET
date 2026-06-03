import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  Trophy,
  Brain,
  BarChart3,
  Navigation2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Target,
  Compass,
} from 'lucide-react';

/* ───────────────────────── step definitions ───────────────────────── */
const STEPS = [
  {
    id: null,
    type: 'welcome',
    emoji: '🚀',
    icon: GraduationCap,
    title: 'Welcome to TET Prep!',
    desc: 'Your personal AI-powered companion for cracking TET. Let us show you around!',
    color: 'from-sky-500 to-indigo-600',
    iconColor: 'text-sky-400',
  },
  {
    id: 'tut-stats',
    type: 'spotlight',
    emoji: '📊',
    icon: BarChart3,
    title: 'Track Your Progress',
    desc: 'See your accuracy, streaks and performance stats at a glance right from the dashboard.',
    color: 'from-orange-500 to-amber-600',
    iconColor: 'text-orange-400',
  },
  {
    id: 'tut-daily',
    type: 'spotlight',
    emoji: '📝',
    icon: Target,
    title: 'Daily Challenge',
    desc: 'Practice 50 fresh questions every day to build consistency and sharpen your skills.',
    color: 'from-rose-500 to-pink-600',
    iconColor: 'text-rose-400',
  },
  {
    id: 'tut-contest',
    type: 'spotlight',
    emoji: '🏆',
    icon: Trophy,
    title: 'Live Contests',
    desc: 'Compete in live daily contests at 8:30 PM and climb the leaderboard!',
    color: 'from-amber-500 to-yellow-600',
    iconColor: 'text-amber-400',
  },
  {
    id: 'tut-modes',
    type: 'spotlight',
    emoji: '🧠',
    icon: Brain,
    title: 'Study Modes',
    desc: 'Multiple ways to learn — topic-wise practice, mock tests, revision zone, and more.',
    color: 'from-sky-500 to-cyan-600',
    iconColor: 'text-sky-400',
  },
  {
    id: 'tut-radar',
    type: 'spotlight',
    emoji: '📈',
    icon: Compass,
    title: 'Progress Radar',
    desc: 'Deep analytics of your performance across every subject and subtopic.',
    color: 'from-emerald-500 to-teal-600',
    iconColor: 'text-emerald-400',
  },
  {
    id: 'tut-nav',
    type: 'spotlight',
    emoji: '🧭',
    icon: Navigation2,
    title: 'Quick Navigation',
    desc: 'Navigate easily between all sections using the bottom navigation bar.',
    color: 'from-indigo-500 to-violet-600',
    iconColor: 'text-indigo-400',
  },
  {
    id: null,
    type: 'finale',
    emoji: '🎉',
    icon: Sparkles,
    title: "You're All Set!",
    desc: 'Start your TET journey now. Consistency is the key to cracking the exam!',
    color: 'from-emerald-500 to-sky-600',
    iconColor: 'text-emerald-400',
  },
];

/* ──────────────────── framer-motion variants ──────────────────── */

// Direction-aware slide for the tooltip card
const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.92,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    x: dir > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.92,
  }),
};

// Full-screen overlay variants for welcome / finale
const overlayCardVariants = {
  enter: (dir) => ({
    y: dir > 0 ? 60 : -60,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir) => ({
    y: dir > 0 ? -60 : 60,
    opacity: 0,
    scale: 0.9,
  }),
};

// Springy spotlight box
const spotlightSpring = {
  type: 'spring',
  stiffness: 260,
  damping: 25,
  mass: 1,
};

/* ─────────────────── confetti dots for the finale ─────────────────── */
const CONFETTI_COLORS = [
  'bg-sky-400',
  'bg-emerald-400',
  'bg-amber-400',
  'bg-rose-400',
  'bg-indigo-400',
  'bg-pink-400',
  'bg-violet-400',
  'bg-teal-400',
];

const ConfettiDots = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 8,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.div
          key={d.id}
          className={`absolute rounded-full ${d.color} opacity-60`}
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, (Math.random() - 0.5) * 40, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.3, 0.8],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/* ───────────── gradient animated bg for welcome / finale ───────────── */
const AnimatedGradientBg = ({ colors = 'from-sky-600 via-indigo-600 to-violet-600' }) => (
  <motion.div
    className={`absolute inset-0 bg-gradient-to-br ${colors} opacity-20`}
    animate={{
      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
    }}
    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    style={{ backgroundSize: '200% 200%' }}
  />
);

/* ─────────────── progress dots component ─────────────── */
const ProgressDots = ({ current, total, onJump }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }, (_, i) => (
      <button
        key={i}
        onClick={() => onJump(i)}
        className={`rounded-full transition-all duration-300 ${
          i === current
            ? 'w-6 h-2 bg-sky-400 shadow-lg shadow-sky-400/40'
            : i < current
              ? 'w-2 h-2 bg-sky-400/50 hover:bg-sky-400/70'
              : 'w-2 h-2 bg-white/20 hover:bg-white/40'
        }`}
        aria-label={`Go to step ${i + 1}`}
      />
    ))}
  </div>
);

/* ══════════════════════════ MAIN COMPONENT ══════════════════════════ */

const AppTutorial = () => {
  const { user } = useAuth();
  const tutorialKey = user?.id ? `hasSeenTutorial_${user.id}` : 'hasSeenTutorial';

  const [step, setStep] = useState(-1); // -1 = checking, -2 = done
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [activeRect, setActiveRect] = useState(null);

  const totalSteps = STEPS.length;

  /* ── decide whether to show tutorial ── */
  useEffect(() => {
    if (!user) return;
    const hasSeen = localStorage.getItem(tutorialKey);
    if (!hasSeen) {
      const timer = setTimeout(() => setStep(0), 1200);
      return () => clearTimeout(timer);
    }
  }, [user, tutorialKey]);

  /* ── track the spotlight rectangle ── */
  useEffect(() => {
    if (step < 0 || step >= totalSteps) return;

    const targetId = STEPS[step].id;
    if (!targetId) {
      setActiveRect(null);
      return;
    }

    const el = document.getElementById(targetId);
    if (!el) {
      setActiveRect(null);
      return;
    }

    const updateRect = () => {
      const rect = el.getBoundingClientRect();
      setActiveRect(rect);
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const timer = setTimeout(updateRect, 120);
    window.addEventListener('resize', updateRect);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateRect);
    };
  }, [step, totalSteps]);

  /* ── navigation handlers ── */
  const finish = useCallback(() => {
    localStorage.setItem(tutorialKey, 'true');
    setStep(-2);
  }, [tutorialKey]);

  const goNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }, [step, totalSteps, finish]);

  const goPrev = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  const jumpTo = useCallback(
    (idx) => {
      setDirection(idx > step ? 1 : -1);
      setStep(idx);
    },
    [step]
  );

  const handleSkip = useCallback(() => finish(), [finish]);

  /* ── keyboard navigation ── */
  useEffect(() => {
    if (step < 0) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') goNext();
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, goNext, goPrev, handleSkip]);

  /* ── early return ── */
  if (step < 0) return null;

  const current = STEPS[step];
  const isWelcome = current.type === 'welcome';
  const isFinale = current.type === 'finale';
  const isOverlay = isWelcome || isFinale;
  const StepIcon = current.icon;

  /* ════════════════════════════ RENDER ════════════════════════════ */
  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* ── backdrop ── */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          clipPath:
            activeRect && !isOverlay
              ? `polygon(
                  0% 0%, 0% 100%,
                  ${activeRect.left - 8}px 100%,
                  ${activeRect.left - 8}px ${activeRect.top - 8}px,
                  ${activeRect.right + 8}px ${activeRect.top - 8}px,
                  ${activeRect.right + 8}px ${activeRect.bottom + 8}px,
                  ${activeRect.left - 8}px ${activeRect.bottom + 8}px,
                  ${activeRect.left - 8}px 100%,
                  100% 100%, 100% 0%
                )`
              : 'none',
        }}
        onClick={isOverlay ? undefined : goNext}
      />

      {/* ── spotlight ring (only for element-targeted steps) ── */}
      {activeRect && !isOverlay && (
        <>
          {/* Animated ring */}
          <motion.div
            className="absolute rounded-2xl border-2 border-sky-400 z-[10000] pointer-events-none"
            animate={{
              top: activeRect.top - 8,
              left: activeRect.left - 8,
              width: activeRect.width + 16,
              height: activeRect.height + 16,
            }}
            transition={spotlightSpring}
            style={{
              boxShadow:
                '0 0 30px rgba(56,189,248,0.35), 0 0 60px rgba(56,189,248,0.15), inset 0 0 20px rgba(56,189,248,0.1)',
            }}
          >
            {/* Ping ripple */}
            <span className="absolute -inset-3 rounded-2xl border-2 border-sky-400/25 animate-ping pointer-events-none" />
          </motion.div>

          {/* Clickable spotlight overlay */}
          <motion.div
            className="absolute z-[10001] pointer-events-auto cursor-pointer group"
            animate={{
              top: activeRect.top - 8,
              left: activeRect.left - 8,
              width: activeRect.width + 16,
              height: activeRect.height + 16,
            }}
            transition={spotlightSpring}
            onClick={goNext}
          >
            <div className="absolute inset-0 rounded-2xl group-hover:bg-sky-400/5 transition-colors duration-200" />
          </motion.div>
        </>
      )}

      {/* ── step counter badge (top center) ── */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[10002] pointer-events-none"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
      >
        <div className="px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl">
          <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">
            Step {step + 1}{' '}
            <span className="text-slate-500">of {totalSteps}</span>
          </span>
        </div>
      </motion.div>

      {/* ── skip tutorial (top right) ── */}
      <motion.button
        className="absolute top-4 right-4 z-[10002] pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <X size={12} className="text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Skip
        </span>
      </motion.button>

      {/* ══════════ CONTENT CARDS ══════════ */}
      <AnimatePresence mode="wait" custom={direction}>
        {isOverlay ? (
          /* ── WELCOME / FINALE full-screen card ── */
          <motion.div
            key={step}
            custom={direction}
            variants={overlayCardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="absolute inset-0 z-[10001] flex items-center justify-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-[92%] max-w-md p-8 rounded-3xl border border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6 overflow-hidden">
              {/* Background gradient animation */}
              <AnimatedGradientBg
                colors={
                  isWelcome
                    ? 'from-sky-600 via-indigo-600 to-violet-600'
                    : 'from-emerald-600 via-sky-600 to-indigo-600'
                }
              />

              {/* Confetti for finale */}
              {isFinale && <ConfettiDots />}

              {/* Large icon */}
              <motion.div
                className={`relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-2xl`}
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <StepIcon size={36} className="text-white" />
              </motion.div>

              {/* Big emoji */}
              <motion.span
                className="relative z-10 text-5xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {current.emoji}
              </motion.span>

              {/* Title */}
              <h2 className="relative z-10 text-2xl font-black text-white text-center leading-tight">
                {current.title}
              </h2>

              {/* Description */}
              <p className="relative z-10 text-sm text-slate-400 text-center leading-relaxed max-w-xs">
                {current.desc}
              </p>

              {/* Progress dots */}
              <div className="relative z-10">
                <ProgressDots current={step} total={totalSteps} onJump={jumpTo} />
              </div>

              {/* Action buttons */}
              <div className="relative z-10 flex items-center gap-3 w-full">
                {isFinale && (
                  <button
                    onClick={goPrev}
                    className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft size={18} className="text-slate-300" />
                  </button>
                )}
                <button
                  onClick={isFinale ? finish : goNext}
                  className="premium-button flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-xl shadow-sky-500/25 hover:shadow-sky-500/40 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                >
                  <span>{isWelcome ? "Let's Go!" : 'Start Learning'}</span>
                  {isWelcome ? (
                    <ChevronRight size={16} />
                  ) : (
                    <Sparkles size={16} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ── SPOTLIGHT tooltip card ── */
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="absolute z-[10002] w-[92%] max-w-sm pointer-events-auto left-1/2 -translate-x-1/2"
            style={{
              top: activeRect
                ? activeRect.bottom + 28 > window.innerHeight - 280
                  ? Math.max(16, activeRect.top - 280)
                  : activeRect.bottom + 28
                : '50%',
              ...(activeRect ? {} : { transform: 'translate(-50%, -50%)' }),
            }}
          >
            <div className="glass-card !bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
              {/* Subtle gradient accent line at top */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${current.color} opacity-60 rounded-t-3xl`}
              />

              {/* Header: icon + step label */}
              <div className="flex items-start gap-4">
                {/* Icon badge */}
                <motion.div
                  className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center shadow-lg`}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                >
                  <StepIcon size={26} className="text-white" />
                </motion.div>

                <div className="flex-1 space-y-1 min-w-0">
                  {/* Emoji + title */}
                  <h3 className="text-lg font-black text-white leading-tight flex items-center gap-2">
                    <span className="text-xl">{current.emoji}</span>
                    {current.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {current.desc}
                  </p>
                </div>
              </div>

              {/* Tap hint */}
              {activeRect && (
                <motion.p
                  className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center bg-white/5 py-2 rounded-xl border border-white/5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  💡 Tap the highlighted area to continue
                </motion.p>
              )}

              {/* Footer: progress + nav buttons */}
              <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/5">
                <ProgressDots current={step} total={totalSteps} onJump={jumpTo} />

                <div className="flex items-center gap-2">
                  {/* Back button */}
                  {step > 0 && (
                    <button
                      onClick={goPrev}
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft size={16} className="text-slate-300" />
                    </button>
                  )}

                  {/* Next button */}
                  <button
                    onClick={goNext}
                    className="premium-button px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>{step === totalSteps - 2 ? 'Finish' : 'Next'}</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppTutorial;
