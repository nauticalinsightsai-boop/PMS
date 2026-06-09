import { getDashboardSessionToken } from '@/lib/auth/dashboard-api-headers';
import { readDemoSessionEmail } from '@/lib/demo-auth';

import { isApiLoginEnabled } from '@/lib/auth/api-login-config';

const USE_API_LOGIN = isApiLoginEnabled();

/** Returns a user-facing reason when CMS draft/publish cannot save. */
export function getCmsSaveBlockReason(): string | null {
  if (readDemoSessionEmail()) {
    return 'Demo login cannot write to the CMS. Sign in with your real admin email and password.';
  }
  if (USE_API_LOGIN && !getDashboardSessionToken()) {
    return 'Not signed in for CMS writes. Log in at /admin/login with your admin password (API login).';
  }
  return null;
}

export function toSyncErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}
