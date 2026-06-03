import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, Calendar, ChevronRight, ShieldCheck } from 'lucide-react';
import translations from '../translations';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { user, setUser } = useAuth();
  const { uiVersion, setUiVersion } = useTheme();
  const lang = localStorage.getItem('appLang') || 'EN';
  const t = translations[lang] || translations.EN;
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
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordMessage({ type: 'error', text: t.fillFields || 'Please fill all fields' });
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/auth/change-password', passwordData, {
        headers: { 'x-auth-token': token }
      });
      setPasswordMessage({ type: 'success', text: res.data.message });
      setPasswordData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'Error changing password' });
    }
  };

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
      const res = await api.put('/api/profile/settings', profile, {
        headers: { 'x-auth-token': token }
      });
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      setMessage(t.settingsUpdated || 'Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage(t.errorUpdating || 'Error updating settings');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold animate-pulse">{t.loadingProfile || 'Loading Profile...'}</p>
    </div>
  );

  const getLetterGrade = (score) => {
    if (score >= 95) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 75) return 'B+';
    if (score >= 65) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  };

  return (
    <div className="flex flex-col gap-8 pt-8 px-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
          {t.yourProfile.split(' ')[0]} <span className="text-sky-400">{t.yourProfile.split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="text-[var(--text-secondary)] font-medium text-sm">{t.profileDesc}</p>
      </div>
      
      <div className="glass-card p-6 flex flex-col gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-sky-500/20 transition-colors" />
        
        <div className="flex gap-5 items-center relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-sky-500/20">
            {profile.name?.[0]?.toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <h3 className="text-xl font-black text-[var(--text-primary)] leading-tight">{profile.name}</h3>
            <p className="text-[10px] font-bold text-slate-500 lowercase tracking-wide mb-1">{profile.email}</p>
            <div className="inline-block px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-black uppercase tracking-widest">
              {profile.level === 'primary' ? t.primaryLevel : t.juniorLevel}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.solvedText}</span>
            <div className="text-xl font-black text-[var(--text-primary)]">{profile.questions_solved}</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.success}</span>
            <div className="text-xl font-black text-emerald-400">
              {uiVersion === 'v3' ? getLetterGrade(profile.avgScore || 0) : `${profile.avgScore || 0}%`}
            </div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.streak}</span>
            <div className="text-xl font-black text-orange-400">{profile.streak || 0} 🔥</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.pointsText}</span>
            <div className="text-xl font-black text-sky-400">{profile.rank_points}</div>
          </div>
        </div>
      </div>

      {/* Subscription Card */}
      <div 
        onClick={() => navigate('/subscription')}
        className="glass-card p-5 border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-500/10 to-transparent flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <Crown size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-[var(--text-primary)]">
                {profile.is_premium || (profile.subscription_end_date && new Date(profile.subscription_end_date) > new Date()) 
                  ? t.premium 
                  : new Date(profile.trial_end_date) > new Date() 
                  ? t.trial 
                  : t.planExpired}
              </h4>
              <Zap size={12} className="text-amber-500 fill-amber-500" />
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              {profile.is_premium || (profile.subscription_end_date && new Date(profile.subscription_end_date) > new Date())
                ? `${t.expires || 'Expires'}: ${new Date(profile.subscription_end_date).toLocaleDateString()}`
                : new Date(profile.trial_end_date) > new Date()
                ? `${Math.ceil((new Date(profile.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))} ${t.daysLeft}`
                : t.renewToContinue}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-amber-500 group-hover:translate-x-1 transition-transform">
          <span className="text-[10px] font-black uppercase tracking-widest">{t.viewPlans}</span>
          <ChevronRight size={16} />
        </div>
      </div>

      {/* UI Theme Selection */}
      <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden">
        <div>
          <h4 className="text-sm font-black text-[var(--text-primary)]">
            {t.uiExperience || "UI Theme"}
          </h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
            Switch between Classic, Modern, and Blackboard UI designs
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/5 relative">
          <button
            type="button"
            onClick={() => setUiVersion('v1')}
            className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 relative z-10 flex items-center justify-center gap-1 ${
              uiVersion === 'v1'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.classicUI || 'Classic (V1)'}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setUiVersion('v2')}
            className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 relative z-10 flex items-center justify-center gap-1 ${
              uiVersion === 'v2'
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.modernUI || 'Modern (V2)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setUiVersion('v3')}
            className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 relative z-10 flex items-center justify-center gap-1 ${
              uiVersion === 'v3'
                ? (localStorage.getItem('theme') === 'light' ? 'text-white' : 'text-slate-950')
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>{t.chalkboardUI || 'Chalk (V3)'}</span>
          </button>
          
          <div 
            className="absolute top-1 bottom-1 rounded-xl transition-all duration-300 ease-out"
            style={{
              left: uiVersion === 'v1' ? '4px' : uiVersion === 'v2' ? 'calc(33.33% + 2px)' : 'calc(66.66% + 2px)',
              width: 'calc(33.33% - 6px)',
              background: uiVersion === 'v2' 
                ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' 
                : uiVersion === 'v3' 
                  ? (localStorage.getItem('theme') === 'light' ? '#121413' : '#fcfcfc') 
                  : 'linear-gradient(135deg, #0ea5e9, #6366f1)'
            }}
          />
        </div>
      </div>

      <form onSubmit={handleUpdate} className="flex flex-col gap-8">
        <div className="glass-card p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">{t.username}</label>
            <input 
              type="text"
              value={profile.name || ''}
              onChange={e => setProfile({...profile, name: e.target.value})}
              className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
              placeholder={t.username}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">{t.examLevel}</label>
            <select 
              value={profile.level} 
              onChange={e => setProfile({...profile, level: e.target.value})}
              className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold appearance-none text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
            >
              <option value="primary" className="bg-[var(--bg-secondary)]">{t.primaryLevel}</option>
              <option value="junior" className="bg-[var(--bg-secondary)]">{t.juniorLevel}</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">{t.lang1}</label>
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
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">{t.lang2}</label>
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
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">{t.subjectStream}</label>
              <select 
                value={profile.subject_preference} 
                onChange={e => setProfile({...profile, subject_preference: e.target.value})}
                className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold appearance-none text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
              >
                <option value="science" className="bg-[var(--bg-secondary)]">{t.mathScience}</option>
                <option value="arts" className="bg-[var(--bg-secondary)]">{t.socialStudies}</option>
              </select>
            </div>
          )}

          <div 
            onClick={() => {
              // Remove user-specific tutorial key so it replays for this user
              const tutorialKey = user?.id ? `hasSeenTutorial_${user.id}` : 'hasSeenTutorial';
              localStorage.removeItem(tutorialKey);
              navigate('/dashboard');
              window.location.reload();
            }}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.replayTutorial}</span>
            </div>
            <ChevronRight size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
          </div>

          <div 
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              navigate('/login');
              window.location.reload();
            }}
            className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 cursor-pointer hover:bg-rose-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </div>
              <span className="text-xs font-bold text-rose-500 uppercase tracking-widest">{t.logoutAccount}</span>
            </div>
            <ChevronRight size={16} className="text-rose-400 group-hover:translate-x-1 transition-transform" />
          </div>

          <button 
            type="submit" 
            className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 cursor-pointer"
          >
            {t.saveChanges}
          </button>
          
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-4 rounded-2xl text-sm font-bold text-center animate-fade-in">
              {message}
            </div>
          )}
        </div>
      </form>

      {/* Security Section */}
      <div className="space-y-4">
        <div className="px-2">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.accountSecurity}</h5>
        </div>
        <div className="glass-card p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">{t.currentPassword}</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={passwordData.currentPassword}
              onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})}
              className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">{t.newPassword}</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={passwordData.newPassword}
              onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})}
              className="glass-input w-full rounded-2xl py-4 px-5 text-sm font-bold text-[var(--text-primary)] focus:ring-4 focus:ring-sky-500/10 shadow-inner"
            />
          </div>
          
          <button 
            onClick={handlePasswordChange}
            className="w-full py-4 rounded-2xl border-2 border-sky-500/20 text-sky-500 font-black text-sm uppercase tracking-widest hover:bg-sky-500/5 active:scale-95 transition-all cursor-pointer"
          >
            {t.updatePassword}
          </button>

          {passwordMessage.text && (
            <div className={`px-4 py-3 rounded-xl text-xs font-bold text-center animate-fade-in ${
              passwordMessage.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {passwordMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* App Information */}
      <div className="space-y-4">
        <div className="px-2">
          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t.appInfo}</h5>
        </div>
        <div className="glass-card p-4 flex items-center justify-between opacity-80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-500/10 text-slate-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.versionStatus}</span>
              <span className="text-xs font-bold text-white">v1.2.4 Premium</span>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            {t.stable}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
