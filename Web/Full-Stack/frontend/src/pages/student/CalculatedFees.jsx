import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import studentService from '../../services/studentService';
import api from '../../services/api';
import './CalculatedFees.css';

const CalculatedFees = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [feeBreakdown, setFeeBreakdown] = useState(null);
  const [duesBalance, setDuesBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch dashboard status for dues balance
      const dashboardData = await studentService.getDashboardStatus();
      setEnrollments(dashboardData.enrollments || []);
      setDuesBalance(dashboardData.dues_balance || 0);
      
      // Fetch detailed fee breakdown
      try {
        const feeResponse = await api.get('/finance/student-fees');
        setFeeBreakdown(feeResponse.data);
        if (feeResponse.data.totals) {
          setDuesBalance(feeResponse.data.totals.balance_due);
        }
      } catch (feeError) {
        console.log('Fee breakdown not available:', feeError);
        // Continue without breakdown if endpoint not available
      }
      
    } catch (err) {
      setError('Failed to load fee information. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBusToggle = async (hasBus) => {
    try {
      setError(null);
      // Optimistic update
      setFeeBreakdown(prev => ({
        ...prev,
        has_bus_service: hasBus
      }));
      
      // Call backend to update bus service preference
      await api.put('/students/bus-service', { has_bus_service: hasBus });
      
      // Refresh all fee info to get updated totals and balance
      fetchEnrollments();
    } catch (err) {
      console.error('Failed to update bus service:', err);
      setError('Failed to update bus service preference.');
      // Revert on error
      fetchEnrollments();
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

            {/* Additional Fees Card */}
            {feeBreakdown && (feeBreakdown.breakdown?.registration_fees?.length > 0 || feeBreakdown.breakdown?.other_fees?.length > 0) && (
              <div className="fee-category-card mt-4">
                <div className="category-header">
                  <svg className="category-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <h2 className="category-title">Mandatory Fees</h2>
                </div>
                <div className="fee-items">
                  {[...(feeBreakdown.breakdown?.registration_fees || []), ...(feeBreakdown.breakdown?.other_fees || [])].map((fee, index) => (
                    <div key={index} className="fee-item">
                      <div className="fee-item-info">
                        <h3 className="fee-item-name">{fee.name}</h3>
                        <p className="fee-item-credits">Required</p>
                      </div>
                      <div className="fee-item-amount">
                        ${fee.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Services Card (Bus) */}
            {feeBreakdown && feeBreakdown.breakdown?.bus_fees?.length > 0 && (
              <div className="fee-category-card mt-4">
                <div className="category-header">
                  <svg className="category-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h2 className="category-title">Optional Services</h2>
                </div>
                <div className="fee-items">
                  {feeBreakdown.breakdown.bus_fees.map((fee, index) => (
                    <div key={index} className="fee-item bus-service-item">
                      <div className="fee-item-info">
                        <h3 className="fee-item-name">{fee.name}</h3>
                        <p className="fee-item-credits">Optional Subscription</p>
                      </div>
                      <div className="fee-item-actions">
                        <div className="fee-item-amount mr-4">
                          ${fee.amount.toLocaleString()}
                        </div>
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={feeBreakdown.has_bus_service} 
                            onChange={(e) => handleBusToggle(e.target.checked)}
                          />
                          <span className="slider round"></span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {feeBreakdown ? (
                  <>
                    {/* Course Fees */}
                    <div className="summary-row">
                      <span className="summary-label">Course Tuition</span>
                      <span className="summary-value">${(feeBreakdown.totals?.course_fees || 0).toLocaleString()}</span>
                    </div>
                    
                    {/* Registration Fees */}
                    {feeBreakdown.totals?.registration_fees > 0 && (
                      <div className="summary-row">
                        <span className="summary-label">Registration & Other Fees</span>
                        <span className="summary-value">${(feeBreakdown.totals.registration_fees).toLocaleString()}</span>
                      </div>
                    )}
                    
                    {/* Bus Fees */}
                    {feeBreakdown.totals?.bus_fees > 0 && (
                      <div className="summary-row">
                        <span className="summary-label">Bus Service</span>
                        <span className="summary-value">${(feeBreakdown.totals.bus_fees).toLocaleString()}</span>
                      </div>
                    )}
                    
                    {/* Other Fees */}
                    {feeBreakdown.totals?.other_fees > 0 && (
                      <div className="summary-row">
                        <span className="summary-label">Other Fees</span>
                        <span className="summary-value">${(feeBreakdown.totals.other_fees).toLocaleString()}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="summary-row">
                    <span className="summary-label">Tuition Fees</span>
                    <span className="summary-value">${duesBalance.toLocaleString()}</span>
                  </div>
                )}

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
