import mongoose from 'mongoose';
import { config } from './index.js';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    isConnected = false;
    console.error(`[Database] Connection Error: Could not connect to MongoDB at "${config.mongoUri.replace(/:\/\/[^@]*@/, '://<credentials>@')}". Reason: ${error.message}`);
    console.warn('[Database] If deployed on Vercel/Render, ensure you have set MONGODB_URI in your dashboard environment variables (MongoDB Atlas).');
  }
};
