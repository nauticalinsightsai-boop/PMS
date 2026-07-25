import { readFileSync } from 'node:fs';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SitemapPage from '@/app/(site)/sitemap/page';
import { generateMetadata } from '@/app/go/[channel]/page';
import sitemap from '@/app/sitemap';
import {
  getAllIndexationStrategyRows,
  shouldIncludeInHtmlSitemap,
} from '@/content/indexation/strategy';
import { resolveChannelLandingPageForGo } from '@pms/booking-crm/repository';
import {
  captureUtmFromLocation,
  type UtmTouch,
} from '@/lib/analytics/funnel';
import { mergeCalendlyUtmWithInbound } from '@/lib/analytics/utm-calendly';
import { isIndexablePath, robotsForPath } from '@/lib/indexing-metadata';
import { buildHtmlSitemapSections } from '@/lib/sitemap/build-html-sitemap-sections';

const REPRESENTATIVE_PORTALS = [
  {
    slug: 'instagram',
    destination: 'https://calendly.com/pm-structure/so-discovery-mentorship',
  },
  {
    slug: 'linkedin',
    destination: 'https://calendly.com/pm-structure/so-discovery-mentorship',
  },
  {
    slug: 'facebook',
    destination: 'https://calendly.com/pm-structure/so-discovery-mentorship',
  },
  {
    slug: 'snapchat',
    destination: 'https://calendly.com/pm-structure/so-discovery-mentorship',
  },
  {
    slug: 'whatsapp',
    destination: 'https://calendly.com/pm-structure/go-messaging-discovery',
  },
  {
    slug: 'telegram',
    destination: 'https://calendly.com/pm-structure/go-messaging-discovery',
  },
] as const;

function stubBrowserLocation(search: string) {
  const store = new Map<string, string>();
  vi.stubGlobal('sessionStorage', {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  });
  vi.stubGlobal('window', {
    location: {
      search,
      pathname: '/go/test',
      href: `https://pmstructure.com/go/test${search}`,
    },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each(REPRESENTATIVE_PORTALS)(
  '/go/$slug containment',
  ({ slug, destination }) => {
    const path = `/go/${slug}`;

    it('emits noindex,nofollow and is excluded from both sitemap policies', async () => {
      expect(isIndexablePath(path)).toBe(false);
      expect(robotsForPath(path)).toMatchObject({ index: false, follow: false });

      const metadata = await generateMetadata({
        params: Promise.resolve({ channel: slug }),
        searchParams: Promise.resolve({ preview: '0' }),
      });
      expect(metadata.robots).toMatchObject({ index: false, follow: false });

      const row = getAllIndexationStrategyRows().find((candidate) => candidate.path === path);
      expect(row).toMatchObject({
        decision: 'noindex',
        index: false,
        follow: false,
        includeInSitemap: false,
      });
      expect(row && shouldIncludeInHtmlSitemap(row)).toBe(false);
    });

    it('preserves the configured handoff destination and inbound attribution query', () => {
      const page = resolveChannelLandingPageForGo(slug, { preview: false });
      expect(page?.status).toBe('published');
      expect(page?.consultationTiers?.[0]?.scheduleUrl).toBe(destination);

      const inbound: Required<UtmTouch> = {
        utm_source: `paid-${slug}`,
        utm_medium: 'paid_social',
        utm_campaign: 'packet_04c',
        utm_content: `entry-${slug}`,
        utm_term: 'pmp',
      };
      const search = `?${new URLSearchParams(inbound).toString()}`;
      stubBrowserLocation(search);
      captureUtmFromLocation();

      expect(
        mergeCalendlyUtmWithInbound({
          utm_source: slug,
          utm_medium: 'channel_portal',
          utm_campaign: 'mentor-intro',
          utm_content: slug,
        }),
      ).toEqual(inbound);
    });
  },
);

describe('/go/* sitemap containment', () => {
  it('emits zero /go/* URLs in the XML sitemap', async () => {
    const entries = await sitemap();
    expect(entries.filter((entry) => new URL(entry.url).pathname.startsWith('/go/'))).toEqual([]);
  });

  it('emits zero /go/* links in the HTML sitemap sections', async () => {
    const sections = await buildHtmlSitemapSections();
    const goLinks = sections
      .flatMap((section) => section.links)
      .filter((entry) => entry.href.startsWith('/go/'));
    expect(goLinks).toEqual([]);
  });

  it('emits no literal or rendered clickable /go/* anchor in the full HTML sitemap page', async () => {
    const source = readFileSync(
      new URL('../app/(site)/sitemap/page.tsx', import.meta.url),
      'utf8',
    );
    expect(source).not.toMatch(
      /<(?:Link|a)\b[^>]*\bhref\s*=\s*["']\/go\/[^"']+["'][^>]*>/i,
    );

    vi.stubGlobal('React', React);
    const html = renderToStaticMarkup(await SitemapPage());
    expect(html).not.toMatch(/<a\b[^>]*\bhref=["']\/go\/[^"']+["'][^>]*>/i);
    expect(html).toContain('<code class="font-semibold text-brand-purple">/go/*</code>');
  });
});
