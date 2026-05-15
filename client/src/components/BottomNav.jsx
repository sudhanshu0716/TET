import { NavLink, useLocation } from 'react-router-dom';
import { Home, Trophy, FileText, User, LayoutGrid } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // Hide on public routes or during exams (but show on /exams portal)
  const isExamPath = (location.pathname.includes('exam') || 
                     location.pathname.includes('practice') || 
                     location.pathname.includes('mock') || 
                     location.pathname.includes('important') || 
                     location.pathname.includes('contest')) && location.pathname !== '/exams';

  if (!token || ['/', '/login', '/register'].includes(location.pathname) || isExamPath) return null;

  const navItems = [
    { to: '/dashboard', label: 'Home', Icon: Home },
    { to: '/exams', label: 'Tests', Icon: LayoutGrid },
    { to: '/leaderboard', label: 'Rank', Icon: Trophy },
    { to: '/cheatsheets', label: 'Notes', Icon: FileText },
    { to: '/profile', label: 'Me', Icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-[env(safe-area-inset-bottom,12px)] pt-2 pointer-events-none">
      <nav id="tut-nav" className="max-w-md mx-auto h-16 bg-[var(--nav-bg)] backdrop-blur-2xl border border-white/5 rounded-3xl flex items-center justify-around px-2 shadow-2xl pointer-events-auto overflow-hidden">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink 
            key={to}
            to={to} 
            className={({ isActive }) => `
              flex flex-col items-center justify-center gap-1 w-16 h-full transition-all duration-300 relative
              ${isActive ? 'text-sky-400' : 'text-[var(--text-secondary)] hover:opacity-80'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute -top-1 w-12 h-1 bg-sky-400 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.5)] animate-fade-in" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default BottomNav;
