import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../../config/index.js';

export class GeminiProvider {
  private static client: GoogleGenerativeAI | null = null;

  private static getClient(): GoogleGenerativeAI | null {
    if (!this.client && config.geminiApiKey) {
      this.client = new GoogleGenerativeAI(config.geminiApiKey);
    }
    return this.client;
  }

  static async generateJson<T>(prompt: string, fallbackExtractor?: () => T): Promise<T> {
    const client = this.getClient();
    if (!client) {
      if (fallbackExtractor) {
        return fallbackExtractor();
      }
      throw new Error('Gemini API key is not configured');
    }

    try {
      const model = client.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return JSON.parse(text) as T;
    } catch (error: any) {
      console.warn(`[Gemini Provider] API Error: ${error.message}. Using fallback if available.`);
      if (fallbackExtractor) {
        return fallbackExtractor();
      }
      throw error;
    }
  }

  static async generateText(prompt: string, fallbackText?: string): Promise<string> {
    const client = this.getClient();
    if (!client) {
      return fallbackText || 'AI service is currently operating in offline mode.';
    }

    try {
      const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.warn(`[Gemini Provider] API Error: ${error.message}`);
      return fallbackText || 'AI assistant is currently responding via local heuristics.';
    }
  }
}
