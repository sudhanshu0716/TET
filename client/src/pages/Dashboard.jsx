import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import translations from '../translations';
import TopicInsights from '../components/TopicInsights';
import PerformanceRadar from '../components/PerformanceRadar';

import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const [user, setUser] = useState(authUser || null);
  const [error, setError] = useState(false);
  const [history, setHistory] = useState([]);
  const [todaySolved, setTodaySolved] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [contestStatus, setContestStatus] = useState({ status: 'upcoming', registered: false });
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/profile', {
          headers: { 'x-auth-token': token }
        });
        if (res.data) {
          setUser(res.data);
          setAuthUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }

        // Access Check
        
      } catch (err) {
        console.error(err);
        setError(true);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/contests/status', { headers: { 'x-auth-token': token } });
        setContestStatus(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStatus();
  }, []);
  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/exams/history', { headers: { 'x-auth-token': token } });
        setHistory(res.data);
        
        // Calculate today's solved questions
        const today = new Date().toLocaleDateString();
        const count = res.data
          .filter(ex => new Date(ex.date).toLocaleDateString() === today)
          .reduce((sum, ex) => sum + (ex.answers?.length || 0), 0);
        setTodaySolved(count);
      } catch (err) { console.error(err); }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchActiveCount = async () => {
      try {
        const res = await api.get('/api/profile/active-count');
        setActiveCount(res.data.count);
      } catch (err) { console.error(err); }
    };
    fetchActiveCount();
  }, []);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/contests/register', {}, { headers: { 'x-auth-token': token } });
      setContestStatus({ ...contestStatus, registered: true });
      alert('Registered successfully! Join at 8:30 PM.');
    } catch (err) { alert(err.response?.data?.message || 'Registration failed'); }
  };

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-5 max-w-md mx-auto w-full">
      <div className="text-4xl">📡</div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-[var(--text-primary)]">Connection Issue</h3>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Unable to reach the server</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-8 py-4 rounded-2xl bg-sky-500 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
      >
        Retry Connection
      </button>
    </div>
  );

  if (!user && !error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-5 max-w-md mx-auto w-full">
      <div className="loader"></div>
      <p className="text-slate-500 font-bold animate-pulse">{t.preparing}</p>
    </div>
  );

  const subjects = [
    { name: 'Pedagogy', id: 'pedagogy', icon: '🧠' },
    { name: 'Hindi', id: 'hindi', icon: '📖' },
    { name: 'English', id: 'english', icon: '🔤' },
    { name: 'Math', id: 'math', icon: '➗' },
    { name: 'EVS', id: 'evs', icon: '🌱' },
    { name: 'Science', id: 'science', icon: '🔬' },
    { name: 'Social', id: 'social', icon: '⚖️' },
    { name: 'Sanskrit', id: 'sanskrit', icon: '🕉️' },
    { name: 'Urdu', id: 'urdu', icon: '🖋️' }
  ];

  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-32 max-w-md mx-auto w-full animate-fade-in">
      {/* Global System Message */}
      {user?.system_message && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-center"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
            <Sparkles size={16} />
          </div>
          <p className="text-xs font-bold text-amber-400 leading-relaxed">
            {user.system_message}
          </p>
        </motion.div>
      )}

      {/* Top Info Bar */}
      <div id="tut-stats" className="flex justify-between items-center px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">🔥</span>
            <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-wider">{user?.streak || 0} {t.streak}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-wider">{activeCount || '...'} {lang === 'HI' ? 'ऑनलाइन' : 'Online'}</span>
          </div>
        </div>
        
        {user.is_premium || (user.subscription_end_date && new Date(user.subscription_end_date) > new Date()) ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <div className="w-1 h-1 rounded-full bg-amber-500"></div>
            <span className="text-[8px] font-black text-amber-500 uppercase">{t.premium}</span>
          </div>
        ) : new Date(user.trial_end_date) > new Date() ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
            <div className="w-1 h-1 rounded-full bg-sky-500"></div>
            <span className="text-[8px] font-black text-sky-400 uppercase">{t.trial}</span>
          </div>
        ) : null}
      </div>

      <header className="space-y-1">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
              {t.hello}, <span className="text-sky-400">{user?.name?.split(' ')[0] || 'User'}</span>! 👋
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t.readyChallenge}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Daily Progress Goal */}
      <div id="tut-daily" className="glass-card !py-4 space-y-3 bg-gradient-to-r from-emerald-500/10 to-transparent border-l-4 border-l-emerald-500">
        <div className="flex justify-between items-center">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Today's Goal</h5>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{todaySolved}/25 Qs</span>
        </div>
        <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000"
            style={{ width: `${Math.min((todaySolved/25)*100, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 font-medium italic">
          {todaySolved >= 25 ? "Amazing! Goal reached. Keep it up! 🏆" : `Solve ${Math.max(0, 25 - todaySolved)} more to hit your daily goal!`}
        </p>
      </div>
      
      {/* Daily Live Contest Card */}
      <div id="tut-contest" className={`glass-card relative overflow-hidden ${contestStatus.status === 'live' ? 'ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${contestStatus.status === 'live' ? 'text-emerald-600 dark:text-emerald-400' : 'text-sky-600 dark:text-sky-400'}`}>
              {contestStatus.status === 'live' ? t.liveContest : t.upcomingContest}
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">{t.contestTitle}</h3>
            {contestStatus.registrationCount > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(3, contestStatus.registrationCount))].map((_, i) => (
                    <div key={i} className="w-5 h-5 rounded-full bg-slate-800 border-2 border-[var(--bg-card)] flex items-center justify-center text-[8px] font-black">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {contestStatus.registrationCount} {lang === 'HI' ? 'छात्र पंजीकृत' : 'Students Registered'}
                </span>
              </div>
            )}
          </div>
          <div className="text-3xl">🏆</div>
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {contestStatus.status === 'live' ? t.contestDescLive : t.contestDescUpcoming}
        </p>

        <div className="flex gap-3">
          {contestStatus.status === 'live' ? (
            contestStatus.attempted ? (
              <div className="flex-1 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-black text-center">
                Attempted 🏁
              </div>
            ) : (
              <button className="premium-button flex-1 py-4 rounded-2xl font-bold text-[var(--text-primary)] text-sm" onClick={() => navigate('/contest-live')}>
                {t.joinNow}
              </button>
            )
          ) : contestStatus.status === 'ended' ? (
            <button className="premium-button flex-1 py-4 rounded-2xl font-bold text-[var(--text-primary)] text-sm" onClick={() => navigate('/contest-leaderboard')}>
              {t.viewLeaderboard}
            </button>
          ) : (
            <>
              {contestStatus.registered ? (
                <button 
                  className="flex-1 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-black text-center active:scale-95 transition-all"
                  onClick={() => navigate('/contest-live')}
                >
                  Enter Waiting Room 🛋️
                </button>
              ) : (
                <button className="premium-button flex-1 py-4 rounded-2xl font-bold text-[var(--text-primary)] text-sm" onClick={handleRegister}>
                  {t.registerToday}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Daily Tip */}
      <div className="glass-card relative overflow-hidden border-l-4 border-l-sky-500 !py-5 bg-gradient-to-r from-sky-500/10 to-transparent">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 mb-2 flex items-center gap-2">
          <span>💡</span> {t.tipTitle}
        </h5>
        <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">"{t.tipBody}"</p>
      </div>

      {/* Performance Predictor */}
      <div className="glass-card bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">Exam Score Predictor 📈</h4>
        <div className="flex items-end gap-4">
          <div className="text-5xl font-black text-[var(--text-primary)] leading-none">
            {Math.round((user?.avgScore || 0) * 1.5)}
            <span className="text-lg text-slate-500 font-bold ml-1">/150</span>
          </div>
          <div className="pb-1">
            <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${user?.avgScore > 60 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
              {user?.avgScore > 60 ? 'Trending Up ↑' : 'Steady ⚡'}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-medium mt-3 leading-relaxed">
          Based on your last {user?.examsTaken || 0} exams, this is your estimated score for the real TET exam. 
          <span className="text-indigo-400 font-bold"> Keep practicing to reach 125+!</span>
        </p>
      </div>

      {/* Performance Summary */}
      <div className="glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">{t.perf}</h4>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="space-y-1">
            <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">{user.avgScore || 0}%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.accuracy}</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 to-teal-400">{user.examsTaken || 0}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.examsDone}</div>
          </div>
        </div>
        <div className="progress-bar-container mt-6 relative z-10">
          <div className="progress-bar-fill shadow-lg shadow-sky-500/30 bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: `${user.avgScore || 0}%` }}></div>
        </div>
      </div>

      {/* Main Action: Daily Exam */}
      <div className="glass-card bg-gradient-to-br from-sky-600 to-indigo-900 relative overflow-hidden group">
        <div className="relative z-10">
          <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2">{t.dailyChallenge}</h3>
          <p className="text-sm text-[var(--text-primary)]/80 mb-6 font-medium leading-snug">
            {t.dailyDesc} <br/>
            <span className="text-[10px] uppercase tracking-widest bg-white/10 px-2 py-1 rounded mt-2 inline-block">
              {user.level} | {user.language1} | {user.language2}
            </span>
          </p>
          <button 
            className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm transition-all hover:bg-slate-50 active:scale-[0.98] shadow-xl shadow-black/20" 
            onClick={() => navigate('/daily-exam')}
          >
            {t.startNow}
          </button>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 group-hover:scale-110 transition-transform duration-500">🔥</div>
      </div>

      {/* Secondary Actions */}
      <div id="tut-modes">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 mt-4 ml-1">{t.practiceModes}</h4>
        <div className="grid grid-cols-2 gap-4">
        <div className="glass-card cursor-pointer active:scale-95 transition-all" onClick={() => navigate('/full-mock')}>
          <div className="text-3xl mb-3">🏆</div>
          <h5 className="text-sm font-bold text-[var(--text-primary)] mb-1">{t.fullMock}</h5>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">150 Qs | 150 Mins</div>
        </div>
        <div className="glass-card cursor-pointer active:scale-95 transition-all" onClick={() => navigate('/important')}>
          <div className="text-3xl mb-3">⭐</div>
          <h5 className="text-sm font-bold text-[var(--text-primary)] mb-1">{t.important}</h5>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{t.repeated}</div>
        </div>
        <div className="glass-card cursor-pointer active:scale-95 transition-all bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20" onClick={() => navigate('/flashcards')}>
          <div className="text-3xl mb-3">🎴</div>
          <h5 className="text-sm font-bold text-[var(--text-primary)] mb-1">Flashcards</h5>
          <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Quick Revision</div>
        </div>
      </div>
    </div>

      {/* Subject-wise MCQ Menu */}
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 mt-4 ml-1">{t.subjectWise}</h4>
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

      {/* Performance Analysis Group */}
      <div className="space-y-6 pt-4">
        <div id="tut-radar">
          <PerformanceRadar />
        </div>
        <TopicInsights />
      </div>

      {/* Recent Exams History */}
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 mt-4 ml-1">Recent Activity</h4>
      <div className="flex flex-col gap-3">
        {history.length > 0 ? history.map(ex => (
          <div 
            key={ex.exam_id} 
            className="glass-card !p-4 flex items-center justify-between cursor-pointer hover:border-sky-500/30 transition-all"
            onClick={() => navigate(`/exam-result/${ex.exam_id}`)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                {ex.exam_type === 'full-mock' ? '🏆' : ex.exam_type === 'contest' ? '🏁' : '📝'}
              </div>
              <div>
                <h5 className="text-sm font-bold text-[var(--text-primary)] capitalize">{ex.exam_type.replace('-', ' ')}</h5>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{new Date(ex.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-sky-400">{ex.score} Qs</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Score</div>
            </div>
          </div>
        )) : (
          <div className="glass-card !p-8 text-center text-slate-500 font-bold text-sm border-dashed">
            No exams taken yet. Start your first challenge!
          </div>
        )}
      </div>

      {/* Stats Quick View */}
      <div className="glass-card border-dashed border-slate-800 bg-transparent flex justify-between items-center mt-4">
        <div>
          <h5 className="text-sm font-bold text-[var(--text-primary)]">{t.ranking}</h5>
          <p className="text-[10px] text-slate-500 font-medium">{t.top10}</p>
        </div>
        <Link to="/leaderboard" className="text-xs font-black text-sky-400 uppercase tracking-widest hover:text-sky-300 transition-colors">
          {t.viewAll}
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
