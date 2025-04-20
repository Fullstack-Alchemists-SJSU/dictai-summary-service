import { JournalEntry, DailySummary, WeeklySummary, SummaryRequest, WeeklySummaryRequest, WeeklySummaryResponse } from '../types/journal';
import { isWithinLastNDays, getDateRange } from '../utils/dateUtils';
import { OpenAI } from 'openai';
import { VapiService } from './vapiService';

export class SummaryService {
  private openai: OpenAI;
  private vapiService: VapiService;
  private summaryCache: Map<string, { summary: string; timestamp: number }>;
  private cacheTTL: number;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.vapiService = new VapiService();
    this.summaryCache = new Map();
    this.cacheTTL = 30 * 60 * 1000; // 30 minutes cache
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTTL;
  }

  private getCacheKey(entryIds: string[]): string {
    return entryIds.sort().join('_');
  }

  public extractValidTranscripts(entries: JournalEntry[], days: number, endDate?: Date): JournalEntry[] {
    const end = endDate || new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days);

    return entries.filter(entry => {
      const entryDate = new Date(entry.startedAt);
      return (
        entryDate >= start &&
        entryDate <= end &&
        entry.status === 'ended' &&
        entry.transcript?.trim()
      );
    });
  }

  private async generateSummary(entries: JournalEntry[]): Promise<string> {
    if (entries.length === 0) {
      return 'No valid entries found for the specified period.';
    }

    const cacheKey = this.getCacheKey(entries.map(e => e.id));
    const cached = this.summaryCache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.summary;
    }

    const transcripts = entries.map(entry => entry.transcript).join('\n\n');
    
    const completion = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes journal entries. Focus on key themes, emotions, and insights."
        },
        {
          role: "user",
          content: `Please summarize these journal entries:\n\n${transcripts}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const summary = completion.choices[0].message.content || 'No summary generated.';
    
    this.summaryCache.set(cacheKey, {
      summary,
      timestamp: Date.now()
    });

    return summary;
  }

  async createDailySummary(request: SummaryRequest): Promise<DailySummary> {
    const {  date, entries } = request;
    
    if (!entries || entries.length === 0) {
      throw new Error('No journal entries provided for summarization');
    }

    const summary = await this.generateSummary(entries);
    
    return {
      id: crypto.randomUUID(),
      date: date || new Date().toISOString().split('T')[0],
      entries,
      summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async createWeeklySummary(days: number, endDate?: Date): Promise<WeeklySummaryResponse> {
    const calls = await this.vapiService.getCalls();
    const entries = calls.map(call => this.vapiService.transformToJournalEntry(call));
    const validEntries = this.extractValidTranscripts(entries, days, endDate);

    if (validEntries.length === 0) {
      throw new Error('No valid entries found for the specified period.');
    }

    const summary = await this.generateSummary(validEntries);
    const end = endDate || new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - days);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      entries: validEntries,
      summary
    };
  }
} 