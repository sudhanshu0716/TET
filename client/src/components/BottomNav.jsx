import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  return (
    <div className="bottom-nav-container">
      <nav className="bottom-nav-bar">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Rank</span>
        </NavLink>
        <NavLink to="/cheatsheets" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">📄</span>
          <span className="nav-label">Notes</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">👤</span>
          <span className="nav-label">Me</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default BottomNav;
