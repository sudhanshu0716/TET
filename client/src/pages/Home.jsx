import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, GraduationCap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center gap-12 pt-8">
      {/* Hero Section */}
      <section className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10 text-primary-500 shadow-xl shadow-primary-500/10">
            <GraduationCap size={40} />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Master the <span className="text-primary-500">TET Exams</span>
          </h1>
          <p className="mx-auto max-w-xs text-lg text-slate-400">
            Daily practice, curated cheatsheets, and personalized prep for UPTET & CTET.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-col gap-4"
        >
          {user ? (
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-4 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 active:scale-95"
            >
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-8 py-4 font-bold text-white transition-all hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25 active:scale-95"
              >
                Start Free Preparation
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-400 hover:text-white"
              >
                Already have an account? Login
              </Link>
            </>
          )}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="grid w-full gap-4">
        {[
          {
            title: 'Daily Practice',
            desc: '30 Fresh MCQs every day to keep you sharp.',
            icon: CheckCircle,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            title: 'Revision Cheatsheets',
            desc: 'Quick revision notes after every exam.',
            icon: BookOpen,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
          {
            title: 'Past Papers',
            desc: 'Access huge repository of previous year papers.',
            icon: GraduationCap,
            color: 'text-primary-500',
            bg: 'bg-primary-500/10',
          },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm"
          >
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${feature.bg} ${feature.color}`}>
              <feature.icon size={24} />
            </div>
            <div>
              <h3 className="mb-1 font-bold text-white">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default Home;
