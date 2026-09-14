import mongoose, { Schema, Document } from 'mongoose';
import { INote } from '../types/index.js';

export interface INoteDocument extends Omit<INote, '_id'>, Document {}

const NoteSchema = new Schema<INoteDocument>(
  {
    userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true, index: true },
    applicationId: { type: Schema.Types.ObjectId as any, ref: 'Application', required: true, index: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Note = mongoose.model<INoteDocument>('Note', NoteSchema);
