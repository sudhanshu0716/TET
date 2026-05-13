import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
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
    <nav style={{ 
      padding: '12px 20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: 'rgba(15, 23, 42, 0.8)', 
      backdropFilter: 'blur(20px)', 
      borderBottom: '1px solid var(--glass-border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ 
          width: '35px', 
          height: '35px', 
          background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 800,
          fontSize: '1.2rem',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
        }}>T</div>
        <h1 style={{ 
          fontSize: '1.1rem', 
          fontWeight: 800, 
          letterSpacing: '-0.5px',
          margin: 0
        }}>
          TET PREP
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={toggleLang}
          style={{ 
            background: 'var(--glass)', 
            border: '1px solid var(--glass-border)', 
            color: 'white', 
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.75rem', 
            fontWeight: 700,
            cursor: 'pointer' 
          }}
        >
          {lang === 'EN' ? 'हिंदी' : 'English'}
        </button>
        {token && (
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.2)', 
              color: '#f87171', 
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem', 
              fontWeight: 700,
              cursor: 'pointer' 
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
