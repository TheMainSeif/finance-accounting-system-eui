/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading] = useState(false);

  // No longer need useEffect to set loading to false as it's initialized above

  const login = async (username, password) => {
    try {
      const data = await authService.login(username, password);
      
      // Save to localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        username: data.username,
        is_admin: data.is_admin,
        email: data.email
      }));

      // Update State
      setToken(data.access_token);
      setUser({
        id: data.user_id,
        username: data.username,
        is_admin: data.is_admin,
        email: data.email
      });

      return { success: true, data };
    } catch (error) {
      console.error("Login failed", error);
      return { 
        success: false, 
        message: error.response?.data?.error || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
