import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PMS_SITE_URL } from '@/config/pms-site';

const mocks = vi.hoisted(() => ({
  getNewsletterArticle: vi.fn(),
  getPublishedNewsletterArticles: vi.fn(),
  getDraftNewsletterArticle: vi.fn(),
}));

vi.mock('@/lib/newsletter/articles', () => mocks);
vi.mock('@/components/pages/NewsletterArticle', () => ({
  NewsletterArticlePage: () => null,
}));

import Page, {
  generateMetadata,
} from '@/app/(site)/newsletter/[slug]/page';

const publicArticle = {
  slug: 'pmp-readiness-example',
  title: 'PMP readiness example',
  excerpt: 'A source-backed readiness article.',
  metaTitle: 'PMP readiness example',
  metaDescription: 'A source-backed readiness article.',
  category: 'PMP',
  date: 'Jul 25, 2026',
  datePublished: '2026-07-25T09:00:00.000Z',
  dateModified: '2026-07-25T12:00:00.000Z',
  author: 'PMP Readiness Mentor',
  authorId: 'author-pmp-readiness-mentor',
  authorSlug: 'pmp-readiness-mentor',
  authorBylineType: 'editorial_role' as const,
  authorPersonSchemaEligible: false,
  authorProfilePending: false,
  readTime: '8 min read',
  image: '/images/newsletter/pmp-readiness-example.webp',
  body: ['Article body.'],
};

function jsonLdObjects(html: string): Record<string, unknown>[] {
  return Array.from(
    html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g),
    (match) => JSON.parse(match[1]) as { '@graph'?: Record<string, unknown>[] },
  ).flatMap((document) => document['@graph'] ?? []);
}

beforeEach(() => {
  vi.stubGlobal('React', React);
  mocks.getNewsletterArticle.mockResolvedValue(publicArticle);
  mocks.getPublishedNewsletterArticles.mockResolvedValue([publicArticle]);
  mocks.getDraftNewsletterArticle.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('public newsletter article metadata and schema', () => {
  it('emits the canonical, article image, and one truthful complete Article object', async () => {
    const props = {
      params: Promise.resolve({ slug: publicArticle.slug }),
      searchParams: Promise.resolve({ preview: '0' }),
    };
    const metadata = await generateMetadata(props);
    const html = renderToStaticMarkup(await Page(props));
    const articles = jsonLdObjects(html).filter((item) => item['@type'] === 'Article');

    expect(metadata.alternates?.canonical).toBe(
      `${PMS_SITE_URL}/newsletter/${publicArticle.slug}`,
    );
    expect(metadata.openGraph?.images).toEqual([
      {
        url: `${PMS_SITE_URL}${publicArticle.image}`,
        alt: publicArticle.metaTitle,
      },
    ]);
    expect(articles).toHaveLength(1);
    expect(articles[0]).toMatchObject({
      headline: publicArticle.title,
      image: `${PMS_SITE_URL}${publicArticle.image}`,
      datePublished: publicArticle.datePublished,
      dateModified: publicArticle.dateModified,
      author: { '@id': `${PMS_SITE_URL}/#organization` },
      publisher: { '@id': `${PMS_SITE_URL}/#organization` },
      mainEntityOfPage: {
        '@id': `${PMS_SITE_URL}/newsletter/${publicArticle.slug}#webpage`,
      },
    });
    expect(JSON.stringify(articles[0].author)).not.toContain('"@type":"Person"');
  });

  it('keeps an incomplete development draft preview noindex without Article JSON-LD', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    mocks.getDraftNewsletterArticle.mockResolvedValue({
      ...publicArticle,
      datePublished: undefined,
      dateModified: undefined,
    });
    const props = {
      params: Promise.resolve({ slug: publicArticle.slug }),
      searchParams: Promise.resolve({ preview: '1' }),
    };

    const metadata = await generateMetadata(props);
    const html = renderToStaticMarkup(await Page(props));

    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(jsonLdObjects(html).filter((item) => item['@type'] === 'Article')).toHaveLength(0);
  });
});
