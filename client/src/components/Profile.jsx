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

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold animate-pulse">Loading Profile...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 pt-8 px-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">Your <span className="text-sky-400">Profile</span></h2>
        <p className="text-[var(--text-secondary)] font-medium text-sm">Manage your account and preferences</p>
      </div>
      
      <div className="glass-card p-6 flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-sky-500/20 transition-colors" />
        
        <div className="flex gap-5 items-center relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-sky-500/20">
            {profile.name?.[0]?.toUpperCase()}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-[var(--text-primary)]">{profile.name}</h3>
            <div className="inline-block px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest">
              {profile.level === 'primary' ? 'Primary (P-I)' : 'Junior (P-II)'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Solved</span>
            <div className="text-2xl font-black text-[var(--text-primary)]">{profile.questions_solved}</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rank Points</span>
            <div className="text-2xl font-black text-sky-400">{profile.rank_points}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="flex flex-col gap-6">
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Exam Level</label>
            <select 
              value={profile.level} 
              onChange={e => setProfile({...profile, level: e.target.value})}
              className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold appearance-none text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
            >
              <option value="primary" className="bg-[var(--bg-secondary)]">Primary (Level 1)</option>
              <option value="junior" className="bg-[var(--bg-secondary)]">Junior (Level 2)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Language I</label>
              <select 
                value={profile.language1} 
                onChange={e => setProfile({...profile, language1: e.target.value})}
                className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold appearance-none text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
              >
                <option value="Hindi" className="bg-[var(--bg-secondary)]">Hindi</option>
                <option value="English" className="bg-[var(--bg-secondary)]">English</option>
                <option value="Sanskrit" className="bg-[var(--bg-secondary)]">Sanskrit</option>
                <option value="Urdu" className="bg-[var(--bg-secondary)]">Urdu</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Language II</label>
              <select 
                value={profile.language2} 
                onChange={e => setProfile({...profile, language2: e.target.value})}
                className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold appearance-none text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
              >
                <option value="English" className="bg-[var(--bg-secondary)]">English</option>
                <option value="Hindi" className="bg-[var(--bg-secondary)]">Hindi</option>
                <option value="Sanskrit" className="bg-[var(--bg-secondary)]">Sanskrit</option>
                <option value="Urdu" className="bg-[var(--bg-secondary)]">Urdu</option>
              </select>
            </div>
          </div>

          {profile.level === 'junior' && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Subject Stream</label>
              <select 
                value={profile.subject_preference} 
                onChange={e => setProfile({...profile, subject_preference: e.target.value})}
                className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold appearance-none text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
              >
                <option value="science" className="bg-[var(--bg-secondary)]">Math & Science</option>
                <option value="arts" className="bg-[var(--bg-secondary)]">Social Studies</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20"
          >
            Save Changes
          </button>
          
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-4 rounded-2xl text-sm font-bold text-center animate-fade-in">
              {message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
