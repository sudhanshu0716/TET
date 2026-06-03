import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Sun, Moon, Target } from 'lucide-react';
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
    window.location.reload(); // Refresh to apply lang change globally
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
          {/* Enhanced Visibility Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-amber-500/5 border border-amber-500/40 text-amber-500 flex items-center justify-center hover:bg-amber-500/10 hover:border-amber-400 hover:text-amber-400 transition-all shadow-[0_0_12px_rgba(245,158,11,0.15)] active:scale-95 cursor-pointer"
            aria-label="Toggle Theme"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-amber-500 fill-amber-500/10" />
            ) : (
              <Moon className="w-5 h-5 text-amber-500 fill-amber-500/15" />
            )}
          </button>

          <button 
            onClick={toggleLang}
            className="h-9 px-3 rounded-lg bg-white/5 border border-white/10 text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer"
          >
            {lang === 'EN' ? 'हिंदी' : 'English'}
          </button>

          {token && (
            <button 
              onClick={() => navigate('/revision')}
              className="w-9 h-9 rounded-lg bg-purple-500/5 border border-purple-500/40 text-purple-400 flex items-center justify-center hover:bg-purple-500/10 hover:border-purple-300 hover:text-purple-300 transition-all shadow-[0_0_12px_rgba(168,85,247,0.15)] active:scale-95 cursor-pointer"
              aria-label={t.revisionZone}
              title={t.revisionZone}
            >
              <Target className="w-5 h-5" />
            </button>
          )}
          
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
