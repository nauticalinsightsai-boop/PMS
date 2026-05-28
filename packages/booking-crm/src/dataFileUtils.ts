import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ChannelLandingPage } from './types/channelLandingPage';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Repo root `data/channel-landing-pages.json` (works from marketing or dashboard cwd). */
export function resolveChannelLandingPagesPath(): string {
  const candidates = [
    path.resolve(__dirname, '../../../data/channel-landing-pages.json'),
    path.resolve(process.cwd(), 'data/channel-landing-pages.json'),
    path.resolve(process.cwd(), '../../data/channel-landing-pages.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

export const CHANNEL_LANDING_PAGES_FILE = resolveChannelLandingPagesPath();

export function isWritable(): boolean {
  try {
    const dir = path.dirname(CHANNEL_LANDING_PAGES_FILE);
    return fs.existsSync(dir);
  } catch {
    return false;
  }
}

export function readChannelLandingPagesFile(): { pages: Record<string, ChannelLandingPage> } {
  try {
    const raw = fs.readFileSync(CHANNEL_LANDING_PAGES_FILE, 'utf8');
    const data = JSON.parse(raw) as { pages?: Record<string, ChannelLandingPage> };
    return { pages: data.pages ?? {} };
  } catch {
    return { pages: {} };
  }
}

export function writeChannelLandingPagesFile(data: {
  pages: Record<string, ChannelLandingPage>;
}): boolean {
  if (!isWritable()) return false;
  fs.writeFileSync(CHANNEL_LANDING_PAGES_FILE, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return true;
}

function resolveRepoDataFile(name: string): string {
  const candidates = [
    path.resolve(__dirname, '../../../data', name),
    path.resolve(__dirname, '../../../../data', name),
    path.resolve(process.cwd(), 'data', name),
    path.resolve(process.cwd(), '../../data', name),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

export function readChannelContextBriefsFile(): Record<string, unknown> {
  try {
    const p = resolveRepoDataFile('channel-context-briefs.json');
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}
