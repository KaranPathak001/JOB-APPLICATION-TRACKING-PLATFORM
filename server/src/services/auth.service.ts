import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUserDocument } from '../models/User.js';
import { config } from '../config/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { IUser } from '../types/index.js';

export class AuthService {
  static async register(name: string, email: string, password: string):Promise<{ user: IUser; token: string }> {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new AppError('An account with this email already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    });

    const token = this.generateToken(user);
    return { user: user.toJSON() as any, token };
  }

  static async login(email: string, password: string): Promise<{ user: IUser; token: string }> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user);
    return { user: user.toJSON() as any, token };
  }

  static async getMe(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user.toJSON() as any;
  }

  static async updatePreferences(userId: string, preferences: Partial<IUser['preferences']>): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    user.preferences = { ...(user.preferences || {}), ...preferences } as any;
    await user.save();
    return user.toJSON() as any;
  }

  private static generateToken(user: IUserDocument): string {
    return jwt.sign(
      { id: user._id.toString(), email: user.email, name: user.name },
      config.jwtSecret,
      { expiresIn: '7d' }
    );
  }
}
