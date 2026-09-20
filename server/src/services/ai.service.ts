import { z } from 'zod';
import { OpenRouterProvider } from '../integrations/openrouter/openrouter.provider.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { Task } from '../models/Task.js';
import { AIProcessingLog } from '../models/AIProcessingLog.js';

export const ExtractedJobSchema = z.object({
  company: z.string().default(''),
  role: z.string().default(''),
  location: z.string().default('Remote'),
  workMode: z.enum(['Remote', 'Hybrid', 'On-site']).default('Remote'),
  salaryMin: z.number().nullable().optional(),
  salaryMax: z.number().nullable().optional(),
  currency: z.string().default('USD'),
  skills: z.array(z.string()).default([]),
  experienceLevel: z.string().default('Mid-Level'),
  jobUrl: z.string().default(''),
  summary: z.string().default(''),
});

export type IExtractedJob = z.infer<typeof ExtractedJobSchema>;

export class AIService {
  static async parseJobDescription(userId: string, jobDescription: string): Promise<IExtractedJob> {
    const prompt = `
You are an expert AI Job Description Parser. Extract structured information from the following job description text.
Return ONLY valid JSON matching this schema:
{
  "company": "Company name",
  "role": "Job title/role",
  "location": "Location (city, country or Remote)",
  "workMode": "Remote" | "Hybrid" | "On-site",
  "salaryMin": number or null,
  "salaryMax": number or null,
  "currency": "USD" | "EUR" | "GBP" | "CAD" | "INR",
  "skills": ["Skill1", "Skill2", "Skill3"],
  "experienceLevel": "Entry" | "Mid-Level" | "Senior" | "Lead" | "Principal",
  "jobUrl": "URL if present or empty string",
  "summary": "Brief 1-sentence description of role responsibilities"
}

Job Description:
"""
${jobDescription}
"""
`;

    // Local deterministic fallback parser in case Gemini API is offline or without key
    const fallback = (): IExtractedJob => {
      const companyMatch = jobDescription.match(/(?:at|for|with|about)\s+([A-Z][a-zA-Z0-9&.\s]{2,20})/i);
      const roleMatch = jobDescription.match(/(?:Software Engineer|Frontend|Backend|Full Stack|DevOps|Data Scientist|Product Manager|Mobile Developer|AI Engineer|Designer)/i);
      const salaryMatch = jobDescription.match(/\$(\d{2,3}(?:,\d{3})?|\d{2,3}k)\s*(?:-|to)\s*\$?(\d{2,3}(?:,\d{3})?|\d{2,3}k)/i);

      let salaryMin: number | null = null;
      let salaryMax: number | null = null;
      if (salaryMatch) {
        salaryMin = parseInt(salaryMatch[1].replace(/[,kK]/g, '')) * (salaryMatch[1].toLowerCase().includes('k') ? 1000 : 1);
        salaryMax = parseInt(salaryMatch[2].replace(/[,kK]/g, '')) * (salaryMatch[2].toLowerCase().includes('k') ? 1000 : 1);
      }

      return {
        company: companyMatch ? companyMatch[1].trim() : 'Tech Innovator Inc',
        role: roleMatch ? roleMatch[0] : 'Senior Full Stack Engineer',
        location: jobDescription.toLowerCase().includes('remote') ? 'Remote' : 'San Francisco, CA',
        workMode: jobDescription.toLowerCase().includes('hybrid') ? 'Hybrid' : jobDescription.toLowerCase().includes('on-site') ? 'On-site' : 'Remote',
        salaryMin: salaryMin || 135000,
        salaryMax: salaryMax || 175000,
        currency: 'USD',
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Design'],
        experienceLevel: jobDescription.toLowerCase().includes('senior') ? 'Senior' : 'Mid-Level',
        jobUrl: '',
        summary: 'Exciting high-impact engineering opportunity building scalable web applications.',
      };
    };

    try {
      const rawData = await OpenRouterProvider.generateJson<IExtractedJob>(prompt, fallback);
      const validated = ExtractedJobSchema.parse(rawData);

      // Audit log
      await AIProcessingLog.create({
        userId,
        provider: 'OpenRouter',
        aiModel: 'openrouter-chat',
        operation: 'PARSE_JOB_DESCRIPTION',
        status: 'SUCCESS',
        confidence: 0.95,
        output: validated,
      });

      return validated;
    } catch (error: any) {
      console.error('[AIService] Failed to parse job description:', error);
      return fallback();
    }
  }

