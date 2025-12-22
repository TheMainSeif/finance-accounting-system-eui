import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import studentService from '../../services/studentService';
import './CalculatedFees.css';

const CalculatedFees = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [duesBalance, setDuesBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await studentService.getDashboardStatus();
      setEnrollments(data.enrollments || []);
      setDuesBalance(data.dues_balance || 0);
    } catch (err) {
      setError('Failed to load fee information. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    navigate('/student/payment');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading fee information...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="calculated-fees-container">
        {/* Page Header */}
        <div className="fees-page-header">
          <h1 className="fees-page-title">Calculated Fees</h1>
          <p className="fees-page-subtitle">Detailed breakdown of your tuition and fees</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="fees-content">
          {/* Left Section - Fee Breakdown */}
          <div className="fees-breakdown-section">
            {/* Tuition Fees */}
            <div className="fee-category-card">
              <div className="category-header">
                <svg className="category-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="category-title">Tuition Fees</h2>
              </div>

              <div className="fee-items">
                {enrollments.length === 0 ? (
                  <div className="empty-state">
                    <p>No courses enrolled yet. Please register for courses first.</p>
                  </div>
                ) : (
                  enrollments.map((enrollment) => (
                    <div key={enrollment.id} className="fee-item">
                      <div className="fee-item-info">
                        <h3 className="fee-item-name">{enrollment.course_name}</h3>
                        <p className="fee-item-credits">{enrollment.credits || 'N/A'} Credits</p>
                      </div>
                      <div className="fee-item-amount">
                        ${enrollment.course_fee.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Fee Summary */}
          <div className="fees-summary-section">
            <div className="summary-card">
              <div className="summary-header">
                <svg className="summary-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="summary-title">Fee Summary</h2>
              </div>

              <div className="summary-content">
                <div className="summary-row">
                  <span className="summary-label">Tuition Fees</span>
                  <span className="summary-value">${duesBalance.toLocaleString()}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row total-row">
                  <span className="summary-label">Total Due</span>
                  <span className="summary-total">${duesBalance.toLocaleString()}</span>
                </div>

                {/* Payment Status */}
                <div className="payment-status-row">
                  <span className="status-label">Payment Status</span>
                  {duesBalance === 0 ? (
                    <span className="status-badge paid">Paid</span>
                  ) : (
                    <span className="status-badge unpaid">Unpaid</span>
                  )}
                </div>

                {duesBalance > 0 ? (
                  <button 
                    className="proceed-payment-btn"
                    onClick={handleProceedToPayment}
                    disabled={enrollments.length === 0}
                  >
                    <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Proceed to Payment
                  </button>
                ) : (
                  <div className="paid-message">
                    <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All fees have been paid</span>
                  </div>
                )}

                <p className="payment-note">Payment due by January 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalculatedFees;
