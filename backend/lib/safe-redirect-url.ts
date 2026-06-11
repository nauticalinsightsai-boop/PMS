/** Restrict redirect URLs to the request origin (open-redirect guard). */
export function safeRedirectUrl(origin: string, candidate: string | undefined, fallback: string): string {
  if (!candidate?.trim()) return fallback;
  try {
    const parsed = new URL(candidate);
    const base = new URL(origin);
    if (parsed.origin !== base.origin) return fallback;
    return parsed.toString();
  } catch {
    return fallback;
  }
}
