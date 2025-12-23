import api from './api';

const authService = {
  /**
   * Login user with identifier and password
   * SECURITY: Portal parameter is required for strict portal isolation
   * @param {string} username 
   * @param {string} password 
   * @param {string} portal - 'student' or 'finance'
   * @returns {Promise<Object>} Response data { access_token, user_id, username, is_admin, role, ... }
   */
  login: async (username, password, portal) => {
    const response = await api.post('/auth/login', { username, password, portal });
    return response.data;
  },

  /**
   * Register a new student
   * @param {Object} userData { username, password, email }
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};

export default authService;
