import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from './errorHandler.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not authorized to access this resource. Please log in.', 401));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { id: string; email: string; name?: string };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Token invalid or expired. Please log in again.', 401));
  }
};
