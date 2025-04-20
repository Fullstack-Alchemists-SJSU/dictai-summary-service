import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import summaryRoutes from './routes/summaryRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', summaryRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  errorHandler(err, req, res, next);
});

// Start server
app.listen(port, () => {
  console.log(`Summary service running on port ${port}`);
});
