import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getBearerSessionEmail } from '@/lib/auth/api-guard';
import { assertSameOrigin } from '@/lib/auth/csrf-origin';
import { readDashboardSessionEmail } from '@/lib/auth/dashboard-session-cookie';
import { getSupabaseAuthUser } from '@/lib/auth/get-supabase-auth-user';
import { isKnownAdminEmail } from '@/lib/auth/known-users';

/**
 * Interactions admin APIs: signed dashboard session cookie, signed Bearer, or Supabase auth.
 */
export async function requireInteractionAdmin(
  request: NextRequest,
): Promise<{ email: string } | NextResponse> {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const cookieEmail = readDashboardSessionEmail(request);
  if (cookieEmail && isKnownAdminEmail(cookieEmail)) {
    return { email: cookieEmail };
  }

  const bearerEmail = getBearerSessionEmail(request);
  if (bearerEmail && isKnownAdminEmail(bearerEmail)) {
    return { email: bearerEmail };
  }

  try {
    const user = await getSupabaseAuthUser();
    if (user?.email && isKnownAdminEmail(user.email)) {
      return { email: user.email };
    }
  } catch (error) {
    console.error('[interactions] getSupabaseAuthUser failed:', error);
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
