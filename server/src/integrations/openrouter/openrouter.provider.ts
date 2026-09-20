import { config } from '../../config/index.js';

export class OpenRouterProvider {
  private static readonly OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  private static getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.openrouterApiKey}`,
      'HTTP-Referer': config.clientUrl || 'http://localhost:5173',
      'X-Title': 'JobFlow AI',
    };
  }

  static async generateJson<T>(prompt: string, fallbackExtractor?: () => T): Promise<T> {
    if (!config.openrouterApiKey) {
      if (fallbackExtractor) {
        return fallbackExtractor();
      }
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: config.openrouterModel || 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'system',
              content: 'You are an expert AI parser. You must strictly output valid JSON only. Do not include markdown code blocks (```json), explanations, or any other formatting.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenRouter HTTP ${response.status}: ${errorBody}`);
      }

      const data = (await response.json()) as any;
      const content = data?.choices?.[0]?.message?.content?.trim() || '{}';
      
      // Clean up markdown block wraps if model adds them
      const cleanedJson = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
      return JSON.parse(cleanedJson) as T;
    } catch (error: any) {
      console.warn(`[OpenRouter Provider] API Error: ${error.message}. Using fallback if available.`);
      if (fallbackExtractor) {
        return fallbackExtractor();
      }
      throw error;
    }
  }

  static async generateText(prompt: string, fallbackText?: string): Promise<string> {
    if (!config.openrouterApiKey) {
      return fallbackText || 'AI service is currently operating in offline mode.';
    }

    try {
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: config.openrouterModel || 'google/gemini-2.0-flash-001',
          messages: [
            {
              role: 'system',
              content: 'You are JobFlow AI - a personal career strategist and job-search assistant. Provide helpful, actionable, and formatted career guidance.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenRouter HTTP ${response.status}: ${errorBody}`);
      }

      const data = (await response.json()) as any;
      const content = data?.choices?.[0]?.message?.content?.trim();
      return content || fallbackText || 'No response generated.';
    } catch (error: any) {
      console.warn(`[OpenRouter Provider] API Error: ${error.message}`);
      return fallbackText || 'AI assistant is currently responding via local heuristics.';
    }
  }
}
