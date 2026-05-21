/**
 * Error Handling Middleware
 * Centralizes error handling across the application
 * Catches and formats errors consistently
 * Returns proper HTTP status codes and messages
 */

const errorMiddleware = (err, req, res, next) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((e) => e.message);
    message = errors.join(', ');
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (
    err.name === 'MongoNetworkError' ||
    err.name === 'MongooseServerSelectionError' ||
    err.name === 'MongoNotConnectedError' ||
    err.name === 'MongooseError' ||
    err.message?.includes('buffering timed out') ||
    err.message?.includes('before initial connection is complete') ||
    err.message?.includes('disconnected') ||
    err.message?.includes('not connected')
  ) {
    statusCode = 503;
    message = 'Database is unavailable. Please try again shortly.';
  }

  // Handle Mongoose cast errors
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  console.error('❌ Error middleware caught:', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorMiddleware;
