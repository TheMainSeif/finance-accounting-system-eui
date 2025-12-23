import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * SECURITY: Protected Route Component with Strict Role-Based Access Control
 * 
 * This component enforces portal isolation by validating both authentication
 * and role before rendering any protected content. It prevents:
 * - Unauthenticated access
 * - Cross-portal access (student accessing finance, finance accessing student)
 * - UI flash of wrong portal
 * - Token reuse across incompatible roles
 * 
 * @param {string} role - Required role: 'student' or 'finance'
 */
const ProtectedRoute = ({ role }) => {
  const { isAuthenticated, user, loading, hasRole } = useAuth();

  // SECURITY: Wait for auth state to load before making any decisions
  // This prevents UI flash and ensures we have complete user data
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Verifying credentials...
      </div>
    );
  }

  // SECURITY: Check 1 - Authentication required
  if (!isAuthenticated || !user) {
    console.warn('ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // SECURITY: Check 2 - Validate user object has role field
  if (!user.role) {
    console.error('ProtectedRoute: User object missing role field, clearing auth');
    // This should never happen with the updated AuthContext, but defense in depth
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // SECURITY: Check 3 - Validate role consistency
  // Ensure role matches is_admin flag (defense in depth)
  const roleMatchesAdmin = (user.role === 'finance' && user.is_admin) || 
                           (user.role === 'student' && !user.is_admin);
  
  if (!roleMatchesAdmin) {
    console.error('ProtectedRoute: Role mismatch detected - role:', user.role, 'is_admin:', user.is_admin);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }

  // SECURITY: Check 4 - Enforce role-based portal access
  if (role === 'student') {
    // Student portal - reject finance users
    if (!hasRole('student')) {
      console.warn('ProtectedRoute: Finance user attempted to access student portal');
      return <Navigate to="/finance/dashboard" replace />;
    }
  } else if (role === 'finance') {
    // Finance portal - reject student users
    if (!hasRole('finance')) {
      console.warn('ProtectedRoute: Student user attempted to access finance portal');
      return <Navigate to="/student/dashboard" replace />;
    }
  } else {
    // Invalid role specified in route configuration
    console.error('ProtectedRoute: Invalid role specified:', role);
    return <Navigate to="/login" replace />;
  }

  // All security checks passed - render protected content
  return <Outlet />;
};

export default ProtectedRoute;
