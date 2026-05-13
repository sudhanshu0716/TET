import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Send normalized email
      await login(formData.email.toLowerCase().trim(), formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pt-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
        <p className="mt-2 text-slate-400 text-sm font-medium">Continue your preparation journey</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
        >
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="group relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary-500" size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-4.5 pl-14 pr-4 text-white placeholder:text-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
            onChange={handleChange}
          />
        </div>

        <div className="group relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary-500" size={20} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-4.5 pl-14 pr-4 text-white placeholder:text-slate-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all"
            onChange={handleChange}
          />
        </div>

        <button
          disabled={loading}
          className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary-500 py-4.5 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              <span>Signing In...</span>
            </div>
          ) : (
            <>Sign In <ArrowRight size={20} /></>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-primary-500 hover:text-primary-400 transition-colors">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
