/** Whether dashboard_one API login is enabled (vs legacy Supabase Auth). */
export function isApiLoginEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_AUTH_USE_API_LOGIN;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  // Monorepo dev: NEXT_PUBLIC_* from repo root .env.local is not always inlined in client chunks.
  return process.env.NODE_ENV === 'development';
}
