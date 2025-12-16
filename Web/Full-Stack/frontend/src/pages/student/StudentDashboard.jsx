import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
  return (
    <DashboardLayout>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
        Welcome back, {user?.username}!
      </h1>
      <p style={{ color: '#6b7280' }}>Here's your financial overview</p>

      {/* Empty State for now */}
      <div style={{ marginTop: '2rem', padding: '2rem', border: '2px dashed #e5e7eb', borderRadius: '0.5rem', textAlign: 'center', color: '#9ca3af' }}>
         Dashboard Widgets Loading...
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
