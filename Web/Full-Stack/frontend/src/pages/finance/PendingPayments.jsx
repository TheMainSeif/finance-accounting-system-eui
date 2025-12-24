import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import paymentVerificationService from '../../services/api-routes/finance-routes/paymentVerificationService';
import './PendingPayments.css';

const PendingPayments = () => {
  const navigate = useNavigate();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentVerificationService.getPendingPayments();
      setPendingPayments(data.pending_payments || []);
    } catch (err) {
      console.error('Error fetching pending payments:', err);
      setError('Failed to load pending payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;

    try {
      setProcessing(true);
      await paymentVerificationService.verifyPayment(selectedPayment.id);
      
      // Remove from pending list
      setPendingPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
      
      setShowModal(false);
      setSelectedPayment(null);
      
      // Show success message
      alert(`Payment of $${selectedPayment.amount.toFixed(2)} approved successfully!`);
    } catch (err) {
      console.error('Error approving payment:', err);
      alert(err.response?.data?.error || 'Failed to approve payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectClick = () => {
    setShowModal(false);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedPayment || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      await paymentVerificationService.rejectPayment(selectedPayment.id, rejectionReason);
      
      // Remove from pending list
      setPendingPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
      
      setShowRejectModal(false);
      setSelectedPayment(null);
      setRejectionReason('');
      
      alert('Payment rejected successfully');
    } catch (err) {
      console.error('Error rejecting payment:', err);
      alert(err.response?.data?.error || 'Failed to reject payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="pending-payments-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading pending payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-payments-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Pending Bank Transfer Payments</h1>
          <p className="page-subtitle">Review and verify student payment submissions</p>
        </div>
        <button className="btn-back" onClick={() => navigate('/finance')}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button onClick={fetchPendingPayments}>Retry</button>
        </div>
      )}

      {/* Pending Count */}
      <div className="pending-count-card">
        <svg className="count-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="count-content">
          <span className="count-label">Pending Verification</span>
          <span className="count-value">{pendingPayments.length}</span>
        </div>
      </div>

      {/* Payments List */}
      {pendingPayments.length === 0 ? (
        <div className="empty-state">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3>All Caught Up!</h3>
          <p>No pending bank transfer payments to review</p>
        </div>
      ) : (
        <div className="payments-grid">
          {pendingPayments.map(payment => (
            <div key={payment.id} className="payment-card">
              <div className="payment-header">
                <div className="student-info">
                  <h3>{payment.student_name || 'Unknown Student'}</h3>
                  <span className="student-id">{payment.student_username}</span>
                </div>
                <div className="payment-amount">
                  <span className="amount-label">Amount</span>
                  <span className="amount-value">${payment.amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="payment-details">
                <div className="detail-row">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Submitted: {formatDate(payment.created_at)}</span>
                </div>

                {payment.reference_number && (
                  <div className="detail-row">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    <span>Ref: {payment.reference_number}</span>
                  </div>
                )}

                <div className="detail-row">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Current Balance: ${payment.student_balance?.toFixed(2) || '0.00'}</span>
                </div>
              </div>

              <button 
                className="btn-review"
                onClick={() => handleViewPayment(payment)}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Review Payment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {showModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Review Payment</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {/* Student Info */}
              <div className="info-section">
                <h3>Student Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Name</span>
                    <span className="info-value">{selectedPayment.student_name}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Username</span>
                    <span className="info-value">{selectedPayment.student_username}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{selectedPayment.student_email || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Current Balance</span>
                    <span className="info-value">${selectedPayment.student_balance?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="info-section">
                <h3>Payment Details</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Amount</span>
                    <span className="info-value highlight">${selectedPayment.amount.toFixed(2)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Reference Number</span>
                    <span className="info-value">{selectedPayment.reference_number || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Submitted</span>
                    <span className="info-value">{formatDate(selectedPayment.created_at)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">New Balance (if approved)</span>
                    <span className="info-value success">
                      ${Math.max(0, (selectedPayment.student_balance || 0) - selectedPayment.amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Proof Document */}
              {selectedPayment.proof_document && (
                <div className="info-section">
                  <h3>Proof of Payment</h3>
                  <div className="proof-viewer">
                    <iframe
                      src={paymentVerificationService.getProofDocumentUrl(selectedPayment.id)}
                      title="Payment Proof"
                      className="proof-iframe"
                    />
                    <a
                      href={paymentVerificationService.getProofDocumentUrl(selectedPayment.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-open-proof"
                    >
                      Open in New Tab
                    </a>
                  </div>
                </div>
              )}

              {selectedPayment.notes && (
                <div className="info-section">
                  <h3>Notes</h3>
                  <p className="notes-text">{selectedPayment.notes}</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn-reject"
                onClick={handleRejectClick}
                disabled={processing}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
              <button
                className="btn-approve"
                onClick={handleApprove}
                disabled={processing}
              >
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {processing ? 'Processing...' : 'Approve Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reject Payment</h2>
              <button className="btn-close" onClick={() => setShowRejectModal(false)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <p className="reject-warning">
                You are about to reject a payment of <strong>${selectedPayment.amount.toFixed(2)}</strong> from <strong>{selectedPayment.student_name}</strong>.
              </p>
              
              <div className="form-group">
                <label htmlFor="rejection-reason">Rejection Reason *</label>
                <textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejection..."
                  rows={4}
                  required
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowRejectModal(false);
                  setShowModal(true);
                }}
                disabled={processing}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-reject"
                onClick={handleRejectConfirm}
                disabled={processing || !rejectionReason.trim()}
              >
                {processing ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPayments;
