import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    level: 'primary',
    language1: 'Hindi',
    language2: 'English',
    subject_preference: 'none'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 pt-16 px-6 max-w-md mx-auto w-full pb-20 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
          Create <br/>
          <span className="text-gradient">Account</span>
        </h1>
        <p className="text-slate-400 font-medium">Join 5,000+ successful candidates</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl text-sm font-bold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors pointer-events-none z-10">
            <User size={22} />
          </div>
          <input
            type="text"
            placeholder="Full Name"
            required
            className="glass-input w-full rounded-2xl py-5 pl-14 pr-5 text-white font-semibold placeholder:text-slate-600 focus:ring-4 focus:ring-sky-500/10"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors pointer-events-none z-10">
            <Mail size={22} />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            required
            className="glass-input w-full rounded-2xl py-5 pl-14 pr-5 text-white font-semibold placeholder:text-slate-600 focus:ring-4 focus:ring-sky-500/10"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-400 transition-colors pointer-events-none z-10">
            <Lock size={22} />
          </div>
          <input
            type="password"
            placeholder="Create Password"
            required
            className="glass-input w-full rounded-2xl py-5 pl-14 pr-5 text-white font-semibold placeholder:text-slate-600 focus:ring-4 focus:ring-sky-500/10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Exam Level</label>
            <select
              className="glass-input w-full rounded-2xl py-4 px-4 text-sm font-bold appearance-none bg-slate-900/50"
              value={formData.level}
              onChange={(e) => {
                const val = e.target.value;
                setFormData(prev => ({ 
                  ...prev, 
                  level: val,
                  subject_preference: val === 'primary' ? 'none' : 'science'
                }));
              }}
            >
              <option value="primary">Primary (P-I)</option>
              <option value="junior">Junior (P-II)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Language II</label>
            <select
              className="glass-input w-full rounded-2xl py-4 px-4 text-sm font-bold appearance-none bg-slate-900/50"
              value={formData.language2}
              onChange={(e) => setFormData({ ...formData, language2: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
              <option value="Sanskrit">Sanskrit</option>
            </select>
          </div>
        </div>

        {formData.level === 'junior' && (
          <div className="space-y-3 pt-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-black ml-2">Subject Group</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, subject_preference: 'science' })}
                className={`rounded-2xl py-4 text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                  formData.subject_preference === 'science'
                    ? 'border-sky-500 bg-sky-500/10 text-white shadow-lg shadow-sky-500/10'
                    : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10'
                }`}
              >
                Maths & Science
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, subject_preference: 'arts' })}
                className={`rounded-2xl py-4 text-[10px] font-black uppercase tracking-wider transition-all border-2 ${
                  formData.subject_preference === 'arts'
                    ? 'border-sky-500 bg-sky-500/10 text-white shadow-lg shadow-sky-500/10'
                    : 'border-white/5 bg-white/5 text-slate-500 hover:border-white/10'
                }`}
              >
                Social Studies
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Setting up...</span>
            </div>
          ) : (
            <>
              Sign Up Now
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
            </>
          )}
        </button>
      </form>
      <div className="text-center">
        <p className="text-slate-500 font-medium">
          Already a member?{' '}
          <Link to="/login" className="text-sky-400 font-black hover:underline underline-offset-4 decoration-sky-400/30">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
