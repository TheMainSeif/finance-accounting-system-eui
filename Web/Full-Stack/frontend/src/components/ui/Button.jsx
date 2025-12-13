import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button text or content
 * @param {'primary' | 'outline' | 'ghost'} [props.variant='primary'] - Button style variant
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.rest] - Any other standard button attributes (onClick, type, etc.)
 */
const Button = ({ children, variant = 'primary', className = '', ...rest }) => {
  // Map variant strings to CSS classes defined in index.css
  const variantClass = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: '', // No specific background, just base btn styles if needed, or implement .btn-ghost in CSS
  }[variant] || 'btn-primary';

  return (
    <button 
      className={`btn ${variantClass} ${className}`} 
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
