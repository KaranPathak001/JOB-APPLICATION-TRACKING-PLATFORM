export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    targetRoles?: string[];
    targetLocations?: string[];
    expectedSalary?: number;
    currency?: string;
    workPreference?: 'remote' | 'hybrid' | 'onsite' | 'any';
    emailSyncEnabled?: boolean;
    notificationsEnabled?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface IApplication {
  _id: string;
  userId: string;
  company: string;
  role: string;
  location?: string;
  workMode?: WorkMode;
  status: ApplicationStatus;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  jobUrl?: string;
  source?: string;
  appliedDate: string;
  lastActivityAt: string;
  contactPerson?: {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
  notesCount?: number;
  tasksCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type EventType =
  | 'APPLIED'
  | 'RESUME_VIEWED'
  | 'SHORTLISTED'
  | 'SCREENING_SCHEDULED'
  | 'INTERVIEW_SCHEDULED'
  | 'INTERVIEW_COMPLETED'
  | 'OFFER_RECEIVED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'EMAIL_RECEIVED'
  | 'NOTE_ADDED'
  | 'STATUS_CHANGED';

export interface IApplicationEvent {
  _id: string;
  userId: string;
  applicationId: string;
  type: EventType;
  description: string;
  source: 'MANUAL' | 'GMAIL' | 'GEMINI_AI' | 'SYSTEM';
  metadata?: Record<string, any>;
  timestamp: string;
  createdAt: string;
}

export interface ITask {
  _id: string;
  userId: string;
  applicationId?: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface INote {
  _id: string;
  userId: string;
  applicationId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type InterviewType = 'Screening' | 'Technical' | 'System Design' | 'Behavioral' | 'Hiring Manager' | 'Final Round' | 'Offer Discussion';

export interface IInterview {
  _id: string;
  userId: string;
  applicationId: string;
  company?: string;
  role?: string;
  type: InterviewType;
  scheduledAt: string;
  durationMinutes?: number;
  meetingUrl?: string;
  interviewerNames?: string[];
  notes?: string;
  status?: 'Scheduled' | 'Completed' | 'Rescheduled' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface IEmailMessage {
  _id: string;
  userId: string;
  applicationId?: string;
  providerMessageId: string;
  sender: string;
  subject: string;
  snippet: string;
  receivedAt: string;
  classification: 'JOB_UPDATE' | 'INTERVIEW_INVITE' | 'REJECTION' | 'OFFER' | 'OTHER';
  processingStatus: 'PENDING' | 'PROCESSED' | 'SKIPPED' | 'FAILED';
  parsedData?: Record<string, any>;
  createdAt: string;
}

export interface IAIProcessingLog {
  _id: string;
  userId: string;
  emailMessageId?: string;
  provider: string;
  aiModel: string;
  operation: string;
  status: 'SUCCESS' | 'FAILED';
  confidence: number;
  inputMetadata?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  createdAt: string;
}

export interface IDashboardStats {
  totalApplications: number;
  activeApplications: number;
  interviewsCount: number;
  offersCount: number;
  rejectionRate: number;
  responseRate: number;
  trends: {
    applicationsDelta: number;
    interviewsDelta: number;
    offersDelta: number;
  };
  funnel: {
    applied: number;
    shortlisted: number;
    interview: number;
    offer: number;
    rejected: number;
  };
  upcomingInterviews: (IInterview & { companyName?: string; roleName?: string })[];
  recentActivity: IApplicationEvent[];
  aiInsights: {
    id: string;
    type: 'warning' | 'tip' | 'info' | 'success';
    title: string;
    description: string;
    actionLabel: string;
    actionUrl: string;
  }[];
}

export interface IAnalyticsResponse {
  totalApplications: number;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  rejectionRate: number;
  averageResponseDays: number;
  applicationsOverTime: { date: string; count: number }[];
  bySource: { name: string; value: number }[];
  byRole: { name: string; count: number }[];
  byLocation: { name: string; count: number }[];
  bySalary: { range: string; count: number }[];
  conversionFunnel: { stage: string; count: number; percentage: number }[];
}
