import axios from 'axios';
import logger from '../utils/logger.js';
import { getApiBaseUrl } from '../utils/backendUrl.js';

const API_BASE_URL = getApiBaseUrl();

// Create Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  validateStatus: (status) => status >= 200 && status < 300,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
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
    if (response.status === 304) {
      return Promise.resolve(response);
    }

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
