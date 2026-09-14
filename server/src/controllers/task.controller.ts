import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { TaskService } from '../services/task.service.js';
import { sendSuccess } from '../utils/response.js';

export class TaskController {
  static async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tasks = await TaskService.listTasks(req.user!.id);
      return sendSuccess(res, tasks, 'Tasks retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.createTask(req.user!.id, req.body);
      return sendSuccess(res, task, 'Task created', 201);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const task = await TaskService.updateTask(req.user!.id, req.params.id, req.body);
      return sendSuccess(res, task, 'Task updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await TaskService.deleteTask(req.user!.id, req.params.id);
      return sendSuccess(res, result, 'Task deleted');
    } catch (error) {
      next(error);
    }
  }
}
