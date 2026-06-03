import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  Star, 
  Trash2, 
  Play, 
  Sparkles, 
  Clock, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import api from '../services/api';
import translations from '../translations';

const RevisionZone = () => {
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  const [activeTab, setActiveTab] = useState('incorrect'); // 'incorrect' | 'bookmarked'
  const [stats, setStats] = useState({
    active_mistakes: 0,
    corrected_mistakes: 0,
    total_bookmarks: 0,
    progress: 0
  });
  const [incorrectList, setIncorrectList] = useState([]);
  const [bookmarkedList, setBookmarkedList] = useState([]);
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [quizSize, setQuizSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, wrongRes, bookmarkedRes] = await Promise.all([
        api.get('/api/revision/stats'),
        api.get('/api/revision/wrong-questions'),
        api.get('/api/revision/bookmarked-questions')
      ]);

      // Check if the server returned HTML index fallback (indicating backend needs to be restarted)
      if (
        (typeof wrongRes.data === 'string' && wrongRes.data.includes('<!DOCTYPE html>')) ||
        (typeof statsRes.data === 'string' && statsRes.data.includes('<!DOCTYPE html>'))
      ) {
        console.error('API returned HTML fallback. Please restart your backend server to load the new Revision routes.');
        showToast('Please restart your backend server!');
        setStats({ active_mistakes: 0, corrected_mistakes: 0, total_bookmarks: 0, progress: 0 });
        setIncorrectList([]);
        setBookmarkedList([]);
        return;
      }

      setStats(statsRes.data || { active_mistakes: 0, corrected_mistakes: 0, total_bookmarks: 0, progress: 0 });
      setIncorrectList(Array.isArray(wrongRes.data) ? wrongRes.data : []);
      setBookmarkedList(Array.isArray(bookmarkedRes.data) ? bookmarkedRes.data : []);
    } catch (err) {
      console.error('Error fetching revision data:', err);
      setIncorrectList([]);
      setBookmarkedList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (qid) => {
    try {
      const res = await api.post('/api/revision/bookmark/toggle', { question_id: qid });
      // Update bookmarked list
      if (res.data.bookmarked === false) {
        setBookmarkedList(prev => prev.filter(q => q.question_id !== qid));
        showToast(t.bookmarkRemoved || 'Bookmark Removed');
      } else {
        // Refresh bookmarked list
        const bookmarkedRes = await api.get('/api/revision/bookmarked-questions');
        setBookmarkedList(bookmarkedRes.data);
        showToast(t.bookmarkAdded || 'Bookmark Added');
      }
      // Update stats
      setStats(prev => ({
        ...prev,
        total_bookmarks: res.data.bookmarksCount
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateRemedial = async () => {
    setGeneratingQuiz(true);
    try {
      const res = await api.post('/api/revision/generate-remedial', { count: quizSize });
      const { exam } = res.data;
      navigate(`/daily-exam`, { state: { remedialExam: res.data } });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate remedial quiz.');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const showToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  };

  // Helper to format date
  const formatDateString = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'HI' ? 'hi-IN' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Circular progress meter properties
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.progress / 100) * circumference;

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-5 max-w-md mx-auto w-full">
      <div className="loader"></div>
      <p className="text-slate-500 font-bold animate-pulse">{t.loadingRevision || "Loading Revision Zone..."}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {message && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] px-4 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white shadow-2xl flex items-center gap-2 text-xs font-bold"
          >
            <Sparkles size={14} className="text-sky-400" />
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <span>←</span> {t.returnDash}
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
          {t.revisionZone}
        </span>
      </div>

      {/* Stats Summary & Circular progress */}
      <div className="glass-card flex items-center justify-between gap-6 !p-6 bg-gradient-to-br from-indigo-500/10 to-transparent relative overflow-hidden">
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] leading-tight">
              {t.revisionZone} 🌟
            </h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
              {t.practiceWeakPoints || "Practice weak points"}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <div className="text-[10px] font-black text-rose-400 uppercase tracking-wider">{t.activeMistakes || "Active Mistakes"}</div>
              <div className="text-2xl font-black text-[var(--text-primary)]">{stats.active_mistakes}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] font-black text-sky-400 uppercase tracking-wider">{t.bookmarks || "Bookmarks"}</div>
              <div className="text-2xl font-black text-[var(--text-primary)]">{stats.total_bookmarks}</div>
            </div>
          </div>
        </div>

        {/* Pulsing circular progress meter */}
        <div className="relative flex items-center justify-center h-28 w-28 shrink-0">
          <svg className="w-full h-full transform -rotate-95">
            {/* Background circle */}
            <circle 
              cx="56" cy="56" r={radius} 
              className="stroke-white/5 fill-none" 
              strokeWidth="8"
            />
            {/* Pulsing glow underlay */}
            <motion.circle 
              cx="56" cy="56" r={radius}
              className="stroke-emerald-500/30 fill-none" 
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            {/* Foreground progress circle */}
            <circle 
              cx="56" cy="56" r={radius} 
              className="stroke-emerald-500 fill-none" 
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          {/* Centered progress percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-emerald-400">{stats.progress}%</span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider">
              {lang === 'HI' ? 'हल' : 'Done'}
            </span>
          </div>
        </div>
      </div>

      {/* Remedial Quiz Generator Panel */}
      {stats.active_mistakes > 0 && (
        <div className="glass-card bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/20 p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-base font-black text-sky-400 flex items-center gap-1.5">
                <Sparkles size={16} />
                {t.remedialGenerator || "Remedial Quiz Generator"}
              </h3>
              <p className="text-slate-400 text-[10px] leading-relaxed max-w-[280px]">
                {t.remedialQuizDesc || "Compile a custom quiz of 10, 20, or 50 questions from only your incorrect questions."}
              </p>
            </div>
            <div className="text-2xl">⚡</div>
          </div>

          <div className="flex gap-2">
            {[10, 20, 50].map(size => {
              const isDisabled = stats.active_mistakes < size && size !== 10;
              return (
                <button
                  key={size}
                  disabled={isDisabled}
                  onClick={() => setQuizSize(size)}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all border ${
                    quizSize === size
                      ? 'border-sky-500 bg-sky-500/10 text-white shadow-lg'
                      : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10 disabled:opacity-20 disabled:cursor-not-allowed'
                  }`}
                >
                  {size} Qs
                </button>
              );
            })}
          </div>

          <button
            disabled={generatingQuiz}
            onClick={handleGenerateRemedial}
            className="w-full h-14 rounded-2xl premium-button font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 disabled:opacity-50"
          >
            {generatingQuiz ? (
              <div className="loader w-5 h-5 border-2 border-t-white/30" />
            ) : (
              <>
                <Play size={16} fill="white" /> {t.generateQuiz || "Generate Quiz"}
              </>
            )}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-950/60 p-1.5 rounded-2xl border border-white/5 relative z-10">
        <button
          onClick={() => setActiveTab('incorrect')}
          className="flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest relative transition-all"
        >
          {activeTab === 'incorrect' && (
            <motion.div 
              layoutId="activeTabPill"
              className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-lg"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className={`relative z-10 flex items-center justify-center gap-1.5 ${
            activeTab === 'incorrect' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}>
            <AlertCircle size={14} className={activeTab === 'incorrect' ? 'text-rose-400' : ''} />
            {t.incorrectQueue ? t.incorrectQueue.split(' ')[0] : 'Incorrect'} ({stats.active_mistakes})
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bookmarked')}
          className="flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest relative transition-all"
        >
          {activeTab === 'bookmarked' && (
            <motion.div 
              layoutId="activeTabPill"
              className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl shadow-lg"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className={`relative z-10 flex items-center justify-center gap-1.5 ${
            activeTab === 'bookmarked' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}>
            <Star size={14} className={activeTab === 'bookmarked' ? 'text-sky-400 fill-sky-400' : ''} />
            {t.bookmarks || 'Bookmarks'} ({stats.total_bookmarks})
          </span>
        </button>
      </div>

      {/* Lists with Framer Motion AnimatePresence */}
      <div className="min-h-[200px]">
        {activeTab === 'incorrect' ? (
          incorrectList.length > 0 ? (
            <div className="flex flex-col gap-3">
              {incorrectList.map(({ question, count, added_at }) => {
                const isExpanded = expandedQuestionId === question.question_id;
                return (
                  <div 
                    key={question.question_id}
                    className="glass-card hover:border-white/10 transition-colors flex flex-col gap-3 overflow-hidden !p-4"
                  >
                    <div 
                      className="flex justify-between items-start gap-4 cursor-pointer"
                      onClick={() => setExpandedQuestionId(isExpanded ? null : question.question_id)}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[8px] font-black uppercase tracking-wider">
                            {question.subject}
                          </span>
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                            {formatDateString(added_at)}
                          </span>
                          <span className="text-[8px] font-black text-rose-400 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">
                            {t.mistakeFrequency ? t.mistakeFrequency.replace('{count}', count) : `Fails: ${count} times`}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)] leading-relaxed line-clamp-2">
                          {question.question_text}
                        </h4>
                      </div>
                      <div className="p-1 rounded-lg bg-white/5 text-slate-500 group-hover:text-white transition-colors mt-0.5 shrink-0">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pt-2 border-t border-white/5 space-y-4 text-left"
                        >
                          <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
                            {question.question_text}
                          </p>

                          <div className="space-y-2">
                            {question.options.map((opt, oIdx) => {
                              const isCorrect = opt === question.correct_answer;
                              return (
                                <div 
                                  key={oIdx}
                                  className={`p-3.5 rounded-xl border text-xs font-semibold leading-normal ${
                                    isCorrect 
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                      : 'bg-white/5 border-white/5 text-slate-400'
                                  }`}
                                >
                                  <span className="font-black uppercase tracking-widest mr-2">
                                    {String.fromCharCode(65 + oIdx)}.
                                  </span>
                                  {opt}
                                </div>
                              );
                            })}
                          </div>

                          {question.explanation && (
                            <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-1">
                              <div className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Explanation 💡</div>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed leading-normal text-pretty">
                                {question.explanation}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleToggleBookmark(question.question_id)}
                              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-sky-500/10 hover:border-sky-500/20 text-slate-400 hover:text-sky-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all"
                            >
                              <Star size={12} />
                              {t.bookmarks || "Bookmark"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card !p-8 text-center text-slate-500 font-bold text-sm border-dashed">
              <div className="text-3xl mb-3">🎉</div>
              {t.noIncorrectQuestions || "No incorrect questions in your queue yet. Keep practicing!"}
            </div>
          )
        ) : (
          bookmarkedList.length > 0 ? (
            <div className="flex flex-col gap-3">
              {bookmarkedList.map((question) => {
                const isExpanded = expandedQuestionId === question.question_id;
                return (
                  <div 
                    key={question.question_id}
                    className="glass-card hover:border-white/10 transition-colors flex flex-col gap-3 overflow-hidden !p-4"
                  >
                    <div 
                      className="flex justify-between items-start gap-4 cursor-pointer"
                      onClick={() => setExpandedQuestionId(isExpanded ? null : question.question_id)}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[8px] font-black uppercase tracking-wider">
                            {question.subject}
                          </span>
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
                            {question.source || question.year || 'PREVIOUS YEAR'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[var(--text-primary)] leading-relaxed line-clamp-2">
                          {question.question_text}
                        </h4>
                      </div>
                      <div className="p-1 rounded-lg bg-white/5 text-slate-500 group-hover:text-white transition-colors mt-0.5 shrink-0">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pt-2 border-t border-white/5 space-y-4 text-left"
                        >
                          <p className="text-sm text-[var(--text-primary)] font-medium leading-relaxed">
                            {question.question_text}
                          </p>

                          <div className="space-y-2">
                            {question.options.map((opt, oIdx) => {
                              const isCorrect = opt === question.correct_answer;
                              return (
                                <div 
                                  key={oIdx}
                                  className={`p-3.5 rounded-xl border text-xs font-semibold leading-normal ${
                                    isCorrect 
                                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                      : 'bg-white/5 border-white/5 text-slate-400'
                                  }`}
                                >
                                  <span className="font-black uppercase tracking-widest mr-2">
                                    {String.fromCharCode(65 + oIdx)}.
                                  </span>
                                  {opt}
                                </div>
                              );
                            })}
                          </div>

                          {question.explanation && (
                            <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-1">
                              <div className="text-[9px] font-black text-sky-400 uppercase tracking-widest">Explanation 💡</div>
                              <p className="text-xs text-slate-400 font-medium leading-relaxed leading-normal text-pretty">
                                {question.explanation}
                              </p>
                            </div>
                          )}

                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleToggleBookmark(question.question_id)}
                              className="px-4 py-2 rounded-xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 text-rose-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-all"
                            >
                              <Trash2 size={12} />
                              {t.removeBookmark || "Remove"}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card !p-8 text-center text-slate-500 font-bold text-sm border-dashed">
              <div className="text-3xl mb-3">⭐</div>
              {t.noBookmarkedQuestions || "No bookmarked questions yet. Star difficult questions during tests!"}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RevisionZone;
