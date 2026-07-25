import assert from 'node:assert/strict';
import test from 'node:test';
import {
  NEWSLETTER_POSTS_FIELD_KEY,
  type NewsletterPost,
  type NewsletterPostsRegistry,
} from '@pms/site-content/newsletter-posts';
import type { WebsiteData } from '@/services/WebsiteDataService';
import { buildUnifiedNewsletterRegistry } from './registry-merge';

const COLLIDING_SLUG = 'pmp-live-training-requirements-late-q4-2026';
const SEED_ONLY_SLUG = 'new-pmp-exam-day-format-240-minutes';

function websiteDataRow(
  content: NewsletterPostsRegistry,
  isPublished: boolean,
): WebsiteData {
  return {
    id: isPublished ? 'published-newsletter-registry' : 'draft-newsletter-registry',
    field_key: NEWSLETTER_POSTS_FIELD_KEY,
    content: content as unknown as Record<string, unknown>,
    is_published: isPublished,
    updated_at: '2026-07-25T00:00:00.000Z',
  };
}

function getGeneratedPost(slug: string): NewsletterPost {
  const post = buildUnifiedNewsletterRegistry({ draft: [], published: [] }).posts.find(
    (candidate) => candidate.slug === slug,
  );
  assert.ok(post, `expected generated draft seed for ${slug}`);
  return post;
}

test('keeps a generated draft when no persisted version exists', () => {
  const result = buildUnifiedNewsletterRegistry({ draft: [], published: [] });
  const seedOnly = result.posts.find((post) => post.slug === SEED_ONLY_SLUG);

  assert.ok(seedOnly);
  assert.equal(seedOnly.status, 'draft');
  assert.equal(seedOnly.publishDate, '');
});

test('keeps published CMS fields authoritative on generated-slug collision', () => {
  const generated = getGeneratedPost(COLLIDING_SLUG);
  const approvedHero = '/images/newsletter/approved-live-training.webp';
  const approvedPublishDate = '2026-08-15T06:00:00.000Z';
  const published: NewsletterPost = {
    ...generated,
    title: 'Approved live-training article',
    status: 'published',
    publishDate: approvedPublishDate,
    modifiedDate: '2026-08-14T10:00:00.000Z',
    featuredImageUrl: approvedHero,
  };
  const unrelated: NewsletterPost = {
    ...generated,
    id: 'post-unrelated-published-newsletter',
    slug: 'unrelated-published-newsletter',
    title: 'Unrelated published newsletter',
    status: 'published',
    publishDate: '2026-08-10T06:00:00.000Z',
    modifiedDate: '2026-08-10T06:00:00.000Z',
    featuredImageUrl: '/images/newsletter/unrelated.webp',
  };
  const publishedRegistry: NewsletterPostsRegistry = {
    version: 1,
    posts: [published, unrelated],
  };

  const result = buildUnifiedNewsletterRegistry({
    draft: [],
    published: [websiteDataRow(publishedRegistry, true)],
  });
  const collision = result.posts.find((post) => post.slug === COLLIDING_SLUG);

  assert.ok(collision);
  assert.equal(collision.title, 'Approved live-training article');
  assert.equal(collision.status, 'published');
  assert.equal(collision.publishDate, approvedPublishDate);
  assert.equal(collision.featuredImageUrl, approvedHero);
  assert.ok(result.posts.some((post) => post.slug === SEED_ONLY_SLUG));
  assert.ok(result.posts.some((post) => post.slug === unrelated.slug));
});
