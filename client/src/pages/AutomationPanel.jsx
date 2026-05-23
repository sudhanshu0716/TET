import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Cpu, Play, Settings, RefreshCw, CheckCircle, 
  XCircle, Loader, Terminal, GitBranch, ShieldAlert, KeyRound,
  ExternalLink, Clock, User, ChevronRight, Check
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const AutomationPanel = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Config States
  const [config, setConfig] = useState({ is_configured: false, owner: '', repo: '', has_token: false });
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [formConfig, setFormConfig] = useState({ token: '', owner: 'sudhanshu0716', repo: 'TET' });
  const [savingConfig, setSavingConfig] = useState(false);

  // Workflow runs states
  const [workflows, setWorkflows] = useState([]);
  const [runs, setRuns] = useState([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const [triggeringId, setTriggeringId] = useState(null);
  const [targetBranches, setTargetBranches] = useState({}); // mapping workflow.id -> branchName

  // Detail Modal States
  const [activeRun, setActiveRun] = useState(null);
  const [runDetails, setRunDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const detailsIntervalRef = useRef(null);

  // General Notification Alert
  const [toast, setToast] = useState(null);

  const triggerToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Fetch Config
  const fetchConfigStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/admin/automation/config', {
        headers: { 'x-auth-token': token }
      });
      setConfig(res.data);
      if (!res.data.is_configured) {
        setShowConfigForm(true);
      } else {
        fetchWorkflowsAndRuns();
      }
    } catch (err) {
      console.error(err);
      triggerToast('Failed to check configuration status.', true);
    } finally {
      setLoadingConfig(false);
    }
  };

  // 2. Save Config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!formConfig.owner || !formConfig.repo) {
      return triggerToast('Owner and Repository name are required.', true);
    }
    setSavingConfig(true);
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/admin/automation/config', formConfig, {
        headers: { 'x-auth-token': token }
      });
      triggerToast('GitHub credentials saved successfully!');
      setShowConfigForm(false);
      fetchConfigStatus();
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Failed to save configuration.', true);
    } finally {
      setSavingConfig(false);
    }
  };

  // 3. Fetch Workflows & Runs
  const fetchWorkflowsAndRuns = async () => {
    setLoadingWorkflows(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/api/admin/automation/workflows', {
        headers: { 'x-auth-token': token }
      });
      setWorkflows(res.data.workflows);
      setRuns(res.data.runs);
      
      // Initialize target branches for workflows to 'main'
      const branchMap = {};
      res.data.workflows.forEach(w => {
        branchMap[w.id] = targetBranches[w.id] || 'main';
      });
      setTargetBranches(branchMap);
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Failed to load GitHub workflows.', true);
    } finally {
      setLoadingWorkflows(false);
    }
  };

  // 4. Trigger Workflow Run
  const handleTriggerWorkflow = async (workflowId) => {
    const branchName = targetBranches[workflowId] || 'main';
    setTriggeringId(workflowId);
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/admin/automation/workflows/${workflowId}/trigger`, {
        ref: branchName
      }, {
        headers: { 'x-auth-token': token }
      });
      triggerToast(`Successfully requested run on branch "${branchName}"!`);
      // Wait 3 seconds and refresh list to show the new run
      setTimeout(() => {
        fetchWorkflowsAndRuns();
      }, 3000);
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || 'Failed to trigger workflow.', true);
    } finally {
      setTriggeringId(null);
    }
  };

  // 5. Fetch Specific Run details
  const fetchRunDetails = async (runId, silent = false) => {
    if (!silent) setLoadingDetails(true);
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/api/admin/automation/runs/${runId}/details`, {
        headers: { 'x-auth-token': token }
      });
      setRunDetails(res.data);
    } catch (err) {
      console.error(err);
      if (!silent) triggerToast('Failed to load run steps details.', true);
    } finally {
      if (!silent) setLoadingDetails(false);
    }
  };

  // Open Details Modal and start polling
  const handleOpenDetails = (run) => {
    setActiveRun(run);
    setRunDetails(null);
    fetchRunDetails(run.id);
    
    // Poll every 5 seconds if run is in progress
    if (run.status === 'in_progress' || run.status === 'queued') {
      detailsIntervalRef.current = setInterval(() => {
        fetchRunDetails(run.id, true);
      }, 5000);
    }
  };

  // Close Details Modal and stop polling
  const handleCloseDetails = () => {
    setActiveRun(null);
    setRunDetails(null);
    if (detailsIntervalRef.current) {
      clearInterval(detailsIntervalRef.current);
      detailsIntervalRef.current = null;
    }
    // Refresh main list in case status updated
    fetchWorkflowsAndRuns();
  };

  useEffect(() => {
    if (isAdmin) {
      fetchConfigStatus();
    }
    return () => {
      if (detailsIntervalRef.current) {
        clearInterval(detailsIntervalRef.current);
      }
    };
  }, [isAdmin]);

  // Non-admin Access Denied Guard
  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center bg-[#0B0F19] text-white">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/20 flex items-center justify-center mb-6 text-rose-500">
          <ShieldAlert size={40} />
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2">Access Denied</h1>
        <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
          You do not have administrative privileges to access this panel.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-slate-200 font-black text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Format runs duration
  const getDuration = (run) => {
    if (!run.updated_at || !run.run_started_at) return '';
    const diff = new Date(run.updated_at) - new Date(run.run_started_at);
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins}m ${remSecs}s`;
  };

  const getStatusIcon = (status, conclusion) => {
    if (status === 'in_progress') {
      return <Loader className="text-amber-500 animate-spin shrink-0" size={16} />;
    }
    if (status === 'queued') {
      return <Clock className="text-slate-400 animate-pulse shrink-0" size={16} />;
    }
    if (conclusion === 'success') {
      return <CheckCircle className="text-emerald-400 shrink-0" size={16} />;
    }
    if (conclusion === 'failure') {
      return <XCircle className="text-rose-500 shrink-0" size={16} />;
    }
    return <Clock className="text-slate-400 shrink-0" size={16} />;
  };

  const getStatusBg = (status, conclusion) => {
    if (status === 'in_progress') return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (status === 'queued') return 'bg-slate-500/15 text-slate-400 border border-slate-500/10';
    if (conclusion === 'success') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (conclusion === 'failure') return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
    return 'bg-slate-500/10 text-slate-400';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0F19] text-white px-5 pt-6 pb-32 max-w-md mx-auto w-full relative overflow-hidden select-none">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full bg-purple-500/10 blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full bg-cyan-500/10 blur-[80px]" />

      <header className="flex justify-between items-center relative z-10 mb-6">
        <button 
          onClick={() => navigate('/admin')}
          className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/20 text-purple-300 border border-purple-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
          <Cpu size={12} />
          DevOps
        </span>
      </header>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-0 right-0 max-w-sm mx-auto z-[999] px-4 py-3 rounded-2xl border text-xs font-bold shadow-2xl flex items-center gap-2 ${
              toast.isError 
                ? 'bg-rose-950/80 border-rose-800 text-rose-300' 
                : 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
            }`}
          >
            {toast.isError ? <XCircle size={16} /> : <CheckCircle size={16} />}
            <span>{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1 mb-6 relative z-10">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          Automation <span className="text-purple-400">Panel</span>
        </h1>
        <p className="text-xs text-slate-400 font-semibold">
          GitHub Actions integration, dispatches & execution status logs.
        </p>
      </div>

      {loadingConfig ? (
        <div className="flex flex-col items-center justify-center flex-1 py-12 gap-3 relative z-10">
          <Loader className="text-purple-400 animate-spin" size={32} />
          <p className="text-xs font-bold text-slate-500 animate-pulse uppercase tracking-wider">Checking DevOps Configuration...</p>
        </div>
      ) : (
        <div className="space-y-6 relative z-10">
          
          {/* CREDENTIAL CONFIGURATION FORM */}
          {showConfigForm && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card space-y-4 border-2 border-purple-500/20"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-wider flex items-center gap-2">
                  <KeyRound size={14} className="text-purple-400" /> Setup GitHub Integration
                </h3>
                {config.is_configured && (
                  <button 
                    onClick={() => setShowConfigForm(false)}
                    className="text-slate-400 text-xs font-bold"
                  >
                    Cancel
                  </button>
                )}
              </div>
              <form onSubmit={handleSaveConfig} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">GitHub PAT (Token)</label>
                  <input 
                    type="password" 
                    placeholder={config.has_token ? "••••••••••••••••••••" : "Enter Personal Access Token"}
                    value={formConfig.token}
                    onChange={e => setFormConfig({...formConfig, token: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Repository Owner</label>
                    <input 
                      type="text" 
                      placeholder="e.g. sudhanshu0716"
                      value={formConfig.owner}
                      onChange={e => setFormConfig({...formConfig, owner: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Repository Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. TET"
                      value={formConfig.repo}
                      onChange={e => setFormConfig({...formConfig, repo: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="w-full py-3 rounded-xl bg-purple-600 text-white font-black text-xs hover:bg-purple-700 transition-colors active:scale-95 shadow-lg shadow-purple-600/25"
                >
                  {savingConfig ? 'Saving...' : 'Save Configuration'}
                </button>
              </form>
            </motion.div>
          )}

          {config.is_configured && !showConfigForm && (
            <div className="glass-card flex items-center justify-between p-3.5 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-white/5">
              <div className="space-y-0.5">
                <span className="text-[8px] font-black uppercase text-purple-400 tracking-wider">Configured Repo</span>
                <h4 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                  {config.owner}/{config.repo}
                  <a 
                    href={`https://github.com/${config.owner}/${config.repo}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-slate-500 hover:text-sky-400"
                  >
                    <ExternalLink size={12} />
                  </a>
                </h4>
              </div>
              <button
                onClick={() => {
                  setFormConfig({ token: '', owner: config.owner, repo: config.repo });
                  setShowConfigForm(true);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                title="Edit GitHub Settings"
              >
                <Settings size={14} />
              </button>
            </div>
          )}

          {/* ACTIVE WORKFLOWS */}
          {config.is_configured && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Active GitHub Workflows</h3>
                <button 
                  onClick={fetchWorkflowsAndRuns} 
                  disabled={loadingWorkflows}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw className={`shrink-0 ${loadingWorkflows ? 'animate-spin' : ''}`} size={12} />
                </button>
              </div>

              {loadingWorkflows && workflows.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-bold animate-pulse">Loading workflows...</div>
              ) : (
                <div className="space-y-2.5">
                  {workflows
                    .filter(w => w.state === 'active')
                    .map(workflow => (
                      <div key={workflow.id} className="glass-card p-4 flex flex-col gap-3.5">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h4 className="font-black text-sm text-slate-200 leading-tight">{workflow.name}</h4>
                            <p className="text-[9px] text-slate-500 font-bold tracking-wide break-all select-all">
                              {workflow.path}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => handleTriggerWorkflow(workflow.id)}
                            disabled={triggeringId === workflow.id}
                            className="px-4.5 py-2.5 rounded-xl bg-purple-600 text-white font-black text-xs shadow-lg shadow-purple-600/20 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                          >
                            {triggeringId === workflow.id ? (
                              <Loader className="animate-spin" size={13} />
                            ) : (
                              <Play size={13} fill="currentColor" />
                            )}
                            Trigger
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-xl border border-white/5 w-full">
                          <GitBranch className="text-purple-400 shrink-0" size={14} />
                          <div className="flex-1 min-w-0">
                            <label className="text-[7px] font-black text-slate-500 uppercase tracking-widest block">Branch Ref</label>
                            <input
                              type="text"
                              value={targetBranches[workflow.id] || 'main'}
                              onChange={(e) => setTargetBranches({
                                ...targetBranches,
                                [workflow.id]: e.target.value
                              })}
                              className="w-full bg-transparent text-[11px] font-bold text-slate-200 outline-none mt-0.5 border-none p-0 focus:ring-0"
                              placeholder="e.g. main"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  {workflows.length === 0 && !loadingWorkflows && (
                    <div className="text-center py-6 text-slate-500 text-xs font-bold italic bg-white/5 border border-white/5 rounded-2xl">
                      No active workflows found in repository. Add `.yml` files in `.github/workflows` folder.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* RECENT RUNS HISTORY */}
          {config.is_configured && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Workflow Executions</h3>
                <span className="text-[9px] font-black text-slate-500">Auto-refresh standby</span>
              </div>

              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {runs.map(run => (
                  <div 
                    key={run.id}
                    onClick={() => handleOpenDetails(run)}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${getStatusBg(run.status, run.conclusion)}`}>
                          {run.status === 'completed' ? run.conclusion : run.status}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <GitBranch size={10} /> {run.head_branch}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-200 truncate leading-snug group-hover:text-purple-300 transition-colors">
                        {run.display_title || run.head_commit?.message || 'Workflow run'}
                      </h4>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold">
                        <span className="flex items-center gap-1"><Clock size={11} /> {getDuration(run) || 'running'}</span>
                        <span className="flex items-center gap-1"><User size={11} /> {run.triggering_actor?.login || 'system'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      {getStatusIcon(run.status, run.conclusion)}
                      <ChevronRight className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" size={16} />
                    </div>
                  </div>
                ))}
                {runs.length === 0 && !loadingWorkflows && (
                  <div className="text-center py-8 text-slate-500 text-xs font-bold italic">
                    No run logs found. Trigger a workflow first!
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* DETAILS DRAWER / MODAL */}
      <AnimatePresence>
        {activeRun && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-4">
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#0B0F19] w-full max-w-md rounded-3xl border border-white/10 p-5 space-y-5 max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${getStatusBg(activeRun.status, activeRun.conclusion)}`}>
                      {activeRun.status === 'completed' ? activeRun.conclusion : activeRun.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Run #{activeRun.run_number}</span>
                  </div>
                  <h3 className="text-base font-black text-slate-100 truncate mt-1">
                    {activeRun.display_title || activeRun.head_commit?.message || 'Workflow steps'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseDetails}
                  className="p-2 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white"
                >
                  <XCircle size={18} />
                </button>
              </div>

              {/* Steps Progress Check list */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                {loadingDetails && !runDetails ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-500">
                    <Loader className="animate-spin text-purple-500" size={24} />
                    <span className="text-xs font-bold uppercase tracking-wider animate-pulse">Fetching Run Steps...</span>
                  </div>
                ) : (
                  runDetails?.jobs.map((job) => (
                    <div key={job.id} className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-1">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Terminal size={12} className="text-purple-400" /> Job: {job.name}
                        </h4>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {job.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {job.steps.map((step, idx) => (
                          <div 
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-xl border text-[11px] font-semibold transition-all ${
                              step.status === 'completed' 
                                ? (step.conclusion === 'success' ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-300' : 'bg-rose-500/5 border-rose-500/10 text-rose-400')
                                : (step.status === 'in_progress' ? 'bg-amber-500/5 border-amber-500/20 text-amber-300 font-bold animate-pulse' : 'bg-white/5 border-white/5 text-slate-500')
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black border ${
                                step.status === 'completed'
                                  ? (step.conclusion === 'success' ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300' : 'bg-rose-500/20 border-rose-400/30 text-rose-300')
                                  : (step.status === 'in_progress' ? 'bg-amber-500/20 border-amber-400/30 text-amber-300 animate-spin' : 'bg-white/10 border-white/10 text-slate-400')
                              }`}>
                                {step.status === 'completed' && step.conclusion === 'success' ? (
                                  <Check size={10} />
                                ) : (
                                  idx + 1
                                )}
                              </span>
                              <span className="truncate leading-none">{step.name}</span>
                            </div>
                            
                            <span className="text-[9px] font-bold text-slate-500 shrink-0 ml-2">
                              {step.status === 'completed' ? (step.conclusion === 'success' ? 'Succeeded' : 'Failed') : step.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-white/5 text-center text-[9px] text-slate-500 font-bold">
                Runs logs are synced directly from GitHub Action Runner.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AutomationPanel;
