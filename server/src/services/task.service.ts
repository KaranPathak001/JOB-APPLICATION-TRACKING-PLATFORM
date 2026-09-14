import { Task } from '../models/Task.js';
import { AppError } from '../middleware/errorHandler.js';
import { ITask } from '../types/index.js';

export class TaskService {
  static async listTasks(userId: string) {
    const tasks = await Task.find({ userId })
      .sort({ completed: 1, dueDate: 1, createdAt: -1 })
      .populate('applicationId', 'company role');
    return tasks.map((t: any) => ({
      ...t.toObject(),
      company: t.applicationId?.company,
    }));
  }

  static async createTask(userId: string, data: Partial<ITask>) {
    return Task.create({
      ...data,
      userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });
  }

  static async updateTask(userId: string, taskId: string, data: Partial<ITask>) {
    const task = await Task.findOneAndUpdate({ _id: taskId, userId }, { ...data }, { new: true });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }

  static async deleteTask(userId: string, taskId: string) {
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return { id: taskId };
  }
}
