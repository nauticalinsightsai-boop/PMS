/**
 * Base URL for links in auth emails (password reset, etc.).
 * Use AUTH_EMAIL_SITE_URL when running locally but sending real emails to production.
 */
export function getAuthEmailSiteUrl(): string {
  const fromEmail = process.env.AUTH_EMAIL_SITE_URL?.trim();
  if (fromEmail) return fromEmail.replace(/\/$/, '');
  const fromPublic = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromPublic) return fromPublic.replace(/\/$/, '');
  return 'http://localhost:3000';
}

export function getAdminBasePath(): string {
  return (process.env.NEXT_PUBLIC_BASE_PATH ?? '/admin').replace(/\/$/, '');
}

export function buildPasswordResetLink(token: string, email: string): string {
  const siteUrl = getAuthEmailSiteUrl();
  const adminPrefix = getAdminBasePath();
  return `${siteUrl}${adminPrefix}/login/update-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;
}
