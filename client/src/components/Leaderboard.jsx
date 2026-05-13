import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const res = await axios.get('/api/profile/ranking');
        setRankings(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRankings();
  }, []);

  if (loading) return <div className="app-container">Loading...</div>;

  return (
    <div className="app-container animate-fade">
      <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>Global Leaderboard</h2>
      
      <div className="glass-card" style={{ padding: '0' }}>
        {rankings.map((user, index) => (
          <div 
            key={index} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px', 
              padding: '16px', 
              borderBottom: index === rankings.length - 1 ? 'none' : '1px solid var(--glass-border)',
              background: index === 0 ? 'rgba(99, 102, 241, 0.1)' : 'transparent'
            }}
          >
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'rgba(255,255,255,0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem'
            }}>
              {index + 1}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0 }}>{user.name}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{user.questions_solved} Questions Solved</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{user.rank_points}</div>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Points</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
