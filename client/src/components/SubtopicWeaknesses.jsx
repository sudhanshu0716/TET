import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { BrainCircuit, BookOpen, AlertTriangle, ChevronRight, Sparkles } from 'lucide-react';
import translations from '../translations';

const SubtopicWeaknesses = ({ insights, loading }) => {
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;
  const [chartData, setChartData] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);

  useEffect(() => {
    if (insights && insights.length > 0) {
      // 1. Process Chart Data (Radar chart works best with 3+ points, but let's show what we have)
      const data = insights.map(item => {
        const title = lang === 'HI' ? item.title_hi : item.title_en;
        const shortTitle = title.length > 15 ? title.substring(0, 15) + '...' : title;
        return {
          topic: shortTitle,
          score: item.accuracy,
          fullMark: 100
        };
      });
      setChartData(data);

      // 2. Filter Weak Topics (Accuracy < 60%)
      const weak = insights.filter(item => item.accuracy < 60);
      setWeakTopics(weak);
    }
  }, [insights, lang]);

  if (loading) return (
    <div className="glass-card animate-pulse h-[300px] flex items-center justify-center">
      <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
        {lang === 'HI' ? 'अध्याय-वार कमजोरी का विश्लेषण किया जा रहा है...' : 'Analyzing sub-topic weaknesses...'}
      </span>
    </div>
  );

  if (!insights || insights.length === 0) return (
    <div className="glass-card p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]">
      <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-xl">📊</div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
        {lang === 'HI' ? 'अध्याय-वार विश्लेषण के लिए अधिक टेस्ट हल करें' : 'Resolve more tests to unlock sub-topic insights'}
      </p>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Radar Chart Section */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full" />
        
        <div className="flex justify-between items-center relative z-10">
          <div>
            <h3 className="text-lg font-black text-[var(--text-primary)] tracking-tight">
              {lang === 'HI' ? 'अध्याय-वार शक्ति स्तर' : 'Sub-Topic Strengths'}
            </h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {lang === 'HI' ? 'सूक्ष्म प्रदर्शन विश्लेषण' : 'Micro-level subject performance'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-400 flex items-center justify-center">
            <BrainCircuit size={18} />
          </div>
        </div>

        {chartData.length >= 3 ? (
          <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="#94a3b8" strokeOpacity={0.1} />
                <PolarAngleAxis 
                  dataKey="topic" 
                  tick={{ fill: '#64748b', fontSize: 9, fontWeight: 900 }}
                />
                <Radar
                  name="Accuracy"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              {lang === 'HI' ? 'चार्ट प्रदर्शित करने के लिए कम से कम 3 अध्यायों के प्रश्न हल करें।' : 'Practice questions from at least 3 sub-topics to render radar chart.'}
            </p>
          </div>
        )}
      </div>

      {/* Personalized Advice Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-500 animate-pulse" size={18} />
          <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider">
            {lang === 'HI' ? 'एआई-संचालित सुधार योजना' : 'AI study recommendation plan'}
          </h3>
        </div>

        {weakTopics.length > 0 ? (
          <div className="flex flex-col gap-4">
            {weakTopics.map((item, idx) => {
              const title = lang === 'HI' ? item.title_hi : item.title_en;
              const category = lang === 'HI' ? item.category_hi : item.category_en;
              const advice = lang === 'HI' ? item.advice_hi : item.advice_en;
              
              return (
                <div 
                  key={idx} 
                  className="glass-card border border-rose-500/20 bg-rose-500/5 relative overflow-hidden flex flex-col gap-3 p-5"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 blur-2xl rounded-full" />
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/15 w-fit">
                        {lang === 'HI' ? 'कमजोर अध्याय' : 'Weak Subtopic'}
                      </span>
                      <h4 className="text-base font-black text-[var(--text-primary)] mt-1 truncate">
                        {title}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        {category} • {lang === 'HI' ? `${item.total} प्रश्न हल किए` : `${item.total} Qs Solved`}
                      </p>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-2xl font-black text-rose-500">{item.accuracy}%</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        {lang === 'HI' ? 'सटीकता' : 'Accuracy'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed bg-white/5 border border-white/5 p-3 rounded-xl">
                    ⚡ {advice}
                  </p>

                  <button
                    onClick={() => navigate('/cheatsheets', { state: { selectedTopicId: item.topic_id } })}
                    className="flex items-center justify-center gap-1.5 self-end px-4 py-2 mt-1 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black uppercase tracking-widest shadow-md shadow-violet-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <BookOpen size={14} />
                    {lang === 'HI' ? 'नोट्स पढ़ें' : 'Study Notes'}
                    <ChevronRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card border border-emerald-500/20 bg-emerald-500/5 p-6 text-center space-y-2">
            <div className="text-3xl">🎉</div>
            <h4 className="text-sm font-black text-emerald-500 uppercase tracking-wider">
              {lang === 'HI' ? 'सभी अध्याय मजबूत हैं!' : 'Excellent Sub-topic mastery!'}
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              {lang === 'HI' 
                ? 'सभी अध्यायों में आपका प्रदर्शन 60% से ऊपर है। अभ्यास जारी रखें!' 
                : 'All your practiced sub-topics maintain above 60% accuracy. Keep it up!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubtopicWeaknesses;
