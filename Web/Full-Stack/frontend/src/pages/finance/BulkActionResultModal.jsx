import React from 'react';
import './BulkActionResultModal.css';

const BulkActionResultModal = ({ isOpen, onClose, result, actionType }) => {
    if (!isOpen || !result) return null;

    const getConfig = () => {
        switch (actionType) {
            case 'reminder':
                return {
                    title: 'Reminders Sent Successfully!',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    stats: [
                        { label: 'Sent Successfully', value: result.sent_count || 0, color: 'green' },
                        { label: 'Failed', value: result.failed_count || 0, color: 'red' }
                    ]
                };
            case 'penalty':
                return {
                    title: 'Penalties Applied Successfully!',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    stats: [
                        { label: 'Students Affected', value: result.applied_count || 0, color: 'blue' },
                        { label: 'Total Penalties', value: `$${(result.total_penalties || 0).toLocaleString()}`, color: 'orange' }
                    ]
                };
            case 'block':
                return {
                    title: 'Registrations Blocked Successfully!',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    stats: [
                        { label: 'Students Blocked', value: result.blocked_count || 0, color: 'red' }
                    ]
                };
            default:
                return null;
        }
    };

    const config = getConfig();
    if (!config) return null;

    return (
        <>
            {/* Overlay */}
            <div className="modal-overlay" onClick={onClose} />

            {/* Modal */}
            <div className="bulk-result-modal">
                {/* Header */}
                <div className="modal-header success">
                    <div className="success-icon-wrapper">
                        {config.icon}
                    </div>
                    <button className="modal-close-btn" onClick={onClose} aria-label="Close">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="modal-content">
                    <h2 className="modal-title">{config.title}</h2>

                    {/* Stats */}
                    <div className="result-stats">
                        {config.stats.map((stat, index) => (
                            <div key={index} className={`stat-item ${stat.color}`}>
                                <p className="stat-value">{stat.value}</p>
                                <label>{stat.label}</label>
                            </div>
                        ))}
                    </div>

                    {/* Close Button */}
                    <button className="close-btn" onClick={onClose}>
                        Continue
                    </button>
                </div>
            </div>
        </>
    );
};

export default BulkActionResultModal;
