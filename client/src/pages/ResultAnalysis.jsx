import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import translations from '../translations';

const ResultAnalysis = () => {
  const { examId } = useParams();
  const [data, setData] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang];

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get(`/api/exams/${examId}`, { headers: { 'x-auth-token': token } });
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert('Could not fetch exam result');
        navigate('/dashboard');
      }
    };
    fetchResult();
  }, [examId]);

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="loader w-10 h-10 border-4 border-sky-500/20 border-t-sky-500"></div>
      <p className="text-slate-500 font-bold animate-pulse">Loading Analysis...</p>
    </div>
  );

  const { exam, questions } = data;
  const currentQ = questions[reviewIndex];
  const userAns = exam.answers.find(a => a.question_id === currentQ.question_id)?.selected_option;

  return (
    <div className="flex flex-col gap-6 px-5 pt-8 pb-32 max-w-md mx-auto w-full animate-fade-in relative overflow-hidden">
      <div className="glass-card text-center border-2 border-sky-500/20">
        <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">{t.reviewAnswers || 'Solution Sheet'} 🔍</h2>
        <div className="text-4xl font-black my-6 text-gradient">
          {exam.score} / {questions.length}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1 text-left">
            <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{t.accuracy}</div>
            <div className="text-xl font-black text-[var(--text-primary)]">{Math.round((exam.score / questions.length) * 100)}%</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1 text-left">
            <div className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Type</div>
            <div className="text-xl font-black text-sky-400 capitalize">{exam.exam_type.replace('-', ' ')}</div>
          </div>
        </div>

        {/* Detailed Review Carousel */}
        <div className="space-y-4 text-left border-t border-white/10 pt-6">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">Question {reviewIndex + 1}</span>
            <span className="text-[10px] font-black text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 uppercase">
              {currentQ.subject}
            </span>
          </div>
          
          <div className="glass-card !bg-white/5 !border-white/10 space-y-5">
            <h3 className="text-sm text-[var(--text-primary)] font-bold leading-relaxed">
              {currentQ.question_text}
            </h3>
            
            <div className="space-y-3">
              {currentQ.options.map((opt, i) => {
                const isCorrect = opt === currentQ.correct_answer;
                const isSelected = opt === userAns;
                
                let borderClass = 'border-white/5 bg-white/5';
                let textClass = 'text-[var(--text-secondary)]';
                
                if (isCorrect) {
                  borderClass = 'border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
                  textClass = 'text-emerald-400';
                } else if (isSelected && !isCorrect) {
                  borderClass = 'border-rose-500/50 bg-rose-500/10';
                  textClass = 'text-rose-400';
                }

                return (
                  <div key={i} className={`p-4 rounded-xl border transition-all flex items-start gap-3 ${borderClass}`}>
                    <span className={`font-bold shrink-0 ${textClass}`}>{String.fromCharCode(65 + i)}.</span>
                    <span className={`text-xs font-medium ${isCorrect || isSelected ? textClass : 'text-[var(--text-secondary)]'}`}>{opt}</span>
                    {isCorrect && <span className="ml-auto">✅</span>}
                    {isSelected && !isCorrect && <span className="ml-auto">❌</span>}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                disabled={reviewIndex === 0}
                onClick={() => setReviewIndex(prev => prev - 1)}
                className="flex-1 py-4 rounded-xl bg-white/5 text-[var(--text-secondary)] font-black text-xs disabled:opacity-20 transition-all active:scale-95 border border-white/5"
              >
                ← Previous
              </button>
              <button 
                disabled={reviewIndex === questions.length - 1}
                onClick={() => setReviewIndex(prev => prev + 1)}
                className="flex-1 py-4 rounded-xl bg-white/5 text-[var(--text-secondary)] font-black text-xs disabled:opacity-20 transition-all active:scale-95 border border-white/5"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        <button 
          className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 mt-8"
          onClick={() => navigate('/dashboard')}
        >
          {t.returnDash}
        </button>
      </div>
    </div>
  );
};

export default ResultAnalysis;
