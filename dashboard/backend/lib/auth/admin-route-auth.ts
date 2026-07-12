import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getBearerSessionEmail } from '@/lib/auth/api-guard';
import { readDashboardSessionEmail } from '@/lib/auth/dashboard-session-cookie';
import { isKnownAdminEmail } from '@/lib/auth/known-users';
import { assertSameOrigin } from '@/lib/auth/csrf-origin';

export async function requireAdminRoute(
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

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
