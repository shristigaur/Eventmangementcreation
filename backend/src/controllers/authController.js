/**
 * Authentication Controller
 * Handles user registration, login, and profile retrieval
 * Implements business logic for authentication
 */

import User from '../models/User.js';
import { isDbConnected, getDbStatus } from '../config/db.js';
import generateToken from '../utils/generateToken.js';

const sanitizeRegisterBody = (body) => {
  const safeBody = body && typeof body === 'object' ? body : {};

  return {
    ...safeBody,
    password: safeBody.password ? '[hidden]' : safeBody.password,
    confirmPassword: safeBody.confirmPassword ? '[hidden]' : safeBody.confirmPassword,
  };
};

/**
 * Register a new user
 * POST /api/auth/register
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.fullName - User's full name (frontend alias)
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password (min 6 chars)
 * @param {Object} res - Express response object
 */
export const register = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Request body must be valid JSON',
      });
    }

    console.log('🧾 [REGISTER] incoming body:', sanitizeRegisterBody(req.body));
    console.log(`🗄️  [REGISTER] MongoDB status: ${getDbStatus()}`);

    const { name, fullName, email, password, confirmPassword } = req.body;
    const displayName = (name || fullName || '').trim();
    const normalizedEmail =
      typeof email === 'string' ? email.trim().toLowerCase() : '';

    // Validate input
    if (!displayName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match',
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Please try again shortly.',
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Create new user
    const user = new User({
      name: displayName,
      email: normalizedEmail,
      password,
    });

    // Save user to database
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email);

    // Return response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ [REGISTER] crash:', error.message);
    console.error(error.stack);
    next(error);
  }
};

/**
 * Login user
 * POST /api/auth/login
 *
 * @param {Object} req - Express request object
 * @param {string} req.body.email - User's email
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user by email and get password (select: false by default)
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if password matches
    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.email);

    // Return response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 * Protected route - requires valid JWT token
 *
 * @param {Object} req - Express request object (contains user from auth middleware)
 * @param {Object} res - Express response object
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update current user profile
 * PUT /api/auth/users/:userId
 * Protected route - requires valid JWT token
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const authUser = req.user;

    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (authUser._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      });
    }

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is not connected. Please try again shortly.',
      });
    }

    const { name, fullName, email } = req.body || {};
    const updateData = {};

    const resolvedName = (name || fullName || '').trim();
    if (resolvedName) {
      updateData.name = resolvedName;
    }

    if (typeof email === 'string' && email.trim()) {
      updateData.email = email.trim().toLowerCase();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided to update',
      });
    }

    if (updateData.email) {
      const duplicate = await User.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered',
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        fullName: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
