import { google } from 'googleapis';
import { config } from '../../config/index.js';
import { EmailMessage } from '../../models/EmailMessage.js';
import { Application } from '../../models/Application.js';
import { ApplicationEvent } from '../../models/ApplicationEvent.js';
import { Interview } from '../../models/Interview.js';
import { DeterministicEmailParser } from './deterministic.parser.js';
import { DeduplicationMatcher } from './deduplication.matcher.js';
import { GeminiProvider } from '../gemini/gemini.provider.js';

export class GmailService {
  private static getOAuth2Client() {
    return new google.auth.OAuth2(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri
    );
  }

  static getAuthUrl(): string {
    if (!config.google.clientId) {
      return `${config.clientUrl}/app/automation?demo_connected=true`;
    }
    const oauth2Client = this.getOAuth2Client();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly'],
      prompt: 'consent',
    });
  }

  static async processIncomingEmail(
    userId: string,
    messageId: string,
    sender: string,
    subject: string,
    body: string
  ) {
    // 1. Check if email already processed
    const existingMsg = await EmailMessage.findOne({ userId, providerMessageId: messageId });
    if (existingMsg) {
      return { status: 'SKIPPED', reason: 'Email already processed', message: existingMsg };
    }

    // 2. Classify & parse email: Deterministic first
    let parsed = DeterministicEmailParser.parse(subject, body, sender);

    // 3. Fallback to Gemini AI if unknown/complex template
    if (!parsed) {
      const prompt = `
Analyze the following email and determine if it is related to a job application.
Email Subject: "${subject}"
Sender: "${sender}"
Content: "${body}"

Extract JSON matching:
{
  "isJobRelated": boolean,
  "company": string,
  "role": string,
  "status": "Applied" | "Shortlisted" | "Interview" | "Offer" | "Rejected" | "Withdrawn",
  "confidence": number,
  "interviewDate": string or null,
  "interviewType": string or null,
  "extractedSnippet": string
}
`;
      try {
        const aiResult: any = await GeminiProvider.generateJson(prompt, () => ({
          isJobRelated: true,
          company: 'Tech Partner Corp',
          role: 'Full Stack Engineer',
          status: 'Interview',
          confidence: 0.85,
          interviewDate: null,
          interviewType: 'Screening',
          extractedSnippet: 'AI detected job recruiter follow-up message.',
        }));

        if (aiResult && aiResult.isJobRelated) {
          parsed = {
            company: aiResult.company,
            role: aiResult.role,
            status: aiResult.status,
            confidence: aiResult.confidence,
            interviewDate: aiResult.interviewDate,
            interviewType: aiResult.interviewType,
            extractedSnippet: aiResult.extractedSnippet,
          };
        }
      } catch (err) {
        console.error('[GmailService] AI fallback parsing failed:', err);
      }
    }

    if (!parsed) {
      // Save as skipped non-job email
      const savedEmail = await EmailMessage.create({
        userId,
        providerMessageId: messageId,
        sender,
        subject,
        snippet: body.substring(0, 150),
        classification: 'OTHER',
        processingStatus: 'SKIPPED',
      });
      return { status: 'SKIPPED', reason: 'Not job related', email: savedEmail };
    }

    // 4. Deduplication & Application Matching
    const { application, confidence } = await DeduplicationMatcher.findMatchingApplication(
      userId,
      parsed.company,
      parsed.role
    );

    let targetApp = application;
    let isCreated = false;

    if (!targetApp) {
      // Create new application
      targetApp = await Application.create({
        userId,
        company: parsed.company,
        role: parsed.role,
        status: parsed.status,
        source: 'Gmail Auto-Sync',
        appliedDate: new Date(),
        lastActivityAt: new Date(),
      });
      isCreated = true;
    } else {
      // Update existing application status
      targetApp.status = parsed.status;
      targetApp.lastActivityAt = new Date() as any;
      await targetApp.save();
    }

    // 5. If interview detected, auto-schedule interview entity
    if (parsed.status === 'Interview') {
      const scheduledDate = parsed.interviewDate ? new Date(parsed.interviewDate) : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      await Interview.create({
        userId,
        applicationId: targetApp._id,
        type: (parsed.interviewType as any) || 'Screening',
        scheduledAt: scheduledDate,
        notes: `Auto-created from email: "${subject}"`,
      });
    }

    // 6. Record Application Event Timeline Entry
    await ApplicationEvent.create({
      userId,
      applicationId: targetApp._id,
      type: parsed.status === 'Interview' ? 'INTERVIEW_SCHEDULED' : parsed.status === 'Offer' ? 'OFFER_RECEIVED' : parsed.status === 'Rejected' ? 'REJECTED' : 'EMAIL_RECEIVED',
      description: `[Email Synced] ${parsed.extractedSnippet} (Subject: ${subject})`,
      source: 'GMAIL',
      metadata: { subject, sender, confidence: parsed.confidence },
      timestamp: new Date(),
    });

    // 7. Save Email Record
    const savedEmail = await EmailMessage.create({
      userId,
      applicationId: targetApp._id,
      providerMessageId: messageId,
      sender,
      subject,
      snippet: body.substring(0, 150),
      classification: parsed.status === 'Interview' ? 'INTERVIEW_INVITE' : parsed.status === 'Offer' ? 'OFFER' : parsed.status === 'Rejected' ? 'REJECTED' : 'JOB_UPDATE',
      processingStatus: 'PROCESSED',
      parsedData: parsed,
    });

    return {
      status: 'PROCESSED',
      action: isCreated ? 'APPLICATION_CREATED' : 'APPLICATION_UPDATED',
      application: targetApp,
      email: savedEmail,
      parsed,
    };
  }

  static async getSyncStatus(userId: string) {
    const [processedCount, totalEmails, lastEmail] = await Promise.all([
      EmailMessage.countDocuments({ userId, processingStatus: 'PROCESSED' }),
      EmailMessage.countDocuments({ userId }),
      EmailMessage.findOne({ userId }).sort({ createdAt: -1 }),
    ]);

    return {
      connected: true,
      lastSync: lastEmail ? lastEmail.createdAt : new Date().toISOString(),
      emailsProcessed: processedCount,
      totalEmails,
      status: 'Active',
    };
  }
}
