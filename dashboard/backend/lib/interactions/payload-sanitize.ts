const MAX_KEYS = 48;
const MAX_KEY_LEN = 80;
const MAX_STRING_LEN = 8000;

export function sanitizeInteractionPayload(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {};
  }
  const o = input as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  let n = 0;
  for (const [k, v] of Object.entries(o)) {
    if (n >= MAX_KEYS) break;
    if (k.length > MAX_KEY_LEN) continue;
    if (typeof v === 'string') {
      out[k] = v.length > MAX_STRING_LEN ? v.slice(0, MAX_STRING_LEN) : v;
    } else if (typeof v === 'number' && Number.isFinite(v)) {
      out[k] = v;
    } else if (typeof v === 'boolean') {
      out[k] = v;
    } else if (v === null) {
      out[k] = null;
    }
    n++;
  }
  return out;
}

export function jsonByteLength(obj: Record<string, unknown>): number {
  try {
    return new TextEncoder().encode(JSON.stringify(obj)).length;
  } catch {
    return Number.MAX_SAFE_INTEGER;
  }
}
