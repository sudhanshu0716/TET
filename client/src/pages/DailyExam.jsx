import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import translations from '../translations';

const DailyExam = ({ type }) => {
  const { subject } = useParams();
  const [step, setStep] = useState('config'); // 'config', 'loading', 'exam', 'result'
  const [config, setConfig] = useState({ qCount: 30, timeLimit: 30 });
  const [questions, setQuestions] = useState([]);
  const [exam, setExam] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang];

  const startExam = async () => {
    setStep('loading');
    try {
      const token = localStorage.getItem('token');
      let url = `/api/exams/today?count=${config.qCount}&duration=${config.timeLimit}`;
      if (type === 'full-mock') url = '/api/exams/full-mock';
      if (type === 'subject') url = `/api/exams/subject/${subject}?count=${config.qCount}&duration=${config.timeLimit}`;
      if (type === 'important') url = '/api/exams/important';
      if (type === 'contest') url = '/api/contests/join';

      const res = await axios.get(url, { headers: { 'x-auth-token': token } });
      const examData = res.data;
      
      const detailRes = await axios.get(`/api/exams/${examData.exam_id}`, { headers: { 'x-auth-token': token } });
      setExam(detailRes.data.exam);
      setQuestions(detailRes.data.questions);
      setTimeLeft(detailRes.data.exam.duration * 60);
      setStep('exam');
    } catch (err) {
      alert(err.response?.data?.message || 'Error starting exam');
      navigate('/dashboard');
    }
  };

  // Auto-start for specific exam types
  useEffect(() => {
    if (step === 'config') {
      if (type === 'contest') {
        setConfig({ qCount: 20, timeLimit: 30 });
        startExam();
      } else if (type === 'full-mock') {
        setConfig({ qCount: 150, timeLimit: 150 });
        startExam();
      } else if (type === 'important') {
        setConfig({ qCount: 30, timeLimit: 30 });
        startExam();
      }
    }
  }, [type]);

  // Prevent accidental exit
  useEffect(() => {
    if (step !== 'exam') return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = 'Exam in progress. Your progress will be lost!';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [step]);

  useEffect(() => {
    if (step !== 'exam' || result || !exam) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, result, exam]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.entries(answers).map(([qid, opt]) => ({ question_id: qid, selected_option: opt }));
      const res = await axios.post(`/api/exams/submit/${exam.exam_id}`, { answers: formattedAnswers }, { headers: { 'x-auth-token': token } });
      setResult(res.data.exam);
      setStep('result');
    } catch (err) { console.error(err); }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (step === 'config') return (
    <div className="app-container animate-fade">
      <div className="glass-card">
        <h2 style={{ marginBottom: '20px' }}>{t.setupExam} ⚙️</h2>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t.questions}</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[10, 20, 30].map(n => (
              <button 
                key={n} 
                className="glass-card" 
                style={{ flex: 1, borderColor: config.qCount === n ? 'var(--primary)' : 'var(--glass-border)' }}
                onClick={() => setConfig({...config, qCount: n, timeLimit: n})} // Default 1 min per question
              >
                {n} Qs
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>{t.timeLimit} (Minutes)</label>
          <input 
            type="range" min="5" max="60" value={config.timeLimit} 
            onChange={(e) => setConfig({...config, timeLimit: parseInt(e.target.value)})}
            style={{ width: '100%', accentColor: 'var(--primary)' }}
          />
          <div style={{ textAlign: 'center', marginTop: '10px', fontWeight: 600 }}>{config.timeLimit} Minutes</div>
        </div>
        <button className="btn-primary" onClick={startExam}>{t.launchExam}</button>
      </div>
    </div>
  );

  if (step === 'loading') return <div className="app-container">{t.preparing}</div>;

  if (step === 'result') return (
    <div className="app-container animate-fade">
      {/* Confetti Particles */}
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="confetti" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            background: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)',
            animationDelay: `${Math.random() * 2}s` 
          }}
        ></div>
      ))}

      <div className="glass-card text-center" style={{ 
        position: 'relative', 
        overflow: 'hidden',
        border: '2px solid var(--primary)',
        boxShadow: '0 0 40px rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '-50%', 
          left: '-50%', 
          width: '200%', 
          height: '200%', 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
          animation: 'pulse 4s infinite'
        }}></div>
        
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🎊 {t.brilliant}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{t.completed}</p>
        
        <div style={{ 
          fontSize: '4rem', 
          fontWeight: 900, 
          margin: '30px 0', 
          background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 10px rgba(99, 102, 241, 0.3))'
        }}>
          {result.score} / {questions.length}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.accuracy}</div>
            <div style={{ fontWeight: 700 }}>{Math.round((result.score / questions.length) * 100)}%</div>
          </div>
          <div className="glass-card" style={{ padding: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.timeSpent}</div>
            <div style={{ fontWeight: 700 }}>{config.timeLimit - Math.floor(timeLeft/60)}m</div>
          </div>
        </div>

        <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ position: 'relative', zIndex: 1 }}>
          {t.returnDash}
        </button>
      </div>
    </div>
  );

  if (!questions || questions.length === 0) return <div className="app-container">No questions found.</div>;
  const q = questions[currentIndex];

  return (
    <div className="app-container animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>Q {currentIndex + 1} / {questions.length}</span>
        <div className="glass-card" style={{ padding: '4px 12px', color: timeLeft < 300 ? 'var(--accent)' : 'var(--primary)' }}>
          ⏱️ {formatTime(timeLeft)}
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '24px', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{q.subject}</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{q.year || 'PREVIOUS YEAR'}</span>
        </div>
        <h3 style={{ fontSize: '1.2rem', lineHeight: 1.5 }}>{q.question_text}</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {q.options.map((opt, i) => (
          <div 
            key={i} 
            className="glass-card" 
            style={{ 
              padding: '16px', 
              border: answers[q.question_id] === opt ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
              background: answers[q.question_id] === opt ? 'rgba(99, 102, 241, 0.1)' : 'var(--card-bg)'
            }}
            onClick={() => setAnswers({ ...answers, [q.question_id]: opt })}
          >
            <span style={{ marginRight: '12px', opacity: 0.5 }}>{String.fromCharCode(65 + i)}.</span>
            {opt}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
        <button 
          className="glass-card" 
          style={{ flex: 1 }} 
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(prev => prev - 1)}
        >
          Previous
        </button>
        {currentIndex === questions.length - 1 ? (
          <button className="btn-primary" style={{ flex: 2, background: '#10b981' }} onClick={handleSubmit}>Submit Exam</button>
        ) : (
          <button className="btn-primary" style={{ flex: 2 }} onClick={() => setCurrentIndex(prev => prev + 1)}>Next Question</button>
        )}
      </div>
    </div>
  );
};

export default DailyExam;
