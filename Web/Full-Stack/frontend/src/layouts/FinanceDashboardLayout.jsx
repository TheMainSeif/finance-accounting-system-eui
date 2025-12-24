import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logoIcon from '../assets/images/logo.ico';
import './FinanceDashboardLayout.css';

const FinanceDashboardLayout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    // Close sidebar on route change
    React.useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        // Clear auth data immediately (synchronous)
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Force immediate navigation to home (bypasses all React routing)
        window.location.href = '/';
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className={`finance-dashboard-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
            {/* Top Header Bar */}
            <header className="finance-topbar">
                <button className="menu-toggle-btn" onClick={toggleSidebar} aria-label="Toggle Menu">
                    <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="topbar-brand">
                    <img src={logoIcon} alt="Logo" className="topbar-logo" />
                    <span>Finance Portal</span>
                </div>
            </header>

            {/* Overlay Backdrop */}
            <div className="sidebar-overlay" onClick={closeSidebar}></div>

            {/* Sidebar */}
            <aside className="finance-sidebar">
                {/* Close Button */}
                <button className="sidebar-close-btn" onClick={closeSidebar} aria-label="Close Sidebar">
                    <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Logo Section */}
                <div className="sidebar-header">
                    <div className="logo-container">
                        <img src={logoIcon} alt="Logo" className="sidebar-logo" />
                    </div>
                    <div className="portal-info">
                        <h2 className="sidebar-portal-title">FinAccount</h2>
                        <p className="sidebar-portal-subtitle">Finance Dept</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    <ul className="nav-list">
                        <li className={`nav-item ${location.pathname === '/finance/dashboard' ? 'active' : ''}`}>
                            <Link to="/finance/dashboard" className="nav-link">
                                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        <li className={`nav-item ${location.pathname === '/finance/students' ? 'active' : ''}`}>
                            <Link to="/finance/students" className="nav-link">
                                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Student List</span>
                            </Link>
                        </li>

                        <li className={`nav-item ${location.pathname === '/finance/fee-calculation' ? 'active' : ''}`}>
                            <Link to="/finance/fee-calculation" className="nav-link">
                                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>Fee Calculation</span>
                            </Link>
                        </li>

                        <li className={`nav-item ${location.pathname === '/finance/pending-payments' ? 'active' : ''}`}>
                            <Link to="/finance/pending-payments" className="nav-link">
                                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Pending Payments</span>
                            </Link>
                        </li>

                        <li className={`nav-item ${location.pathname === '/finance/bank-reconciliation' ? 'active' : ''}`}>
                            <Link to="/finance/bank-reconciliation" className="nav-link">
                                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <span>Bank Reconciliation</span>
                            </Link>
                        </li>

                        <li className={`nav-item ${location.pathname === '/finance/reports' ? 'active' : ''}`}>
                            <Link to="/finance/reports" className="nav-link">
                                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Reports</span>
                            </Link>
                        </li>

                        <li className={`nav-item ${location.pathname === '/finance/unpaid-students' ? 'active' : ''}`}>
                            <Link to="/finance/unpaid-students" className="nav-link">
                                <svg className="nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>Unpaid Students</span>
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* User Profile Section */}
                <div className="sidebar-footer">
                    <div className="user-profile">
                        <div className="user-avatar">
                            FM
                        </div>
                        <div className="user-info">
                            <div className="user-name">Finance Manager</div>
                            <div className="user-email">finance@univ.edu</div>
                        </div>
                    </div>

                    <button className="signout-btn" onClick={handleLogout}>
                        <svg className="signout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="finance-main">
                {children}
            </main>
        </div>
    );
};

export default FinanceDashboardLayout;
