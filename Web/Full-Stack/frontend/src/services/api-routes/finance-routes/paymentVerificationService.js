/**
 * ================================================================================
 * PAYMENT VERIFICATION SERVICE
 * ================================================================================
 * Service for finance staff to manage bank transfer payment verification
 * ================================================================================
 */

import api from '../../api';

const paymentVerificationService = {
  /**
   * Get all pending bank transfer payments awaiting verification
   * @returns {Promise<Object>} { pending_payments: [], count: number }
   */
  getPendingPayments: async () => {
    try {
      const response = await api.get('/finance/payments/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      throw error;
    }
  },

  /**
   * Verify (approve) a pending payment
   * @param {number} paymentId - Payment ID to verify
   * @returns {Promise<Object>} Verification result
   */
  verifyPayment: async (paymentId) => {
    try {
      const response = await api.post(`/finance/payments/${paymentId}/verify`);
      return response.data;
    } catch (error) {
      console.error(`Error verifying payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Reject a pending payment
   * @param {number} paymentId - Payment ID to reject
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Rejection result
   */
  rejectPayment: async (paymentId, reason) => {
    try {
      const response = await api.post(`/finance/payments/${paymentId}/reject`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error(`Error rejecting payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Get proof document URL for a payment
   * @param {number} paymentId - Payment ID
   * @returns {string} URL to proof document with auth token
   */
  getProofDocumentUrl: (paymentId) => {
    // Get JWT token from localStorage
    const token = localStorage.getItem('token');
    // Return the URL with token as query parameter for iframe access
    return `/api/finance/payments/${paymentId}/proof${token ? `?token=${token}` : ''}`;
  }
};

export default paymentVerificationService;
