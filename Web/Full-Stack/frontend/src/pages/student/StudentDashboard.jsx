import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import studentService from '../../services/studentService';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await studentService.getDashboardStatus();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="error-container">
          <p>{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const enrollments = dashboardData?.enrollments || [];
  const duesBalance = dashboardData?.dues_balance || 0;
  const totalCourses = enrollments.length;
  const totalCredits = enrollments.reduce((sum, e) => sum + (e.credits || 0), 0);

  return (
    <DashboardLayout>
      <div className="student-dashboard-content">
        
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.username}</p>
        </div>

        {/* 1. Summary: Stats Grid */}
        <div>
          <h2 className="section-label">Financial Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="stat-value">{totalCourses}</div>
                <div className="stat-label">Registered Courses</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="stat-value">{totalCredits}</div>
                <div className="stat-label">Total Credits</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="stat-value">${duesBalance.toLocaleString()}</div>
                <div className="stat-label">Outstanding Balance</div>
              </div>
            </div>
            
            {/* Placeholder Stat (e.g. Next Payment Due) */}
            <div className="stat-card">
               <div className="stat-icon-wrapper">
                <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="stat-value">-</div>
                <div className="stat-label">Next Due Date</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Details: Registered Courses (Full Width) */}
        <div>
          <h2 className="section-label">Academic Details</h2>
          <div className="dashboard-card">
            <div className="card-header">
              <div className="card-title-group">
                <svg className="card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="card-title">Current Enrollments</h2>
              </div>
              <button className="view-all-btn" onClick={() => navigate('/student/courses')}>
                Manage Courses
              </button>
            </div>

            <div className="card-content">
              {enrollments.length === 0 ? (
                <div className="empty-state">
                  <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3>No Enrollments Found</h3>
                  <p>You are not currently enrolled in any courses for this term.</p>
                  <button className="action-btn-primary" onClick={() => navigate('/student/courses')}>
                    View Course Catalog
                  </button>
                </div>
              ) : (
                <div className="courses-container">
                  <div className="course-list-header">
                    <div>Course Name</div>
                    <div>Credits</div>
                    <div>Tuition Fee</div>
                    <div>Status</div>
                  </div>
                  {enrollments.map((enrollment, index) => (
                    <div key={index} className="course-item">
                      <div className="course-name">{enrollment.course_name}</div>
                      <div className="course-meta-item">
                        {enrollment.credits || 'N/A'} Credits
                      </div>
                      <div className="course-meta-item">
                        ${enrollment.course_fee?.toLocaleString()}
                      </div>
                      <div>
                        <span className="status-badge">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. Actions: Quick Actions Grid */}
        <div>
          <h2 className="section-label">Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card" onClick={() => navigate('/student/courses')}>
              <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="action-label">Register Courses</span>
            </div>

            <div className="action-card" onClick={() => navigate('/student/fees')}>
              <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="action-label">View Fee Statement</span>
            </div>

            <div className="action-card" onClick={() => navigate('/student/payment')}>
              <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="action-label">Make Payment</span>
            </div>

            <div className="action-card" onClick={() => navigate('/student/history')}>
              <svg className="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="action-label">Transaction History</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
