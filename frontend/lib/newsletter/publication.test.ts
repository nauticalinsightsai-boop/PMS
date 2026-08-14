import { describe, expect, it } from 'vitest';
import { newsletterPostToArticle } from '@pms/site-content/newsletter-posts';
import sitemap, { buildSitemap } from '@/app/sitemap';
import {
  LEGACY_THIN_NEWSLETTER_SLUGS,
  publishedLongFormNewsletterPosts,
} from '@/content/newsletter/publication';

function usefulWordCount(markdown: string): number {
  return markdown
    .replace(/##\s+References[\s\S]*$/m, '')
    .replace(/^\s*#\s+[^\r\n]+(?:\r?\n)+/, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

describe('long-form newsletter publication batch', () => {
  it('publishes all 13 validated articles with complete production metadata', () => {
    expect(publishedLongFormNewsletterPosts).toHaveLength(13);

    for (const post of publishedLongFormNewsletterPosts) {
      expect(post.status, post.slug).toBe('published');
      expect(Number.isNaN(Date.parse(post.publishDate)), post.slug).toBe(false);
      expect(post.featuredImageUrl, post.slug).toMatch(/^\/images\/marketing\/.+\.webp$/);
      expect(post.featuredImageMobileUrl, post.slug).toBe(post.featuredImageUrl);
      expect(usefulWordCount(post.content), post.slug).toBeGreaterThanOrEqual(1_800);
      expect(usefulWordCount(post.content), post.slug).toBeLessThanOrEqual(2_500);
      expect(LEGACY_THIN_NEWSLETTER_SLUGS.has(post.slug), post.slug).toBe(false);
    }
  });

  it('maps the published posts to substantive public articles with accurate read times', () => {
    for (const post of publishedLongFormNewsletterPosts) {
      const article = newsletterPostToArticle(post);
      const minutes = Number.parseInt(article.readTime, 10);

      expect(article.markdown?.length, post.slug).toBeGreaterThan(8_000);
      expect(article.body.length, post.slug).toBeGreaterThan(20);
      expect(minutes, post.slug).toBeGreaterThanOrEqual(9);
      expect(article.category, post.slug).not.toMatch(/^["']|["']$/);
    }
  });

  it('includes every long-form publication URL in the XML sitemap', async () => {
    const paths = new Set((await sitemap()).map((entry) => new URL(entry.url).pathname));

    for (const post of publishedLongFormNewsletterPosts) {
      expect(paths.has(`/newsletter/${post.slug}`), post.slug).toBe(true);
    }
  });

  it('includes the three fixed publications once with provider lastmod timestamps', async () => {
    const entries = await buildSitemap([]);
    const expected = new Map([
      ['/newsletter/pmi-rmp-2026-domain-map-five-domain-study-plan', '2026-08-04T01:07:06.733Z'],
      ['/newsletter/pmi-rmp-eligibility-separate-risk-experience-general-project-work', '2026-08-04T01:08:27.700Z'],
      ['/newsletter/workplace-safety-basics', '2026-08-14T12:04:24.575Z'],
    ]);
    expect(new Set(entries.map((entry) => entry.url)).size).toBe(entries.length);
    for (const [path, timestamp] of expected) {
      const matches = entries.filter((entry) => new URL(entry.url).pathname === path);
      expect(matches).toHaveLength(1);
      expect(new Date(matches[0].lastModified!).toISOString()).toBe(timestamp);
    }
  });

  it('keeps locked provider lastmods when CMS also returns all fixed published slugs', async () => {
    const baselineEntries = await buildSitemap([]);
    const entries = await buildSitemap([
      'pmi-rmp-2026-domain-map-five-domain-study-plan',
      'pmi-rmp-eligibility-separate-risk-experience-general-project-work',
      'workplace-safety-basics',
    ]);
    const expected = new Map([
      ['/newsletter/pmi-rmp-2026-domain-map-five-domain-study-plan', '2026-08-04T01:07:06.733Z'],
      ['/newsletter/pmi-rmp-eligibility-separate-risk-experience-general-project-work', '2026-08-04T01:08:27.700Z'],
      ['/newsletter/workplace-safety-basics', '2026-08-14T12:04:24.575Z'],
    ]);
    expect(entries).toHaveLength(baselineEntries.length);
    expect(entries.map((entry) => entry.url)).toEqual(
      baselineEntries.map((entry) => entry.url),
    );
    for (const [path, timestamp] of expected) {
      const matches = entries.filter((entry) => new URL(entry.url).pathname === path);
      expect(matches).toHaveLength(1);
      expect(new Date(matches[0].lastModified!).toISOString()).toBe(timestamp);
    }
  });
});
