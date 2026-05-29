const DEFAULT_ADMIN_EMAILS = new Set(['admin@pms.os', 'admin@platform.os']);

export function isKnownAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  if (DEFAULT_ADMIN_EMAILS.has(normalized)) return true;
  const extra = process.env.DASHBOARD_ADMIN_EMAILS?.split(',') ?? [];
  return extra.some((entry) => entry.trim().toLowerCase() === normalized);
}
