import React, { createContext, useState, useEffect } from 'react';
import authAPI from '../api/authAPI.js';
import logger from '../utils/logger.js';
import { getApiErrorMessage } from '../utils/apiError.js';
import { getStoredUserPayload } from '../utils/tokenStorage.js';

// Create Auth Context
export const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    logger.lifecycle("AuthProvider", "INIT");
    const storedUserData = getStoredUserPayload();
    let hydratedToken = null;

    if (storedUserData) {
      setUser(storedUserData.user || storedUserData);
      hydratedToken = storedUserData.token || storedUserData.user?.token || null;
      setToken(hydratedToken);
      logger.auth("AUTO_LOGIN", { userId: storedUserData.user?._id || storedUserData._id });
    } else {
      logger.auth("NO_STORED_USER", {});
    }
    setIsLoading(false);

    if (hydratedToken) {
      void getCurrentUser();
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
    logger.auth("LOGIN_START", { email: normalizedEmail });
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login({ email: normalizedEmail, password });
      const { user: userData, token: newToken } = response.data;

      // Store in state
      setUser(userData);
      setToken(newToken);
      logger.stateUpdate("AuthContext", "user", userData);

      // Store in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({ user: userData, token: newToken })
      );
      localStorage.removeItem('authUser');
      logger.auth("LOGIN_SUCCESS", { userId: userData._id, email });

      return { success: true, user: userData };
    } catch (err) {
      const errorMsg = getApiErrorMessage(err, 'Login failed');
      setError(errorMsg);
      logger.auth("LOGIN_ERROR", { error: errorMsg, status: err.response?.status });
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    const payload = {
      ...userData,
      name: typeof userData.name === 'string' ? userData.name.trim() : userData.name,
      email: typeof userData.email === 'string' ? userData.email.trim().toLowerCase() : userData.email,
    };

    logger.auth("REGISTER_START", { email: payload.email });
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(payload);
      const { user: newUser, token: newToken } = response.data;

      // Store in state
      setUser(newUser);
      setToken(newToken);
      logger.stateUpdate("AuthContext", "user", newUser);

      // Store in localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({ user: newUser, token: newToken })
      );
      localStorage.removeItem('authUser');
      logger.auth("REGISTER_SUCCESS", { userId: newUser._id, email: payload.email });

      return { success: true, user: newUser };
    } catch (err) {
      const errorMsg = getApiErrorMessage(err, 'Registration failed');
      setError(errorMsg);
      logger.auth("REGISTER_ERROR", { error: errorMsg, status: err.response?.status });
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    logger.auth("LOGOUT", { userId: user?._id });
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authUser');
    logger.auth("LOGOUT_SUCCESS", {});
  };

  // Get current user info
  const getCurrentUser = async () => {
    logger.data("FETCH", "Current User", {});
    try {
      const response = await authAPI.getMe();
      setUser(response.data.user);
      logger.stateUpdate("AuthContext", "user", response.data.user);
      return response.data.user;
    } catch (err) {
      logger.apiError("GET", "/auth/me", err);
      logout();
      return null;
    }
  };

  // Update user profile
  const updateUserProfile = async (profileData) => {
    logger.data("UPDATE", "User Profile", profileData);
    try {
      const response = await authAPI.updateProfile(user._id, profileData);
      const updatedUser = response.data.user;
      setUser(updatedUser);
      logger.stateUpdate("AuthContext", "user", updatedUser);

      // Update localStorage
      localStorage.setItem(
        'user',
        JSON.stringify({ user: updatedUser, token })
      );
      logger.auth("PROFILE_UPDATE_SUCCESS", { userId: user._id });

      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Update failed';
      setError(errorMsg);
      logger.auth("PROFILE_UPDATE_ERROR", { error: errorMsg });
      return { success: false, error: errorMsg };
    }
  };

  // Context value
  const value = {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    getCurrentUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
