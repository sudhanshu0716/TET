import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const [uiVersion, setUiVersion] = useState(() => {
    return localStorage.getItem('uiVersion') || 'v1';
  });

  useEffect(() => {
    const root = window.document.body;
    if (isDarkMode) {
      root.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = window.document.body;
    if (uiVersion === 'v2') {
      root.classList.add('theme-v2');
    } else {
      root.classList.remove('theme-v2');
    }
    localStorage.setItem('uiVersion', uiVersion);
  }, [uiVersion]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);
  const toggleUiVersion = () => setUiVersion(prev => prev === 'v1' ? 'v2' : 'v1');

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, uiVersion, setUiVersion, toggleUiVersion }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

