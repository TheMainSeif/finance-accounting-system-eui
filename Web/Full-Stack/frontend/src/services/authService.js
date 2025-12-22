import api from './api';

const authService = {
  /**
   * Login user with identifier and password
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<Object>} Response data { access_token, user_id, username, is_admin, ... }
   */
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
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
