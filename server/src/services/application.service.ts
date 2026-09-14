import { Application, IApplicationDocument } from '../models/Application.js';
import { ApplicationEvent } from '../models/ApplicationEvent.js';
import { Note } from '../models/Note.js';
import { Task } from '../models/Task.js';
import { Interview } from '../models/Interview.js';
import { AppError } from '../middleware/errorHandler.js';
import { IApplication, ApplicationStatus } from '../types/index.js';

export interface ApplicationFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  workMode?: string;
  source?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ApplicationService {
  static async listApplications(userId: string, query: ApplicationFilterQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const filter: any = { userId };

    if (query.status && query.status !== 'ALL') {
      filter.status = query.status;
    }

    if (query.workMode && query.workMode !== 'ALL') {
      filter.workMode = query.workMode;
    }

    if (query.source && query.source !== 'ALL') {
      filter.source = query.source;
    }

    if (query.search) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { company: searchRegex },
        { role: searchRegex },
        { location: searchRegex },
      ];
    }

    const sortField = query.sortBy || 'appliedDate';
    const sortDirection = query.sortOrder === 'asc' ? 1 : -1;
    const sort: any = { [sortField]: sortDirection };

    const [applications, total] = await Promise.all([
      Application.find(filter).sort(sort).skip(skip).limit(limit),
      Application.countDocuments(filter),
    ]);

    return { applications, total, page, limit };
  }

  static async getApplicationById(userId: string, applicationId: string) {
    const app = await Application.findOne({ _id: applicationId, userId });
    if (!app) {
      throw new AppError('Application not found', 404);
    }
    return app;
  }

  static async createApplication(userId: string, data: Partial<IApplication> & { notes?: string }) {
    // Check if application already exists for same user, company & role
    const existing = await Application.findOne({
      userId,
      company: { $regex: new RegExp(`^${data.company?.trim()}$`, 'i') },
      role: { $regex: new RegExp(`^${data.role?.trim()}$`, 'i') },
    });

    if (existing) {
      throw new AppError(`An application for ${data.role} at ${data.company} already exists.`, 409);
    }

    const application = await Application.create({
      ...data,
      userId,
      appliedDate: data.appliedDate ? new Date(data.appliedDate) : new Date(),
      lastActivityAt: new Date(),
      status: data.status || 'Applied',
    });

    // Create initial timeline event
    await ApplicationEvent.create({
      userId,
      applicationId: application._id,
      type: 'APPLIED',
      description: `Applied for ${application.role} at ${application.company}`,
      source: 'MANUAL',
      timestamp: application.appliedDate,
    });

    // If initial notes were provided, create Note
    if (data.notes && data.notes.trim()) {
      await Note.create({
        userId,
        applicationId: application._id,
        content: data.notes.trim(),
      });
      application.notesCount = 1;
      await application.save();
    }

    return application;
  }

  static async updateApplication(userId: string, applicationId: string, updateData: Partial<IApplication>) {
    const existing = await Application.findOne({ _id: applicationId, userId });
    if (!existing) {
      throw new AppError('Application not found', 404);
    }

    const previousStatus = existing.status;
    const isStatusChanged = updateData.status && updateData.status !== previousStatus;

    Object.assign(existing, updateData);
    existing.lastActivityAt = new Date() as any;
    await existing.save();

    // If status changed, create an event
    if (isStatusChanged) {
      await ApplicationEvent.create({
        userId,
        applicationId: existing._id,
        type: 'STATUS_CHANGED',
        description: `Status updated from ${previousStatus} to ${updateData.status}`,
        source: 'MANUAL',
        metadata: { from: previousStatus, to: updateData.status },
        timestamp: new Date(),
      });
    }

    return existing;
  }

  static async updateStatus(userId: string, applicationId: string, status: ApplicationStatus) {
    return this.updateApplication(userId, applicationId, { status });
  }

  static async deleteApplication(userId: string, applicationId: string) {
    const app = await Application.findOneAndDelete({ _id: applicationId, userId });
    if (!app) {
      throw new AppError('Application not found', 404);
    }

    // Clean up related sub-collections
    await Promise.all([
      ApplicationEvent.deleteMany({ applicationId, userId }),
      Note.deleteMany({ applicationId, userId }),
      Task.deleteMany({ applicationId, userId }),
      Interview.deleteMany({ applicationId, userId }),
    ]);

    return { id: applicationId };
  }

  static async getTimelineEvents(userId: string, applicationId: string) {
    return ApplicationEvent.find({ userId, applicationId }).sort({ timestamp: -1 });
  }

  static async createEvent(
    userId: string,
    applicationId: string,
    eventData: { type: any; description: string; source?: 'MANUAL' | 'GMAIL' | 'GEMINI_AI' | 'SYSTEM'; metadata?: any }
  ) {
    const app = await Application.findOne({ _id: applicationId, userId });
    if (!app) {
      throw new AppError('Application not found', 404);
    }

    const event = await ApplicationEvent.create({
      userId,
      applicationId,
      type: eventData.type,
      description: eventData.description,
      source: eventData.source || 'MANUAL',
      metadata: eventData.metadata || {},
      timestamp: new Date(),
    });

    app.lastActivityAt = new Date() as any;
    await app.save();

    return event;
  }

  static async getNotes(userId: string, applicationId: string) {
    return Note.find({ userId, applicationId }).sort({ createdAt: -1 });
  }

  static async addNote(userId: string, applicationId: string, content: string) {
    const app = await Application.findOne({ _id: applicationId, userId });
    if (!app) {
      throw new AppError('Application not found', 404);
    }

    const note = await Note.create({
      userId,
      applicationId,
      content,
    });

    app.notesCount = (app.notesCount || 0) + 1;
    app.lastActivityAt = new Date() as any;
    await app.save();

    await ApplicationEvent.create({
      userId,
      applicationId,
      type: 'NOTE_ADDED',
      description: `Added a note: "${content.substring(0, 40)}${content.length > 40 ? '...' : ''}"`,
      source: 'MANUAL',
      timestamp: new Date(),
    });

    return note;
  }

  static async deleteNote(userId: string, noteId: string) {
    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) {
      throw new AppError('Note not found', 404);
    }
    await Application.findByIdAndUpdate(note.applicationId, { $inc: { notesCount: -1 } });
    return { id: noteId };
  }

  static async bulkImport(userId: string, items: Array<Partial<IApplication> & { notes?: string }>) {
    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of items) {
      if (!item.company || !item.role) {
        skipped++;
        errors.push(`Row missing company or role: ${JSON.stringify(item)}`);
        continue;
      }

      try {
        await this.createApplication(userId, {
          company: item.company,
          role: item.role,
          location: item.location || 'Remote',
          workMode: item.workMode || 'Remote',
          status: item.status || 'Applied',
          salaryMin: item.salaryMin,
          salaryMax: item.salaryMax,
          jobUrl: item.jobUrl || '',
          source: item.source || 'CSV Import',
          appliedDate: item.appliedDate || new Date().toISOString(),
          notes: item.notes,
        });
        imported++;
      } catch (err: any) {
        skipped++;
        errors.push(`${item.company} (${item.role}): ${err.message}`);
      }
    }

    return { imported, skipped, errors };
  }
}
