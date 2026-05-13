import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState({
    level: 'primary',
    language1: 'Hindi',
    language2: 'English',
    subject_preference: 'none',
    name: '',
    questions_solved: 0,
    rank_points: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/profile', {
          headers: { 'x-auth-token': token }
        });
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await api.put('/api/profile/settings', profile, {
        headers: { 'x-auth-token': token }
      });
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="app-container">Loading...</div>;

  return (
    <div className="app-container animate-fade">
      <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>Profile Settings</h2>
      
      <div className="glass-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700 }}>
            {profile.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 style={{ margin: 0 }}>{profile.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Level: {profile.level === 'primary' ? 'Primary (1-5)' : 'Junior (6-8)'}</p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
          <div className="subject-pill">
            <small style={{ color: 'var(--text-muted)' }}>Solved</small>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{profile.questions_solved}</div>
          </div>
          <div className="subject-pill">
            <small style={{ color: 'var(--text-muted)' }}>Rank Points</small>
            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{profile.rank_points}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Exam Level</label>
            <select 
              value={profile.level} 
              onChange={e => setProfile({...profile, level: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--glass-border)' }}
            >
              <option value="primary">Primary (Level 1)</option>
              <option value="junior">Junior (Level 2)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Language 1</label>
            <select 
              value={profile.language1} 
              onChange={e => setProfile({...profile, language1: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--glass-border)' }}
            >
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Language 2</label>
            <select 
              value={profile.language2} 
              onChange={e => setProfile({...profile, language2: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--glass-border)' }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          {profile.level === 'junior' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Subject Stream</label>
              <select 
                value={profile.subject_preference} 
                onChange={e => setProfile({...profile, subject_preference: e.target.value})}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid var(--glass-border)' }}
              >
                <option value="science">Math & Science</option>
                <option value="arts">Social Studies</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Save Settings</button>
          {message && <p style={{ color: '#10b981', textAlign: 'center', fontSize: '0.9rem' }}>{message}</p>}
        </div>
      </form>
    </div>
  );
};

export default Profile;
