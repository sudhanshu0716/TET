import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Questions', value: stats.totalQuestions, icon: Database, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Daily Participation', value: stats.dailyActive, icon: Activity, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Control Center</h1>
          <p className="text-slate-400 text-sm">Monitor and manage exam content</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
          <ShieldCheck size={20} />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {adminCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={20} />
            </div>
            <span className="text-3xl font-bold text-white">{card.value.toLocaleString()}</span>
            <span className="text-sm text-slate-500">{card.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Content Management</h3>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-left transition-all hover:bg-slate-900">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 text-primary-500">
              <FilePlus size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Upload Paper</h4>
              <p className="text-xs text-slate-500">Import PDF or CSV questions</p>
            </div>
          </button>

          <button className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-left transition-all hover:bg-slate-900">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
              <BarChart2 size={24} />
            </div>
            <div>
              <h4 className="font-bold text-white">Advanced Analytics</h4>
              <p className="text-xs text-slate-500">View detailed performance reports</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity Table (Placeholder) */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Users</h3>
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="border-b border-slate-800 bg-slate-800/50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Level</th>
                <th className="px-6 py-4 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[1, 2, 3].map((_, i) => (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="px-6 py-4 font-medium text-white">User_{i+100}</td>
                  <td className="px-6 py-4">Primary</td>
                  <td className="px-6 py-4 text-xs">Today, 10:24 AM</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
