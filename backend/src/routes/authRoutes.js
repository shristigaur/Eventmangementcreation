/**
 * Authentication Routes
 * Defines endpoints for user authentication
 * /register - POST to create new user
 * /login - POST to authenticate user
 * /me - GET to retrieve current user (protected)
 */

import express from 'express';
import {
  register,
  login,
  getCurrentUser,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

/**
 * POST /register
 * Register a new user
 * Body: { name, email, password }
 * Returns: { token, user }
 */
router.post('/register', asyncHandler(register));

/**
 * POST /login
 * Login existing user
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post('/login', asyncHandler(login));

/**
 * GET /me
 * Get current authenticated user
 * Protected route - requires valid JWT token in Authorization header
 * Headers: Authorization: Bearer <token>
 * Returns: { user }
 */
router.get('/me', authMiddleware, asyncHandler(getCurrentUser));

export default router;
