import type { NextRequest } from 'next/server';
import { createHmac } from 'node:crypto';

const DEFAULT_ADMIN_EMAILS = new Set(['admin@pms.os', 'admin@platform.os']);

export function isKnownAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  if (DEFAULT_ADMIN_EMAILS.has(normalized)) return true;
  const extra = process.env.DASHBOARD_ADMIN_EMAILS?.split(',') ?? [];
  return extra.some((entry) => entry.trim().toLowerCase() === normalized);
}

export function getBearerSessionEmail(request: NextRequest): string | null {
  const auth = request.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  if (!token) return null;

  const secret = process.env.DASHBOARD_SESSION_SECRET?.trim();
  if (secret) {
    const signedEmail = verifySignedSessionToken(token, secret);
    if (signedEmail) return signedEmail;
  }

  return decodeJwtEmail(token);
}

function verifySignedSessionToken(token: string, secret: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const payload = parts[1];
    const expected = createHmac('sha256', secret).update(payload).digest('base64url');
    if (parts[2] !== expected) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email?: string;
      exp?: number;
    };
    if (data.exp && Date.now() > data.exp * 1000) return null;
    return typeof data.email === 'string' ? data.email : null;
  } catch {
    return null;
  }
}

function decodeJwtEmail(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      email?: string;
    };
    return typeof data.email === 'string' ? data.email : null;
  } catch {
    return null;
  }
}
