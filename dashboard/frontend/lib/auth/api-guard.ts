import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { DEMO_SESSION_KEY } from '@/lib/demo-auth';

/**
 * Dashboard mutation guard — Supabase session cookie or demo admin session.
 */
export async function requireDashboardMutationAuth(
  request: NextRequest,
): Promise<NextResponse | null> {
  const demo = request.cookies.get(DEMO_SESSION_KEY)?.value;
  if (demo === '1' || demo === 'true') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return NextResponse.json({ success: false, error: 'Auth not configured' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  const accessToken =
    authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : request.cookies.get('sb-access-token')?.value;

  if (!accessToken) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(url, anon);
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
