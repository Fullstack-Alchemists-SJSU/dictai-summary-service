import { JournalEntry, DailySummary, SummaryRequest } from '../types/journal';
import OpenAI from 'openai';

export class SummaryService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateSummary(entries: JournalEntry[]): Promise<string> {
    const transcripts = entries.map(entry => entry.transcript).join('\n\n');
    
    const prompt = `Please provide a comprehensive summary of the following journal entries. 
    Focus on key events, emotions, and insights. If there are multiple entries, 
    try to identify patterns or themes across them:\n\n${transcripts}`;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful journaling assistant that provides insightful summaries of journal entries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || '';
  }

  async createDailySummary(request: SummaryRequest): Promise<DailySummary> {
    const { userId, date, entries } = request;
    
    if (!entries || entries.length === 0) {
      throw new Error('No journal entries provided for summarization');
    }

    const summary = await this.generateSummary(entries);
    
    return {
      id: crypto.randomUUID(),
      userId,
      date: date || new Date().toISOString().split('T')[0],
      entries,
      summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
} 