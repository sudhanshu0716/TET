import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import translations from '../translations';
import TopicInsights from '../components/TopicInsights';
import PerformanceRadar from '../components/PerformanceRadar';
import SubtopicWeaknesses from '../components/SubtopicWeaknesses';
import { useAuth } from '../context/AuthContext';
import { ProgressSkeleton } from '../components/SkeletonLoader';

const Progress = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser || (() => {
    try {
      const cached = localStorage.getItem('user');
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  }));
  const [insights, setInsights] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_progress_insights');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [subtopicInsights, setSubtopicInsights] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_subtopic_insights');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [loadingProfile, setLoadingProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('user');
      return !authUser && !cached;
    } catch (e) {
      return true;
    }
  });
  const [loadingInsights, setLoadingInsights] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_progress_insights');
      return !cached;
    } catch (e) {
      return true;
    }
  });
  const [loadingSubtopic, setLoadingSubtopic] = useState(() => {
    try {
      const cached = localStorage.getItem('cached_subtopic_insights');
      return !cached;
    } catch (e) {
      return true;
    }
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const profilePromise = api.get('/api/profile', { headers: { 'x-auth-token': token } })
          .then(res => {
            if (res.data) {
              setUser(res.data);
              localStorage.setItem('user', JSON.stringify(res.data));
            }
          })
          .catch(err => {
            console.error("Profile fetch error:", err);
            if (err.response?.status === 401) {
              localStorage.removeItem('token');
              navigate('/login');
            }
          })
          .finally(() => setLoadingProfile(false));

        const insightsPromise = api.get('/api/exams/insights', { headers: { 'x-auth-token': token } })
          .then(res => {
            if (res.data) {
              setInsights(res.data);
              localStorage.setItem('cached_progress_insights', JSON.stringify(res.data));
            }
          })
          .catch(err => {
            console.error("Insights fetch error:", err);
          })
          .finally(() => setLoadingInsights(false));

        const subtopicPromise = api.get('/api/exams/subtopic-insights', { headers: { 'x-auth-token': token } })
          .then(res => {
            if (res.data) {
              setSubtopicInsights(res.data);
              localStorage.setItem('cached_subtopic_insights', JSON.stringify(res.data));
            }
          })
          .catch(err => {
            console.error("Subtopic insights fetch error:", err);
          })
          .finally(() => setLoadingSubtopic(false));

        await Promise.all([profilePromise, insightsPromise, subtopicPromise]);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };
    fetchData();
  }, [navigate]);

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-5 max-w-md mx-auto w-full animate-fade-in">
      <div className="text-4xl">📡</div>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-[var(--text-primary)]">{t.connectionIssue}</h3>
        <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">{t.unableReachServer}</p>
      </div>
      <button 
        onClick={() => window.location.reload()}
        className="px-8 py-4 rounded-2xl bg-sky-500 text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
      >
        {t.retryConnection}
      </button>
    </div>
  );

  if (loadingProfile && !user) return <ProgressSkeleton />;

  return (
    <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <header className="space-y-1">
        <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
          {t.progressAnalysis.split(' ')[0]} <span className="text-sky-400">{t.progressAnalysis.split(' ').slice(1).join(' ')}</span> 📈
        </h1>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">{t.progressDesc}</p>
      </header>

      {/* Performance Predictor */}
      <div className="glass-card bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">{t.scorePredictor} 📈</h4>
        <div className="flex items-end gap-4">
          <div className="text-5xl font-black text-[var(--text-primary)] leading-none">
            {Math.round((user?.avgScore || 0) * 1.5)}
            <span className="text-lg text-slate-500 font-bold ml-1">/150</span>
          </div>
          <div className="pb-1">
            <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${user?.avgScore > 60 ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
              {user?.avgScore > 60 ? `↑ ${t.trendingUp}` : `⚡ ${t.steady}`}
            </div>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 font-medium mt-3 leading-relaxed">
          {t.predictorDesc.replace('{count}', user?.examsTaken || 0)}
        </p>
      </div>

      {/* Performance Summary */}
      <div className="glass-card relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-5">{t.perf}</h4>
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="space-y-1">
            <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">{user?.avgScore || 0}%</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.accuracy}</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-l from-emerald-400 to-teal-400">{user?.examsTaken || 0}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.examsDone}</div>
          </div>
        </div>
        <div className="progress-bar-container mt-6 relative z-10">
          <div className="progress-bar-fill shadow-lg shadow-sky-500/30 bg-gradient-to-r from-sky-500 to-indigo-500" style={{ width: `${user?.avgScore || 0}%` }}></div>
        </div>
      </div>

      {/* Performance Analysis Group */}
      <div className="space-y-6 pt-2">
        <div id="tut-radar">
          <PerformanceRadar insights={insights} loading={loadingInsights} />
        </div>
        <TopicInsights insights={insights} loading={loadingInsights} />
        
        {/* Subtopic level Weakness Analysis & Recommendations */}
        <SubtopicWeaknesses insights={subtopicInsights} loading={loadingSubtopic} />
      </div>
    </div>
  );
};

export default Progress;
