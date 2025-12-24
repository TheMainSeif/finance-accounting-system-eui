import React from 'react';
import './BankSyncModal.css';

const BankSyncModal = ({ isOpen, onClose, syncResult }) => {
    if (!isOpen || !syncResult) return null;

    const { imported_count, auto_matched, unmatched } = syncResult;

    return (
        <>
            {/* Overlay */}
            <div className="modal-overlay" onClick={onClose} />

            {/* Modal */}
            <div className="bank-sync-modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="modal-header-content">
                        <div className="success-icon-wrapper">
                            <svg className="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="modal-content">
                    <h2 className="modal-title">Bank Data Synced Successfully!</h2>
                    <p className="modal-subtitle">Your bank transactions have been imported and processed</p>

                    {/* Sync Results */}
                    <div className="sync-results">
                        <div className="result-card imported">
                            <div className="result-icon">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div className="result-content">
                                <p className="result-count">{imported_count}</p>
                                <label>Transactions Imported</label>
                            </div>
                        </div>

                        <div className="result-card matched">
                            <div className="result-icon">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="result-content">
                                <p className="result-count">{auto_matched}</p>
                                <label>Auto-Matched</label>
                            </div>
                        </div>

                        <div className="result-card unmatched">
                            <div className="result-icon">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="result-content">
                                <p className="result-count">{unmatched}</p>
                                <label>Unmatched</label>
                            </div>
                        </div>
                    </div>

                    {/* Summary Message */}
                    <div className="summary-message">
                        {unmatched > 0 ? (
                            <>
                                <svg className="info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>
                                    {unmatched} transaction{unmatched !== 1 ? 's' : ''} require{unmatched === 1 ? 's' : ''} manual matching.
                                    Please review the unmatched transactions below.
                                </p>
                            </>
                        ) : (
                            <>
                                <svg className="success-icon-small" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>All transactions have been successfully matched!</p>
                            </>
                        )}
                    </div>

                    {/* Action Button */}
                    <button className="finance-close-modal-btn" onClick={onClose}>
                        Continue
                    </button>
                </div>
            </div>
        </>
    );
};

export default BankSyncModal;
