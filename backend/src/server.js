/**
 * Server Entry Point
 * Starts Express server and connects to MongoDB
 * Handles graceful shutdown
 */

import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const PORT = process.env.PORT || 5001;
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
      console.warn('⚠️ MongoDB connection failed; server will continue running without DB.');
    }

    // Start listening on port with retry on EADDRINUSE
    let server = null;
    const maxAttempts = 5;
    let attempt = 0;
    let listenPort = Number(PORT);

    while (attempt < maxAttempts) {
      try {
        // eslint-disable-next-line no-await-in-loop
        server = await new Promise((resolve, reject) => {
          const s = app.listen(listenPort);
          s.once('listening', () => resolve(s));
          s.once('error', (err) => reject(err));
        });
        break;
      } catch (err) {
        if (err && err.code === 'EADDRINUSE') {
          console.warn(`Port ${listenPort} is in use, trying next port...`);
          listenPort += 1;
          attempt += 1;
          // small delay before retrying
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 200));
          continue;
        }

        // Unknown error - rethrow
        throw err;
      }
    }

    if (!server) {
      throw new Error(`Failed to bind to a port after ${maxAttempts} attempts`);
    }

    server.on('listening', () => {
      try {
        // Write the chosen listen port to a file for local tooling
        const portFile = new URL('../.backend_port', import.meta.url).pathname;
        // Use a non-blocking write
        import('fs').then(({ promises: fs }) => fs.writeFile(portFile, String(listenPort), 'utf8').catch(() => {}));
      } catch (e) {
        // ignore
      }
      console.log(`
╔════════════════════════════════════════════╗
║   🚀 Event Management Backend              ║
║   Environment: ${NODE_ENV === 'development' ? 'Development ' : 'Production'}          ║
║   Server running on port: ${String(listenPort).padEnd(21)} ║
║   API: http://localhost:${String(listenPort).padEnd(21)} ║
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
