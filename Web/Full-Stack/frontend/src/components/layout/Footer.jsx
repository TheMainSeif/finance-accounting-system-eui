import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer-text">
        &copy; {new Date().getFullYear()} Finance & Accounting System | Built by Team X (EUI)
      </p>
    </footer>
  );
};

export default Footer;
