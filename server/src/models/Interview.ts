import mongoose, { Schema, Document } from 'mongoose';
import { IInterview, InterviewType } from '../types/index.js';

export interface IInterviewDocument extends Omit<IInterview, '_id'>, Document {}

const InterviewSchema = new Schema<IInterviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId as any, ref: 'Application', required: true, index: true },
    type: {
      type: String,
      enum: [
        'Screening',
        'Technical',
        'System Design',
        'Behavioral',
        'Hiring Manager',
        'Final Round',
        'Offer Discussion',
      ],
      default: 'Technical',
    },
    scheduledAt: { type: Date as any, required: true, index: true },
    durationMinutes: { type: Number, default: 45 },
    meetingUrl: { type: String, default: '' },
    interviewerNames: [{ type: String }],
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Rescheduled', 'Cancelled'],
      default: 'Scheduled',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

InterviewSchema.index({ userId: 1, scheduledAt: 1 });

export const Interview = mongoose.model<IInterviewDocument>('Interview', InterviewSchema);
