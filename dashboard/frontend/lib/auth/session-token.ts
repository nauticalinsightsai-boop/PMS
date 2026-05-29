export function getSessionSecret(): string | null {
  const secret = process.env.DASHBOARD_SESSION_SECRET?.trim();
  return secret || null;
}
