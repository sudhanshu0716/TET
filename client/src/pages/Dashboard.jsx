import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import translations from '../translations';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [contestStatus, setContestStatus] = useState({ status: 'upcoming', registered: false });
  const navigate = useNavigate();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/profile', {
          headers: { 'x-auth-token': token }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/contests/status', { headers: { 'x-auth-token': token } });
        setContestStatus(res.data);
      } catch (err) { console.error(err); }
    };
    fetchStatus();
  }, []);

  const handleRegister = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/contests/register', {}, { headers: { 'x-auth-token': token } });
      setContestStatus({ ...contestStatus, registered: true });
      alert('Registered successfully! Join at 8:30 PM.');
    } catch (err) { alert(err.response?.data?.message || 'Registration failed'); }
  };

  if (!user) return (
    <div className="app-container animate-fade" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div className="loader"></div>
      <p style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t.preparing}</p>
    </div>
  );

  const subjects = [
    { name: 'Pedagogy', id: 'pedagogy', icon: '🧠' },
    { name: 'Hindi', id: 'hindi', icon: '📖' },
    { name: 'English', id: 'english', icon: '🔤' },
    { name: 'Math', id: 'math', icon: '➗' },
    { name: 'EVS', id: 'evs', icon: '🌱' },
    { name: 'Science', id: 'science', icon: '🔬' },
    { name: 'Social', id: 'social', icon: '⚖️' },
    { name: 'Sanskrit', id: 'sanskrit', icon: '🕉️' },
    { name: 'Urdu', id: 'urdu', icon: '🖋️' }
  ];

  return (
    <div className="app-container animate-fade" style={{ paddingTop: '10px' }}>
      <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{t.hello}, {user.name}! 👋</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t.readyChallenge}</p>
        </div>
        <div className="streak-badge">
          <span>🔥</span>
          <span>{user.streak || 3} {t.streak}</span>
        </div>
      </header>

      {/* Daily Live Contest Card */}
      <div className="glass-card" style={{ 
        marginBottom: '24px', 
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9))',
        border: contestStatus.status === 'live' ? '2px solid #10b981' : '1px solid var(--glass-border)',
        boxShadow: contestStatus.status === 'live' ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: contestStatus.status === 'live' ? '#10b981' : 'var(--primary)', fontWeight: 800 }}>
              {contestStatus.status === 'live' ? '● LIVE CONTEST' : 'UPCOMING CONTEST'}
            </span>
            <h3 style={{ fontSize: '1.2rem', margin: '4px 0' }}>Daily 8:30 PM Challenge</h3>
          </div>
          <div style={{ fontSize: '2rem' }}>🏆</div>
        </div>
        
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          {contestStatus.status === 'live' ? 'The contest is live! 20 Questions | 30 Mins.' : 'Join the elite battle tonight at 8:30 PM. Earn your global rank!'}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          {contestStatus.status === 'live' ? (
            <button className="btn-primary" style={{ background: '#10b981' }} onClick={() => navigate('/contest-live')}>
              Join Contest Now
            </button>
          ) : contestStatus.status === 'ended' ? (
            <button className="btn-primary" onClick={() => navigate('/contest-leaderboard')}>
              View Leaderboard
            </button>
          ) : (
            <>
              {contestStatus.registered ? (
                <div style={{ padding: '10px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, flex: 1, textAlign: 'center' }}>
                  ✓ Registered
                </div>
              ) : (
                <button className="btn-primary" onClick={handleRegister}>Register for Today</button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Daily Tip */}
      <div className="glass-card" style={{ marginBottom: '24px', borderLeft: '4px solid var(--primary)', background: 'rgba(99, 102, 241, 0.05)' }}>
        <h5 style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '4px' }}>{t.tipTitle}</h5>
        <p style={{ fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>"{t.tipBody}"</p>
      </div>

      {/* Performance Summary */}
      <div className="glass-card" style={{ marginBottom: '24px', padding: '20px' }}>
        <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', opacity: 0.8 }}>{t.perf}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{user.avgScore || 78}%</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.accuracy}</div>
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{user.examsTaken || 12}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.examsDone}</div>
          </div>
        </div>
        <div className="progress-bar-container" style={{ marginTop: '20px' }}>
          <div className="progress-bar-fill" style={{ width: `${user.avgScore || 78}%` }}></div>
        </div>
      </div>

      {/* Main Action: Daily Exam */}
      <div className="glass-card bg-gradient" style={{ marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>{t.dailyChallenge}</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px', opacity: 0.9 }}>{t.dailyDesc} ({user.level.toUpperCase()} | {user.language1} | {user.language2})</p>
          <button className="btn-primary" style={{ background: 'white', color: 'var(--primary)' }} onClick={() => navigate('/daily-exam')}>{t.startNow}</button>
        </div>
        <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '6rem', opacity: 0.2 }}>🔥</div>
      </div>

      {/* Secondary Actions */}
      <h4 style={{ marginBottom: '16px', fontWeight: 600 }}>{t.practiceModes}</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-card" onClick={() => navigate('/full-mock')}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🏆</div>
          <h5 style={{ margin: 0 }}>{t.fullMock}</h5>
          <small style={{ color: 'var(--text-muted)' }}>150 Qs | 150 Mins</small>
        </div>
        <div className="glass-card" onClick={() => navigate('/important')}>
          <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>⭐</div>
          <h5 style={{ margin: 0 }}>{t.important}</h5>
          <small style={{ color: 'var(--text-muted)' }}>{t.repeated}</small>
        </div>
      </div>

      {/* Subject-wise MCQ Menu */}
      <h4 style={{ marginBottom: '16px', fontWeight: 600 }}>{t.subjectWise}</h4>
      <div className="subject-grid">
        {subjects.map(sub => (
          <div 
            key={sub.id} 
            className="subject-pill" 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => navigate(`/practice/${sub.id}`)}
          >
            <span>{sub.icon}</span>
            <span>{sub.name}</span>
          </div>
        ))}
      </div>

      {/* Stats Quick View */}
      <div className="glass-card" style={{ marginTop: '24px', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h5 style={{ margin: 0 }}>{t.ranking}</h5>
            <small style={{ color: 'var(--text-muted)' }}>{t.top10}</small>
          </div>
          <Link to="/leaderboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>{t.viewAll}</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
