import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  Users, Database, ShieldCheck, Activity, BarChart2, Clock, Save, 
  Search, Trash2, Send, CheckCircle, AlertTriangle, UserMinus,
  Sparkles, Settings, ShieldAlert, Trophy, Zap, FilePlus, LogOut
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
  const [contestSettings, setContestSettings] = useState({ start_time: '20:30', duration: 30 });
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
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, contestRes, premiumRes, activityRes] = await Promise.all([
          api.get('/api/admin/stats', { headers: { 'x-auth-token': token } }),
          api.get('/api/admin/contest-settings', { headers: { 'x-auth-token': token } }),
          api.get('/api/admin/premium-status', { headers: { 'x-auth-token': token } }),
          api.get('/api/admin/recent-activity', { headers: { 'x-auth-token': token } })
        ]);
        setStats(statsRes.data);
        setContestSettings(contestRes.data);
        setPremiumEnabled(premiumRes.data.premium_service_enabled);
        setSystemMessage(premiumRes.data.system_message || '');
        setMaintenanceEnabled(premiumRes.data.is_maintenance_mode || false);
        setRecentActivity(activityRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const adminCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Questions', value: stats.totalQuestions, icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Daily Active', value: stats.dailyActive, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Contest Regs', value: stats.contestRegs, icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

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

      {/* Recent Activity Feed */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
          <Activity size={12} /> Recent App Activity
        </h3>
        <div className="glass-card divide-y divide-white/5 p-0 overflow-hidden">
          {recentActivity.length > 0 ? recentActivity.map((act, i) => (
            <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">{act.user_id?.name || 'Unknown User'}</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <span className="text-sky-400">{act.subject || act.type || 'Mock Test'}</span>
                  <span>•</span>
                  <span>{new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-emerald-400">{act.score} pts</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</div>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No recent activity</div>
          )}
        </div>
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

      {/* User Inspector */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">User Lookup & Inspection</h3>
        <div className="glass-card space-y-4">
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="User Email" 
              className="bg-white/5 border border-white/10 flex-1 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-sky-500/50 transition-all"
              value={inspectEmail}
              onChange={e => setInspectEmail(e.target.value)}
            />
            <button 
              onClick={handleInspectUser}
              className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              Inspect
            </button>
          </div>
          
          {inspectedUser && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900/50 border border-white/10 space-y-3 animate-fade-in text-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 font-medium">Name:</span>
                <span className="text-white font-black">{inspectedUser.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 font-medium">Role:</span>
                <span className={`font-black uppercase tracking-wider text-[10px] px-2 py-1 rounded-md ${inspectedUser.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'}`}>{inspectedUser.role}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className={`font-black uppercase tracking-wider text-[10px] px-2 py-1 rounded-md ${inspectedUser.is_premium ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'}`}>{inspectedUser.is_premium ? 'Premium' : 'Free Trial'}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-slate-400 font-medium">Questions Solved:</span>
                <span className="text-white font-black">{inspectedUser.questions_solved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Rank Points:</span>
                <span className="text-white font-black">{inspectedUser.rank_points}</span>
              </div>
            </div>
          )}
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
