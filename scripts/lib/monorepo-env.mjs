/**
 * Single source of truth: repo root `.env.local` only.
 * All Next.js apps load via scripts/load-monorepo-env.cjs in next.config.ts.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const ROOT_ENV_FILES = [
  path.join(ROOT, '.env'),
  path.join(ROOT, '.env.local'),
];

/** Old per-app env files: removed by npm run env:link */
export const APP_ENV_PATHS = [
  path.join(ROOT, 'frontend', '.env.local'),
  path.join(ROOT, 'backend', '.env.local'),
  path.join(ROOT, 'dashboard', 'frontend', '.env.local'),
  path.join(ROOT, 'dashboard', 'backend', '.env.local'),
];

export function parseEnvFile(filePath) {
  const env = {};
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

export function loadMonorepoEnv() {
  const merged = {};
  for (const file of ROOT_ENV_FILES) {
    Object.assign(merged, parseEnvFile(file));
  }
  return merged;
}

export function applyToProcessEnv(env) {
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] == null || process.env[key] === '') {
      process.env[key] = value;
    }
  }
}

export function loadMonorepoEnvIntoProcess() {
  applyToProcessEnv(loadMonorepoEnv());
}

export function serializeEnvFile(env, headerComment) {
  const lines = headerComment ? [headerComment, ''] : [];
  for (const [key, value] of Object.entries(env)) {
    if (value === '' || value == null) continue;
    const needsQuotes = /[\s#"'`]/.test(value);
    lines.push(`${key}=${needsQuotes ? `"${value.replace(/"/g, '\\"')}"` : value}`);
  }
  lines.push('');
  return lines.join('\n');
}

export function removeAppEnvFiles() {
  const removed = [];
  for (const filePath of APP_ENV_PATHS) {
    if (!fs.existsSync(filePath)) continue;
    fs.unlinkSync(filePath);
    removed.push(path.relative(ROOT, filePath));
  }
  return removed;
}