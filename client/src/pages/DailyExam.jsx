import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import translations from '../translations';

const DailyExam = ({ type }) => {
  const { subject } = useParams();
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
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang];
  const [loadingText, setLoadingText] = useState(t.preparing || 'Preparing your questions...');

  useEffect(() => {
    const saved = localStorage.getItem('offline_exam');
    if (saved) setOfflineExam(JSON.parse(saved));
  }, []);

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

  const startExam = async () => {
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
      let url = `/api/exams/today?count=${config.qCount}&duration=${config.timeLimit}`;
      if (type === 'full-mock') url = '/api/exams/full-mock';
      if (type === 'subject') url = `/api/exams/subject/${subject}?count=${config.qCount}&duration=${config.timeLimit}`;
      if (type === 'important') url = '/api/exams/important';
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
      alert(err.response?.data?.message || 'Error starting exam');
      navigate('/dashboard');
    }
  };

  // Auto-start for specific exam types
  useEffect(() => {
    if (step === 'config') {
      if (type === 'contest') {
        setConfig({ qCount: 20, timeLimit: 30 });
        startExam();
      } else if (type === 'full-mock') {
        setConfig({ qCount: 150, timeLimit: 150 });
        startExam();
      } else if (type === 'important') {
        setConfig({ qCount: 30, timeLimit: 30 });
        startExam();
      }
    }
  }, [type]);

  // Prevent accidental exit
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

  const handleSubmit = async () => {
    setSubmitting(true);
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

  // CONFIG SCREEN
  if (step === 'config') return (
    <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <div className="glass-card space-y-6">
        <h2 className="text-2xl font-black text-[var(--text-primary)]">{t.setupExam} ⚙️</h2>
        
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">{t.questions}</label>
          <div className="flex gap-3">
            {[10, 20, 30].map(n => (
              <button 
                key={n} 
                className={`flex-1 py-4 rounded-2xl text-sm font-black transition-all border-2 ${
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
    <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in">
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

  // LOADING
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
        
        <h2 className="text-3xl font-black text-[var(--text-primary)] mb-2 relative z-10">🎊 {t.brilliant}</h2>
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
    <div className="flex items-center justify-center min-h-[60vh] text-slate-500 font-bold px-5 max-w-md mx-auto">
      No questions found.
    </div>
  );

  const q = questions[currentIndex];

  // EXAM SCREEN
  return (
    <div className="flex flex-col gap-5 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      {/* Exit & Mode Header */}
      <div className="flex justify-between items-center px-1">
        <button 
          onClick={() => {
            if (window.confirm(t.confirmExit || "Quit exam? Your progress will be lost.")) {
              navigate('/dashboard');
            }
          }}
          className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] bg-rose-500/5 dark:bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center gap-2"
        >
          <span>✕</span> {t.exitExam || 'Exit Exam'}
        </button>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] opacity-60">
          {type === 'daily' ? 'Daily' : type === 'full-mock' ? 'Mock' : type === 'subject' ? subject : 'Contest'} Mode
        </span>
      </div>

      {/* Header Bar */}
      <div className="flex justify-between items-center gap-3">
        <div className="glass-card !py-2.5 !px-5 !rounded-full border-white/10 bg-white/5 flex-1 shadow-sm flex items-center justify-between group cursor-pointer" onClick={() => setStep('summary')}>
          <div>
            <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-0.5">Progress</span>
            <span className="text-sm font-black text-[var(--text-primary)]">Q {currentIndex + 1} / {questions.length}</span>
          </div>
          <span className="text-lg group-hover:scale-125 transition-transform">📋</span>
        </div>
        <div className={`glass-card !py-2.5 !px-5 !rounded-full border-sky-500/20 bg-sky-500/5 flex-1 shadow-sm transition-colors ${timeLeft < 300 ? '!border-rose-500/30 !bg-rose-500/5' : ''}`}>
          <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block mb-0.5">Time Left</span>
          <div className={`text-sm font-black flex items-center gap-1.5 ${timeLeft < 300 ? 'text-rose-400' : 'text-sky-400'}`}>
            <span>⏱️</span>
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="glass-card space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">{q.subject}</span>
          <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{q.year || 'PREVIOUS YEAR'}</span>
        </div>
        <h3 className="text-base font-bold text-[var(--text-primary)] leading-relaxed">{q.question_text}</h3>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {q.options.map((opt, i) => (
          <div 
            key={i} 
            className={`glass-card !py-4 !px-5 cursor-pointer active:scale-[0.98] transition-all flex items-start gap-3 ${
              answers[q.question_id] === opt 
                ? 'border-2 !border-sky-500/50 bg-sky-500/10' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => setAnswers({ ...answers, [q.question_id]: opt })}
          >
            <span className="text-[var(--text-secondary)] font-bold shrink-0">{String.fromCharCode(65 + i)}.</span>
            <span className="text-sm text-[var(--text-primary)] font-medium">{opt}</span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-6">
        <button 
          className={`flex-1 py-4 rounded-2xl font-black text-sm transition-all border-2 ${
            currentIndex === 0 
              ? 'border-white/5 bg-white/5 text-slate-600 opacity-50 cursor-not-allowed' 
              : 'border-white/10 bg-white/5 text-[var(--text-secondary)] hover:bg-white/10 active:scale-95'
          }`}
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
        >
          Previous
        </button>
        {currentIndex === questions.length - 1 ? (
          <button 
            className="flex-[1.5] py-4 rounded-2xl bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={() => setStep('summary')}
          >
            Review Summary 📋
          </button>
        ) : (
          <button 
            className="premium-button flex-[1.5] py-4 rounded-2xl font-black text-white text-sm shadow-xl shadow-sky-500/20 active:scale-95"
            onClick={() => setCurrentIndex(prev => prev + 1)}
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyExam;
