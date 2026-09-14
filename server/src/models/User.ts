import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types/index.js';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  passwordHash: string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String, default: '' },
    preferences: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
      targetRoles: [{ type: String }],
      targetLocations: [{ type: String }],
      expectedSalary: { type: Number },
      currency: { type: String, default: 'USD' },
      workPreference: { type: String, enum: ['remote', 'hybrid', 'onsite', 'any'], default: 'any' },
      emailSyncEnabled: { type: Boolean, default: false },
      notificationsEnabled: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Helper method or schema index
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);
