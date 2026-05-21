import React, { useState, useEffect } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { Target } from 'lucide-react';
import api from '../services/api';
import translations from '../translations';

const PerformanceRadar = ({ insights, loading }) => {
  const [data, setData] = useState([]);
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;

  useEffect(() => {
    if (insights) {
      const transformed = insights.map(item => {
        const rawId = item._id || 'Unknown';
        return {
          subject: (t.subjects && t.subjects[rawId]) ? t.subjects[rawId] : rawId.charAt(0).toUpperCase() + rawId.slice(1),
          score: Math.round((item.correct / item.total) * 100),
          fullMark: 100
        };
      });
      setData(transformed);
    }
  }, [t, insights]);

  if (loading) return (
    <div className="glass-card animate-pulse h-[250px] flex items-center justify-center">
      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{lang === 'HI' ? 'चार्ट लोड हो रहा है...' : 'Loading Radar Chart...'}</span>
    </div>
  );

  if (data.length < 3) return (
    <div className="glass-card p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]">
      <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-xl">📊</div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
        {lang === 'HI' ? 'अधिक परीक्षा दें विश्लेषण देखने के लिए' : 'Take more exams to see analysis'}
      </p>
    </div>
  );

  return (
    <div className="glass-card p-6 space-y-4 animate-fade-in relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full" />
      
      <div className="flex justify-between items-center relative z-10">
        <div>
          <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight">
            {lang === 'HI' ? 'प्रदर्शन विश्लेषण' : 'Performance Analysis'}
          </h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {lang === 'HI' ? 'विषयवार कमजोरी' : 'Subject-wise weakness'}
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
          <Target size={18} />
        </div>
      </div>

      <div className="h-[250px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#94a3b8" strokeOpacity={0.1} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
            />
            <Radar
              name="Performance"
              dataKey="score"
              stroke="#0ea5e9"
              fill="#0ea5e9"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-2 flex flex-col gap-2 relative z-10">
        {[...data].sort((a, b) => a.score - b.score).slice(0, 2).map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <div className="flex items-center gap-2">
              <span className="text-xs">⚠️</span>
              <span className="text-xs font-black text-[var(--text-primary)]">{item.subject}</span>
            </div>
            <span className="text-[10px] font-black text-red-500 uppercase">{item.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceRadar;
