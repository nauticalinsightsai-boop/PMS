import { isSupabaseAuthConfigured } from '@/lib/supabase';
import { readDemoSessionEmail } from '@/lib/demo-auth';

/** Returns a user-facing reason when CMS draft/publish cannot reach Supabase. */
export function getCmsSaveBlockReason(): string | null {
  if (!isSupabaseAuthConfigured) {
    return 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in dashboard .env.local, then restart the dev server.';
  }
  if (readDemoSessionEmail()) {
    return 'Demo login (admin@pms.os / admin) opens the dashboard but cannot write to Supabase. Sign in with a real Supabase user account to save or publish.';
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
