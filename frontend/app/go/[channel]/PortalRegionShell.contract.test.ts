import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getPublishedGoChannelSlugs } from '@pms/booking-crm';

const here = path.dirname(fileURLToPath(import.meta.url));
const shellSource = readFileSync(path.join(here, 'PortalRegionShell.tsx'), 'utf8');
const goPageSource = readFileSync(path.join(here, '../page.tsx'), 'utf8');
const channelPageSource = readFileSync(path.join(here, 'page.tsx'), 'utf8');
const frontendRoot = path.resolve(here, '../../..');
const channelLandingRoot = path.join(frontendRoot, 'components', 'channel-landing');

function walkSourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walkSourceFiles(abs, out);
      continue;
    }
    if (/\.(tsx|ts|jsx|js)$/.test(name)) out.push(abs);
  }
  return out;
}

describe('PortalRegionShell main landmark and /go contracts', () => {
  it('wraps children in the sole main#main-content with tabIndex=-1 and scroll-mt-16', () => {
    expect(shellSource).toContain("const MAIN_CONTENT_ID = 'main-content'");
    expect(shellSource).toContain("const MAIN_CONTENT_SCROLL_MARGIN_CLASS = 'scroll-mt-16'");
    expect(shellSource).toContain('id={MAIN_CONTENT_ID}');
    expect(shellSource).toContain('tabIndex={-1}');
    expect(shellSource).toContain('MAIN_CONTENT_SCROLL_MARGIN_CLASS');
    expect(shellSource).toContain('outline-none');
    expect(shellSource).toContain('{children}');
    const mainTags = shellSource.match(/<main\b/g) || [];
    expect(mainTags).toHaveLength(1);
    expect(shellSource).not.toMatch(/tabIndex=\{[1-9]/);
    expect(shellSource).not.toMatch(/tabIndex="[1-9]/);
  });

  it('keeps CookieConsent as a sibling outside main', () => {
    const mainClose = shellSource.indexOf('</main>');
    const cookie = shellSource.indexOf('<CookieConsent');
    expect(mainClose).toBeGreaterThan(-1);
    expect(cookie).toBeGreaterThan(mainClose);
    expect(shellSource).toContain('<Suspense fallback={null}>');
  });

  it('recursively finds no nested/child <main> under channel-landing portal views', () => {
    const files = walkSourceFiles(channelLandingRoot);
    expect(files.length).toBeGreaterThan(10);
    const offenders: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      if (/<main\b/.test(text) || /<\/main>/.test(text)) {
        offenders.push(path.relative(frontendRoot, file).replace(/\\/g, '/'));
      }
    }
    expect(offenders).toEqual([]);
  });

  it('preserves generateStaticParams from getPublishedGoChannelSlugs for all published slugs', () => {
    expect(channelPageSource).toContain('export function generateStaticParams()');
    expect(channelPageSource).toContain(
      'return getPublishedGoChannelSlugs().map((channel) => ({ channel }));',
    );
    const slugs = getPublishedGoChannelSlugs();
    expect(slugs.length).toBeGreaterThan(0);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug.includes('/')).toBe(false);
    }
  });

  it('preserves /go root permanentRedirect to /go/website', () => {
    expect(goPageSource).toContain("permanentRedirect('/go/website')");
  });
});
