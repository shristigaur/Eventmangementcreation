/**
 * Express Application Configuration
 * Main Backend Application Setup
 */

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

/* ======================================================
   CORS CONFIGURATION
====================================================== */

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Pragma',
      'Expires',
    ],
  })
);

/* ======================================================
   BODY PARSER MIDDLEWARE
====================================================== */

app.use(
  express.json({
    limit: '10mb',
  })
);

app.use(
  express.urlencoded({
    limit: '10mb',
    extended: true,
  })
);

/* ======================================================
   DEBUG / REQUEST LOGGER
====================================================== */

app.use((req, _res, next) => {
  console.log(
    `📡 ${req.method} ${req.originalUrl}`
  );

  // Hide passwords in logs
  if (
    req.method === 'POST' &&
    req.path.includes('/auth/register')
  ) {
    const safeBody = { ...req.body };

    if (safeBody.password) {
      safeBody.password = '[hidden]';
    }

    if (safeBody.confirmPassword) {
      safeBody.confirmPassword = '[hidden]';
    }

    console.log(
      '🧾 Register Request:',
      safeBody
    );
  }

  next();
});

/* ======================================================
   DEVELOPMENT LOGGER
====================================================== */

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/* ======================================================
   HEALTH CHECK ROUTE
====================================================== */

/**
 * GET /health
 */
app.get('/health', (_req, res) => {
  return res.status(200).json({
    success: true,
    status: 'ok',
    message: '🚀 Server is running',
    timestamp: new Date().toISOString(),
  });
});

/* ======================================================
   API ROUTES
====================================================== */

/**
 * Authentication Routes
 */
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

/**
 * Event + RSVP Routes
 */
app.use('/api', eventRoutes);

/**
 * Optional direct routes
 * Example:
 * /events instead of /api/events
 */
app.use('/', eventRoutes);

/* ======================================================
   ROOT ROUTE
====================================================== */

app.get('/', (_req, res) => {
  return res.status(200).json({
    success: true,
    message:
      '🎉 Event Management API is running',
  });
});

/* ======================================================
   404 ROUTE HANDLER
====================================================== */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

/* ======================================================
   GLOBAL ERROR HANDLER
====================================================== */

app.use(errorMiddleware);

export default app;