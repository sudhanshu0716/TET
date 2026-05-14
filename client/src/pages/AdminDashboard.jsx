import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FilePlus, Database, ShieldCheck, Activity, BarChart2 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    dailyActive: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking stats for now
    setTimeout(() => {
      setStats({
        totalUsers: 1240,
        totalQuestions: 5430,
        dailyActive: 450
      });
      setLoading(false);
    }, 1000);
  }, []);

  const adminCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Questions', value: stats.totalQuestions, icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Daily Active', value: stats.dailyActive, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
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
          <h1 className="text-2xl font-black text-white tracking-tight">Admin <span className="text-sky-400">Panel</span></h1>
          <p className="text-slate-400 text-sm font-medium">Monitor and manage content</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck size={20} />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-3">
        {adminCards.map((card, i) => (
          <div
            key={i}
            className="glass-card flex items-center gap-5"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.bg} ${card.color}`}>
              <card.icon size={22} />
            </div>
            <div>
              <span className="text-2xl font-black text-white">{card.value.toLocaleString()}</span>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</div>
            </div>
          </div>
        ))}
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
              <h4 className="font-black text-white text-sm">Upload Paper</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Import PDF or CSV</p>
            </div>
          </button>

          <button className="glass-card flex items-center gap-4 text-left active:scale-[0.98] transition-all">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <BarChart2 size={22} />
            </div>
            <div>
              <h4 className="font-black text-white text-sm">Analytics</h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Performance reports</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Recent Users</h3>
        <div className="glass-card !p-0 overflow-hidden">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className={`flex items-center justify-between px-5 py-4 ${i < 2 ? 'border-b border-white/5' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 text-xs font-black">
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-sm font-bold text-white">User_{i+100}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Primary</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
