/**
 * Server Entry Point
 * Starts Express server and connects to MongoDB
 * Handles graceful shutdown
 */

import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/* * Start Server
 * Connects to database and listens on specified port
 */
const startServer = async () => {
  try {
    const [{ default: app }, { default: connectDB }] = await Promise.all([
      import('./app.js'),
      import('./config/db.js'),
    ]);

    // Connect to MongoDB
    const dbConn = await connectDB();

    // If DB connection failed, log a warning but continue running so health
    // endpoints remain available (useful for platform health checks).
    if (!dbConn) {
         console.error('❌ MongoDB connection failed. Stopping server.');
          process.exit(1);
      }
    const listenPort = Number(PORT);
    const server = app.listen(listenPort);

    server.on('listening', () => {
      console.log(`
╔════════════════════════════════════════════╗
║   🚀 Event Management Backend              ║
║   Environment: ${NODE_ENV === 'development' ? 'Development ' : 'Production'}          ║
║   Server running on port: ${String(listenPort).padEnd(21)} ║
║   API: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${listenPort}`}
╚════════════════════════════════════════════╝
      `);

      // Log available endpoints
      console.log('📌 Available Endpoints:');
      console.log('   POST   /auth/register        - Register new user');
      console.log('   POST   /api/auth/register    - Register new user');
      console.log('   POST   /auth/login           - Login user');
      console.log('   POST   /api/auth/login       - Login user');
      console.log('   GET    /api/auth/me          - Get current user (protected)');
      console.log('   GET    /api/events           - List events');
      console.log('   POST   /api/events           - Create event (protected)');
      console.log('   GET    /api/events/:id       - Get event by ID');
      console.log('   PUT    /api/events/:id       - Update event (protected)');
      console.log('   DELETE /api/events/:id       - Delete event (protected)');
      console.log('   POST   /api/events/:id/rsvp  - RSVP to event (protected)');
      console.log('   GET    /health               - Health check');
      console.log('');
    });

    server.on('error', (error) => {
      console.error('❌ Failed to start HTTP server:', {
        code: error.code,
        message: error.message,
        port: listenPort,
        stack: error.stack,
      });

      if (error.code === 'EADDRINUSE') {
        console.error(
          `Port ${listenPort} is already in use. Stop the other server or set PORT to a free port.`
        );
      }

      process.exit(1);
    });

    /**
     * Graceful Shutdown
     * Closes server and database connection on termination signal
     */
    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();
