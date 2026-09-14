import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { AIService } from '../services/ai.service.js';
import { sendSuccess } from '../utils/response.js';

export class AIController {
  static async parseJob(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { jobDescription } = req.body;
      const extracted = await AIService.parseJobDescription(req.user!.id, jobDescription);
      return sendSuccess(res, extracted, 'Job description parsed successfully');
    } catch (error) {
      next(error);
    }
  }

  static async assistant(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { query, conversationHistory } = req.body;
      const result = await AIService.handleAssistantQuery(req.user!.id, query, conversationHistory);
      return sendSuccess(res, result, 'Assistant response generated');
    } catch (error) {
      next(error);
    }
  }
}
