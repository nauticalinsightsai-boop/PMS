import type { NextRequest } from 'next/server';

const DEMO_SESSION_COOKIE = 'pms_demo_admin_session';

export function readDashboardSessionEmail(request: NextRequest): string | null {
  const demo = request.cookies.get(DEMO_SESSION_COOKIE)?.value?.trim();
  if (demo && demo.includes('@')) return demo.toLowerCase();

  const session = request.cookies.get('dashboard_session')?.value?.trim();
  if (!session) return null;

  try {
    const data = JSON.parse(session) as { email?: string };
    return typeof data.email === 'string' ? data.email.trim().toLowerCase() : null;
  } catch {
    return null;
  }
}
