/**
 * MongoDB Connection Configuration
 * Establishes connection to MongoDB using Mongoose
 * Supports both local MongoDB and MongoDB Atlas
 */

import mongoose from 'mongoose';

mongoose.set('bufferCommands', false);

export const getDbStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState] || 'unknown';
};

export const isDbConnected = () => mongoose.connection.readyState === 1;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

    console.log(`🗄️  MongoDB status before connect: ${getDbStatus()}`);

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗄️  MongoDB status after connect: ${getDbStatus()}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    console.error(error.stack);
    console.log(`🗄️  MongoDB status after failure: ${getDbStatus()}`);
    console.log('⚠️  Server will continue running without database connection');
    console.log('   Note: Database features will not work until MongoDB is available');
    return null;
  }
};

export default connectDB;
