import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { InterviewService } from '../services/interview.service.js';
import { sendSuccess } from '../utils/response.js';

export class InterviewController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const interviews = await InterviewService.listInterviews(req.user!.id);
      return sendSuccess(res, interviews, 'Interviews retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const interview = await InterviewService.createInterview(req.user!.id, req.body);
      return sendSuccess(res, interview, 'Interview scheduled successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const interview = await InterviewService.updateInterview(req.user!.id, req.params.id, req.body);
      return sendSuccess(res, interview, 'Interview updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await InterviewService.deleteInterview(req.user!.id, req.params.id);
      return sendSuccess(res, result, 'Interview deleted');
    } catch (error) {
      next(error);
    }
  }
}
