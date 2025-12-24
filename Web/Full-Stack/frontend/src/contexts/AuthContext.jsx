import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // SECURITY: Validate that user object has required role information
        if (!parsedUser.role || !['student', 'finance'].includes(parsedUser.role)) {
          console.error('Invalid or missing role in stored user data');
          // Clear corrupted auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        } else {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        // Clear corrupted auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, portal) => {
    try {
      // SECURITY: Portal parameter is required for strict portal isolation
      if (!portal || !['student', 'finance'].includes(portal)) {
        throw new Error('Invalid portal parameter');
      }
      
      const data = await authService.login(username, password, portal);
      
      // SECURITY: Validate role from backend response
      if (!data.role || !['student', 'finance'].includes(data.role)) {
        throw new Error('Invalid role received from server');
      }
      
      // SECURITY: Ensure role consistency
      const userRole = data.role;
      const isAdmin = data.is_admin;
      
      // Validate role matches is_admin flag
      if ((userRole === 'finance' && !isAdmin) || (userRole === 'student' && isAdmin)) {
        throw new Error('Role mismatch detected');
      }
      
      const userData = {
        id: data.user_id,
        username: data.username,
        is_admin: isAdmin,
        role: userRole,  // SECURITY: Store explicit role
        email: data.email
      };

      // Save to localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update State
      setToken(data.access_token);
      setUser(userData);

      return { success: true, data, role: userRole };
    } catch (error) {
      console.error("Login failed", error);
      // SECURITY: Clear any partial auth state on login failure
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      
      return { 
        success: false, 
        message: error.response?.data?.error || error.message || 'Login failed. Please check your credentials.',
        code: error.response?.data?.code
      };
    }
  };

  const logout = () => {
    // SECURITY: Complete cleanup of all auth state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Also clear any other potential auth-related items
    localStorage.removeItem('role');
    localStorage.removeItem('is_admin');
    
    setToken(null);
    setUser(null);
  };

  // SECURITY: Helper to validate current user has required role
  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      hasRole,  // SECURITY: Expose role validation helper
      isAuthenticated: !!token && !!user, 
      loading 
    }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
