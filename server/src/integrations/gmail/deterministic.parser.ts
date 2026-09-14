export interface IParsedEmailJob {
  company: string;
  role: string;
  status: 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  confidence: number;
  interviewDate?: string;
  interviewType?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  extractedSnippet: string;
}

export class DeterministicEmailParser {
  /**
   * Deterministically parses known ATS templates (Greenhouse, Lever, Workday, LinkedIn, Ashby)
   */
  static parse(subject: string, body: string, sender: string): IParsedEmailJob | null {
    const text = `${subject} \n ${body}`;
    const lowerText = text.toLowerCase();

    // 1. Rejections
    if (
      lowerText.includes('unfortunately') ||
      lowerText.includes('not moving forward') ||
      lowerText.includes('decided to pursue other candidates') ||
      lowerText.includes('will not be advancing') ||
      lowerText.includes('at this time, we have decided') ||
      lowerText.includes('we will keep your resume on file')
    ) {
      const company = this.extractCompany(subject, sender, text);
      const role = this.extractRole(subject, text);
      return {
        company,
        role,
        status: 'Rejected',
        confidence: 0.95,
        extractedSnippet: 'Detected rejection email via standard ATS language pattern.',
      };
    }

    // 2. Interview Invitations
    if (
      lowerText.includes('interview') ||
      lowerText.includes('phone screen') ||
      lowerText.includes('schedule a call') ||
      lowerText.includes('next steps in our hiring process') ||
      lowerText.includes('calendly.com') ||
      lowerText.includes('zoom.us') ||
      lowerText.includes('meet.google.com')
    ) {
      const company = this.extractCompany(subject, sender, text);
      const role = this.extractRole(subject, text);
      return {
        company,
        role,
        status: 'Interview',
        confidence: 0.9,
        interviewType: lowerText.includes('technical') ? 'Technical' : lowerText.includes('screen') ? 'Screening' : 'Behavioral',
        extractedSnippet: 'Detected interview scheduling invite.',
      };
    }

    // 3. Application Confirmations
    if (
      lowerText.includes('application received') ||
      lowerText.includes('thank you for applying') ||
      lowerText.includes('we received your application') ||
      lowerText.includes('thanks for your interest in')
    ) {
      const company = this.extractCompany(subject, sender, text);
      const role = this.extractRole(subject, text);
      return {
        company,
        role,
        status: 'Applied',
        confidence: 0.95,
        extractedSnippet: 'Detected formal application receipt confirmation.',
      };
    }

    // 4. Job Offers
    if (
      lowerText.includes('offer letter') ||
      lowerText.includes('formal offer') ||
      lowerText.includes('delighted to offer you the position') ||
      lowerText.includes('congratulations on your offer')
    ) {
      const company = this.extractCompany(subject, sender, text);
      const role = this.extractRole(subject, text);
      return {
        company,
        role,
        status: 'Offer',
        confidence: 0.98,
        extractedSnippet: 'Detected official employment offer letter.',
      };
    }

    return null;
  }

  private static extractCompany(subject: string, sender: string, text: string): string {
    // Check subject patterns like "Application to [Company]" or "Update from [Company]"
    const atMatch = subject.match(/(?:at|from|with|@)\s+([A-Z0-9][a-zA-Z0-9&.\s]{1,20})/i);
    if (atMatch && atMatch[1]) {
      return atMatch[1].trim();
    }

    // Check sender domain name (e.g. recruiter@stripe.com => Stripe)
    const domainMatch = sender.match(/@([a-zA-Z0-9-]+)\./);
    if (domainMatch && domainMatch[1] && !['gmail', 'yahoo', 'outlook', 'hotmail', 'greenhouse', 'lever', 'workday', 'smartrecruiters'].includes(domainMatch[1])) {
      const clean = domainMatch[1].charAt(0).toUpperCase() + domainMatch[1].slice(1);
      return clean;
    }

    return 'Technology Partner';
  }

  private static extractRole(subject: string, text: string): string {
    const roleMatch = `${subject} ${text}`.match(/(?:Software Engineer|Frontend Engineer|Backend Engineer|Full Stack Engineer|DevOps Engineer|Data Engineer|Product Manager|Mobile Engineer|Engineering Manager)/i);
    if (roleMatch) {
      return roleMatch[0];
    }
    return 'Software Engineer';
  }
}
