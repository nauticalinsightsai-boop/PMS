import fs from 'fs';
import path from 'path';

let loaded = false;

function parseEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return env;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const line of text.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function repoRootCandidates(): string[] {
  return [
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd()),
    path.resolve(__dirname, '..', '..'),
  ];
}

/** Load repo root `.env` + `.env.local` when Next.js app dir is `backend/`. */
export function ensureMonorepoEnv(): void {
  if (loaded) return;

  for (const root of repoRootCandidates()) {
    for (const file of ['.env', '.env.local']) {
      const parsed = parseEnvFile(path.join(root, file));
      for (const [key, value] of Object.entries(parsed)) {
        const publishableKey = key === 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY' || key === 'STRIPE_PUBLISHABLE_KEY';
        const currentPublishable =
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ||
          process.env.STRIPE_PUBLISHABLE_KEY?.trim() ||
          '';
        const shouldSet =
          value &&
          (publishableKey
            ? !currentPublishable.startsWith('pk_')
            : !process.env[key] || process.env[key] === '');
        if (shouldSet) {
          process.env[key] = value;
        }
      }
    }
    const stripeSecret = process.env.STRIPE_SECRET_KEY?.trim() ?? '';
    if (/^(sk_|rk_)/.test(stripeSecret)) {
      loaded = true;
      return;
    }
  }

  loaded = true;
}

const PUBLISHABLE_ENV_KEYS = ['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_PUBLISHABLE_KEY'];

/** Read Stripe publishable key directly from repo root env files (bypasses Next env inlining). */
export function readMonorepoPublishableKey(): string {
  ensureMonorepoEnv();
  for (const key of PUBLISHABLE_ENV_KEYS) {
    const val = process.env[key]?.trim() ?? '';
    if (val.startsWith('pk_')) return val;
  }

  for (const root of repoRootCandidates()) {
    for (const file of ['.env.local', '.env']) {
      const parsed = parseEnvFile(path.join(root, file));
      for (const key of PUBLISHABLE_ENV_KEYS) {
        const val = parsed[key]?.trim() ?? '';
        if (val.startsWith('pk_')) return val;
      }
    }
  }

  return '';
}
