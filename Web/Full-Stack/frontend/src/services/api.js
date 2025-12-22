import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  baseURL: '/api', // Proxied to http://localhost:5000 in vite.config.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Auto-logout on 401 response from API
    if (error.response && error.response.status === 401) {
      // We perform a cleaner logout in AuthContext, but this is a failsafe
      // localStorage.removeItem('token');
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;
