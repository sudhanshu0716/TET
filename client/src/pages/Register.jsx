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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <div className="flex flex-col gap-8 pt-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="mt-2 text-slate-400 text-sm">Join thousands of successful candidates</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-4 pl-12 pr-4 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            onChange={handleChange}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-4 pl-12 pr-4 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            onChange={handleChange}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-4 pl-12 pr-4 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Exam Level</label>
            <select
              name="level"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              onChange={(e) => {
                handleChange(e);
                if (e.target.value === 'primary') {
                  setFormData(prev => ({ ...prev, subject_preference: 'none' }));
                } else {
                  setFormData(prev => ({ ...prev, subject_preference: 'science' }));
                }
              }}
            >
              <option value="primary">Primary (Paper I)</option>
              <option value="junior">Junior (Paper II)</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Language II</label>
            <select
              name="language2"
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-white focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              onChange={handleChange}
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
              <option value="Sanskrit">Sanskrit</option>
            </select>
          </div>
        </div>

        {formData.level === 'junior' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-col gap-1.5 overflow-hidden"
          >
            <label className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Subject Preference</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, subject_preference: 'science' })}
                className={`rounded-xl border p-4 text-sm font-bold transition-all ${
                  formData.subject_preference === 'science'
                    ? 'border-primary-500 bg-primary-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-500'
                }`}
              >
                Maths & Science
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, subject_preference: 'arts' })}
                className={`rounded-xl border p-4 text-sm font-bold transition-all ${
                  formData.subject_preference === 'arts'
                    ? 'border-primary-500 bg-primary-500/10 text-white'
                    : 'border-slate-800 bg-slate-900/50 text-slate-500'
                }`}
              >
                Social Studies
              </button>
            </div>
          </motion.div>
        )}

        <button
          disabled={loading}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary-500 py-4 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign Up'} <ArrowRight size={20} />
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-primary-500 hover:text-primary-400">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
