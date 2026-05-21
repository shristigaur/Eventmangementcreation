/**
 * Async Error Handler Wrapper
 * Wraps async route handlers to catch errors and pass them to error middleware
 * Eliminates the need for try-catch blocks in controllers
 * 
 * Usage:
 * router.get('/route', asyncHandler(async (req, res) => {
 *   // Your async code here
 *   // Errors are automatically caught and passed to error middleware
 * }))
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
