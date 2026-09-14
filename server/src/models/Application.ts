import mongoose, { Schema, Document } from 'mongoose';
import { IApplication, ApplicationStatus, WorkMode } from '../types/index.js';

export interface IApplicationDocument extends Omit<IApplication, '_id'>, Document {}

const ApplicationSchema = new Schema<IApplicationDocument>(
  {
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
    company: { type: String, required: true, trim: true, index: true },
    role: { type: String, required: true, trim: true, index: true },
    location: { type: String, default: 'Remote' },
    workMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Remote',
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn'],
      default: 'Applied',
      index: true,
    },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: 'USD' },
    jobUrl: { type: String, default: '' },
    source: { type: String, default: 'LinkedIn', index: true },
    appliedDate: { type: Date as any, default: Date.now, index: true },
    lastActivityAt: { type: Date as any, default: Date.now, index: true },
    contactPerson: {
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      role: { type: String, default: '' },
    },
    notesCount: { type: Number, default: 0 },
    tasksCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Compound index for deduplication & search optimization
ApplicationSchema.index({ userId: 1, company: 1, role: 1 });
ApplicationSchema.index({ userId: 1, status: 1, appliedDate: -1 });

export const Application = mongoose.model<IApplicationDocument>('Application', ApplicationSchema);
