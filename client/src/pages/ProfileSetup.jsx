import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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
      await api.put('/api/profile/settings', formData, {
        headers: { 'x-auth-token': token }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-12 px-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-black text-white tracking-tight">Welcome! 🎯</h2>
        <p className="text-slate-400 font-medium">Let's customize your preparation</p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Target Exam Level</label>
            <div className="flex gap-3">
              <button 
                type="button"
                className={`flex-1 py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                  formData.level === 'primary' 
                    ? 'border-sky-500 bg-sky-500/10 text-white shadow-lg shadow-sky-500/10' 
                    : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10'
                }`}
                onClick={() => setFormData({...formData, level: 'primary'})}
              >
                Primary (1-5)
              </button>
              <button 
                type="button"
                className={`flex-1 py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                  formData.level === 'junior' 
                    ? 'border-sky-500 bg-sky-500/10 text-white shadow-lg shadow-sky-500/10' 
                    : 'border-white/5 bg-white/5 text-slate-400 hover:border-white/10'
                }`}
                onClick={() => setFormData({...formData, level: 'junior'})}
              >
                Junior (6-8)
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Language 1 (Primary)</label>
            <select 
              value={formData.language1}
              onChange={e => setFormData({...formData, language1: e.target.value})}
              className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold appearance-none"
            >
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-1">Language 2 (Secondary)</label>
            <select 
              value={formData.language2}
              onChange={e => setFormData({...formData, language2: e.target.value})}
              className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold appearance-none"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Sanskrit">Sanskrit</option>
              <option value="Urdu">Urdu</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 mt-2"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
