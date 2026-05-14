import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FilePlus, Database, ShieldCheck, Activity, BarChart2, Clock, Save } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    dailyActive: 0,
    contestRegs: 0
  });
  const [contestSettings, setContestSettings] = useState({ start_time: '20:30', duration: 30 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [statsRes, contestRes] = await Promise.all([
          api.get('/api/admin/stats', { headers: { 'x-auth-token': token } }),
          api.get('/api/admin/contest-settings', { headers: { 'x-auth-token': token } })
        ]);
        setStats(statsRes.data);
        setContestSettings(contestRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <div>
          <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">Admin <span className="text-sky-400">Panel</span></h1>
          <p className="text-slate-400 text-sm font-medium">Monitor and manage content</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck size={20} />
        </div>
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
                onChange={(e) => setContestSettings({...contestSettings, duration: parseInt(e.target.value)})}
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

      {/* Actions */}
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
          <button className="glass-card flex items-center gap-4 text-left active:scale-[0.98] transition-all">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <BarChart2 size={22} />
            </div>
            <div>
              <h4 className="font-black text-[var(--text-primary)] text-sm">Analytics</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Performance reports</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
