import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_PATH || '../../.env' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Supabase URL or service role key missing. API routes will return 503 until configured.');
}

export const supabaseAdmin = createClient(supabaseUrl || 'https://placeholder.supabase.co', serviceRoleKey || 'placeholder', {
  auth: { persistSession: false, autoRefreshToken: false },
});

export const isSupabaseConfigured = Boolean(supabaseUrl && serviceRoleKey && !serviceRoleKey.includes('placeholder'));
