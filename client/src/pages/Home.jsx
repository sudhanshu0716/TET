import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-12 pt-12 px-6 max-w-md mx-auto w-full animate-fade-in">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-sky-500/20 rotate-3 transition-transform hover:rotate-0 duration-500">
          <GraduationCap size={44} className="text-white" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-5xl font-black text-[var(--text-primary)] leading-[1.1] tracking-tight">
            Master <br/>
            <span className="text-gradient">TET Exams</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg font-medium leading-relaxed px-4">
            The ultimate preparation companion for UPTET & CTET success.
          </p>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          {user ? (
            <Link
              to="/dashboard"
              className="premium-button py-5 rounded-2xl font-black text-white shadow-xl group"
            >
              Enter Dashboard
              <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="premium-button py-5 rounded-2xl font-black text-white shadow-xl"
              >
                Start Free Journey
              </Link>
              <Link
                to="/login"
                className="text-sm font-bold text-slate-500 hover:text-sky-400 transition-colors uppercase tracking-widest"
              >
                Already a member? Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-4">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] text-center mb-6">Why TET Prep?</h2>
        {[
          {
            title: 'Daily Practice',
            desc: '30 Fresh MCQs every day across all major subjects.',
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
          },
          {
            title: 'Revision Notes',
            desc: 'AI-curated cheatsheets for rapid revision before exams.',
            icon: BookOpen,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
          },
          {
            title: 'PYQ Repository',
            desc: 'Unlimited access to 10+ years of solved past papers.',
            icon: GraduationCap,
            color: 'text-sky-400',
            bg: 'bg-sky-400/10',
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="glass-card p-6 flex items-start gap-5 group"
          >
            <div className={`w-14 h-14 shrink-0 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
              <feature.icon size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-[var(--text-primary)] text-lg">{feature.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-snug">{feature.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Social Proof / Footer-ish */}
      <footer className="text-center pb-20">
        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
          Join 5,000+ Aspirants Today
        </p>
      </footer>
    </div>
  );
};

export default Home;
