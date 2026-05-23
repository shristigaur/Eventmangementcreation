import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = async () => {
  try {
    const [{ default: app }, { default: connectDB }] = await Promise.all([
      import('./app.js'),
      import('./config/db.js'),
    ]);

    // Attempt to connect to MongoDB but do not let a failed DB connection
    // crash the whole process immediately — allow health checks to remain
    // available for debugging and platform probes.
    let dbConn = null;
    try {
      dbConn = await connectDB();
      if (!dbConn) {
        console.warn('⚠️ MongoDB connection not established. Continuing without DB.');
      }
    } catch (dbErr) {
      console.error('❌ MongoDB connect attempt threw an error:', dbErr && dbErr.message);
      console.error(dbErr && dbErr.stack);
      console.warn('⚠️ Server will continue running without database connection');
      dbConn = null;
    }

    const listenPort = Number(PORT);
    const server = app.listen(listenPort);

    server.on('listening', () => {
      console.log(`\nEvent Management Backend`);
      console.log(`Environment: ${NODE_ENV}`);
      console.log(`Server running on port: ${listenPort}`);
      console.log(`API: ${process.env.RENDER_EXTERNAL_URL || `http://localhost:${listenPort}`}`);

      // console.log('📌 Available Endpoints:');
      // console.log('   POST   /auth/register        - Register new user');
      // console.log('   POST   /api/auth/register    - Register new user');
      // console.log('   POST   /auth/login           - Login user');
      // console.log('   POST   /api/auth/login       - Login user');
      // console.log('   GET    /api/auth/me          - Get current user (protected)');
      // console.log('   GET    /api/events           - List events');
      // console.log('   POST   /api/events           - Create event (protected)');
      // console.log('   GET    /api/events/:id       - Get event by ID');
      // console.log('   PUT    /api/events/:id       - Update event (protected)');
      // console.log('   DELETE /api/events/:id       - Delete event (protected)');
      // console.log('   POST   /api/events/:id/rsvp  - RSVP to event (protected)');
      // console.log('   GET    /health               - Health check');
      // console.log('');
    });

    server.on('error', (error) => {
      console.error('❌ Failed to start HTTP server:', {
        code: error.code,
        message: error.message,
        port: listenPort,
        stack: error.stack,
      });

      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${listenPort} is already in use. Stop the other server or set PORT to a free port.`);
      }

      process.exit(1);
    });

    const gracefulShutdown = (signal) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);

      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error && error.message);
    console.error(error && error.stack);
    console.warn('The server did not start successfully. Fix the error and restart the process.');
  }
};

// Start the server
startServer();
