import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme === 'dark';
    // Auto-detect from system preference
    if (window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default: dark
  });

  const [uiVersion, setUiVersion] = useState(() => {
    return localStorage.getItem('uiVersion') || 'v1';
  });

  // On mount, fetch server default UI version and apply if user hasn't manually set one
  useEffect(() => {
    const fetchServerDefault = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const hasManualUi = localStorage.getItem('uiVersion_manual');
        if (hasManualUi) return; // User has their own preference, skip

        const res = await api.get('/api/admin/global-settings-public', {
          headers: { 'x-auth-token': token }
        });
        const serverDefault = res.data?.default_ui_version || 'v1';
        setUiVersion(serverDefault);
        localStorage.setItem('uiVersion', serverDefault);
      } catch (err) {
        // Silent fail — use existing local value
      }
    };
    fetchServerDefault();
  }, []);

  // Listen for system theme changes (only if user hasn't manually set a preference)
  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      // Only auto-switch if user hasn't explicitly set a preference
      const hasManualPref = localStorage.getItem('theme_manual');
      if (!hasManualPref) {
        setIsDarkMode(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  useEffect(() => {
    const root = document.body;
    // Add transition class for smooth theme switch
    root.classList.add('theme-transitioning');
    
    if (isDarkMode) {
      root.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }

    // Update the meta theme-color
    const meta = document.getElementById('theme-color-meta');
    if (meta) {
      meta.content = isDarkMode ? '#020617' : '#f1f5f9';
    }

    // Remove transition class after animation completes
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 400);

    return () => clearTimeout(timer);
  }, [isDarkMode]);

  useEffect(() => {
    const root = document.body;
    root.classList.remove('theme-v2', 'theme-v3');
    if (uiVersion === 'v2') root.classList.add('theme-v2');
    else if (uiVersion === 'v3') root.classList.add('theme-v3');
    localStorage.setItem('uiVersion', uiVersion);
  }, [uiVersion]);

  const toggleTheme = useCallback(() => {
    localStorage.setItem('theme_manual', 'true');
    setIsDarkMode(prev => !prev);
  }, []);

  const toggleUiVersion = () => {
    localStorage.setItem('uiVersion_manual', 'true');
    setUiVersion(prev => prev === 'v1' ? 'v2' : prev === 'v2' ? 'v3' : 'v1');
  };

  // Called from login flow to apply server default (only if user hasn't manually chosen)
  const applyServerDefault = (serverUiVersion) => {
    const hasManualUi = localStorage.getItem('uiVersion_manual');
    if (!hasManualUi && serverUiVersion) {
      setUiVersion(serverUiVersion);
      localStorage.setItem('uiVersion', serverUiVersion);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, uiVersion, setUiVersion, toggleUiVersion, applyServerDefault }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

