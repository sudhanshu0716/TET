import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const savedUser = localStorage.getItem('user');
        if (savedUser && savedUser !== 'undefined') {
          return JSON.parse(savedUser);
        }
      }
    } catch (err) {
      console.error("Auth sync init error:", err);
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const savedUser = localStorage.getItem('user');
          if (!savedUser || savedUser === 'undefined') {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth verification error:", err);
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    // Returning users should NEVER see the tutorial again
    localStorage.setItem(`hasSeenTutorial_${res.data.user.id}`, 'true');
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post('/api/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
