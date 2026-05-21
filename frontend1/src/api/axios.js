import axios from 'axios';
import logger from '../utils/logger.js';

const normalizeBaseURL = (url) => {
  const trimmedUrl = (url || 'http://localhost:5001').trim().replace(/\/+$/, '');
  return trimmedUrl.endsWith('/api') ? trimmedUrl : `${trimmedUrl}/api`;
};

const API_BASE_URL = normalizeBaseURL(import.meta.env.VITE_BACKEND_URL);

// Create Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach auth token and log request
axiosInstance.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    }
    // Log API request
    logger.apiRequest(config.method, config.url, config.data);
    return config;
  },
  (error) => {
    logger.apiError('REQUEST', 'Interceptor', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors and log responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response
    logger.apiSuccess(response.config.method, response.config.url, response.data);
    return response;
  },
  (error) => {
    const method = error.config?.method || 'UNKNOWN';
    const url = error.config?.url || 'UNKNOWN';
    
    logger.apiError(method, url, error);

    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth
      logger.auth('TOKEN_EXPIRED', { status: 401 });
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
