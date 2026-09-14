import mongoose, { Schema, Document } from 'mongoose';
import { IEmailMessage } from '../types/index.js';

export interface IEmailMessageDocument extends Omit<IEmailMessage, '_id'>, Document {}

const EmailMessageSchema = new Schema<IEmailMessageDocument>(
  {
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId as any, ref: 'Application', index: true },
    providerMessageId: { type: String, required: true, index: true },
    sender: { type: String, required: true },
    subject: { type: String, required: true },
    snippet: { type: String, required: true },
    receivedAt: { type: Date as any, default: Date.now },
    classification: {
      type: String,
      enum: ['JOB_UPDATE', 'INTERVIEW_INVITE', 'REJECTION', 'OFFER', 'OTHER'],
      default: 'JOB_UPDATE',
    },
    processingStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'SKIPPED', 'FAILED'],
      default: 'PROCESSED',
      index: true,
    },
    parsedData: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate processing of the same Gmail message for the same user
EmailMessageSchema.index({ userId: 1, providerMessageId: 1 }, { unique: true });

export const EmailMessage = mongoose.model<IEmailMessageDocument>('EmailMessage', EmailMessageSchema);
