/** Edge-safe HMAC session verify (middleware). */

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function parseSignedSessionToken(token: string): {
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

export async function verifySignedSessionTokenEdge(
  token: string,
  secret: string,
): Promise<string | null> {
  let normalizedToken = token.trim();
  try {
    normalizedToken = decodeURIComponent(normalizedToken);
  } catch {
    /* use raw token */
  }
  const parsed = parseSignedSessionToken(normalizedToken);
  if (!parsed) return null;
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(parsed.payload));
    const expected = base64UrlEncode(new Uint8Array(sig));
    if (parsed.sig !== expected) return null;
    const padded = parsed.payload + '='.repeat((4 - (parsed.payload.length % 4)) % 4);
    const data = JSON.parse(
      atob(padded.replace(/-/g, '+').replace(/_/g, '/')),
    ) as {
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
