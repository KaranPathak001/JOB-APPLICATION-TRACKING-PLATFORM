import mongoose, { Schema, Document } from 'mongoose';
import { IApplicationEvent, EventType } from '../types/index.js';

export interface IApplicationEventDocument extends Omit<IApplicationEvent, '_id'>, Document {}

const ApplicationEventSchema = new Schema<IApplicationEventDocument>(
  {
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId as any, ref: 'Application', required: true, index: true },
    type: {
      type: String,
      enum: [
        'APPLIED',
        'RESUME_VIEWED',
        'SHORTLISTED',
        'SCREENING_SCHEDULED',
        'INTERVIEW_SCHEDULED',
        'INTERVIEW_COMPLETED',
        'OFFER_RECEIVED',
        'REJECTED',
        'WITHDRAWN',
        'EMAIL_RECEIVED',
        'NOTE_ADDED',
        'STATUS_CHANGED',
      ],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    source: {
      type: String,
      enum: ['MANUAL', 'GMAIL', 'GEMINI_AI', 'SYSTEM'],
      default: 'MANUAL',
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date as any, default: Date.now, index: true },
  },
  {
    timestamps: true,
  }
);

ApplicationEventSchema.index({ userId: 1, timestamp: -1 });

export const ApplicationEvent = mongoose.model<IApplicationEventDocument>('ApplicationEvent', ApplicationEventSchema);
