import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, Database, ShieldCheck, Activity, BarChart2, Clock, Save, 
  Search, Trash2, Send, CheckCircle, AlertTriangle, UserMinus,
  Sparkles, Settings, ShieldAlert, Trophy, Zap, FilePlus, LogOut,
  Edit2, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    dailyActive: 0,
    contestRegs: 0
  });
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [loadingBreakdown, setLoadingBreakdown] = useState(false);
  const [contestSettings, setContestSettings] = useState({ start_time: '20:30', duration: 50 });
  const [premiumEnabled, setPremiumEnabled] = useState(false);
  const [grantEmail, setGrantEmail] = useState('');
  const [grantMonths, setGrantMonths] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [revokeEmail, setRevokeEmail] = useState('');
  
  // New Admin Tools State
  const [systemMessage, setSystemMessage] = useState('');
  const [inspectEmail, setInspectEmail] = useState('');
  const [inspectedUser, setInspectedUser] = useState(null);
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [cleanStatsEmail, setCleanStatsEmail] = useState('');
  const [cleanSelectedSubjects, setCleanSelectedSubjects] = useState([]);

  // User Management State
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingLevel, setEditingLevel] = useState('');
  const [editingLanguage1, setEditingLanguage1] = useState('');
  const [editingLanguage2, setEditingLanguage2] = useState('');

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/admin/users', { headers: { 'x-auth-token': token } });
      setUsersList(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, contestRes, premiumRes, usersRes] = await Promise.all([
          api.get('/api/admin/stats', { headers: { 'x-auth-token': token } }),
          api.get('/api/admin/contest-settings', { headers: { 'x-auth-token': token } }),
          api.get('/api/admin/premium-status', { headers: { 'x-auth-token': token } }),
          api.get('/api/admin/users', { headers: { 'x-auth-token': token } })
        ]);
        setStats(statsRes.data);
        setContestSettings(contestRes.data);
        setPremiumEnabled(premiumRes.data.premium_service_enabled);
        setSystemMessage(premiumRes.data.system_message || '');
        setMaintenanceEnabled(premiumRes.data.is_maintenance_mode || false);
        setUsersList(usersRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditName = (user) => {
    setEditingUserId(user._id);
    setEditingName(user.name);
    setEditingLevel(user.level || 'primary');
    setEditingLanguage1(user.language1 || 'Hindi');
    setEditingLanguage2(user.language2 || 'English');
  };

  const handleSaveName = async (userId) => {
    if (!editingName.trim()) return alert('Name cannot be empty');
    try {
      const token = localStorage.getItem('token');
      await api.put(`/api/admin/users/${userId}`, { name: editingName, level: editingLevel, language1: editingLanguage1, language2: editingLanguage2 }, { headers: { 'x-auth-token': token } });
      alert('User updated successfully!');
      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete user "${userName}"? This will delete all their exam records and contest registrations.`)) return;
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/admin/users/${userId}`, { headers: { 'x-auth-token': token } });
      alert('User deleted successfully!');
      fetchUsers();
      // Also update overall stats count
      const statsRes = await api.get('/api/admin/stats', { headers: { 'x-auth-token': token } });
      setStats(statsRes.data);
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleTogglePremium = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/admin/toggle-premium', { enabled: !premiumEnabled }, { headers: { 'x-auth-token': token } });
      setPremiumEnabled(res.data.premium_service_enabled);
      alert(`Premium Service is now ${res.data.premium_service_enabled ? 'ON' : 'OFF'}`);
    } catch (err) { alert('Toggle failed'); }
  };

  const handleGrantPremium = async () => {
    if (!grantEmail) return alert('Enter email');
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/admin/grant-premium', { email: grantEmail, months: grantMonths }, { headers: { 'x-auth-token': token } });
      alert(`Premium granted to ${grantEmail}`);
      setGrantEmail('');
    } catch (err) { alert(err.response?.data?.message || 'Grant failed'); }
  };

  const handleUpdateContest = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/admin/contest-settings', contestSettings, { headers: { 'x-auth-token': token } });
      alert('Contest settings updated successfully!');
    } catch (err) {
      alert('Failed to update contest settings');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDuplicates = async () => {
    if (!window.confirm("Are you sure you want to scan and remove duplicate questions from the database?")) return;
    setCleaning(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/admin/remove-duplicates', {}, { headers: { 'x-auth-token': token } });
      alert(res.data.message);
      // Refresh stats after deletion
      const statsRes = await api.get('/api/admin/stats', { headers: { 'x-auth-token': token } });
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
      alert('Failed to remove duplicates');
    } finally {
      setCleaning(false);
    }
  };

  const handleResetLeaderboard = async () => {
    if (!window.confirm("WARNING: This will zero out ALL user rank points and solved counts. Are you sure?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/admin/reset-leaderboard', {}, { headers: { 'x-auth-token': token } });
      alert(res.data.message);
    } catch (err) { alert('Failed to reset leaderboard'); }
  };

  const handleClearIdleExams = async () => {
    if (!window.confirm("Clear all abandoned exams older than 2 days?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/admin/clear-idle-exams', {}, { headers: { 'x-auth-token': token } });
      alert(res.data.message);
    } catch (err) { alert('Failed to clear idle exams'); }
  };

  const handleRevokePremium = async () => {
    if (!revokeEmail) return alert('Enter email');
    if (!window.confirm(`Revoke premium and end trial for ${revokeEmail}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/admin/revoke-premium', { email: revokeEmail }, { headers: { 'x-auth-token': token } });
      alert(res.data.message);
      setRevokeEmail('');
    } catch (err) { alert(err.response?.data?.message || 'Revoke failed'); }
  };

  const handleSetSystemMessage = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/admin/set-system-message', { message: systemMessage }, { headers: { 'x-auth-token': token } });
      alert('System message updated! It will now appear on all user dashboards.');
    } catch (err) { alert('Failed to update system message'); }
  };

  const handleInspectUser = async () => {
    if (!inspectEmail) return;
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/api/admin/inspect-user/${inspectEmail}`, { headers: { 'x-auth-token': token } });
      setInspectedUser(res.data);
    } catch (err) { 
      alert(err.response?.data?.message || 'User not found'); 
      setInspectedUser(null);
    }
  };

  const handleToggleMaintenance = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/admin/toggle-maintenance', { enabled: !maintenanceEnabled }, { headers: { 'x-auth-token': token } });
      setMaintenanceEnabled(res.data.is_maintenance_mode);
      alert(`Maintenance Mode is now ${res.data.is_maintenance_mode ? 'ON' : 'OFF'}`);
    } catch (err) { alert('Toggle failed'); }
  };

  const handleResetSubjectStats = async () => {
    if (!cleanStatsEmail) return alert('Enter email');
    if (cleanSelectedSubjects.length === 0) return alert('Select at least one subject');
    
    const subjectList = cleanSelectedSubjects.map(s => subjectLabels[s] || s).join(', ');
    if (!window.confirm(`Are you sure you want to completely remove stats for subjects (${subjectList}) for user ${cleanStatsEmail}? This cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await api.post('/api/admin/reset-subject-stats', {
        email: cleanStatsEmail,
        subjects: cleanSelectedSubjects
      }, { headers: { 'x-auth-token': token } });
      
      alert(res.data.message);
      setCleanStatsEmail('');
      setCleanSelectedSubjects([]);
      
      // Refresh the users list so statistics update on screen
      const usersRes = await api.get('/api/admin/users', { headers: { 'x-auth-token': token } });
      setUsersList(usersRes.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Reset failed');
    }
  };


  const adminCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Daily Active', value: stats.dailyActive, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Contest Regs', value: stats.contestRegs, icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const fetchBreakdown = async () => {
    if (subjectBreakdown.length > 0) { setShowBreakdown(v => !v); return; }
    setShowBreakdown(true);
    setLoadingBreakdown(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/admin/question-breakdown', { headers: { 'x-auth-token': token } });
      setSubjectBreakdown(res.data);
    } catch (err) { console.error(err); }
    finally { setLoadingBreakdown(false); }
  };

  const subjectColors = {
    pedagogy: 'bg-violet-500', hindi: 'bg-rose-500', english: 'bg-sky-500',
    math: 'bg-amber-500', evs: 'bg-green-500', science: 'bg-cyan-500',
    social: 'bg-orange-500', sanskrit: 'bg-pink-500', urdu: 'bg-teal-500'
  };
  const subjectLabels = {
    pedagogy: 'Pedagogy', hindi: 'Hindi', english: 'English',
    math: 'Math', evs: 'EVS', science: 'Science',
    social: 'Social', sanskrit: 'Sanskrit', urdu: 'Urdu'
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="loader"></div>
      <p className="text-slate-500 font-bold animate-pulse">Loading admin data...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 px-5 pt-6 pb-32 max-w-md mx-auto w-full animate-fade-in">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Admin <span className="text-sky-400">Panel</span></h1>
            <p className="text-slate-400 text-sm font-medium leading-none mt-0.5">Control Center</p>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 active:scale-95 transition-all"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3">

        {/* Total Questions — Expandable Card */}
        <div
          className="glass-card cursor-pointer select-none transition-all"
          onClick={fetchBreakdown}
        >
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Database size={22} />
            </div>
            <div className="flex-1">
              <span className="text-2xl font-black text-[var(--text-primary)]">{stats.totalQuestions.toLocaleString()}</span>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Questions</div>
            </div>
            <div className={`text-slate-400 transition-transform duration-300 ${showBreakdown ? 'rotate-180' : ''}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          {/* Expandable Subject Breakdown */}
          {showBreakdown && (
            <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5">
              {loadingBreakdown ? (
                <div className="text-center text-slate-500 text-xs py-2 animate-pulse">Loading breakdown...</div>
              ) : (
                subjectBreakdown.map((item) => {
                  const maxCount = Math.max(...subjectBreakdown.map(x => x.count), 1);
                  const pct = Math.round((item.count / maxCount) * 100);
                  return (
                    <div key={item.subject}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-[var(--text-primary)] capitalize">{subjectLabels[item.subject] || item.subject}</span>
                        <span className="text-xs font-black text-emerald-400">{item.count.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${subjectColors[item.subject] || 'bg-slate-500'} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Other stat cards */}
        {adminCards.map((card, i) => (
          <div key={i} className="glass-card flex items-center gap-5">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
              <card.icon size={22} />
            </div>
            <div>
              <span className="text-2xl font-black text-[var(--text-primary)]">{card.value.toLocaleString()}</span>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</div>
            </div>
          </div>
        ))}
      </div>


      {/* Premium Service Management */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
          <ShieldCheck size={12} /> Premium Service Management
        </h3>
        <div className="glass-card space-y-6">
          {/* Global Toggle */}
          <div className="flex items-center justify-between p-1">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Enforce Subscription</h4>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Redirect users to plans if trial ended</p>
            </div>
            <button 
              onClick={handleTogglePremium}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${premiumEnabled ? 'bg-sky-500' : 'bg-slate-700'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${premiumEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Maintenance Mode Toggle */}
          <div className="flex items-center justify-between p-1">
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)]">Maintenance Mode</h4>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Restrict app access for maintenance</p>
            </div>
            <button 
              onClick={handleToggleMaintenance}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${maintenanceEnabled ? 'bg-rose-500' : 'bg-slate-700'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${maintenanceEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="h-px bg-white/5 w-full" />

          {/* Manual Bypass */}
          <div className="space-y-4 pt-1">
            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Manual User Bypass (Grant Free Plan)</h4>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="User Email"
                value={grantEmail}
                onChange={(e) => setGrantEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] font-medium outline-none focus:border-sky-500/50 transition-all"
              />
              <div className="flex gap-2">
                <select 
                  value={grantMonths}
                  onChange={(e) => setGrantMonths(parseInt(e.target.value))}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] font-medium outline-none focus:border-sky-500/50 appearance-none"
                >
                  <option value={1} className="bg-slate-900">1 Month</option>
                  <option value={3} className="bg-slate-900">3 Months</option>
                  <option value={6} className="bg-slate-900">6 Months</option>
                  <option value={12} className="bg-slate-900">1 Year</option>
                  <option value={120} className="bg-slate-900">Lifetime</option>
                </select>
                <button 
                  onClick={handleGrantPremium}
                  className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  Grant Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Management */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
          <Clock size={12} /> Live Contest Settings
        </h3>
        <div className="glass-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Start Time (IST)</label>
              <input 
                type="time" 
                value={contestSettings.start_time}
                onChange={(e) => setContestSettings({...contestSettings, start_time: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] font-bold outline-none focus:border-sky-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Duration (Mins)</label>
              <input 
                type="number" 
                value={contestSettings.duration}
                onChange={(e) => setContestSettings({...contestSettings, duration: parseInt(e.target.value) || 0})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] font-bold outline-none focus:border-sky-500/50"
              />
            </div>
          </div>
          <button 
            onClick={handleUpdateContest}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-sky-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
          >
            {saving ? 'Updating...' : <><Save size={14} /> Update Contest Time</>}
          </button>
        </div>
      </div>

      {/* Global App Settings */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Global App Settings</h3>
        <div className="glass-card space-y-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Message / Banner Alert</label>
            <textarea 
              rows={3}
              value={systemMessage}
              onChange={(e) => setSystemMessage(e.target.value)}
              placeholder="E.g., Server maintenance at 12 PM. Expect 5 mins downtime."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] font-medium outline-none focus:border-sky-500/50 transition-all resize-none"
            />
          </div>
          <button 
            onClick={handleSetSystemMessage}
            className="w-full py-3 rounded-xl bg-sky-500 text-white font-black text-xs shadow-lg shadow-sky-500/20 active:scale-95 transition-all"
          >
            Publish System Message
          </button>
        </div>
      </div>

      {/* User Directory & Management */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
          <Users size={12} /> User Directory & Management
        </h3>
        <div className="glass-card space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="bg-white/5 border border-white/10 w-full rounded-xl pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-sky-500/50 transition-all font-medium"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-3.5 text-slate-500" size={16} />
          </div>

          <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
            {usersList
              .filter(user => 
                user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                user.email?.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(user => (
                <div key={user._id} className="p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-3">
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-indigo-600/20 border border-sky-500/20 flex items-center justify-center font-black text-sky-400 text-sm shrink-0">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-black text-sm text-[var(--text-primary)] leading-tight">{user.name}</h4>
                          {editingUserId !== user._id && (
                            <button 
                              onClick={() => handleEditName(user)}
                              className="text-slate-500 hover:text-sky-400 transition-colors"
                              title="Edit User"
                            >
                              <Edit2 size={12} />
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold lowercase tracking-wide mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded h-fit ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'}`}>
                        {user.role}
                      </span>
                      <button 
                        onClick={() => handleDeleteUser(user._id, user.name)}
                        className="text-rose-500 hover:text-rose-400 p-1 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-all hover:bg-rose-500/20 h-fit"
                        title="Delete User"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {editingUserId === user._id && (
                    <div className="flex flex-col gap-3 mt-1 bg-slate-950/40 p-3 rounded-xl border border-white/5 w-full max-w-full">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Name</label>
                        <input 
                          type="text" 
                          value={editingName} 
                          onChange={e => setEditingName(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-sky-500 transition-colors"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Level</label>
                          <select
                            value={editingLevel}
                            onChange={e => setEditingLevel(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-2 py-2 text-xs text-white font-bold outline-none focus:border-sky-500 transition-colors"
                          >
                            <option value="primary">Primary</option>
                            <option value="junior">Junior</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lang I</label>
                          <select
                            value={editingLanguage1}
                            onChange={e => setEditingLanguage1(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-2 py-2 text-xs text-white font-bold outline-none focus:border-sky-500 transition-colors"
                          >
                            <option value="Hindi">Hindi</option>
                            <option value="English">English</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lang II</label>
                          <select
                            value={editingLanguage2}
                            onChange={e => setEditingLanguage2(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-2 py-2 text-xs text-white font-bold outline-none focus:border-sky-500 transition-colors"
                          >
                            <option value="English">English</option>
                            <option value="Sanskrit">Sanskrit</option>
                            <option value="Urdu">Urdu</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button 
                          onClick={() => setEditingUserId(null)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5"
                        >
                          <X size={12} /> Cancel
                        </button>
                        <button 
                          onClick={() => handleSaveName(user._id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5"
                        >
                          <CheckCircle size={12} /> Save
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Stats Grid */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
                    <div className="text-center bg-white/5 rounded-lg py-1.5 px-1">
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Solved</div>
                      <div className="text-xs font-black text-[var(--text-primary)]">{user.questions_solved || 0}</div>
                    </div>
                    <div className="text-center bg-white/5 rounded-lg py-1.5 px-1">
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Points</div>
                      <div className="text-xs font-black text-sky-400">{user.rank_points || 0}</div>
                    </div>
                    <div className="text-center bg-white/5 rounded-lg py-1.5 px-1">
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Exams</div>
                      <div className="text-xs font-black text-purple-400">{user.examsTaken || 0}</div>
                    </div>
                    <div className="text-center bg-white/5 rounded-lg py-1.5 px-1">
                      <div className="text-[7px] font-black text-slate-500 uppercase tracking-wider">Avg Score</div>
                      <div className="text-xs font-black text-emerald-400">{user.avgScore || 0}%</div>
                    </div>
                  </div>

                  {/* Detail pills */}
                  <div className="flex gap-2 flex-wrap items-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      Level: {user.level || 'primary'}
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
                      Lang: {user.language1}/{user.language2}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${user.is_premium ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/30 text-slate-400 border border-slate-700/30'}`}>
                      {user.is_premium ? 'Premium' : 'Free Trial'}
                    </span>
                  </div>
                </div>
              ))}
            {usersList.filter(user => 
              user.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
              user.email?.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 && (
              <div className="text-center py-8 text-slate-500 font-bold text-xs">
                No users found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Content Management</h3>
        <div className="flex flex-col gap-3">
          <button className="glass-card flex items-center gap-4 text-left active:scale-[0.98] transition-all">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
              <FilePlus size={22} />
            </div>
            <div>
              <h4 className="font-black text-[var(--text-primary)] text-sm">Upload Paper</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Import PDF or CSV</p>
            </div>
          </button>
          
          <button 
            onClick={handleRemoveDuplicates}
            disabled={cleaning}
            className="glass-card flex items-center gap-4 text-left active:scale-[0.98] transition-all"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <Database size={22} />
            </div>
            <div>
              <h4 className="font-black text-[var(--text-primary)] text-sm">{cleaning ? 'Scanning Database...' : 'Clean Duplicates'}</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Remove identical questions</p>
            </div>
          </button>
          <button 
            onClick={handleClearIdleExams}
            className="glass-card flex items-center gap-4 text-left active:scale-[0.98] transition-all"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <Database size={22} />
            </div>
            <div>
              <h4 className="font-black text-[var(--text-primary)] text-sm">Clear Abandoned Exams</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Free up database space</p>
            </div>
          </button>

          <button 
            onClick={handleResetLeaderboard}
            className="glass-card flex items-center gap-4 text-left active:scale-[0.98] transition-all"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-400">
              <Activity size={22} />
            </div>
            <div>
              <h4 className="font-black text-[var(--text-primary)] text-sm">Reset Leaderboard</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Zero out all points</p>
            </div>
          </button>

          <div className="glass-card p-4 space-y-4">
             <h4 className="font-black text-[var(--text-primary)] text-sm border-b border-white/5 pb-2">Revoke Access</h4>
             <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="User Email to Revoke" 
                  className="bg-white/5 flex-1 rounded-xl px-3 py-2 text-xs font-semibold"
                  value={revokeEmail}
                  onChange={e => setRevokeEmail(e.target.value)}
                />
                <button 
                  onClick={handleRevokePremium}
                  className="bg-rose-500/10 text-rose-500 border border-rose-500/20 px-3 py-2 rounded-xl font-bold text-xs hover:bg-rose-500 hover:text-white transition-all"
                >
                  Revoke
                </button>
             </div>
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Removes premium & ends trial instantly</p>
          </div>

          <div className="glass-card p-4 space-y-4">
             <h4 className="font-black text-[var(--text-primary)] text-sm border-b border-white/5 pb-2">Reset Stats by Subject</h4>
             <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="User Email to Reset" 
                  className="w-full bg-white/5 rounded-xl px-3 py-2 text-xs font-semibold"
                  value={cleanStatsEmail}
                  onChange={e => setCleanStatsEmail(e.target.value)}
                />
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Select Subjects to Remove</label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Object.entries(subjectLabels).map(([subKey, subLabel]) => {
                      const isSelected = cleanSelectedSubjects.includes(subKey);
                      return (
                        <button
                          key={subKey}
                          onClick={() => {
                            if (isSelected) {
                              setCleanSelectedSubjects(prev => prev.filter(s => s !== subKey));
                            } else {
                              setCleanSelectedSubjects(prev => [...prev, subKey]);
                            }
                          }}
                          type="button"
                          className={`px-2 py-1 rounded-lg text-[9px] font-bold border transition-all ${
                            isSelected 
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm' 
                              : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'
                          }`}
                        >
                          {subLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={handleResetSubjectStats}
                  className="w-full bg-amber-500/10 text-amber-500 border border-amber-500/20 py-2 rounded-xl font-bold text-xs hover:bg-amber-500 hover:text-white transition-all active:scale-[0.98]"
                >
                  Reset Stats
                </button>
             </div>
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Deletes subject exams & adjusts rankings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
