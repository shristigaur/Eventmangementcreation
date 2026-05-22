import axios from 'axios';
import logger from '../utils/logger.js';
import { getApiBaseUrl } from '../utils/backendUrl.js';
import { getStoredToken } from '../utils/tokenStorage.js';

const API_BASE_URL = getApiBaseUrl();

const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);
const RETRYABLE_METHODS = new Set(['get', 'head', 'options']);

const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const shouldRetryRequest = (error, config) => {
  if (!config) return false;

  const method = (config.method || 'get').toLowerCase();
  const retryEnabled = config.retry !== false && config.meta?.retry !== false;
  const retryableMethod = RETRYABLE_METHODS.has(method) || config.meta?.retry === true;

  if (!retryEnabled || !retryableMethod) {
    return false;
  }

  if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
    return true;
  }

  const status = error.response?.status;
  return status ? RETRYABLE_STATUS_CODES.has(status) : false;
};

const retryRequest = async (instance, error) => {
  const config = error.config;
  if (!config) {
    throw error;
  }

  config.__retryCount = config.__retryCount || 0;
  const maxRetries = config.meta?.maxRetries ?? 2;

  if (config.__retryCount >= maxRetries || !shouldRetryRequest(error, config)) {
    throw error;
  }

  config.__retryCount += 1;
  const delayMs = (config.meta?.retryDelayMs ?? 1000) * config.__retryCount;
  logger.lifecycle('API_RETRY', `${(config.method || 'get').toUpperCase()} ${config.url} retry ${config.__retryCount}/${maxRetries}`);
  await sleep(delayMs);
  return instance.request(config);
};

// Create Axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }

    return retryRequest(axiosInstance, error);
  }
);

export default axiosInstance;
