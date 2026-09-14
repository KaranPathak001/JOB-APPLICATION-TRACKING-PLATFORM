import { User } from '../models/User.js';
import { Application } from '../models/Application.js';
import { ApplicationEvent } from '../models/ApplicationEvent.js';
import { Interview } from '../models/Interview.js';
import { Task } from '../models/Task.js';
import { Note } from '../models/Note.js';
import bcrypt from 'bcryptjs';

export class SeederService {
  static async seedDemoUser() {
    const demoEmail = 'alex.chen@jobflow.ai';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('DemoPass123!', salt);
      user = await User.create({
        name: 'Alex Chen',
        email: demoEmail,
        passwordHash,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        preferences: {
          theme: 'dark',
          targetRoles: ['Senior Frontend Engineer', 'Full Stack Tech Lead'],
          targetLocations: ['San Francisco, CA', 'Remote'],
          expectedSalary: 185000,
          currency: 'USD',
          workPreference: 'remote',
          emailSyncEnabled: true,
          notificationsEnabled: true,
        },
      });
    }

    const userId = user._id;

    // Check if already seeded applications
    const count = await Application.countDocuments({ userId });
    if (count > 5) {
      return { user, message: 'Demo data already present' };
    }

    // Clear old data for a fresh state
    await Promise.all([
      Application.deleteMany({ userId }),
      ApplicationEvent.deleteMany({ userId }),
      Interview.deleteMany({ userId }),
      Task.deleteMany({ userId }),
      Note.deleteMany({ userId }),
    ]);

    const sampleApplications = [
      {
        company: 'Stripe',
        role: 'Senior Staff Frontend Architect',
        location: 'San Francisco, CA (Remote)',
        workMode: 'Remote',
        status: 'Interview',
        salaryMin: 190000,
        salaryMax: 240000,
        source: 'LinkedIn',
        jobUrl: 'https://stripe.com/jobs/senior-frontend-architect',
        appliedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        notesCount: 2,
        tasksCount: 2,
      },
      {
        company: 'Vercel',
        role: 'Lead Next.js & AI Systems Engineer',
        location: 'Remote',
        workMode: 'Remote',
        status: 'Offer',
        salaryMin: 210000,
        salaryMax: 260000,
        source: 'Referral',
        jobUrl: 'https://vercel.com/careers',
        appliedDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        notesCount: 3,
        tasksCount: 1,
      },
      {
        company: 'OpenAI',
        role: 'Full Stack Product Engineer - Canvas',
        location: 'San Francisco, CA',
        workMode: 'Hybrid',
        status: 'Interview',
        salaryMin: 220000,
        salaryMax: 290000,
        source: 'Company Website',
        jobUrl: 'https://openai.com/careers',
        appliedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        notesCount: 1,
        tasksCount: 2,
      },
      {
        company: 'Linear',
        role: 'Senior Product Engineer',
        location: 'Remote (US/EU)',
        workMode: 'Remote',
        status: 'Shortlisted',
        salaryMin: 180000,
        salaryMax: 220000,
        source: 'Twitter / X',
        jobUrl: 'https://linear.app/careers',
        appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notesCount: 1,
        tasksCount: 1,
      },
      {
        company: 'Figma',
        role: 'Design Systems Lead Engineer',
        location: 'San Francisco, CA',
        workMode: 'Hybrid',
        status: 'Applied',
        salaryMin: 195000,
        salaryMax: 235000,
        source: 'LinkedIn',
        jobUrl: 'https://figma.com/careers',
        appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notesCount: 0,
        tasksCount: 1,
      },
      {
        company: 'Datadog',
        role: 'Principal Observability Engineer',
        location: 'New York, NY',
        workMode: 'On-site',
        status: 'Rejected',
        salaryMin: 200000,
        salaryMax: 250000,
        source: 'Indeed',
        jobUrl: 'https://datadoghq.com/careers',
        appliedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        notesCount: 1,
        tasksCount: 0,
      },
      {
        company: 'Supabase',
        role: 'Developer Advocate & Full Stack',
        location: 'Remote',
        workMode: 'Remote',
        status: 'Shortlisted',
        salaryMin: 170000,
        salaryMax: 210000,
        source: 'Hacker News',
        jobUrl: 'https://supabase.com/careers',
        appliedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        notesCount: 0,
        tasksCount: 1,
      },
      {
        company: 'Anthropic',
        role: 'Frontend Infrastructure Lead',
        location: 'San Francisco, CA',
        workMode: 'Hybrid',
        status: 'Applied',
        salaryMin: 230000,
        salaryMax: 300000,
        source: 'LinkedIn',
        jobUrl: 'https://anthropic.com/careers',
        appliedDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        notesCount: 1,
        tasksCount: 0,
      },
    ];

