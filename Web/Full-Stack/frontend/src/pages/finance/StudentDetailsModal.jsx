import React from 'react';
import './StudentDetailsModal.css';

const StudentDetailsModal = ({ studentData, onClose }) => {
    if (!studentData) return null;

    const { student, enrollments = [], payments = [], notifications = [] } = studentData;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status badge class
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'status-paid';
            case 'pending':
                return 'status-pending';
            case 'unpaid':
                return 'status-unpaid';
            default:
                return 'status-pending';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="student-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <button className="back-btn" onClick={onClose}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to selection
                    </button>
                    <button className="close-btn" onClick={onClose}>
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="modal-content">
                    {/* Title */}
                    <div className="modal-title-section">
                        <h2 className="modal-title">Student Details</h2>
                        <p className="modal-subtitle">View complete student information</p>
                    </div>

                    {/* Personal Information */}
                    <section className="info-section">
                        <h3 className="section-title">Personal Information</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <label className="info-label">STUDENT NAME</label>
                                <p className="info-value">{student.name}</p>
                            </div>
                            <div className="info-item">
                                <label className="info-label">EMAIL ADDRESS</label>
                                <p className="info-value">{student.email || 'N/A'}</p>
                            </div>
                            <div className="info-item">
                                <label className="info-label">FACULTY</label>
                                <p className="info-value">{student.faculty}</p>
                            </div>
                            <div className="info-item">
                                <label className="info-label">STATUS</label>
                                <span className={`status-badge ${getStatusClass(student.status)}`}>
                                    {student.status}
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Financial Summary */}
                    <section className="info-section">
                        <h3 className="section-title">Financial Summary</h3>
                        <div className="summary-cards">
                            <div className="summary-card">
                                <div className="card-icon blue">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <p className="card-label">TOTAL FEES</p>
                                    <p className="card-value">{formatCurrency(student.totalFees)}</p>
                                </div>
                            </div>

                            <div className="summary-card">
                                <div className="card-icon green">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <p className="card-label">AMOUNT PAID</p>
                                    <p className="card-value green">{formatCurrency(student.paid)}</p>
                                </div>
                            </div>

                            <div className="summary-card">
                                <div className="card-icon orange">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="card-content">
                                    <p className="card-label">OUTSTANDING DUES</p>
                                    <p className="card-value orange">{formatCurrency(student.dues)}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Enrolled Courses Section - NEW */}
                    <section className="info-section">
                        <h3 className="section-title">Enrolled Courses</h3>
                        {enrollments.length > 0 ? (
                            <div className="courses-table-container">
                                <table className="courses-table">
                                    <thead>
                                        <tr>
                                            <th>Course Name</th>
                                            <th>Course Fee</th>
                                            <th>Enrollment Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enrollments.map((enrollment) => (
                                            <tr key={enrollment.id}>
                                                <td className="course-name">{enrollment.course_name}</td>
                                                <td className="course-fee">{formatCurrency(enrollment.course_fee)}</td>
                                                <td className="enrollment-date">{formatDate(enrollment.enrollment_date)}</td>
                                                <td>
                                                    <span className={`enrollment-status ${enrollment.status?.toLowerCase()}`}>
                                                        {enrollment.status || 'Active'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="empty-state">
                                <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="empty-text">No course enrollments found</p>
                            </div>
                        )}
                    </section>

                    {/* Activity Summary */}
                    <section className="info-section">
                        <h3 className="section-title">Activity Summary</h3>
                        <div className="activity-cards">
                            <div className="activity-card">
                                <div className="activity-icon purple">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <p className="activity-count">{enrollments.length}</p>
                                <p className="activity-label">COURSE ENROLLMENTS</p>
                            </div>

                            <div className="activity-card">
                                <div className="activity-icon teal">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <p className="activity-count">{payments.length}</p>
                                <p className="activity-label">PAYMENT TRANSACTIONS</p>
                            </div>

                            <div className="activity-card">
                                <div className="activity-icon amber">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <p className="activity-count">{notifications.length}</p>
                                <p className="activity-label">NOTIFICATIONS SENT</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailsModal;
