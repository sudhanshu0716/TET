import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    level: 'primary',
    language1: 'Hindi',
    language2: 'English',
    subject_preference: 'none'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('/api/profile/settings', formData, {
        headers: { 'x-auth-token': token }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app-container animate-fade">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome! 🎯</h2>
        <p style={{ color: 'var(--text-muted)' }}>Let's customize your preparation</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Target Exam Level</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                className="glass-card" 
                style={{ flex: 1, borderColor: formData.level === 'primary' ? 'var(--primary)' : 'var(--glass-border)' }}
                onClick={() => setFormData({...formData, level: 'primary'})}
              >
                Primary (1-5)
              </button>
              <button 
                type="button"
                className="glass-card" 
                style={{ flex: 1, borderColor: formData.level === 'junior' ? 'var(--junior)' : 'var(--glass-border)' }}
                onClick={() => setFormData({...formData, level: 'junior'})}
              >
                Junior (6-8)
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Language 1 (Primary)</label>
            <select 
              value={formData.language1}
              onChange={e => setFormData({...formData, language1: e.target.value})}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--glass-border)' }}
            >
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Language 2 (Secondary)</label>
            <select 
              value={formData.language2}
              onChange={e => setFormData({...formData, language2: e.target.value})}
              style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--bg-dark)', color: 'white', border: '1px solid var(--glass-border)' }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>Complete Setup</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
