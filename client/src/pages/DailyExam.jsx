import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import translations from '../translations';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, ListChecks, X, Trophy, RotateCcw, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DailyExam = ({ type }) => {
  const { subject, year } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [step, setStep] = useState('config');
  const [config, setConfig] = useState({ qCount: 30, timeLimit: 30 });
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);
  const [offlineExam, setOfflineExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [contestData, setContestData] = useState(null);
  const [resumeData, setResumeData] = useState(null); // saved session to resume
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;
  const [loadingText, setLoadingText] = useState(t?.preparing || 'Preparing your questions...');

  // Build a unique key per exam type+subject+user so different exams don't clash
  const resumeKey = `examResume_${type}_${subject || 'none'}_${year || 'none'}_${user?.id || 'guest'}`;

  // Countdown helpers — defined at top level to avoid Rules-of-Hooks violation
  const getSecondsToStart = (data) => {
    if (!data?.startTimeIST) return null;
    const [h, m] = data.startTimeIST.split(':').map(Number);
    const now = new Date();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffsetMs);
    const target = new Date(nowIST);
    target.setHours(h, m, 0, 0);
    return Math.max(0, Math.floor((target - nowIST) / 1000));
  };
  const fmtCountdown = (s) => {
    if (s === null || s === undefined) return '--:--:--';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };
  const [countdown, setCountdown] = useState(() => getSecondsToStart(contestData));

  useEffect(() => {
    const saved = localStorage.getItem('offline_exam');
    if (saved) setOfflineExam(JSON.parse(saved));

    // Check for a saved resume session (skip for contest — those can't resume)
    if (type !== 'contest') {
      const savedSession = localStorage.getItem(resumeKey);
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);
          // Only resume if saved within last 3 hours
          const ageMs = Date.now() - (parsed.savedAt || 0);
          if (ageMs < 3 * 60 * 60 * 1000) {
            setResumeData(parsed);
          } else {
            localStorage.removeItem(resumeKey); // stale — discard
          }
        } catch (e) {
          localStorage.removeItem(resumeKey);
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/revision/bookmarked-ids', { headers: { 'x-auth-token': token } });
        setBookmarkedIds(res.data.bookmarked_ids || []);
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      }
    };
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  // Countdown tick — runs at top level, only meaningful when step === 'contest-waiting'
  useEffect(() => {
    if (step !== 'contest-waiting') return;
    const iv = setInterval(() => {
      setCountdown(getSecondsToStart(contestData));
    }, 1000);
    return () => clearInterval(iv);
  }, [step, contestData]);

  const downloadOffline = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch 50 questions based on user profile
      const res = await api.get('/api/exams/today?count=50&duration=60', {
        headers: { 'x-auth-token': token }
      });
      localStorage.setItem('offline_exam', JSON.stringify(res.data));
      setOfflineExam(res.data);
      alert('Offline Mock Test downloaded! You can now practice without internet.');
    } catch (err) {
      console.error(err);
      alert('Failed to download offline test. Please check your connection.');
    }
  };

  const clearResumeData = () => localStorage.removeItem(resumeKey);

  const resumeExam = () => {
    if (!resumeData) return;
    setQuestions(resumeData.questions);
    setExam(resumeData.exam);
    setAnswers(resumeData.answers);
    setCurrentIndex(resumeData.currentIndex);
    setTimeLeft(resumeData.timeLeft);
    setConfig(resumeData.config || { qCount: 30, timeLimit: 30 });
    setResumeData(null);
    setStep('exam');
  };

  const startExam = async () => {
    clearResumeData(); // Fresh start clears any saved session
    
    if (location.state?.remedialExam) {
      const { exam: newExam, questions: newQuestions } = location.state.remedialExam;
      setExam(newExam);
      setQuestions(newQuestions);
      setTimeLeft(newExam.duration * 60);
      setStep('exam');
      return;
    }

    setStep('loading');
    
    // Cycle loading text to keep user engaged while Render wakes up
    const loadingTexts = [
      'Waking up the server... ☕',
      'Gathering the best questions... 📚',
      'Almost ready... 🚀',
      'Just a few more seconds... ⏳'
    ];
    let textIndex = 0;
    const intervalId = setInterval(() => {
      textIndex = (textIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[textIndex]);
    }, 3000);

    try {
      const token = localStorage.getItem('token');
      
      if (type === 'contest') {
        const statusRes = await api.get('/api/contests/status', { headers: { 'x-auth-token': token } });
        setContestData(statusRes.data);
        
        const partRes = await api.get('/api/contests/participants', { headers: { 'x-auth-token': token } });
        setParticipants(partRes.data);

        if (statusRes.data.status !== 'live') {
          setStep('contest-waiting');
          clearInterval(intervalId);
          return;
        }
      }

      let url = `/api/exams/today?count=${config.qCount}&duration=${config.timeLimit}`;
      if (type === 'full-mock') url = '/api/exams/full-mock';
      if (type === 'subject') url = `/api/exams/subject/${subject}?count=${config.qCount}&duration=${config.timeLimit}`;
      if (type === 'important') url = '/api/exams/important';
      if (type === 'year') url = `/api/exams/year/${year}`;
      if (type === 'contest') url = '/api/contests/join';

      const res = await api.get(url, { headers: { 'x-auth-token': token } });
      const { exam: newExam, questions: newQuestions } = res.data;
      
      clearInterval(intervalId);
      setExam(newExam);
      setQuestions(newQuestions);
      setTimeLeft(newExam.duration * 60);
      setStep('exam');
    } catch (err) {
      clearInterval(intervalId);
      const msg = err.response?.data?.message || 'Error starting exam';
      // Suppress alert ONLY for trial/premium limits which are handled by PremiumModal
      if (err.response?.status !== 403 || (!msg.toLowerCase().includes('trial') && !msg.toLowerCase().includes('premium'))) {
        alert(msg);
      }
      navigate('/dashboard');
    }
  };

  // Auto-start for specific exam types — but ONLY if there's no saved resume session
  useEffect(() => {
    if (step !== 'config') return;
    
    if (location.state?.remedialExam) {
      startExam();
      return;
    }

    // If a resume session exists, stay on config so the resume banner is shown
    const savedSession = localStorage.getItem(resumeKey);
    if (savedSession) return; // let the banner handle it

    if (type === 'contest') {
      setConfig({ qCount: 20, timeLimit: 30 });
      startExam();
    } else if (type === 'full-mock') {
      setConfig({ qCount: 150, timeLimit: 150 });
      startExam();
    } else if (type === 'important') {
      setConfig({ qCount: 30, timeLimit: 30 });
      startExam();
    } else if (type === 'daily') {
      setConfig({ qCount: 30, timeLimit: 30 });
      startExam();
    } else if (type === 'year') {
      setConfig({ qCount: 30, timeLimit: 30 });
      startExam();
    }
  }, [type]);

  // Contest Auto-Refresh Logic (Polling)
  useEffect(() => {
    if (step !== 'contest-waiting') return;

    const pollInterval = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/contests/status', { headers: { 'x-auth-token': token } });
        if (res.data.status === 'live') {
          clearInterval(pollInterval);
          startExam(); // Automatically start when live
        } else {
          // Refresh participant list while waiting
          const partRes = await api.get('/api/contests/participants', { headers: { 'x-auth-token': token } });
          setParticipants(partRes.data);
          setContestData(res.data);
        }
      } catch (err) { console.error('Polling error:', err); }
    }, 10000);

    return () => clearInterval(pollInterval);
  }, [step]);

  useEffect(() => {
    if (step !== 'exam') return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Exam in progress. Your progress will be lost!';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);

  useEffect(() => {
    if (step !== 'exam' || result || !exam) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, result, exam]);

  // Auto-save exam progress every time answers or currentIndex changes
  useEffect(() => {
    if (step !== 'exam' || !exam || !questions.length) return;
    const sessionData = {
      questions,
      exam,
      answers,
      currentIndex,
      timeLeft,
      config,
      savedAt: Date.now()
    };
    localStorage.setItem(resumeKey, JSON.stringify(sessionData));
  }, [answers, currentIndex, step]);

  // Also save timeLeft every 10 seconds so timer stays roughly accurate
  useEffect(() => {
    if (step !== 'exam' || !exam || !questions.length) return;
    const interval = setInterval(() => {
      const sessionData = {
        questions,
        exam,
        answers,
        currentIndex,
        timeLeft,
        config,
        savedAt: Date.now()
      };
      localStorage.setItem(resumeKey, JSON.stringify(sessionData));
    }, 10000);
    return () => clearInterval(interval);
  }, [step, exam, questions, answers, currentIndex, timeLeft]);

  const handleSubmit = async () => {
    setSubmitting(true);
    clearResumeData(); // Exam done — clear saved session
    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.entries(answers).map(([qid, opt]) => ({ question_id: qid, selected_option: opt }));
      const res = await api.post(`/api/exams/submit/${exam.exam_id}`, { answers: formattedAnswers }, { headers: { 'x-auth-token': token } });
      setResult(res.data.exam);
      setStep('result');
    } catch (err) { 
      console.error(err);
      alert('Error submitting exam. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleToggleBookmark = async () => {
    if (!q) return;
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/revision/bookmark/toggle', { question_id: q.question_id }, { headers: { 'x-auth-token': token } });
      setBookmarkedIds(prev => 
        prev.includes(q.question_id) 
          ? prev.filter(id => id !== q.question_id) 
          : [...prev, q.question_id]
      );
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // CONFIG SCREEN
  if (step === 'config') return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <div className="flex justify-start px-1">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <span>←</span> {t.returnDash}
        </button>
      </div>

      <div className="glass-card space-y-6">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">{t.setupExam} ⚙️</h2>
        
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">{t.questions}</label>
          <div className="flex gap-2">
            {[10, 20, 30, 50].map(n => (
              <button 
                key={n} 
                className={`flex-1 py-4 rounded-xl text-sm font-black transition-all border-2 ${
                  config.qCount === n 
                    ? 'border-sky-500 bg-sky-500/10 text-[var(--text-primary)] shadow-lg shadow-sky-500/10' 
                    : 'border-white/5 bg-white/5 text-[var(--text-secondary)] hover:border-white/10'
                }`}
                onClick={() => setConfig({...config, qCount: n, timeLimit: n})}
              >
                {n} Qs
              </button>
            ))}
          </div>
        </div>


        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">{t.timeLimit} (Minutes)</label>
          <input 
            type="range" min="5" max="60" value={config.timeLimit} 
            onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
            className="w-full"
          />
          <div className="text-center text-lg font-black text-[var(--text-primary)]">{config.timeLimit} Minutes</div>
        </div>

        {/* Resume Banner — shown if a previous session exists */}
        {resumeData && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚡</div>
              <div>
                <h4 className="font-black text-amber-400 text-sm">
                  {lang === 'HI' ? 'अधूरी परीक्षा मिली!' : 'Unfinished Exam Found!'}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {lang === 'HI'
                    ? `${resumeData.currentIndex + 1}/${resumeData.questions?.length} प्रश्न पूरे — ⏱️ ${Math.floor((resumeData.timeLeft || 0) / 60)} मिनट बचे`
                    : `Question ${resumeData.currentIndex + 1}/${resumeData.questions?.length} — ⏱️ ${Math.floor((resumeData.timeLeft || 0) / 60)} min left`
                  }
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resumeExam}
                className="flex-1 py-3 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
              >
                <RotateCcw size={14} /> {lang === 'HI' ? 'वहीं से जारी रखें' : 'Resume Exam'}
              </button>
              <button
                onClick={() => { clearResumeData(); setResumeData(null); }}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-black text-xs active:scale-95 transition-all"
              >
                {lang === 'HI' ? 'नई शुरुआत' : 'Start Fresh'}
              </button>
            </div>
          </div>
        )}

        <button 
          className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20"
          onClick={startExam}
        >
          {t.launchExam}
        </button>

        <div className="pt-4 border-t border-white/5 space-y-3">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest text-center">Offline Practice</p>
          {offlineExam ? (
            <div className="flex flex-col gap-2">
              <button 
                className="w-full py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-sm transition-all active:scale-[0.98]"
                onClick={() => {
                  setQuestions(offlineExam.questions);
                  setExam(offlineExam.exam);
                  setStep('exam');
                  setTimeLeft(offlineExam.exam.duration * 60);
                }}
              >
                🚀 Start Offline Exam (50 Qs)
              </button>
              <button 
                className="text-[10px] text-slate-500 font-bold uppercase hover:text-red-400 transition-colors"
                onClick={() => {
                  localStorage.removeItem('offline_exam');
                  setOfflineExam(null);
                }}
              >
                Remove Offline Data
              </button>
            </div>
          ) : (
            <button 
              className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-white/10"
              onClick={downloadOffline}
            >
              📥 Download for Offline
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // SUMMARY SCREEN (Dotted Sheet)
  if (step === 'summary') return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <div className="flex justify-start px-1">
        <button 
          onClick={() => {
            if (window.confirm(t.confirmExit || "Quit exam? Your progress will be lost.")) {
              clearResumeData();
              navigate('/dashboard');
            }
          }}
          className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] bg-rose-500/5 px-4 py-2 rounded-full border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-2"
        >
          <span>✕</span> {t.exitExam || 'Exit Exam'}
        </button>
      </div>

      <div className="glass-card space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-[var(--text-primary)]">{t.examSummary || 'Summary'} 📋</h2>
          <div className="text-sky-400 font-bold text-sm">⏱️ {formatTime(timeLeft)}</div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {questions.map((q, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setStep('exam');
              }}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-black transition-all border-2 ${
                answers[q.question_id]
                  ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-white/5 border-white/10 text-[var(--text-secondary)]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="flex gap-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sky-500"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.attempted || 'Attempted'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/10 border border-white/10"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.unattempted || 'Skipped'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button 
            className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 disabled:opacity-70 flex items-center justify-center gap-3"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="loader w-5 h-5 border-2 border-t-white/30"></div>
                Submitting...
              </>
            ) : (
              t.confirmSubmit || 'Confirm & Submit'
            )}
          </button>
          <button 
            className="w-full py-4 rounded-2xl bg-white/5 border border-white/5 text-[var(--text-secondary)] font-black text-sm"
            onClick={() => setStep('exam')}
          >
            Back to Questions
          </button>
        </div>
      </div>
    </div>
  );

  // CONTEST WAITING ROOM
  if (step === 'contest-waiting') {

    return (
      <div className="flex flex-col min-h-screen bg-[var(--bg-main)] pb-10">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/80 via-sky-900/60 to-purple-900/80 px-5 pt-12 pb-10 flex flex-col items-center text-center gap-4">
          {/* Animated background circles */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-sky-500/10 blur-3xl animate-pulse pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

          {/* Back button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="absolute top-4 left-4 text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-all flex items-center gap-1.5"
          >
            ← Back
          </button>

          {/* Trophy icon */}
          <div className="relative z-10">
            <div className="absolute inset-0 bg-amber-400/30 blur-2xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-2 border-amber-400/30 flex items-center justify-center shadow-2xl shadow-amber-500/20">
              <Trophy size={44} className="text-amber-400 drop-shadow-lg" />
            </div>
          </div>

          {/* Title */}
          <div className="relative z-10 space-y-1">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">
              {lang === 'HI' ? 'लाइव प्रतियोगिता' : 'Live Contest'}
            </div>
            <h1 className="text-3xl font-black text-white">
              {lang === 'HI' ? 'प्रतीक्षा कक्ष' : 'Waiting Room'}
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              {lang === 'HI' ? 'प्रतियोगिता शुरू होने में' : 'Contest starts in'}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="relative z-10 bg-white/5 border border-white/10 rounded-3xl px-8 py-5 backdrop-blur-sm shadow-xl mt-1">
            <div className="font-black text-4xl text-white tracking-widest tabular-nums">
              {fmtCountdown(countdown)}
            </div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 text-center">
              HH : MM : SS
            </div>
          </div>

          {/* Start time pill */}
          <div className="relative z-10 flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-4 py-2 rounded-full">
            <Clock size={12} className="text-sky-400" />
            <span className="text-xs font-black text-sky-400">
              {lang === 'HI' ? 'शुरू होगा' : 'Starts at'} {contestData?.startTimeIST || '--:--'} IST
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 pt-5 max-w-md mx-auto w-full">

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card !p-4 text-center space-y-1">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {lang === 'HI' ? 'पंजीकृत' : 'Registered'}
              </div>
              <div className="text-3xl font-black text-sky-400">{contestData?.registrationCount || 0}</div>
              <div className="text-[9px] text-slate-500 font-bold">
                {lang === 'HI' ? 'छात्र' : 'Students'}
              </div>
            </div>
            <div className="glass-card !p-4 text-center space-y-1">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {lang === 'HI' ? 'अवधि' : 'Duration'}
              </div>
              <div className="text-3xl font-black text-emerald-400">{contestData?.duration || 50}</div>
              <div className="text-[9px] text-slate-500 font-bold">
                {lang === 'HI' ? 'मिनट' : 'Minutes'}
              </div>
            </div>
          </div>

          {/* Live Participants */}
          <div className="glass-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-[var(--text-primary)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                {lang === 'HI' ? 'अभी ऑनलाइन' : 'Online Now'}
              </h3>
              <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {participants?.length || 0} {lang === 'HI' ? 'लाइव' : 'live'}
              </span>
            </div>

            {participants && participants.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${p.isAdmin ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    {p.name}
                    {p.isAdmin && <span className="text-[8px] text-amber-400 font-black">(Admin)</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 italic">{lang === 'HI' ? 'छात्र लोड हो रहे हैं...' : 'Loading participants...'}</p>
              </div>
            )}
          </div>

          {/* Auto-refresh notice */}
          <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
            <span className="text-lg mt-0.5">⚡</span>
            <div>
              <p className="text-xs font-black text-amber-400 mb-0.5">
                {lang === 'HI' ? 'यह पेज बंद न करें' : 'Do not close this page'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                {lang === 'HI'
                  ? 'जैसे ही प्रतियोगिता लाइव होगी, यह पेज अपने आप शुरू हो जाएगा।'
                  : 'The exam will automatically launch the moment the contest goes live.'}
              </p>
            </div>
          </div>

          {/* Animated waiting button */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600/30 via-indigo-600/30 to-sky-600/30 animate-pulse" />
            <button
              disabled
              className="relative w-full py-5 rounded-2xl font-black text-slate-400 text-sm border border-white/10 bg-white/5 flex items-center justify-center gap-3 cursor-not-allowed"
            >
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              {lang === 'HI' ? 'लाइव होने की प्रतीक्षा में...' : 'Waiting for Contest to Go Live...'}
            </button>
          </div>

        </div>
      </div>
    );
  }
  if (step === 'loading') return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-5 max-w-md mx-auto w-full animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full animate-pulse"></div>
        <div className="glass-card !p-8 rounded-full relative z-10 border-sky-500/30 shadow-2xl shadow-sky-500/20">
          <div className="loader border-t-sky-400 w-12 h-12 border-4"></div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-[var(--text-primary)]">{loadingText}</h3>
        <p className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest">Please wait...</p>
      </div>
    </div>
  );

  // RESULT SCREEN
  if (step === 'result') return (
    <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in relative overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="confetti" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            background: i % 2 === 0 ? '#0ea5e9' : '#f43f5e',
            animationDelay: `${Math.random() * 2}s` 
          }}
        />
      ))}

      <div className="glass-card text-center relative overflow-hidden border-2 border-sky-500/30 shadow-[0_0_40px_rgba(14,165,233,0.2)]">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(14,165,233,0.1)_0%,transparent_70%)] animate-pulse pointer-events-none" />
        
        {(() => {
          const accuracyPct = questions.length > 0 ? (result.score / questions.length) * 100 : 0;
          let headerText = t.brilliant || 'Brilliant!';
          let emoji = '🎊';
          if (accuracyPct < 50) {
            headerText = t.keepPracticing || 'Keep Practicing!';
            emoji = '💪';
          } else if (accuracyPct < 75) {
            headerText = t.goodJob || 'Good Attempt!';
            emoji = '👍';
          }
          return (
            <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2 relative z-10">
              {emoji} {headerText}
            </h2>
          );
        })()}
        <p className="text-[var(--text-secondary)] text-sm font-medium relative z-10">{t.completed}</p>
        
        <div className="text-6xl font-black my-8 text-gradient relative z-10">
          {result.score} / {questions.length}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-8 relative z-10">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
            <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{t.accuracy}</div>
            <div className="text-xl font-black text-[var(--text-primary)]">{Math.round((result.score / questions.length) * 100)}%</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
            <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{t.timeSpent}</div>
            <div className="text-xl font-black text-[var(--text-primary)]">{config.timeLimit - Math.floor(timeLeft/60)}m</div>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="relative z-10 mt-4 space-y-4 text-left border-t border-white/10 pt-6">
          <h3 className="text-lg font-black text-[var(--text-primary)] px-2 flex items-center justify-between">
            {t.reviewAnswers || 'Review Answers'} 🔍
            <span className="text-xs text-[var(--text-secondary)] font-bold">{reviewIndex + 1} / {questions.length}</span>
          </h3>
          
          <div className="glass-card !bg-white/5 !border-white/5 space-y-4">
            <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
              {questions[reviewIndex].question_text}
            </p>
            
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">{t.yourAnswer || 'Your Answer'}</div>
                <div className={`text-sm font-bold ${
                  answers[questions[reviewIndex].question_id] === questions[reviewIndex].correct_answer 
                    ? 'text-emerald-400' 
                    : 'text-rose-400'
                }`}>
                  {answers[questions[reviewIndex].question_id] || 'Not Attempted'}
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">{t.correctAnswer || 'Correct Answer'}</div>
                <div className="text-sm font-bold text-emerald-400">
                  {questions[reviewIndex].correct_answer}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                disabled={reviewIndex === 0}
                onClick={() => setReviewIndex(prev => prev - 1)}
                className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 font-black text-xs disabled:opacity-20"
              >
                ← Prev
              </button>
              <button 
                disabled={reviewIndex === questions.length - 1}
                onClick={() => setReviewIndex(prev => prev + 1)}
                className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 font-black text-xs disabled:opacity-20"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <button 
          className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 relative z-10 mt-8"
          onClick={() => navigate('/dashboard')}
        >
          {t.returnDash}
        </button>
      </div>
    </div>
  );

  if (!questions || questions.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-5 max-w-md mx-auto w-full">
      <div className="text-center space-y-2">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-xl font-black text-[var(--text-primary)]">{lang === 'HI' ? 'कोई प्रश्न नहीं मिला' : 'No questions found'}</h3>
        <p className="text-sm text-slate-500 font-medium">{lang === 'HI' ? 'कृपया दूसरा विषय या स्तर चुनें।' : 'Please try a different subject or level.'}</p>
      </div>
      <button 
        onClick={() => navigate('/dashboard')}
        className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 font-black text-sm"
      >
        {t.returnDash}
      </button>
    </div>
  );

  const q = questions[currentIndex];

  // EXAM SCREEN
  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-main)]">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1.5 bg-white/5">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]"
        />
      </div>

      <div className="flex flex-col gap-6 px-5 pt-8 pb-44 max-w-md mx-auto w-full" style={{ paddingBottom: 'max(11rem, calc(10rem + env(safe-area-inset-bottom)))' }}>
        {/* Header Section */}
        <div className="flex justify-between items-center px-1">
          <button 
            onClick={() => {
              const choice = window.confirm(
                lang === 'HI'
                  ? 'परीक्षा छोड़ रहे हैं?\n\n✅ OK = बाहर जाएं (प्रगति सहेजी गई - वापस आने पर जारी रख सकते हैं)\n❌ Cancel = परीक्षा जारी रखें'
                  : 'Exit Exam?\n\n✅ OK = Exit (progress saved — you can resume when you return)\n❌ Cancel = Continue exam'
              );
              if (choice) {
                navigate('/dashboard'); // progress stays saved in localStorage
              }
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all"
          >
            <X size={12} /> {t.exitExam || 'Exit'}
          </button>
          
          <div className="flex items-center gap-4">
            {q && (
              <button 
                onClick={handleToggleBookmark}
                className={`p-2 rounded-xl transition-all border ${
                  bookmarkedIds.includes(q.question_id) 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                    : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'
                } active:scale-90`}
              >
                <Star size={16} fill={bookmarkedIds.includes(q.question_id) ? '#fbbf24' : 'none'} className={bookmarkedIds.includes(q.question_id) ? 'animate-pulse' : ''} />
              </button>
            )}
            <div className={`flex items-center gap-1.5 font-black text-sm ${timeLeft < 300 ? 'text-rose-500 animate-pulse' : 'text-sky-400'}`}>
              <Clock size={16} className={timeLeft < 300 ? 'animate-spin-slow' : ''} />
              <span>{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-3">
          <div 
            onClick={() => setStep('summary')}
            className="flex-1 glass-card !p-3 !rounded-2xl flex items-center justify-between cursor-pointer group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <ListChecks size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Question</span>
                <span className="text-sm font-black text-[var(--text-primary)] leading-none">{currentIndex + 1} of {questions.length}</span>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-600 group-hover:text-sky-400" />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card !p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-[10px] font-black uppercase tracking-widest border border-sky-500/20">
                {q.subject}
              </span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                {q.source || q.year || 'PREVIOUS YEAR'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] leading-relaxed text-pretty">
              {q.question_text}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Options List */}
        <div className="flex flex-col gap-3">
          {q.options.map((opt, i) => {
            const isSelected = answers[q.question_id] === opt;
            return (
              <motion.div 
                key={`${currentIndex}-${i}`}
                whileTap={{ scale: 0.98 }}
                onClick={() => setAnswers({ ...answers, [q.question_id]: opt })}
                className={`group relative overflow-hidden glass-card !p-4 cursor-pointer transition-all border-2 flex items-center gap-4 ${
                  isSelected 
                    ? 'border-sky-500/50 bg-sky-500/10 shadow-[0_0_20px_rgba(14,165,233,0.1)]' 
                    : 'border-white/5 hover:border-white/20'
                }`}
                style={{ minHeight: '64px' }}
              >
                {/* Option Letter/Circle */}
                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                  isSelected ? 'bg-sky-500 text-white shadow-lg' : 'bg-white/5 text-slate-500'
                }`}>
                  {isSelected ? <CheckCircle2 size={20} /> : String.fromCharCode(65 + i)}
                </div>

                <span className={`text-sm font-medium leading-snug ${isSelected ? 'text-sky-400 font-bold' : 'text-[var(--text-primary)]'}`}>
                  {opt}
                </span>

                {/* Selected Glow Effect */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-transparent pointer-events-none" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Controls — fixed bottom bar with safe area inset support */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)] to-transparent pointer-events-none"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="px-6 pt-4 pb-6 max-w-md mx-auto flex gap-4 pointer-events-auto">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 transition-all ${
                currentIndex === 0 
                  ? 'border-white/5 bg-white/5 text-slate-700 opacity-50 cursor-not-allowed' 
                  : 'border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-95'
              }`}
            >
              <ChevronLeft size={24} />
            </button>

            {currentIndex === questions.length - 1 ? (
              <button 
                onClick={() => setStep('summary')}
                className="premium-button flex-1 h-14 rounded-2xl font-black text-white text-sm shadow-xl shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2 group"
              >
                {t.finishReview || 'Finish & Review Summary'} <CheckCircle2 size={18} />
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="premium-button flex-1 h-14 rounded-2xl font-black text-white text-sm shadow-xl shadow-sky-500/20 active:scale-95 flex items-center justify-center gap-2 group"
              >
                {t.nextQuestion || 'Next Question'} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyExam;
