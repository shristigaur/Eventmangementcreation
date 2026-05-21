import axiosInstance from './axios.js';

// Authentication API endpoints
const authAPI = {
  // Register a new user
  register: (userData) => {
    return axiosInstance.post('/auth/register', userData);
  },

  // Login user
  login: (credentials) => {
    return axiosInstance.post('/auth/login', credentials);
  },

  // Get current user info
  getMe: () => {
    return axiosInstance.get('/auth/me');
  },

  // Logout (client-side only, clears localStorage)
  logout: () => {
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  // Update user profile
  updateProfile: (userId, profileData) => {
    return axiosInstance.put(`/auth/users/${userId}`, profileData);
  },
};

export default authAPI;
