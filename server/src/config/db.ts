import mongoose from 'mongoose';
import { config } from './index.js';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[Database] Warning: Could not connect to MongoDB at ${config.mongoUri}. (${error.message})`);
    console.warn('[Database] App will operate in resilient demo/mock fallback mode if database is offline.');
  }
};
