/**
 * Authentication Middleware
 * Verifies JWT token and validates user
 * Protects routes that require authentication
 * Attaches user information to request object
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import getJwtSecret from '../config/jwt.js';
import { isDbConnected } from '../config/db.js';

/**
 * Middleware to check if user is authenticated
 * Extracts and verifies JWT token from Authorization header
 * If valid, attaches user data to req.user
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login to access this resource.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, getJwtSecret());

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is unavailable. Please try again shortly.',
      });
    }

    // Find user by ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token may be invalid.',
      });
    }

    // Attach user to request object
    req.user = user;
    req.userId = decoded.id;

    next();
  } catch (error) {
    // Handle token expiration
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
    }

    // Handle invalid token
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please try again.',
    });
  }
};

export default authMiddleware;
