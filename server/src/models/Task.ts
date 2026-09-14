import mongoose, { Schema, Document } from 'mongoose';
import { ITask } from '../types/index.js';

export interface ITaskDocument extends Omit<ITask, '_id'>, Document {}

const TaskSchema = new Schema<ITaskDocument>(
  {
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId as any, ref: 'Application', index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    dueDate: { type: Date as any },
    completed: { type: Boolean, default: false, index: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  },
  {
    timestamps: true,
  }
);

TaskSchema.index({ userId: 1, completed: 1, dueDate: 1 });

export const Task = mongoose.model<ITaskDocument>('Task', TaskSchema);
