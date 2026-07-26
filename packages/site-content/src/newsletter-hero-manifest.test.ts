import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { newsletterDraftRegistry } from './newsletter-draft-registry';
import {
  getNewsletterHeroManifest,
  isGenericNewsletterHeroPath,
  listNewsletterHeroSlugs,
  resolveNewsletterHeroAlt,
  resolveNewsletterHeroImage,
} from './newsletter-hero-manifest';
import { newsletterPostToArticle } from './newsletter-posts';

const require = createRequire(import.meta.url);
const sharp = require('sharp') as typeof import('sharp');

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const publicRoot = join(repoRoot, 'frontend/public');

describe('newsletter hero manifest 2026-07-26', () => {
  const manifest = getNewsletterHeroManifest();
  const slugs = listNewsletterHeroSlugs();

  it('maps exactly 13 live catalogue slugs', () => {
    expect(manifest.articles).toHaveLength(13);
    expect(slugs).toHaveLength(13);
    expect(new Set(slugs).size).toBe(13);
  });

  it('uses unique .webp paths under generated-2026-07-26 only', () => {
    const images = manifest.articles.map((a) => a.image);
    expect(new Set(images).size).toBe(13);
    for (const image of images) {
      expect(image).toMatch(/^\/images\/newsletter\/generated-2026-07-26\/.+\.webp$/);
      expect(image.toLowerCase().endsWith('.png')).toBe(false);
      expect(isGenericNewsletterHeroPath(image)).toBe(false);
    }
  });

  it('requires non-empty alt text for every mapped slug', () => {
    for (const article of manifest.articles) {
      expect(article.alt.trim().length).toBeGreaterThan(0);
      expect(resolveNewsletterHeroAlt(article.slug)).toBe(article.alt);
    }
  });

  it('resolves draft-registry featured image and alt to the manifest contract', () => {
    expect(newsletterDraftRegistry.posts).toHaveLength(13);
    for (const post of newsletterDraftRegistry.posts) {
      const hero = manifest.articles.find((a) => a.slug === post.slug);
      expect(hero, `missing manifest entry for ${post.slug}`).toBeTruthy();
      expect(post.featuredImageUrl).toBe(hero!.image);
      expect(post.heroImageAlt).toBe(hero!.alt);
      expect(resolveNewsletterHeroImage(post.slug, '/images/marketing/community-collab-600.webp')).toBe(
        hero!.image,
      );
      const article = newsletterPostToArticle(post);
      expect(article.image).toBe(hero!.image);
      expect(article.heroImageAlt).toBe(hero!.alt);
      expect(isGenericNewsletterHeroPath(article.image)).toBe(false);
      expect(article.image).not.toContain('/images/marketing/');
    }
  });

  it('does not fall back to generic marketing heroes for the 13 mapped slugs', () => {
    for (const slug of slugs) {
      const image = resolveNewsletterHeroImage(slug, '');
      expect(image).toBeTruthy();
      expect(isGenericNewsletterHeroPath(image!)).toBe(false);
      expect(image).not.toBe('/images/marketing/community-collab-600.webp');
    }
  });

  it('proves each WebP asset exists at 1600x900', async () => {
    for (const article of manifest.articles) {
      const abs = join(publicRoot, article.image.replace(/^\//, ''));
      expect(existsSync(abs), `missing asset ${article.image}`).toBe(true);
      const meta = await sharp(abs).metadata();
      expect(meta.format).toBe('webp');
      expect(meta.width).toBe(1600);
      expect(meta.height).toBe(900);
    }
  });
});
