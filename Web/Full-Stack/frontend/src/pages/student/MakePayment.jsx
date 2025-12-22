import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import studentService from '../../services/studentService';
import './MakePayment.css';

const MakePayment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
<<<<<<< HEAD
  const [fieldErrors, setFieldErrors] = useState({});
=======
>>>>>>> finance-frontend

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const data = await studentService.getDashboardStatus();
      const balance = data.dues_balance || 0;
      setOutstandingBalance(balance);
    } catch (err) {
      setError('Failed to load balance information.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (outstandingBalance <= 0) {
      setError('No outstanding balance to pay');
      return;
    }

    // Validate card details
    if (paymentMethod === 'card') {
<<<<<<< HEAD
      const errors = {};
      let isValid = true;

      // 1. Validate Card Number
      const cleanCardNum = cardNumber.replace(/\s/g, '');
      if (cleanCardNum.length !== 16) {
        errors.cardNumber = 'Card number must be 16 digits';
        isValid = false;
      }

      // 2. Validate Expiry Date
      if (expiryDate.length !== 5) {
        errors.expiryDate = 'Invalid format (MM/YY)';
        isValid = false;
      } else {
        const [expMonth, expYear] = expiryDate.split('/');
        const month = parseInt(expMonth, 10);
        const year = parseInt(expYear, 10);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (!month || !year || month < 1 || month > 12) {
          errors.expiryDate = 'Invalid month';
          isValid = false;
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          errors.expiryDate = 'Card has expired';
          isValid = false;
        }
      }

      // 3. Validate CVV
      if (cvv.length < 3 || cvv.length > 4) {
        errors.cvv = 'Invalid CVV';
        isValid = false;
      }

      // 4. Validate Name
      if (!cardholderName || cardholderName.trim().length < 2) {
        errors.cardholderName = 'Enter cardholder name';
        isValid = false;
      }

      setFieldErrors(errors);
      if (!isValid) return;
=======
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        setError('Please fill in all card details');
        return;
      }
>>>>>>> finance-frontend
    }

    setProcessing(true);
    setError(null);
