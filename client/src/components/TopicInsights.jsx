import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TopicInsights = ({ insights: propInsights, loading }) => {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (propInsights) {
      setInsights(propInsights);
    }
  }, [propInsights]);

  if (loading) return (
    <div className="glass-card animate-pulse h-48 flex items-center justify-center">
      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Analyzing Strengths...</span>
    </div>
  );

  if (!insights || insights.length === 0) return null;

  return (
    <div className="glass-card !p-5 space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Topic Insights 🎯</h4>
      
      <div className="space-y-4">
        {insights.map((item, i) => {
          const accuracy = Math.round((item.correct / item.total) * 100);
          return (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight">{item._id}</span>
                <span className={`text-[10px] font-black ${accuracy > 70 ? 'text-emerald-600 dark:text-emerald-400' : accuracy > 40 ? 'text-sky-600 dark:text-sky-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {accuracy}% Accuracy
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    accuracy > 70 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 
                    accuracy > 40 ? 'bg-sky-500 shadow-[0_0_10px_rgba(14,165,233,0.2)]' : 
                    'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                  }`}
                  style={{ width: `${accuracy}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <p className="text-[10px] text-slate-500 font-medium italic pt-2 border-t border-slate-200 dark:border-white/5">
        Tip: Focus on subjects with red bars to improve your overall rank.
      </p>
    </div>
  );
};

export default TopicInsights;
