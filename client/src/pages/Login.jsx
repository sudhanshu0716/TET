import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email.toLowerCase().trim(), formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 pt-16 px-6 max-w-md mx-auto w-full animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
          Welcome <br/>
          <span className="text-gradient">Back</span>
        </h1>
        <p className="text-slate-400 font-medium">Continue your preparation journey</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-2xl text-sm font-bold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            placeholder="Password"
            required
            className="glass-input w-full rounded-2xl py-5 pl-14 pr-5 text-white font-semibold placeholder:text-slate-600 focus:ring-4 focus:ring-sky-500/10"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="premium-button w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed group mt-4"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Checking...</span>
            </div>
          ) : (
            <>
              Sign In
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <p className="text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-400 font-black hover:underline underline-offset-4 decoration-sky-400/30">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