<<<<<<< HEAD
    setFieldErrors({});

    try {
      const last4 = paymentMethod === 'card' ? cardNumber.replace(/\s/g, '').slice(-4) : '0000';
      const paymentData = {
        amount: outstandingBalance,
        payment_method: paymentMethod === 'card' ? 'ONLINE' : 'MANUAL',
        reference_number: `PAY-${Date.now()}-${last4}`
=======

    try {
      const paymentData = {
        amount: outstandingBalance,
        payment_method: paymentMethod === 'card' ? 'ONLINE' : 'MANUAL',
        reference_number: `PAY-${Date.now()}`
>>>>>>> finance-frontend
      };

      const response = await studentService.makePayment(
        paymentData.amount,
        paymentData.payment_method,
        paymentData.reference_number
      );

      // Navigate to receipt page with payment data
      navigate('/student/receipt', { 
        state: { 
          paymentData: response,
          cardLast4: cardNumber.slice(-4),
          paymentMethod: paymentMethod,
          date: new Date(response.payment_date).toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        } 
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment information...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="make-payment-container">
        {/* Page Header */}
        <div className="payment-page-header">
          <h1 className="payment-page-title">Make Payment</h1>
          <p className="payment-page-subtitle">Choose your preferred payment method</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <div className="payment-content">
          {/* Left Section - Payment Form */}
          <div className="payment-form-section">
            <form onSubmit={handlePayment}>
              {/* Payment Method Selection */}
              <div className="payment-method-section">
                <h2 className="section-title">Select Payment Method</h2>
                <div className="payment-methods">
                  <div 
                    className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <svg className="method-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span>Card</span>
                  </div>
                  <div className="payment-method-card disabled">
                    <svg className="method-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Bank Transfer</span>
                  </div>
<<<<<<< HEAD
=======
                  <div className="payment-method-card disabled">
                    <svg className="method-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Cash</span>
                  </div>
>>>>>>> finance-frontend
                </div>
              </div>

              {/* Card Details Form */}
              {paymentMethod === 'card' && (
                <div className="card-details-section">
                  <div className="section-header">
                    <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="section-title">Card Details</h2>
                  </div>

                  <div className="form-group">
                    <label>Card Number</label>
<<<<<<< HEAD
                    <div className="input-with-icon">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = v.match(/.{1,4}/g)?.join(' ') || v;
                          setCardNumber(formatted);
                          setFieldErrors(prev => ({ ...prev, cardNumber: null }));
                        }}
                        maxLength="19"
                        required
                        className={fieldErrors.cardNumber ? 'invalid' : ''}
                      />
                      <svg className="field-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    {fieldErrors.cardNumber && <span className="error-message">{fieldErrors.cardNumber}</span>}
=======
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                      maxLength="16"
                      required
                    />
>>>>>>> finance-frontend
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiryDate}
<<<<<<< HEAD
                        onChange={(e) => {
                            let val = e.target.value;
                            if (val.length < expiryDate.length) { setExpiryDate(val); return; }
                            const clean = val.replace(/\D/g, '');
                            if (clean.length === 1 && parseInt(clean) > 1) { setExpiryDate(`0${clean}/`); return; }
                            if (clean.length === 2 && parseInt(clean) > 12) return; 
                            let formatted = clean.slice(0, 4);
                            if (formatted.length >= 2) formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`;
                            setExpiryDate(formatted);
                            setFieldErrors(prev => ({ ...prev, expiryDate: null }));
                        }}
                        onBlur={() => {
                            if (expiryDate.length === 5) {
                                const [expMonth, expYear] = expiryDate.split('/');
                                const month = parseInt(expMonth, 10);
                                const year = parseInt(expYear, 10);
                                const now = new Date();
                                const currentYear = now.getFullYear() % 100;
                                const currentMonth = now.getMonth() + 1;

                                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                                    setFieldErrors(prev => ({ ...prev, expiryDate: 'Card has expired' }));
                                }
                            }
                        }}
                        maxLength="5"
                        required
                        className={fieldErrors.expiryDate ? 'invalid' : ''}
                      />
                      {fieldErrors.expiryDate && <span className="error-message">{fieldErrors.expiryDate}</span>}
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <div className="input-with-icon">
                        <input
                          type="text"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => {
                            setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                            setFieldErrors(prev => ({ ...prev, cvv: null }));
                          }}
                          maxLength="4"
                          required
                          className={fieldErrors.cvv ? 'invalid' : ''}
                        />
                         <svg className="field-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      {fieldErrors.cvv && <span className="error-message">{fieldErrors.cvv}</span>}
=======
                        onChange={(e) => setExpiryDate(e.target.value)}
                        maxLength="5"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                        maxLength="3"
                        required
                      />
>>>>>>> finance-frontend
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
<<<<<<< HEAD
                      placeholder="JOHN SMITH"
                      value={cardholderName}
                      onChange={(e) => {
                        setCardholderName(e.target.value.toUpperCase());
                        setFieldErrors(prev => ({ ...prev, cardholderName: null }));
                      }}
                      required
                      className={fieldErrors.cardholderName ? 'invalid' : ''}
                    />
                    {fieldErrors.cardholderName && <span className="error-message">{fieldErrors.cardholderName}</span>}
=======
                      placeholder="John Smith"
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      required
                    />
>>>>>>> finance-frontend
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Section - Payment Summary */}
          <div className="payment-summary-section">
            <div className="summary-card">
              <div className="summary-header">
                <svg className="summary-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h2 className="summary-title">Payment Summary</h2>
              </div>

              <div className="summary-content">
                <div className="summary-row">
                  <span className="summary-label">Outstanding Balance</span>
                  <span className="summary-value">${outstandingBalance.toLocaleString()}</span>
                </div>

                <button 
                  className="pay-btn"
                  onClick={handlePayment}
                  disabled={processing || outstandingBalance <= 0}
                >
                  {processing ? 'Processing...' : `Pay $${outstandingBalance.toLocaleString()}`}
                </button>

                <p className="secure-note">
                  <svg className="lock-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MakePayment;
