/**
 * Express Application Configuration
 * Sets up middleware, routes, and error handling
 * Main application entry point (before server start)
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

// ===========================
// Middleware Configuration
// ===========================

/**
 * CORS Middleware
 * Allow requests from frontend application
 */
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

/**
 * Body Parser Middleware
 * Parse incoming JSON request bodies
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use((req, _res, next) => {
  if (req.method === 'POST' && req.path.includes('/auth/register')) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '[hidden]';
    if (safeBody.confirmPassword) safeBody.confirmPassword = '[hidden]';
    console.log('🧾 Incoming register request body:', safeBody);
  }
  next();
});

/**
 * Logging Middleware
 * Log HTTP requests in development mode
 */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ===========================
// API Routes
// ===========================

/**
 * Health check endpoint
 * GET /health
 * Returns: { status: 'ok' }
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Authentication routes
 * All routes prefixed with /api/auth
 */
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

/**
 * Event and RSVP routes
 * All routes prefixed with /api
 */
app.use('/api', eventRoutes);

// ===========================
// 404 Handler
// ===========================

/**
 * Handle undefined routes
 * Returns 404 error
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// ===========================
// Error Handling Middleware
// ===========================

/**
 * Centralized error handling
 * Must be defined after all other middleware and routes
 */
app.use(errorMiddleware);

export default app;
