export interface JournalEntry {
  id: string;
  userId: string;
  transcript: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailySummary {
  id: string;
  userId: string;
  date: string;
  entries: JournalEntry[];
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface SummaryRequest {
  userId: string;
  date?: string; // Optional date for specific day summary
  entries?: JournalEntry[]; // Optional entries to summarize
} 