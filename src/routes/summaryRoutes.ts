import express, { RequestHandler } from 'express';
import { SummaryController } from '../controllers/summaryController';

const router = express.Router();
const summaryController = new SummaryController();

// Create a new daily summary
router.post('/summaries', summaryController.createSummary.bind(summaryController) as RequestHandler);

// Create a new weekly summary
router.post('/summaries/weekly', summaryController.createWeeklySummary.bind(summaryController) as RequestHandler);

// Get a summary for a specific user and date
router.get('/summaries', summaryController.getSummary.bind(summaryController) as RequestHandler);

export default router;
