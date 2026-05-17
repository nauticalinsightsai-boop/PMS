import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { healthRouter } from './routes/health.js';
import { interactionsRouter } from './routes/interactions.js';

dotenv.config({ path: process.env.ENV_PATH || '../../../.env' });

const app = express();
const PORT = Number(process.env.DASHBOARD_BACKEND_PORT || 3002);

app.use(cors({
  origin: process.env.DASHBOARD_FRONTEND_URL || 'http://localhost:5174',
  credentials: true,
}));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/interactions', interactionsRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`PMS dashboard backend running on http://localhost:${PORT}`);
});
