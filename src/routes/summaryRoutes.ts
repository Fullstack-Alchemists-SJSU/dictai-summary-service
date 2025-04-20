import express from 'express';
import { SummaryController } from '../controllers/summaryController';

const router = express.Router();
const summaryController = new SummaryController();

// Create a new summary
router.post('/summaries', summaryController.createSummary.bind(summaryController));

// Get a summary for a specific user and date
router.get('/summaries', summaryController.getSummary.bind(summaryController));

export default router;
