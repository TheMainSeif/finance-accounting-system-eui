import React from 'react';
import './IndividualActionSuccessModal.css';

const IndividualActionSuccessModal = ({ isOpen, onClose, actionType, studentName }) => {
    if (!isOpen) return null;

    const getConfig = () => {
        switch (actionType) {
            case 'reminder':
                return {
                    title: 'Reminder Sent!',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    message: `Payment reminder has been sent to ${studentName}`
                };
            case 'penalty':
                return {
                    title: 'Penalty Applied!',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    message: `Penalty has been successfully applied to ${studentName}`
                };
            case 'block':
                return {
                    title: 'Registration Blocked!',
                    icon: (
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    message: `Registration has been blocked for ${studentName}`
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
            <div className="individual-success-modal">
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
                    <p className="modal-message">{config.message}</p>

                    {/* Close Button */}
                    <button className="close-btn" onClick={onClose}>
                        Continue
                    </button>
                </div>
            </div>
        </>
    );
};

export default IndividualActionSuccessModal;
