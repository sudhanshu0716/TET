import React, { useState, useEffect } from 'react';
import api from '../services/api';
import translations from '../translations';

const Leaderboard = () => {
  const [tab, setTab] = useState('global'); // 'global' or 'contest'
  const [rankings, setRankings] = useState(() => {
    try {
      const cached = localStorage.getItem(`cached_leaderboard_global`);
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem(`cached_leaderboard_global`);
      return !cached;
    } catch (e) {
      return true;
    }
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  useEffect(() => {
    const fetchRankings = async () => {
      // First, read from cache and set immediately
      try {
        const cached = localStorage.getItem(`cached_leaderboard_${tab}`);
        if (cached) {
          setRankings(JSON.parse(cached));
          setLoading(false);
        } else {
          setLoading(true);
        }
      } catch (e) {
        setLoading(true);
      }

      try {
        const url = tab === 'global' ? '/api/profile/ranking' : '/api/contests/leaderboard';
        const res = await api.get(url, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setRankings(res.data);
        localStorage.setItem(`cached_leaderboard_${tab}`, JSON.stringify(res.data));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchRankings();
  }, [tab]);

  if (loading && rankings.length === 0) return (
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
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${tab === 'global' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-500 hover:text-slate-300'}`}
          >
            {t.globalRank}
          </button>
          <button 
            onClick={() => setTab('contest')}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${tab === 'contest' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}
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
                onClick={() => setSelectedUser({ ...user, rank: index + 1 })}
                className={`
                  glass-card flex items-center gap-5 p-5 transition-all duration-300 cursor-pointer active:scale-[0.99]
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
                    {user.solvedToday !== undefined && user.solvedToday > 0 && (
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

      {/* User Stats Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in text-[var(--text-primary)]">
          <div className="glass-card w-full max-w-sm p-6 relative overflow-hidden space-y-6 border border-white/10 shadow-2xl bg-slate-950/95">
            {/* Glow effect */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />
            <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer text-lg font-bold"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Header Details */}
            <div className="flex flex-col items-center text-center space-y-3 pt-2">
              <div className="relative">
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl shadow-lg border-2
                  ${selectedUser.rank === 1 ? 'bg-gradient-to-br from-amber-300 to-amber-600 text-amber-950 border-amber-400 shadow-amber-500/25' : 
                    selectedUser.rank === 2 ? 'bg-slate-300 text-slate-800 border-slate-200 shadow-slate-300/10' : 
                    selectedUser.rank === 3 ? 'bg-orange-400 text-orange-950 border-orange-300 shadow-orange-500/10' : 
                    'bg-slate-800 text-slate-300 border-slate-700'}
                `}>
                  #{selectedUser.rank}
                </div>
                {selectedUser.last_active && (new Date() - new Date(selectedUser.last_active) < 15 * 60 * 1000) && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#090d16] animate-pulse" />
                )}
              </div>

              <div>
                <h3 className="text-xl font-black text-[var(--text-primary)] flex items-center justify-center gap-1.5">
                  {selectedUser.name}
                  {selectedUser.rank === 1 && <span>👑</span>}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                  {selectedUser.rank === 1 ? 'Champion' : selectedUser.rank === 2 ? 'Runner Up' : selectedUser.rank === 3 ? 'Third Place' : 'Contender'}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Target Exam</div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block ${selectedUser.level === 'primary' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-purple-500/15 text-purple-400 border border-purple-500/25'}`}>
                  {selectedUser.level === 'primary' ? 'Primary' : 'Junior'}
                </span>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Activity</div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block ${
                  selectedUser.last_active && (new Date() - new Date(selectedUser.last_active) < 15 * 60 * 1000)
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' 
                    : 'bg-slate-500/15 text-slate-400 border border-slate-500/25'
                }`}>
                  {selectedUser.last_active && (new Date() - new Date(selectedUser.last_active) < 15 * 60 * 1000) ? 'Online' : 'Offline'}
                </span>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 col-span-2 flex justify-between items-center px-5">
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Solved Today</div>
                  <div className="text-[10px] font-black text-sky-400 mt-0.5">Daily Practice</div>
                </div>
                <div className="text-2xl font-black text-white">
                  +{selectedUser.solvedToday || 0}
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-4 col-span-2 flex justify-between items-center px-5">
                <div className="text-left">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {tab === 'global' ? 'Rank Points' : 'Contest Score'}
                  </div>
                  <div className="text-[10px] font-black text-amber-400 mt-0.5">
                    {tab === 'global' ? 'Overall Points' : 'Points Scored'}
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-400">
                  {tab === 'global' ? selectedUser.rank_points : selectedUser.score}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={() => setSelectedUser(null)}
              className="w-full py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-500/10 transition-all active:scale-[0.98] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
