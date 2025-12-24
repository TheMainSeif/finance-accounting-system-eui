import React, { useState } from 'react';
import './MatchTransactionModal.css';

const MatchTransactionModal = ({ isOpen, onClose, onSubmit, transactionId, suggestions, isLoading }) => {
    const [matchType, setMatchType] = useState('existing'); // 'existing' or 'new'
    const [formData, setFormData] = useState({
        paymentId: '',
        studentId: '',
        paymentMethod: 'BANK_TRANSFER',
        notes: ''
    });
    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (matchType === 'existing') {
            if (!formData.paymentId) {
                newErrors.paymentId = 'Payment ID is required';
            } else if (isNaN(parseInt(formData.paymentId))) {
                newErrors.paymentId = 'Please enter a valid payment ID';
            }
        } else {
            if (!formData.studentId) {
                newErrors.studentId = 'Student ID is required';
            } else if (isNaN(parseInt(formData.studentId))) {
                newErrors.studentId = 'Please enter a valid student ID';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const submitData = matchType === 'existing'
                ? {
                    payment_id: parseInt(formData.paymentId),
                    notes: formData.notes
                }
                : {
                    create_payment: true,
                    student_id: parseInt(formData.studentId),
                    payment_method: formData.paymentMethod,
                    notes: formData.notes
                };

            onSubmit(transactionId, submitData);
            handleClose();
        }
    };

    const handleClose = () => {
        setMatchType('existing');
        setFormData({
            paymentId: '',
            studentId: '',
            paymentMethod: 'BANK_TRANSFER',
            notes: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div className="modal-overlay" onClick={handleClose} />

            {/* Modal */}
            <div className="match-transaction-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-content">
                        <div className="modal-back-btn" onClick={handleClose}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span>Back to selection</span>
                        </div>
                        <button className="modal-close-btn" onClick={handleClose} aria-label="Close">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="modal-content">
                    <h2 className="modal-title">Match Transaction</h2>
                    <p className="modal-subtitle">Choose how to match this bank transaction</p>

                    {/* Match Type Selector */}
                    <div className="match-type-selector">
                        <button
                            type="button"
                            className={`type-btn ${matchType === 'existing' ? 'active' : ''}`}
                            onClick={() => setMatchType('existing')}
                        >
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                                <span className="type-title">Existing Payment</span>
                                <span className="type-desc">Match to an existing payment record</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            className={`type-btn ${matchType === 'new' ? 'active' : ''}`}
                            onClick={() => setMatchType('new')}
                        >
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <div>
                                <span className="type-title">Create New Payment</span>
                                <span className="type-desc">Create a new payment for a student</span>
                            </div>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="match-form">
                        {matchType === 'existing' ? (
                            <>
                                {/* Payment ID */}
                                <div className="form-group">
                                    <label htmlFor="paymentId">Payment ID</label>
                                    <input
                                        type="number"
                                        id="paymentId"
                                        name="paymentId"
                                        value={formData.paymentId}
                                        onChange={handleChange}
                                        placeholder="Enter payment ID"
                                        className={errors.paymentId ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                    {errors.paymentId && <span className="error-message">{errors.paymentId}</span>}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Student ID */}
                                <div className="form-group">
                                    <label htmlFor="studentId">Student ID</label>
                                    <input
                                        type="number"
                                        id="studentId"
                                        name="studentId"
                                        value={formData.studentId}
                                        onChange={handleChange}
                                        placeholder="Enter student ID"
                                        className={errors.studentId ? 'error' : ''}
                                        disabled={isLoading}
                                    />
                                    {errors.studentId && <span className="error-message">{errors.studentId}</span>}
                                </div>

                                {/* Payment Method */}
                                <div className="form-group">
                                    <label htmlFor="paymentMethod">Payment Method</label>
                                    <select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                    >
                                        <option value="BANK_TRANSFER">Bank Transfer</option>
                                        <option value="ONLINE">Online Payment</option>
                                        <option value="MANUAL">Manual Payment</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Notes */}
                        <div className="form-group">
                            <label htmlFor="notes">Notes (Optional)</label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Add any additional notes..."
                                rows="3"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="btn-spinner"></div>
                                    <span>Matching...</span>
                                </>
                            ) : (
                                <>
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Match Transaction</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default MatchTransactionModal;
