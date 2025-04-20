import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import summaryRoutes from './routes/summaryRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', summaryRoutes);

app.listen(port, () => {
  console.log(`Summary service running on port ${port}`);
});
