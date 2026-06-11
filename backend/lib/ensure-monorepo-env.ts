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
        if (value && (!process.env[key] || process.env[key] === '')) {
          process.env[key] = value;
        }
      }
    }
    if (process.env.STRIPE_SECRET_KEY?.trim()?.startsWith('sk_')) {
      loaded = true;
      return;
    }
  }

  loaded = true;
}
