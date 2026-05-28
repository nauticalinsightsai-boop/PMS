import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getBearerSessionEmail } from '@/lib/auth/api-guard';
import { assertSameOrigin } from '@/lib/auth/csrf-origin';
import { readDashboardSessionEmail } from '@/lib/auth/dashboard-session-cookie';
import { getSessionSecret } from '@/lib/auth/session-token';
import { getSupabaseAuthUser } from '@/lib/auth/get-supabase-auth-user';
import { isKnownAdminEmail } from '@/lib/auth/known-users';

/**
 * Interactions admin APIs: dashboard session cookie, Bearer session, or Supabase auth
 * (aligned with dashboard CMS mutation guard).
 */
export async function requireInteractionAdmin(
	request: NextRequest
): Promise<{ email: string } | NextResponse> {
	const cookieEmail = readDashboardSessionEmail(request);
	if (cookieEmail && isKnownAdminEmail(cookieEmail)) {
		return { email: cookieEmail };
	}

	const bearerEmail = getBearerSessionEmail(request);
	if (bearerEmail && isKnownAdminEmail(bearerEmail)) {
		return { email: bearerEmail };
	}

	if (process.env.NODE_ENV === 'development' && !getSessionSecret() && assertSameOrigin(request)) {
		return { email: bearerEmail ?? cookieEmail ?? 'dev@local' };
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
