import { createHmac, randomBytes } from 'node:crypto';

export const GW_DASHBOARD_SESSION = 'gw_dashboard_session';
const SESSION_TTL_SEC = 7 * 24 * 60 * 60;

export function getSessionSecret(): string | null {
  const secret =
    process.env.AUTH_SESSION_SECRET?.trim() ||
    process.env.DASHBOARD_SESSION_SECRET?.trim();
  return secret || null;
}

export function createSignedSessionToken(email: string, secret: string): string {
  const normalized = email.trim().toLowerCase();
  const payload = Buffer.from(
    JSON.stringify({
      email: normalized,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SEC,
      nonce: randomBytes(8).toString('hex'),
    }),
    'utf8',
  ).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${normalized}.${payload}.${sig}`;
}

/** Token shape: `{email}.{payload}.{sig}`: email may contain dots. */
export function parseSignedSessionToken(token: string): {
  emailPrefix: string;
  payload: string;
  sig: string;
} | null {
  const sigSep = token.lastIndexOf('.');
  if (sigSep <= 0) return null;
  const payloadSep = token.lastIndexOf('.', sigSep - 1);
  if (payloadSep <= 0) return null;
  return {
    emailPrefix: token.slice(0, payloadSep),
    payload: token.slice(payloadSep + 1, sigSep),
    sig: token.slice(sigSep + 1),
  };
}

export function verifySignedSessionToken(token: string, secret: string): string | null {
  let normalizedToken = token.trim();
  try {
    normalizedToken = decodeURIComponent(normalizedToken);
  } catch {
    /* use raw token */
  }
  const parsed = parseSignedSessionToken(normalizedToken);
  if (!parsed) return null;
  try {
    const expected = createHmac('sha256', secret).update(parsed.payload).digest('base64url');
    if (parsed.sig !== expected) return null;
    const data = JSON.parse(Buffer.from(parsed.payload, 'base64url').toString('utf8')) as {
      email?: string;
      exp?: number;
    };
    if (data.exp && Date.now() > data.exp * 1000) return null;
    const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : null;
    if (!email || email !== parsed.emailPrefix) return null;
    return email;
  } catch {
    return null;
  }
}