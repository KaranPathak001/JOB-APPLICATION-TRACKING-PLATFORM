import mongoose, { Schema, Document } from 'mongoose';
import { IAIProcessingLog } from '../types/index.js';

export interface IAIProcessingLogDocument extends Document {
  userId: mongoose.Types.ObjectId;
  emailMessageId?: mongoose.Types.ObjectId;
  provider: string;
  aiModel: string;
  operation: string;
  status: 'SUCCESS' | 'FAILED';
  confidence: number;
  inputMetadata: Record<string, any>;
  output: Record<string, any>;
  error?: string;
  createdAt: Date;
}

const AIProcessingLogSchema = new Schema<IAIProcessingLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
    emailMessageId: { type: Schema.Types.ObjectId as any, ref: 'EmailMessage' },
    provider: { type: String, default: 'Google Gemini' },
    aiModel: { type: String, default: 'gemini-1.5-flash' },
    operation: { type: String, required: true },
    status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
    confidence: { type: Number, default: 1.0 },
    inputMetadata: { type: Schema.Types.Mixed, default: {} },
    output: { type: Schema.Types.Mixed, default: {} },
    error: { type: String },
  },
  {
    timestamps: true,
  }
);

export const AIProcessingLog = mongoose.model<IAIProcessingLogDocument>('AIProcessingLog', AIProcessingLogSchema);
