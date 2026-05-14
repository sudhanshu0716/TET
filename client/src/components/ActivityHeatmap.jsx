import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ActivityHeatmap = () => {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/exams/activity', {
          headers: { 'x-auth-token': token }
        });
        setActivity(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  // Generate last 10 weeks of data
  const generateData = () => {
    const days = [];
    const today = new Date();
    for (let i = 70; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const activityData = activity.find(a => a.date === dateStr);
      days.push({
        date: dateStr,
        count: activityData ? activityData.count : 0
      });
    }
    return days;
  };

  if (loading) return null;

  const data = generateData();

  const getColor = (count) => {
    if (count === 0) return 'bg-slate-800/30';
    if (count < 10) return 'bg-emerald-900/40';
    if (count < 30) return 'bg-emerald-700/60';
    if (count < 60) return 'bg-emerald-500/80';
    return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]';
  };

  return (
    <div className="glass-card !p-5 space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Activity Heatmap</h4>
        <div className="flex gap-1 items-center">
          <span className="text-[8px] text-slate-500 uppercase font-black">Less</span>
          <div className="flex gap-0.5">
            <div className="w-2 h-2 rounded-sm bg-slate-800/30"></div>
            <div className="w-2 h-2 rounded-sm bg-emerald-900/40"></div>
            <div className="w-2 h-2 rounded-sm bg-emerald-700/60"></div>
            <div className="w-2 h-2 rounded-sm bg-emerald-500/80"></div>
            <div className="w-2 h-2 rounded-sm bg-emerald-400"></div>
          </div>
          <span className="text-[8px] text-slate-500 uppercase font-black ml-1">More</span>
        </div>
      </div>
      
      <div className="grid grid-flow-col grid-rows-7 gap-1 h-24 overflow-x-auto hide-scrollbar">
        {data.map((day, i) => (
          <div 
            key={i}
            className={`w-3 h-3 rounded-sm transition-all duration-500 ${getColor(day.count)}`}
            title={`${day.date}: ${day.count} Questions`}
          />
        ))}
      </div>
      
      <p className="text-[10px] text-slate-500 font-medium italic">
        Keep your streak alive! Solve more questions daily to turn the grid green.
      </p>
    </div>
  );
};

export default ActivityHeatmap;
