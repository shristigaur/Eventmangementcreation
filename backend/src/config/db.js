/**
 * MongoDB Connection Configuration
 * Supports MongoDB Atlas & Local MongoDB
 */

import mongoose from 'mongoose';

// Disable mongoose buffering
mongoose.set('bufferCommands', false);

/**
 * Get current database connection status
 */
export const getDbStatus = () => {
  const states = [
    'disconnected',
    'connected',
    'connecting',
    'disconnecting',
  ];

  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Check if database is connected
 */
export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    // Get Mongo URI from environment variables
    const mongoURI =
      process.env.MONGODB_URI || process.env.MONGO_URI;

    console.log(
      `🗄️ MongoDB status before connect: ${getDbStatus()}`
    );

    // Check if URI exists
    if (!mongoURI) {
      throw new Error(
        'MONGODB_URI / MONGO_URI is not defined in environment variables'
      );
    }

    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(
      `✅ MongoDB Connected: ${conn.connection.host}`
    );

    console.log(
      `🗄️ MongoDB status after connect: ${getDbStatus()}`
    );

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.error(error.stack);
    console.log(`🗄️ MongoDB status after failure: ${getDbStatus()}`);
    console.log('⚠️ Server will continue running without database connection');

    // Return null so callers can decide how to proceed. Avoid exiting the
    // process here so higher-level startup logic can handle retries or
    // degraded operation (useful for container platforms and health checks).
    return null;
  }
};

export default connectDB;