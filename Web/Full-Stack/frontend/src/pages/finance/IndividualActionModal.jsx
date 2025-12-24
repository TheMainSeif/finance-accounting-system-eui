import React, { useState } from 'react';
import './IndividualActionModal.css';

const IndividualActionModal = ({ isOpen, onClose, onConfirm, actionType, student, isLoading }) => {
    const [penaltyAmount, setPenaltyAmount] = useState('50');
    const [error, setError] = useState('');

    if (!isOpen || !student) return null;

    const getModalConfig = () => {
        switch (actionType) {
            case 'reminder':
                return {
                    title: 'Send Payment Reminder',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    ),
                    color: 'blue',
                    message: `Send a payment reminder email to ${student.name || student.username}?`,
                    confirmText: 'Send Reminder',
                    showInput: false
                };
            case 'penalty':
                return {
                    title: 'Apply Penalty',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    color: 'orange',
                    message: `Apply a late payment penalty to ${student.name || student.username}?`,
                    confirmText: 'Apply Penalty',
                    showInput: true
                };
            case 'block':
                return {
                    title: 'Block Registration',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    ),
                    color: 'red',
                    message: `Block registration for ${student.name || student.username}?`,
                    confirmText: 'Block Registration',
                    showInput: false
                };
            default:
                return null;
        }
    };

    const config = getModalConfig();
    if (!config) return null;

    const handleConfirm = () => {
        if (config.showInput) {
            const amount = parseFloat(penaltyAmount);
            if (!amount || isNaN(amount) || amount <= 0) {
                setError('Please enter a valid penalty amount');
                return;
            }
            onConfirm(amount);
        } else {
            onConfirm();
        }
    };

    const handleClose = () => {
        setPenaltyAmount('50');
        setError('');
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div className="modal-overlay" onClick={handleClose} />

            {/* Modal */}
            <div className="individual-action-modal">
                {/* Header */}
                <div className={`modal-header ${config.color}`}>
                    <div className="modal-icon-wrapper">
                        {config.icon}
                    </div>
                    <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="modal-content">
                    <h2 className="modal-title">{config.title}</h2>
                    <p className="modal-message">{config.message}</p>

                    {/* Student Info Card */}
                    <div className="student-info-card">
                        <div className="info-row">
                            <span className="info-label">Student ID:</span>
                            <span className="info-value">{student.student_id || `STD-${student.user_id}`}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Outstanding:</span>
                            <span className="info-value outstanding">${(student.outstanding || student.dues_balance || 0).toLocaleString()}</span>
                        </div>
                        {student.days_overdue > 0 && (
                            <div className="info-row">
                                <span className="info-label">Days Overdue:</span>
                                <span className="info-value overdue">{student.days_overdue} days</span>
                            </div>
                        )}
                    </div>

                    {/* Penalty Amount Input */}
                    {config.showInput && (
                        <div className="penalty-input-group">
                            <label htmlFor="penaltyAmount">Penalty Amount</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    id="penaltyAmount"
                                    value={penaltyAmount}
                                    onChange={(e) => {
                                        setPenaltyAmount(e.target.value);
                                        setError('');
                                    }}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className={error ? 'error' : ''}
                                    disabled={isLoading}
                                />
                            </div>
                            {error && <span className="error-message">{error}</span>}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="modal-actions">
                        <button
                            className="cancel-btn"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            className={`confirm-btn ${config.color}`}
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    <span>Processing...</span>
                                </>
                            ) : (
                                config.confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default IndividualActionModal;
