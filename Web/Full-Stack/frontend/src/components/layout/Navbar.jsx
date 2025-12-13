import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import logo from '../../assets/images/logo.ico';
import Login from '../../pages/auth/Login'; 
import './Navbar.css';

/**
 * Global Navigation Bar
 */
const Navbar = () => {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="navbar">
        {/* Logo Section */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <img 
            src={logo} 
            alt="FinAccount" 
            className="navbar-logo-img"
          />
        </div>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li><a href="#home" className="navbar-link">Home</a></li>
          <li><a href="#features" className="navbar-link">Features</a></li>
          <li><a href="#about" className="navbar-link">About Us</a></li>
          <li><a href="#contact" className="navbar-link">Contact</a></li>
        </ul>

        {/* Actions (Login) */}
        <div>
          <Button 
            variant="primary" 
            onClick={() => setShowLogin(true)}
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Login Modal Overlay */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
