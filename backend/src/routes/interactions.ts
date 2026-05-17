import { Router } from 'express';
import { isSupabaseConfigured, supabaseAdmin } from '../lib/supabase.js';

export const interactionsRouter = Router();

interactionsRouter.post('/', async (req, res) => {
  if (!isSupabaseConfigured) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const { source = 'contact', subject, email, payload = {}, metadata = {} } = req.body ?? {};

  if (!email && !payload?.email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const { data, error } = await supabaseAdmin.from('form_submissions').insert({
    source,
    subject: subject ?? payload?.subject ?? 'New submission',
    email: email ?? payload?.email,
    payload,
    metadata,
    sheets_status: 'pending',
  }).select().single();

  if (error) {
    console.error('form_submissions insert error:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ data });
});