    const createdApps = await Application.insertMany(
      sampleApplications.map((app) => ({
        ...app,
        userId,
        lastActivityAt: app.appliedDate,
      }))
    );

    // Create realistic Interviews
    const stripeApp = createdApps.find((a) => a.company === 'Stripe');
    const openAIApp = createdApps.find((a) => a.company === 'OpenAI');
    const vercelApp = createdApps.find((a) => a.company === 'Vercel');

    if (stripeApp) {
      await Interview.create({
        userId,
        applicationId: stripeApp._id,
        type: 'System Design',
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        meetingUrl: 'https://meet.google.com/abc-defg-hij',
        interviewerNames: ['Sarah Connor (Staff Architect)', 'Marcus Vance (VP Eng)'],
        notes: 'Focus on distributed caching, multi-region webhooks, and latency budget.',
        status: 'Scheduled',
      });

      await Note.create({
        userId,
        applicationId: stripeApp._id,
        content: 'Review Stripe API idempotency key architecture and event routing before Wednesday.',
      });

      await Task.create({
        userId,
        applicationId: stripeApp._id,
        title: 'Review Stripe system design whitepaper',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        priority: 'high',
        completed: false,
      });
    }

    if (openAIApp) {
      await Interview.create({
        userId,
        applicationId: openAIApp._id,
        type: 'Technical',
        scheduledAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        meetingUrl: 'https://zoom.us/j/987654321',
        interviewerNames: ['Greg B. (Product Lead)'],
        notes: 'Real-time WebSocket rendering and CRDT collaborative state synchronization.',
        status: 'Scheduled',
      });

      await Task.create({
        userId,
        applicationId: openAIApp._id,
        title: 'Brush up on CRDT and WebAssembly data streaming',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        priority: 'high',
        completed: false,
      });
    }

    if (vercelApp) {
      await Note.create({
        userId,
        applicationId: vercelApp._id,
        content: 'Offer package received: $235k base + $90k equity/yr + $25k sign-on. Schedule call with VP next Monday.',
      });
    }

    // Add Events for Stripe timeline
    if (stripeApp) {
      await ApplicationEvent.create([
        {
          userId,
          applicationId: stripeApp._id,
          type: 'APPLIED',
          description: 'Applied on Stripe Careers portal with tailored Full Stack resume.',
          source: 'MANUAL',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          userId,
          applicationId: stripeApp._id,
          type: 'RESUME_VIEWED',
          description: 'Recruiter viewed application profile on Greenhouse ATS.',
          source: 'SYSTEM',
          timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        },
        {
          userId,
          applicationId: stripeApp._id,
          type: 'SHORTLISTED',
          description: 'Passed initial screening with recruiter (Elena Rostova).',
          source: 'GMAIL',
          timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        },
        {
          userId,
          applicationId: stripeApp._id,
          type: 'INTERVIEW_SCHEDULED',
          description: 'System Design Interview scheduled for upcoming Wednesday.',
          source: 'GMAIL',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        },
      ]);
    }

    return { user, message: 'Demo environment successfully seeded!' };
  }
}
