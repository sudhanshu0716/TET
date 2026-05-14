import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [lang, setLang] = React.useState(localStorage.getItem('appLang') || 'EN');

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
    <nav className="sticky top-0 z-[100] px-4 py-4 backdrop-blur-xl border-b border-white/5 bg-[var(--nav-bg)]">
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
          <button 
            onClick={toggleTheme}
            className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
          >
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          <button 
            onClick={toggleLang}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[var(--text-primary)] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
          >
            {lang === 'EN' ? 'हिंदी' : 'English'}
          </button>
          
          {user?.role === 'admin' && (
            <button 
              onClick={() => navigate('/admin')}
              className="px-3 py-1.5 rounded-lg bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
            >
              Admin
            </button>
          )}

          {token && (
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
