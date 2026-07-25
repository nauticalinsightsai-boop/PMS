import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  NEWSLETTER_AUTHOR_PROFILE_SEED,
  NEWSLETTER_DRAFT_AUTHOR_ALLOCATION,
  attachAuthorToArticle,
  createEmptyNewsletterAuthor,
  defaultNewsletterAuthorsRegistry,
  findAuthorForArticle,
  mergeNewsletterAuthorProfiles,
  newsletterAuthorSchema,
  publishedAuthorsFromRegistry,
  resolveDraftAuthorProfile,
} from './newsletter-authors';
import { normalizeNewsletterAuthorName, type NewsletterArticle } from './newsletter-posts';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const PUBLIC_ROOT = join(REPO_ROOT, 'frontend/public');

function publicPathForAvatarUrl(avatarUrl: string): string | null {
  if (!avatarUrl.startsWith('/')) return null;
  return join(PUBLIC_ROOT, ...avatarUrl.replace(/^\//, '').split('/'));
}

const baseArticle = (overrides: Partial<NewsletterArticle> = {}): NewsletterArticle => ({
  slug: 'example',
  title: 'Example',
  excerpt: 'Excerpt',
  category: 'Insights',
  date: '',
  author: 'Sheikh M. Abdullah',
  readTime: '1 min read',
  image: '',
  body: ['Body'],
  ...overrides,
});

describe('replaceable newsletter author profiles', () => {
  it('seeds exactly three transparent profiles with stable ids', () => {
    expect(NEWSLETTER_AUTHOR_PROFILE_SEED).toHaveLength(3);
    expect(NEWSLETTER_AUTHOR_PROFILE_SEED.map((author) => author.id)).toEqual([
      'author-sheikh-m-abdullah',
      'author-pmp-readiness-mentor',
      'author-pmo-transformation-mentor',
    ]);
  });

  it('keeps transparent editorial roles publishable without invented personal identity fields', () => {
    const roles = NEWSLETTER_AUTHOR_PROFILE_SEED.filter(
      (author) => author.bylineType === 'editorial_role',
    );
    expect(roles).toHaveLength(2);

    for (const author of roles) {
      expect(author.personSchemaEligible).toBe(false);
      expect(author.profilePending).toBe(false);
      expect(author.title).toBe('PM Structure Editorial Role');
      expect(author.bio).toMatch(/^A PM Structure editorial role /);
      expect(author.bio).not.toMatch(/profile pending/i);
      expect(author.linkedinUrl).toBe('');
      expect(author.twitterUrl).toBe('');
      expect(author.websiteUrl).toBe('');
      expect(author.email).toBe('');
      expect(author.avatarUrl).toMatch(/\.svg$/);
      expect(author.name).not.toMatch(/\b(Mr|Ms|Dr)\b/i);
    }
  });

  it('resolves every configured local author-avatar URL to an existing public file', () => {
    const missing: string[] = [];

    for (const author of NEWSLETTER_AUTHOR_PROFILE_SEED) {
      const diskPath = publicPathForAvatarUrl(author.avatarUrl);
      expect(diskPath, `${author.id} avatarUrl must be a local public path`).not.toBeNull();
      if (!diskPath || !existsSync(diskPath)) {
        missing.push(`${author.id}: ${author.avatarUrl}`);
      }
    }

    expect(missing).toEqual([]);
  });

  it('retains the real founder profile as person-schema eligible', () => {
    const founder = resolveDraftAuthorProfile(1);
    expect(founder.name).toBe('Sheikh M. Abdullah');
    expect(founder.title).toBe('Founder & Project Management Mentor');
    expect(founder.bylineType).toBe('person');
    expect(founder.personSchemaEligible).toBe(true);
    expect(founder.profilePending).toBe(false);
  });

  it('fails closed when real-person schema eligibility is omitted or an author is empty', () => {
    const founder = resolveDraftAuthorProfile(1);
    const withoutEligibility = { ...founder } as Record<string, unknown>;
    delete withoutEligibility.personSchemaEligible;

    expect(newsletterAuthorSchema.parse(withoutEligibility).personSchemaEligible).toBe(false);
    expect(newsletterAuthorSchema.parse(withoutEligibility).bylineType).toBe('person');
    expect(createEmptyNewsletterAuthor()).toMatchObject({
      bylineType: 'person',
      personSchemaEligible: false,
    });
  });

  it('merges a partial CMS registry over seeds without dropping missing profiles', () => {
    const seeds = defaultNewsletterAuthorsRegistry().authors;
    const founderOverride = {
      ...resolveDraftAuthorProfile(1),
      title: 'Verified CMS title',
      bio: 'Verified CMS biography.',
      status: 'draft' as const,
    };

    const merged = mergeNewsletterAuthorProfiles(seeds, [founderOverride]);
    const published = publishedAuthorsFromRegistry({ version: 1, authors: merged });

    expect(merged).toHaveLength(3);
    expect(merged.find((author) => author.id === founderOverride.id)?.title).toBe(
      'Verified CMS title',
    );
    expect(published.some((author) => author.id === founderOverride.id)).toBe(false);
    expect(
      merged.find((author) => author.id === 'author-pmp-readiness-mentor'),
    ).toMatchObject({
      bylineType: 'editorial_role',
      profilePending: false,
      personSchemaEligible: false,
    });
    expect(
      merged.find((author) => author.id === 'author-pmo-transformation-mentor')
        ?.personSchemaEligible,
    ).toBe(false);
  });

  it('allocates the 13 draft priorities across the three profiles', () => {
    expect(Object.keys(NEWSLETTER_DRAFT_AUTHOR_ALLOCATION)).toHaveLength(13);

    const sheikh = [1, 2, 3, 4, 5, 11, 12].map(resolveDraftAuthorProfile);
    const readiness = [6, 7, 9].map(resolveDraftAuthorProfile);
    const pmo = [8, 10, 13].map(resolveDraftAuthorProfile);

    expect(sheikh.every((author) => author.id === 'author-sheikh-m-abdullah')).toBe(true);
    expect(readiness.every((author) => author.id === 'author-pmp-readiness-mentor')).toBe(true);
    expect(pmo.every((author) => author.id === 'author-pmo-transformation-mentor')).toBe(true);
  });

  it('preserves known bylines and maps legacy aliases to the founder', () => {
    expect(normalizeNewsletterAuthorName('PMP Readiness Mentor')).toBe('PMP Readiness Mentor');
    expect(normalizeNewsletterAuthorName('PMO & Transformation Mentor')).toBe(
      'PMO & Transformation Mentor',
    );
    expect(normalizeNewsletterAuthorName('PM Structure Editorial')).toBe('Sheikh M. Abdullah');
    expect(normalizeNewsletterAuthorName('')).toBe('Sheikh M. Abdullah');
  });

  it('attaches replaceable profile fields by authorId without rewriting article copy', () => {
    const authors = defaultNewsletterAuthorsRegistry().authors;
    const article = baseArticle({
      author: 'PMP Readiness Mentor',
      authorId: 'author-pmp-readiness-mentor',
    });

    const matched = findAuthorForArticle(article, authors);
    expect(matched?.id).toBe('author-pmp-readiness-mentor');

    const enriched = attachAuthorToArticle(article, authors);
    expect(enriched.author).toBe('PMP Readiness Mentor');
    expect(enriched.authorId).toBe('author-pmp-readiness-mentor');
    expect(enriched.authorTitle).toBe('PM Structure Editorial Role');
    expect(enriched.authorBio).toBe(
      'A PM Structure editorial role providing source-reviewed guidance on PMP readiness, exam preparation, and study planning.',
    );
    expect(enriched.authorImage).toBe('/images/marketing/author-avatar-pmp-readiness.svg');
    expect(enriched.authorBylineType).toBe('editorial_role');
    expect(enriched.authorPersonSchemaEligible).toBe(false);
    expect(enriched.authorProfilePending).toBe(false);
  });

  it('preserves an unresolved explicit author ID instead of falling back to the founder', () => {
    const article = baseArticle({
      author: 'External contributor pending verification',
      authorId: 'author-not-in-registry',
    });
    const enriched = attachAuthorToArticle(article, defaultNewsletterAuthorsRegistry().authors);

    expect(findAuthorForArticle(article, defaultNewsletterAuthorsRegistry().authors)).toBeUndefined();
    expect(enriched.author).toBe('External contributor pending verification');
    expect(enriched.authorId).toBe('author-not-in-registry');
    expect(enriched.authorSlug).toBeUndefined();
  });

  it('still resolves the founder by name when no explicit author ID exists', () => {
    const article = baseArticle({
      author: 'Sheikh M. Abdullah',
      authorId: undefined,
    });
    const enriched = attachAuthorToArticle(article, defaultNewsletterAuthorsRegistry().authors);

    expect(enriched.author).toBe('Sheikh M. Abdullah');
    expect(enriched.authorId).toBe('author-sheikh-m-abdullah');
    expect(enriched.authorSlug).toBe('sheikh-m-abdullah');
    expect(enriched.authorPersonSchemaEligible).toBe(true);
    expect(enriched.authorProfilePending).toBe(false);
  });
});
