import { Interview } from '../models/Interview.js';
import { Application } from '../models/Application.js';
import { ApplicationEvent } from '../models/ApplicationEvent.js';
import { AppError } from '../middleware/errorHandler.js';
import { IInterview } from '../types/index.js';

export class InterviewService {
  static async listInterviews(userId: string) {
    const interviews = await Interview.find({ userId })
      .sort({ scheduledAt: 1 })
      .populate('applicationId', 'company role status location');

    return interviews.map((item: any) => ({
      ...item.toObject(),
      company: item.applicationId?.company || 'Unknown Company',
      role: item.applicationId?.role || 'Job Role',
    }));
  }

  static async createInterview(userId: string, data: Partial<IInterview>) {
    const application = await Application.findOne({ _id: data.applicationId, userId });
    if (!application) {
      throw new AppError('Associated application not found', 404);
    }

    const interview = await Interview.create({
      ...data,
      userId,
      scheduledAt: new Date(data.scheduledAt!),
    });

    // Update application status to 'Interview' if it was 'Applied' or 'Shortlisted'
    if (['Applied', 'Shortlisted'].includes(application.status)) {
      application.status = 'Interview';
      application.lastActivityAt = new Date() as any;
      await application.save();
    }

    // Create a timeline event
    await ApplicationEvent.create({
      userId,
      applicationId: application._id,
      type: 'INTERVIEW_SCHEDULED',
      description: `${data.type || 'Technical'} Interview scheduled for ${new Date(
        data.scheduledAt!
      ).toLocaleDateString()}`,
      source: 'MANUAL',
      metadata: {
        type: data.type,
        scheduledAt: data.scheduledAt,
        meetingUrl: data.meetingUrl,
      },
      timestamp: new Date(),
    });

    return interview;
  }

  static async updateInterview(userId: string, interviewId: string, data: Partial<IInterview>) {
    const interview = await Interview.findOneAndUpdate(
      { _id: interviewId, userId },
      { ...data },
      { new: true }
    );
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }
    return interview;
  }

  static async deleteInterview(userId: string, interviewId: string) {
    const interview = await Interview.findOneAndDelete({ _id: interviewId, userId });
    if (!interview) {
      throw new AppError('Interview not found', 404);
    }
    return { id: interviewId };
  }
}
