import { isSupabaseConfigured } from '@/lib/supabase-admin';

export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'pms-backend',
    supabase: isSupabaseConfigured,
    timestamp: new Date().toISOString(),
  });
}
