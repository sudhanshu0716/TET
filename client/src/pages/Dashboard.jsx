import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import translations from '../translations';
import TopicInsights from '../components/TopicInsights';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [contestStatus, setContestStatus] = useState({ status: 'upcoming', registered: false });
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/profile', {
          headers: { 'x-auth-token': token }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
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
      } catch (err) { console.error(err); }
    };
    fetchHistory();
  }, []);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/contests/register', {}, { headers: { 'x-auth-token': token } });
      setContestStatus({ ...contestStatus, registered: true });
      alert('Registered successfully! Join at 8:30 PM.');
    } catch (err) { alert(err.response?.data?.message || 'Registration failed'); }
  };

  if (!user) return (
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
    <div className="flex flex-col gap-6 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <header className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight break-words leading-tight">{t.hello}, {user.name.split(' ')[0]}! 👋</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">{t.readyChallenge}</p>
        </div>
      </header>

      {/* Next Exam Countdown */}
      <div className="glass-card !py-4 flex items-center justify-between bg-gradient-to-r from-rose-500/10 to-transparent border-l-4 border-l-rose-500">
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-rose-400">Next Big Exam</h5>
          <p className="text-sm font-bold text-[var(--text-primary)]">CTET July 2026</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-rose-400">45 Days</div>
          <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Left to prepare</div>
        </div>
      </div>

      {/* Daily Live Contest Card */}
      <div className={`glass-card relative overflow-hidden ${contestStatus.status === 'live' ? 'ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/20' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${contestStatus.status === 'live' ? 'text-emerald-400' : 'text-sky-400'}`}>
              {contestStatus.status === 'live' ? t.liveContest : t.upcomingContest}
            </span>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">{t.contestTitle}</h3>
          </div>
          <div className="text-3xl">🏆</div>
        </div>
        
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          {contestStatus.status === 'live' ? t.contestDescLive : t.contestDescUpcoming}
        </p>

        <div className="flex gap-3">
          {contestStatus.status === 'live' ? (
            <button className="premium-button flex-1 py-4 rounded-2xl font-bold text-[var(--text-primary)] text-sm" onClick={() => navigate('/contest-live')}>
              {t.joinNow}
            </button>
          ) : contestStatus.status === 'ended' ? (
            <button className="premium-button flex-1 py-4 rounded-2xl font-bold text-[var(--text-primary)] text-sm" onClick={() => navigate('/contest-leaderboard')}>
              {t.viewLeaderboard}
            </button>
          ) : (
            <>
              {contestStatus.registered ? (
                <div className="flex-1 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black text-center">
                  {t.registered}
                </div>
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
        <h5 className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-2 flex items-center gap-2">
          <span>💡</span> {t.tipTitle}
        </h5>
        <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">"{t.tipBody}"</p>
      </div>

      <TopicInsights />

      {/* Performance Summary */}
      <div className="glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-5">{t.perf}</h4>
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
