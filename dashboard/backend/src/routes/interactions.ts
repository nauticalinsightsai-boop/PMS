import { Router } from 'express';
import { isSupabaseConfigured, supabaseAdmin } from '../lib/supabase.js';

export const interactionsRouter = Router();

interactionsRouter.get('/', async (req, res) => {
  if (!isSupabaseConfigured) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const page = Number(req.query.page ?? 0);
  const limit = Math.min(Number(req.query.limit ?? 50), 100);
  const from = page * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabaseAdmin
    .from('form_submissions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ data, count });
});

interactionsRouter.post('/:id/retry-sheets', async (req, res) => {
  if (!isSupabaseConfigured) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const { id } = req.params;
  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .update({ sheets_status: 'pending', metadata: { retry_at: new Date().toISOString() } })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.json({ data, message: 'Retry queued' });
});

interactionsRouter.get('/export', async (_req, res) => {
  if (!isSupabaseConfigured) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  const { data, error } = await supabaseAdmin
    .from('form_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const headers = ['id', 'created_at', 'source', 'subject', 'email', 'sheets_status'];
  const rows = (data ?? []).map((row) =>
    headers.map((h) => JSON.stringify((row as Record<string, unknown>)[h] ?? '')).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="interactions.csv"');
  return res.send(csv);
});
