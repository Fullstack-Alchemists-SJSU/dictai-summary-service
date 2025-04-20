export interface JournalEntry {
  id: string;
  transcript: string;
  summary: string;
  startedAt: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface DailySummary {
  id: string;
  date: string;
  entries: JournalEntry[];
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySummary {
  id: string;
  startDate: string;
  endDate: string;
  entries: JournalEntry[];
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySummaryResponse {
  startDate: string;
  endDate: string;
  entries: JournalEntry[];
  summary: string;
}

export interface SummaryRequest {
  date?: string;
  entries?: JournalEntry[];
  days?: number;
}

export interface WeeklySummaryRequest {
  days?: number;
  entries?: JournalEntry[];
} 