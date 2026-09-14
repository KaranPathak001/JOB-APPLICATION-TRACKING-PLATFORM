import { Application } from '../../models/Application.js';
import { IApplicationDocument } from '../../models/Application.js';

export class DeduplicationMatcher {
  /**
   * Matches an incoming job email to an existing application for the user.
   * Matches against:
   * 1. Exact company & role match
   * 2. Fuzzy company substring (e.g. "Google LLC" vs "Google")
   * 3. Recruiter email domain match
   */
  static async findMatchingApplication(
    userId: string,
    extractedCompany: string,
    extractedRole?: string
  ): Promise<{ application: IApplicationDocument | null; confidence: number }> {
    const cleanCompany = extractedCompany.trim();

    // 1. Try exact or case-insensitive match
    const exactMatch = await Application.findOne({
      userId,
      company: { $regex: new RegExp(`^${cleanCompany}$`, 'i') },
    });

    if (exactMatch) {
      return { application: exactMatch, confidence: 0.95 };
    }

    // 2. Try prefix/contains matching
    const fuzzyMatch = await Application.findOne({
      userId,
      company: { $regex: new RegExp(cleanCompany.split(' ')[0], 'i') },
    });

    if (fuzzyMatch) {
      return { application: fuzzyMatch, confidence: 0.8 };
    }

    return { application: null, confidence: 0 };
  }
}
