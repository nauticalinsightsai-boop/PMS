import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ChannelLandingPage } from './types/channelLandingPage';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** All candidate paths for channel landing data (first existing wins). */
export function resolveChannelLandingPagesPath(): string {
  const candidates = [
    /** Bundled with @pms/booking-crm — always present in production builds */
    path.resolve(__dirname, '../data/channel-landing-pages.json'),
    path.resolve(__dirname, '../../../data/channel-landing-pages.json'),
    path.resolve(process.cwd(), 'data/channel-landing-pages.json'),
    path.resolve(process.cwd(), '../data/channel-landing-pages.json'),
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
  const candidates = [
    path.resolve(__dirname, '../data/channel-landing-pages.json'),
    path.resolve(__dirname, '../../../data/channel-landing-pages.json'),
    path.resolve(process.cwd(), 'data/channel-landing-pages.json'),
    path.resolve(process.cwd(), '../data/channel-landing-pages.json'),
    path.resolve(process.cwd(), '../../data/channel-landing-pages.json'),
  ];

  for (const filePath of candidates) {
    try {
      if (!fs.existsSync(filePath)) continue;
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw) as { pages?: Record<string, ChannelLandingPage> };
      const pages = data.pages ?? {};
      if (Object.keys(pages).length > 0) {
        return { pages };
      }
    } catch {
      /* try next path */
    }
  }
  return { pages: {} };
}

export function writeChannelLandingPagesFile(data: {
  pages: Record<string, ChannelLandingPage>;
}): boolean {
  if (!isWritable()) return false;
  const target = resolveChannelLandingPagesPath();
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  // Keep repo-root copy in sync when present (local editor workflow)
  const repoRoot = path.resolve(__dirname, '../../../data/channel-landing-pages.json');
  if (target !== repoRoot && fs.existsSync(path.dirname(repoRoot))) {
    try {
      fs.writeFileSync(repoRoot, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
    } catch {
      /* optional */
    }
  }
  return true;
}

function resolveRepoDataFile(name: string): string {
  const candidates = [
    path.resolve(__dirname, '../data', name),
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
