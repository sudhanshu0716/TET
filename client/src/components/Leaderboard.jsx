import React, { useState, useEffect } from 'react';
import api from '../services/api';
import translations from '../translations';

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('global'); // 'global' or 'contest'

  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  useEffect(() => {
    const fetchRankings = async () => {
      setLoading(true);
      try {
        const url = tab === 'global' ? '/api/profile/ranking' : '/api/contests/leaderboard';
        const res = await api.get(url, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setRankings(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchRankings();
  }, [tab]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">{t.loadingStats || 'Loading Rankings...'}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pt-8 px-6 pb-24 max-w-md mx-auto w-full animate-fade-in">
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
            {t.topPerformers.split(' ')[0]} <span className="text-sky-400">{t.topPerformers.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-[var(--text-secondary)] font-medium text-sm">{t.leaderboardDesc}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setTab('global')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${tab === 'global' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.globalRank}
          </button>
          <button 
            onClick={() => setTab('contest')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${tab === 'contest' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.todayContest}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {rankings.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-bold">{t.noRankings}</div>
        ) : (
          rankings.map((user, index) => {
            const isOnline = user.last_active && (new Date() - new Date(user.last_active) < 15 * 60 * 1000);

            return (
              <div 
                key={index} 
                className={`
                  glass-card flex items-center gap-5 p-5 transition-all duration-300
                  ${index === 0 ? 'border-sky-500/30 bg-sky-500/5 ring-1 ring-sky-500/20' : 'hover:bg-white/5'}
                `}
              >
                <div className="relative shrink-0">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-inner
                    ${index === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-600 text-amber-950 scale-110 shadow-amber-500/40' : 
                      index === 1 ? 'bg-slate-300 text-slate-800' : 
                      index === 2 ? 'bg-orange-400 text-orange-950' : 
                      'bg-slate-800 text-slate-400'}
                  `}>
                    {index + 1}
                  </div>
                  {isOnline && (
                    <span 
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--bg-primary)] animate-pulse" 
                      title={t.online}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-black text-[var(--text-primary)] truncate flex items-center gap-1.5">
                      {user.name}
                      {index === 0 && <span className="text-amber-400 animate-bounce" style={{ animationDuration: '3s' }} title="Champion">👑</span>}
                      {index === 1 && <span className="text-slate-400" title="2nd Place">🥈</span>}
                      {index === 2 && <span className="text-amber-600" title="3rd Place">🥉</span>}
                    </h4>
                    {user.level && (
                      <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${user.level === 'primary' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                        {user.level}
                      </span>
                    )}
                    {user.solvedToday !== undefined && (
                      <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded px-1.5 py-0.5 text-[8px] font-black" title="Solved Today">
                        +{user.solvedToday}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5">
                    <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      {tab === 'global' ? `${user.questions_solved || 0} ${t.solved}` : t.completedToday}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-black leading-none ${tab === 'global' ? 'text-sky-400' : 'text-amber-400'}`}>
                    {tab === 'global' ? user.rank_points : user.score}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {tab === 'global' ? t.points : t.score}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
