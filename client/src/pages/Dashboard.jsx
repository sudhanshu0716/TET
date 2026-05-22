import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import translations from '../translations';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user: authUser, setUser: setAuthUser } = useAuth();
  const [user, setUser] = useState(authUser || (() => {
    try {
      const cached = localStorage.getItem('user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  }));
  const [error, setError] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_dashboard_history');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [todaySolved, setTodaySolved] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_dashboard_todaySolved');
      return cached ? parseInt(cached, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });
  const [activeCount, setActiveCount] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_dashboard_activeCount');
      return cached ? parseInt(cached, 10) || 0 : 0;
    } catch (e) {
      return 0;
    }
  });
  const [contestStatus, setContestStatus] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_dashboard_contestStatus');
      return cached ? JSON.parse(cached) : { status: 'upcoming', registered: false };
    } catch (e) {
      return { status: 'upcoming', registered: false };
    }
  });
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [profileRes, contestRes, historyRes, activeRes] = await Promise.all([
          api.get('/api/profile', { headers: { 'x-auth-token': token } }),
          api.get('/api/contests/status', { headers: { 'x-auth-token': token } }).catch(e => { console.error(e); return { data: null }; }),
          api.get('/api/exams/history', { headers: { 'x-auth-token': token } }).catch(e => { console.error(e); return { data: [] }; }),
          api.get('/api/profile/active-count').catch(e => { console.error(e); return { data: { count: 0 } }; })
        ]);

        if (profileRes.data) {
          setUser(profileRes.data);
          setAuthUser(profileRes.data);
          localStorage.setItem('user', JSON.stringify(profileRes.data));
        }

        if (contestRes.data) {
          setContestStatus(contestRes.data);
          localStorage.setItem('cached_dashboard_contestStatus', JSON.stringify(contestRes.data));
        }

        if (historyRes.data) {
          setHistory(historyRes.data);
          localStorage.setItem('cached_dashboard_history', JSON.stringify(historyRes.data));
          
          // Calculate today's solved questions
          const today = new Date().toLocaleDateString();
          const count = historyRes.data
            .filter(ex => new Date(ex.date).toLocaleDateString() === today)
            .reduce((sum, ex) => sum + (ex.answers?.length || 0), 0);
          setTodaySolved(count);
          localStorage.setItem('cached_dashboard_todaySolved', count.toString());
        }

        if (activeRes.data) {
          setActiveCount(activeRes.data.count);
          localStorage.setItem('cached_dashboard_activeCount', activeRes.data.count.toString());
        }
      } catch (err) {
        console.error(err);
        setError(true);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchDashboardData();
  }, [navigate, setAuthUser]);


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


  return (
    <div className="flex flex-col gap-6 px-5 pt-4 pb-32 max-w-md mx-auto w-full animate-fade-in">
      {/* Global System Message */}
      {user?.system_message && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-center animate-fade-in">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500">
            <span className="text-sm">✨</span>
          </div>
          <p className="text-xs font-bold text-amber-400 leading-relaxed">
            {user.system_message}
          </p>
        </div>
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

      {/* Super Tricks Hub Banner */}
      <div 
        onClick={() => navigate('/super-tricks')}
        className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white shadow-xl shadow-purple-500/20 border border-white/10 flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all group"
      >
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full text-white">
              {lang === 'HI' ? 'नया फीचर' : 'New Feature'}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/30 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Premium
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight mt-1 flex items-center gap-1.5">
            {t.dashboardBannerTitle || "🔥 Super Tricks Hub"}
          </h3>
          <p className="text-xs text-white/95 font-semibold max-w-[280px] leading-relaxed">
            {t.dashboardBannerDesc || "Learn 10x faster with mnemonics, formulas & audio read-aloud!"}
          </p>
        </div>
        <div className="text-4xl relative z-10 animate-pulse group-hover:scale-110 transition-transform duration-300">
          ✨
        </div>
        {/* Subtle glassmorphic overlay */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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


      {/* Recent Exams History */}
      <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 mt-4 ml-1">Recent Activity</h4>
      <div className="max-h-[320px] overflow-y-auto pr-1 flex flex-col gap-3">
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
    </div>
  );
};

export default Dashboard;
