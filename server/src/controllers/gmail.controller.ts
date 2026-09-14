import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { GmailService } from '../integrations/gmail/gmail.service.js';
import { sendSuccess } from '../utils/response.js';

export class GmailController {
  static getConnectUrl(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const url = GmailService.getAuthUrl();
      return sendSuccess(res, { url }, 'OAuth URL generated');
    } catch (error) {
      next(error);
    }
  }

  static async getStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const status = await GmailService.getSyncStatus(req.user!.id);
      return sendSuccess(res, status, 'Gmail sync status retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async sync(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { messageId, sender, subject, body } = req.body;
      const msgId = messageId || `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const result = await GmailService.processIncomingEmail(
        req.user!.id,
        msgId,
        sender || 'recruiter@careers.stripe.com',
        subject || 'Update on your Software Engineer application at Stripe',
        body || 'Hi there, thank you for taking the time to speak with us. We would love to invite you to a Technical Screen next week.'
      );
      return sendSuccess(res, result, 'Email processed successfully');
    } catch (error) {
      next(error);
    }
  }
}
