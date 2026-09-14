import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { ApplicationEvent } from '../models/ApplicationEvent.js';
import { sendSuccess } from '../utils/response.js';

export class AnalyticsController {
  static async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await AnalyticsService.getDashboardStats(req.user!.id);
      return sendSuccess(res, stats, 'Dashboard stats fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getFullAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const period = (req.query.period as string) || 'all';
      const stats = await AnalyticsService.getFullAnalytics(req.user!.id, period);
      return sendSuccess(res, stats, 'Analytics fetched');
    } catch (error) {
      next(error);
    }
  }

  static async getActivityFeed(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { type } = req.query;
      const filter: any = { userId: req.user!.id };

      if (type && type !== 'ALL') {
        if (type === 'Applications') {
          filter.type = { $in: ['APPLIED', 'STATUS_CHANGED', 'WITHDRAWN'] };
        } else if (type === 'Interviews') {
          filter.type = { $in: ['INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'SCREENING_SCHEDULED'] };
        } else if (type === 'Emails') {
          filter.source = 'GMAIL';
        } else if (type === 'AI') {
          filter.source = 'GEMINI_AI';
        }
      }

      const activities = await ApplicationEvent.find(filter)
        .sort({ timestamp: -1 })
        .limit(50)
        .populate('applicationId', 'company role status');

      return sendSuccess(
        res,
        activities.map((a: any) => ({
          ...a.toObject(),
          company: a.applicationId?.company,
          role: a.applicationId?.role,
        })),
        'Activity feed fetched'
      );
    } catch (error) {
      next(error);
    }
  }
}
