import { Request, Response } from 'express';
import { SummaryService } from '../services/summaryService';
import { SummaryRequest } from '../types/journal';

export class SummaryController {
  private summaryService: SummaryService;

  constructor() {
    this.summaryService = new SummaryService();
  }

  async createSummary(req: Request, res: Response) {
    try {
      const request: SummaryRequest = {
        userId: req.body.userId,
        date: req.body.date,
        entries: req.body.entries
      };

      const summary = await this.summaryService.createDailySummary(request);
      res.status(201).json(summary);
    } catch (error) {
      console.error('Error creating summary:', error);
      res.status(500).json({ error: 'Failed to create summary' });
    }
  }

  async getSummary(req: Request, res: Response) {
    try {
      const { userId, date } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
      }

      // Here you would typically fetch entries from your database
      // and then create a summary. For now, we'll return a mock response
      res.status(200).json({
        message: 'Summary retrieval endpoint',
        userId,
        date
      });
    } catch (error) {
      console.error('Error getting summary:', error);
      res.status(500).json({ error: 'Failed to get summary' });
    }
  }
}
