import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PMS_FAVICON_ICO_PATH,
  PMS_FAVICON_PATH,
} from '@/config/pms-site';

const frontendRoot = path.resolve(__dirname, '../..');
const publicRoot = path.join(frontendRoot, 'public');

function sha256(filePath: string): string {
  return createHash('sha256').update(readFileSync(filePath)).digest('hex');
}

describe('production static favicon.ico', () => {
  it('serves /favicon.ico as the official PM Structure brand mark (not a substitute)', () => {
    expect(PMS_FAVICON_PATH).toBe('/brand/pms-icon.png');
    expect(PMS_FAVICON_ICO_PATH).toBe('/favicon.ico');

    const official = path.join(publicRoot, 'brand', 'pms-icon.png');
    const faviconIco = path.join(publicRoot, 'favicon.ico');

    expect(existsSync(official), 'missing official brand icon').toBe(true);
    expect(existsSync(faviconIco), 'missing public/favicon.ico').toBe(true);
    expect(statSync(faviconIco).size).toBeGreaterThan(0);

    // Exact official asset only — no generated/substitute logo bytes.
    expect(sha256(faviconIco)).toBe(sha256(official));
    expect(Buffer.compare(readFileSync(faviconIco), readFileSync(official))).toBe(0);
  });

  it('keeps favicon.ico outside the auth middleware matcher', () => {
    const middleware = readFileSync(path.join(frontendRoot, 'middleware.ts'), 'utf8');
    expect(middleware).toContain('favicon.ico');
  });

  it('includes favicon.ico in the production build static tree when present', () => {
    const publicFavicon = path.join(publicRoot, 'favicon.ico');
    const officialHash = sha256(path.join(publicRoot, 'brand', 'pms-icon.png'));

    // Source of truth Next copies into the Docker/Railway image (Dockerfile: frontend/public → ./public).
    expect(existsSync(publicFavicon)).toBe(true);
    expect(sha256(publicFavicon)).toBe(officialHash);

    const standaloneCandidates = [
      path.join(frontendRoot, '.next', 'standalone', 'frontend', 'public', 'favicon.ico'),
      path.join(frontendRoot, '.next', 'standalone', 'public', 'favicon.ico'),
    ];
    const standalone = standaloneCandidates.find((candidate) => existsSync(candidate));
    if (standalone) {
      expect(sha256(standalone)).toBe(officialHash);
    }
  });
});
