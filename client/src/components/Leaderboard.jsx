import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await api.get('/api/profile/ranking');
        setRankings(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRankings();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold animate-pulse">Loading Rankings...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pt-8 px-6 pb-24 max-w-md mx-auto w-full animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Top <span className="text-sky-400">Performers</span></h2>
        <p className="text-[var(--text-secondary)] font-medium text-sm">Compete with the best and rise to the top</p>
      </div>
      
      <div className="flex flex-col gap-3">
        {rankings.map((user, index) => (
          <div 
            key={index} 
            className={`
              glass-card flex items-center gap-5 p-5 transition-all duration-300
              ${index === 0 ? 'border-sky-500/30 bg-sky-500/5 ring-1 ring-sky-500/20' : 'hover:bg-white/5'}
            `}
          >
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shadow-inner
              ${index === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-600 text-amber-950 scale-110 shadow-amber-500/40' : 
                index === 1 ? 'bg-slate-300 text-slate-800' : 
                index === 2 ? 'bg-orange-400 text-orange-950' : 
                'bg-slate-800 text-slate-400'}
            `}>
              {index + 1}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-black text-[var(--text-primary)] truncate">{user.name}</h4>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                {user.questions_solved} Solved
              </p>
            </div>

            <div className="text-right">
              <div className="text-lg font-black text-sky-400 leading-none">{user.rank_points}</div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Points</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
