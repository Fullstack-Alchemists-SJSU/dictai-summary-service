import { Request, Response } from 'express';
import { SummaryService } from '../services/summaryService';
import { SummaryRequest, WeeklySummaryRequest } from '../types/journal';

export class SummaryController {
  private summaryService: SummaryService;

  constructor() {
    this.summaryService = new SummaryService();
  }

  async createSummary(req: Request, res: Response) {
    try {
      const request: SummaryRequest = {
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

  async createWeeklySummary(req: Request, res: Response) {
    try {
      const request: WeeklySummaryRequest = {
        days: req.body.days || 7,
        entries: req.body.entries
      };

      const summary = await this.summaryService.createWeeklySummary(request.days || 7);
      res.status(201).json(summary);
    } catch (error) {
      console.error('Error creating weekly summary:', error);
      res.status(500).json({ error: 'Failed to create weekly summary' });
    }
  }

  async getSummary(req: Request, res: Response) {
    try {
      const {  date } = req.query;

      // Here you would typically fetch entries from your database
      // and then create a summary. For now, we'll return a mock response
      res.status(200).json({
        message: 'Summary retrieval endpoint',
        date
      });
    } catch (error) {
      console.error('Error getting summary:', error);
      res.status(500).json({ error: 'Failed to get summary' });
    }
  }
}
