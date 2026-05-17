import { Router } from 'express';
import { isSupabaseConfigured } from '../lib/supabase.js';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'pms-dashboard-backend',
    supabase: isSupabaseConfigured,
    timestamp: new Date().toISOString(),
  });
});
