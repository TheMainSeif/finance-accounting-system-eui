import React, { useState } from 'react';
import './BankDataFormModal.css';

const BankDataFormModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [formData, setFormData] = useState({
        bankRef: '',
        amount: '',
        date: '',
        description: ''
    });

    const [errors, setErrors] = useState({});

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.bankRef.trim()) {
            newErrors.bankRef = 'Bank reference is required';
        }

        if (!formData.amount) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({
                bank_ref: formData.bankRef,
                amount: parseFloat(formData.amount),
                date: formData.date,
                description: formData.description
            });
            // Reset form
            setFormData({
                bankRef: '',
                amount: '',
                date: '',
                description: ''
            });
            setErrors({});
        }
    };

    const handleClose = () => {
        setFormData({
            bankRef: '',
            amount: '',
            date: '',
            description: ''
        });
        setErrors({});
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div className="modal-overlay" onClick={handleClose} />

            {/* Modal */}
            <div className="bank-data-form-modal">
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
                    <h2 className="modal-title">Sync Bank Data</h2>
                    <p className="modal-subtitle">Enter bank transaction details below</p>

                    <form onSubmit={handleSubmit} className="bank-data-form">
                        {/* Bank Reference */}
                        <div className="form-group">
                            <label htmlFor="bankRef">Bank Reference / ID</label>
                            <input
                                type="text"
                                id="bankRef"
                                name="bankRef"
                                value={formData.bankRef}
                                onChange={handleChange}
                                placeholder="e.g. TXN-2024-001"
                                className={errors.bankRef ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.bankRef && <span className="error-message">{errors.bankRef}</span>}
                        </div>

                        {/* Amount */}
                        <div className="form-group">
                            <label htmlFor="amount">Amount</label>
                            <div className="input-with-prefix">
                                <span className="input-prefix">$</span>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    className={errors.amount ? 'error' : ''}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.amount && <span className="error-message">{errors.amount}</span>}
                        </div>

                        {/* Date */}
                        <div className="form-group">
                            <label htmlFor="date">Transaction Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className={errors.date ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.date && <span className="error-message">{errors.date}</span>}
                        </div>

                        {/* Description */}
                        <div className="form-group">
                            <label htmlFor="description">Description (Optional)</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter transaction description..."
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
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <>
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Sync Bank Data</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BankDataFormModal;
