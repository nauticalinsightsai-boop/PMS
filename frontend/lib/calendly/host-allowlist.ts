/** Calendly scheduling URLs must point at calendly.com (or subdomain). */
export function isCalendlySchedulingHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return h === 'calendly.com' || h.endsWith('.calendly.com');
}

export function assertCalendlySchedulingUrl(raw: string): string | null {
  let s = raw.trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  if (!s) return null;
  try {
    const u = new URL(s);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    if (!isCalendlySchedulingHost(u.hostname)) return null;
    return u.toString();
  } catch {
    return null;
  }
}
