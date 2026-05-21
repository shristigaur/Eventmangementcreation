/**
 * JWT Token Generation Utility
 * Creates secure JWT tokens with user ID and email
 * Token is used for authentication in protected routes
 */

import jwt from 'jsonwebtoken';
import getJwtSecret from '../config/jwt.js';

/**
 * Generates a JWT token for the user
 * @param {string} userId - User ID to embed in token
 * @param {string} userEmail - User email to embed in token
 * @returns {string} JWT token
 */
const generateToken = (userId, userEmail) => {
  return jwt.sign(
    {
      id: userId,
      email: userEmail,
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRE || '7d',
    }
  );
};

export default generateToken;
