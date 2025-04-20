import axios, { AxiosError } from 'axios';
import { JournalEntry } from '../types/journal';

interface VapiCall {
  id: string;
  transcript: string;
  startedAt: string;
  endedAt: string;
  status: string;
  summary: string;
}

export class VapiService {
  private vapiBaseUrl: string;
  private vapiApiKey: string;
  private cache: Map<string, { data: VapiCall[]; timestamp: number }>;
  private cacheTTL: number;

  constructor() {
    this.vapiBaseUrl = process.env.VAPI_BASE_URL || 'https://api.vapi.ai';
    this.vapiApiKey = process.env.VAPI_API_KEY || '';
    this.cache = new Map();
    this.cacheTTL = 5 * 60 * 1000; // 5 minutes cache
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheTTL;
  }

  async getCalls(): Promise<VapiCall[]> {
    const cacheKey = 'calls';
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }

    try {
      const url = `${this.vapiBaseUrl}/call`;
      console.log('Making request to:', url);
      console.log('With headers:', {
        'Authorization': `Bearer ${this.vapiApiKey}`,
        'Content-Type': 'application/json'
      });

      const response = await axios.get<VapiCall[]>(url, {
        headers: {
          'Authorization': `Bearer ${this.vapiApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Vapi API Error Details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            headers: axiosError.config?.headers
          }
        });

        if (axiosError.response) {
          throw new Error(`Vapi API error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
        } else if (axiosError.request) {
          throw new Error('Network error while connecting to Vapi API');
        }
      }
      throw new Error('Failed to fetch calls from Vapi');
    }
  }

  transformToJournalEntry(call: VapiCall): JournalEntry {
    return {
      id: call.id,
      transcript: call.transcript,
      summary: call.summary,
      startedAt: call.startedAt,
      createdAt: call.startedAt,
      updatedAt: call.endedAt,
      status: call.status
    };
  }
}
