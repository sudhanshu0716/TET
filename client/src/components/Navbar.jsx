import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon } from 'lucide-react';
import translations from '../translations';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [lang, setLang] = React.useState(localStorage.getItem('appLang') || 'EN');
  const t = translations[lang] || translations.EN;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleLang = () => {
    const newLang = lang === 'EN' ? 'HI' : 'EN';
    setLang(newLang);
    localStorage.setItem('appLang', newLang);
    window.dispatchEvent(new Event('languageChanged'));
  };

  return (
    <nav className="sticky top-0 z-[100] px-4 pb-4 nav-top-safe backdrop-blur-xl border-b border-white/5 bg-[var(--nav-bg)]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">
            T
          </div>
          <h1 className="text-lg font-black text-[var(--text-primary)] tracking-tighter">
            TET <span className="text-sky-400">PREP</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Animated Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-2xl hover:bg-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
            aria-label="Toggle theme"
          >
            <motion.div
              key={isDarkMode ? 'dark' : 'light'}
              initial={{ y: -30, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 30, opacity: 0, rotate: 90 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {isDarkMode ? (
                <Sun size={20} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
              ) : (
                <Moon size={20} className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
              )}
            </motion.div>
          </button>

          <button 
            onClick={toggleLang}
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
          >
            {lang === 'EN' ? 'हिंदी' : 'English'}
          </button>


          
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              className="h-9 px-3 rounded-lg bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20 flex items-center justify-center cursor-pointer"
            >
              {t.admin}
            </button>
          )}

          {token && (
            <button 
              onClick={handleLogout}
              className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 transition-all flex items-center justify-center active:scale-95 cursor-pointer"
              aria-label={t.logout}
              title={t.logout}
            >
              <LogOut className="w-4 h-4" strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
