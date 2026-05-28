type RequestWithHeaders = {
  headers: { get(name: string): string | null };
};

/**
 * Client IP behind Vercel / Railway / Cloudflare proxies.
 * Order: platform-specific single-IP headers, then first hop in X-Forwarded-For.
 */
export function getInteractionClientIp(request: RequestWithHeaders): string | null {
  const candidates = [
    request.headers.get('cf-connecting-ip'),
    request.headers.get('true-client-ip'),
    request.headers.get('x-vercel-forwarded-for'),
    request.headers.get('x-real-ip'),
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
  ];
  for (const c of candidates) {
    const ip = c?.trim();
    if (ip && ip.length <= 64) return ip;
  }
  return null;
}

/** Auth / rate-limit helper — same proxy chain as interactions, with fallback. */
export function getClientIp(request: RequestWithHeaders): string {
  return getInteractionClientIp(request) ?? 'unknown';
}

/** Stored on form_submissions.metadata for engagement inbox / Sheets export. */
export function collectInteractionRequestMetadata(
  request: RequestWithHeaders
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  const ip = getInteractionClientIp(request);
  if (ip) out.client_ip = ip;
  const ua = request.headers.get('user-agent')?.slice(0, 2000);
  if (ua) out.user_agent = ua;
  const ref = request.headers.get('referer')?.slice(0, 2000);
  if (ref) out.referrer = ref;
  return out;
}