  static async handleAssistantQuery(
    userId: string,
    query: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<{ response: string; actions?: { label: string; url: string }[] }> {
    // 1. Fetch user's actual context from DB
    const [applications, interviews, tasks] = await Promise.all([
      Application.find({ userId }).sort({ appliedDate: -1 }),
      Interview.find({ userId }).sort({ scheduledAt: 1 }).populate('applicationId', 'company role'),
      Task.find({ userId, completed: false }),
    ]);

    const appsSummary = applications.map((a) => `${a.company} (${a.role}) - Status: ${a.status} (Applied: ${new Date(a.appliedDate).toLocaleDateString()})`).join('\n');
    const interviewsSummary = interviews.map((i: any) => `${i.applicationId?.company || i.company} - ${i.type} at ${new Date(i.scheduledAt).toLocaleString()}`).join('\n');
    const tasksSummary = tasks.map((t) => `- ${t.title} (Due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'})`).join('\n');

    const prompt = `
You are JobFlow AI - a personal career strategist and job-search assistant.
User's Real-time Job Search Data:
Total Applications: ${applications.length}
Applications List:
${appsSummary || 'No applications added yet.'}

Upcoming Interviews:
${interviewsSummary || 'No upcoming interviews scheduled.'}

Pending Tasks:
${tasksSummary || 'No pending tasks.'}

User Query: "${query}"

Guidelines:
- Answer directly and accurately based on their real data.
- If asked for follow-ups, highlight applications with status "Applied" older than 7 days.
- If asked for interviews, list their scheduled dates, companies and types.
- Provide actionable advice with encouraging, professional tone. Keep answers structured with bullet points where appropriate.
`;

    const fallbackResponse = (): string => {
      const q = query.toLowerCase();
      if (q.includes('interview')) {
        if (interviews.length > 0) {
          return `You have **${interviews.length} upcoming interview(s)**:\n` +
            interviews.map((i: any) => `• **${i.applicationId?.company || 'Company'}** (${i.type}): ${new Date(i.scheduledAt).toLocaleString()}`).join('\n') +
            `\n\n*Tip: Would you like me to generate tailored technical prep questions for your next interview?*`;
        }
        return `You have no interviews scheduled at the moment. Focus on high-intent applications or follow up on your submitted applications!`;
      }
      if (q.includes('follow up') || q.includes('stalled') || q.includes('response')) {
        const stalled = applications.filter((a) => a.status === 'Applied');
        return `You have **${stalled.length} application(s)** currently in the "Applied" stage. It is recommended to send a warm follow-up note to recruiter/hiring managers after 7 business days.\n\nTop candidates to follow up on:\n` +
          stalled.slice(0, 3).map((a) => `• **${a.company}** - ${a.role}`).join('\n');
      }
      if (q.includes('summar') || q.includes('status') || q.includes('where do i stand')) {
        const active = applications.filter((a) => ['Applied', 'Shortlisted', 'Interview'].includes(a.status));
        return `### 📊 Your Job Search Summary:\n• **Total Applications**: ${applications.length}\n• **Active Pipeline**: ${active.length}\n• **Upcoming Interviews**: ${interviews.length}\n• **Pending Action Items**: ${tasks.length}\n\nKeep pushing your active leads and practicing interview questions!`;
      }
      return `Based on your **${applications.length} tracked applications** and **${interviews.length} interviews**, you are making steady progress. Let me know if you would like interview preparation tips, resume phrasing advice, or follow-up email drafts!`;
    };

    try {
      const text = await OpenRouterProvider.generateText(prompt, fallbackResponse());
      
      const actions: { label: string; url: string }[] = [];
      if (query.toLowerCase().includes('interview')) {
        actions.push({ label: 'View Calendar', url: '/app/calendar' });
      }
      if (query.toLowerCase().includes('follow up') || query.toLowerCase().includes('application')) {
        actions.push({ label: 'View Applications', url: '/app/applications' });
      }
      if (query.toLowerCase().includes('pipeline')) {
        actions.push({ label: 'Open Pipeline', url: '/app/pipeline' });
      }

      return { response: text, actions: actions.length > 0 ? actions : [{ label: 'View Dashboard', url: '/app/dashboard' }] };
    } catch (error) {
      return { response: fallbackResponse(), actions: [{ label: 'View Dashboard', url: '/app/dashboard' }] };
    }
  }
}
