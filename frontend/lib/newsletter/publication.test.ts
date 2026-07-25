import { describe, expect, it } from 'vitest';
import { newsletterPostToArticle } from '@pms/site-content/newsletter-posts';
import sitemap from '@/app/sitemap';
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
});
