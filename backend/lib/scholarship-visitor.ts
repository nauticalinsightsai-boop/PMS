import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const SCHOLARSHIP_VISITOR_COOKIE = 'pms_scholarship_visitor';

function signingSecret(): string {
  const secret =
    process.env.SCHOLARSHIP_RESERVATION_SECRET?.trim() ||
    process.env.AUTH_SESSION_SECRET?.trim() ||
    process.env.STRIPE_WEBHOOK_SECRET?.trim() ||
    '';
  if (secret.length < 16) throw new Error('scholarship_reservation_secret_unavailable');
  return secret;
}

function signature(visitorId: string): string {
  return createHmac('sha256', signingSecret()).update(`pms-scholarship:${visitorId}`).digest('base64url');
}

export function createScholarshipVisitorCookieValue(): string {
  const visitorId = randomBytes(24).toString('base64url');
  return `${visitorId}.${signature(visitorId)}`;
}

export function readCookieValue(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get('cookie') ?? '';
  for (const entry of cookieHeader.split(';')) {
    const [rawName, ...rawValue] = entry.trim().split('=');
    if (rawName === name) return decodeURIComponent(rawValue.join('='));
  }
  return null;
}

export function verifyScholarshipVisitorCookie(value: string): string | null {
  const [visitorId, provided, ...extra] = value.split('.');
  if (!visitorId || !provided || extra.length || !/^[A-Za-z0-9_-]{32}$/.test(visitorId)) return null;
  const expected = signature(visitorId);
  const left = Buffer.from(provided);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  return visitorId;
}

export function scholarshipVisitorHash(visitorId: string): string {
  return createHash('sha256')
    .update(`${signingSecret()}:visitor:${visitorId}`)
    .digest('hex');
}

export function scholarshipVisitorCookieHeader(value: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SCHOLARSHIP_VISITOR_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`;
}
