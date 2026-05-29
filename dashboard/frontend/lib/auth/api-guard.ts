import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'node:crypto';
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

export function getBearerSessionEmail(request: NextRequest): string | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;

  const secret = process.env.DASHBOARD_SESSION_SECRET?.trim();
  if (secret) {
    const signedEmail = verifySignedSessionToken(token, secret);
    if (signedEmail) return signedEmail;
  }

  return decodeJwtEmail(token);
}

function verifySignedSessionToken(token: string, secret: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = parts[1];
    const expected = createHmac('sha256', secret).update(payload).digest('base64url');
    if (parts[2] !== expected) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email?: string;
      exp?: number;
    };
    if (data.exp && Date.now() > data.exp * 1000) return null;
    return typeof data.email === 'string' ? data.email : null;
  } catch {
    return null;
  }
}

function decodeJwtEmail(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email?: string;
    };
    return typeof data.email === 'string' ? data.email : null;
  } catch {
    return null;
  }
}
