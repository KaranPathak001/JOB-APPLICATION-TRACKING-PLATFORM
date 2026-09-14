import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { ApplicationService } from '../services/application.service.js';
import { sendSuccess, sendPaginated } from '../utils/response.js';

export class ApplicationController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ApplicationService.listApplications(req.user!.id, req.query);
      return sendPaginated(
        res,
        result.applications,
        result.page,
        result.limit,
        result.total,
        'Applications retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const app = await ApplicationService.getApplicationById(req.user!.id, req.params.id);
      return sendSuccess(res, app, 'Application retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const app = await ApplicationService.createApplication(req.user!.id, req.body);
      return sendSuccess(res, app, 'Application created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const app = await ApplicationService.updateApplication(req.user!.id, req.params.id, req.body);
      return sendSuccess(res, app, 'Application updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const app = await ApplicationService.updateStatus(req.user!.id, req.params.id, status);
      return sendSuccess(res, app, `Status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ApplicationService.deleteApplication(req.user!.id, req.params.id);
      return sendSuccess(res, result, 'Application deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getEvents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const events = await ApplicationService.getTimelineEvents(req.user!.id, req.params.id);
      return sendSuccess(res, events, 'Timeline events retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async addEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await ApplicationService.createEvent(req.user!.id, req.params.id, req.body);
      return sendSuccess(res, event, 'Event created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getNotes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notes = await ApplicationService.getNotes(req.user!.id, req.params.id);
      return sendSuccess(res, notes, 'Notes retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async addNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const note = await ApplicationService.addNote(req.user!.id, req.params.id, req.body.content);
      return sendSuccess(res, note, 'Note added', 201);
    } catch (error) {
      next(error);
    }
  }

  static async deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await ApplicationService.deleteNote(req.user!.id, req.params.noteId);
      return sendSuccess(res, result, 'Note deleted');
    } catch (error) {
      next(error);
    }
  }

  static async bulkImport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { items } = req.body;
      const result = await ApplicationService.bulkImport(req.user!.id, items);
      return sendSuccess(res, result, 'CSV imported successfully');
    } catch (error) {
      next(error);
    }
  }
}
