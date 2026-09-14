import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const createApplicationSchema = z.object({
  body: z.object({
    company: z.string().min(1, 'Company name is required'),
    role: z.string().min(1, 'Job role is required'),
    location: z.string().optional(),
    workMode: z.enum(['Remote', 'Hybrid', 'On-site']).optional(),
    status: z.enum(['Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn']).optional(),
    salaryMin: z.number().optional().nullable(),
    salaryMax: z.number().optional().nullable(),
    currency: z.string().optional(),
    jobUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
    source: z.string().optional(),
    appliedDate: z.string().optional(),
    notes: z.string().optional(),
    contactPerson: z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        role: z.string().optional(),
      })
      .optional(),
  }),
});

export const updateApplicationSchema = z.object({
  body: z.object({
    company: z.string().optional(),
    role: z.string().optional(),
    location: z.string().optional(),
    workMode: z.enum(['Remote', 'Hybrid', 'On-site']).optional(),
    status: z.enum(['Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn']).optional(),
    salaryMin: z.number().optional().nullable(),
    salaryMax: z.number().optional().nullable(),
    currency: z.string().optional(),
    jobUrl: z.string().optional(),
    source: z.string().optional(),
    appliedDate: z.string().optional(),
    contactPerson: z.any().optional(),
  }),
});

export const createInterviewSchema = z.object({
  body: z.object({
    applicationId: z.string().min(1, 'Application ID is required'),
    type: z.enum([
      'Screening',
      'Technical',
      'System Design',
      'Behavioral',
      'Hiring Manager',
      'Final Round',
      'Offer Discussion',
    ]),
    scheduledAt: z.string().min(1, 'Scheduled date and time are required'),
    durationMinutes: z.number().optional(),
    meetingUrl: z.string().optional(),
    interviewerNames: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

export const createTaskSchema = z.object({
  body: z.object({
    applicationId: z.string().optional(),
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    dueDate: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

export const parseJobSchema = z.object({
  body: z.object({
    jobDescription: z.string().min(10, 'Job description must be at least 10 characters'),
  }),
});

export const assistantQuerySchema = z.object({
  body: z.object({
    query: z.string().min(1, 'Query is required'),
    conversationHistory: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })
      )
      .optional(),
  }),
});
