import fs from 'fs';
import path from 'path';
import { readStripePublishableKeyFromEnv } from './stripe-publishable-key';

let monorepoEnvLoaded = false;

const PUBLISHABLE_ENV_KEYS = ['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_PUBLISHABLE_KEY'];

function parseEnvFile(filePath: string): Record<string, string> {
  const env: Record<string, string> = {};
  if (!fs.existsSync(filePath)) return env;
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
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
  const roots = new Set<string>();
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    roots.add(dir);
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return [...roots];
}

function readPublishableKeyFromFiles(): string {
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

function shouldApplyEnvValue(key: string, value: string): boolean {
  if (!value) return false;
  if (PUBLISHABLE_ENV_KEYS.includes(key)) {
    return !readStripePublishableKeyFromEnv().startsWith('pk_');
  }
  return !process.env[key] || process.env[key] === '';
}

/** Load repo root .env.local (Next.js only auto-loads frontend/.env*). */
function ensureMonorepoStripeEnv(): void {
  if (monorepoEnvLoaded) return;
  monorepoEnvLoaded = true;

  for (const root of repoRootCandidates()) {
    for (const file of ['.env', '.env.local']) {
      const parsed = parseEnvFile(path.join(root, file));
      for (const [key, value] of Object.entries(parsed)) {
        if (shouldApplyEnvValue(key, value)) {
          process.env[key] = value;
        }
      }
    }
    if (readStripePublishableKeyFromEnv().startsWith('pk_')) return;
  }
}

/** Server-only: resolve publishable key including repo root .env.local. */
export function getStripePublishableKey(): string {
  ensureMonorepoStripeEnv();
  const fromEnv = readStripePublishableKeyFromEnv();
  if (fromEnv.startsWith('pk_')) return fromEnv;
  return readPublishableKeyFromFiles();
}
