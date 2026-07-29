import { describe, expect, it } from 'vitest';
import { PMS_SITE_URL } from '@/config/pms-site';
import { buildArticleSchema, organizationId } from '@/lib/schema';

const baseInput = {
  path: '/newsletter/example-article',
  headline: 'Example article',
  description: 'A useful example article.',
};

describe('buildArticleSchema', () => {
  it('emits a real eligible author as Person with an absolute profile URL', () => {
    const schema = buildArticleSchema({
      ...baseInput,
      author: {
        name: 'Sheikh M. Abdullah',
        url: '/newsletter/author/sheikh-m-abdullah',
        personSchemaEligible: true,
      },
    });

    expect(schema.author).toEqual({
      '@type': 'Person',
      name: 'Sheikh M. Abdullah',
      url: `${PMS_SITE_URL}/newsletter/author/sheikh-m-abdullah`,
    });
  });

  it.each([
    ['PMP Readiness Mentor', '/newsletter/author/pmp-readiness-mentor'],
    ['PMO & Transformation Mentor', '/newsletter/author/pmo-transformation-mentor'],
  ])('links the editorial role %s as a non-Person Organization author', (name, url) => {
    const schema = buildArticleSchema({
      ...baseInput,
      author: {
        name,
        url,
        personSchemaEligible: false,
      },
    });

    expect(schema.author).toEqual({
      '@type': 'Organization',
      name,
      url: `${PMS_SITE_URL}${url}`,
    });
    expect(JSON.stringify(schema.author)).not.toContain('"@type":"Person"');
  });

  it('falls back to the publisher Organization reference without a complete author profile', () => {
    const schema = buildArticleSchema({
      ...baseInput,
      author: {
        name: 'PMP Readiness Mentor',
        personSchemaEligible: false,
      },
    });

    expect(schema.author).toEqual({ '@id': organizationId() });
  });

  it('keeps an absolute image URL and resolves a site-relative image URL', () => {
    const absolute = buildArticleSchema({
      ...baseInput,
      image: 'https://cdn.example.com/article.webp',
    });
    const relative = buildArticleSchema({
      ...baseInput,
      image: '/images/newsletter/article.webp',
    });

    expect(absolute.image).toBe('https://cdn.example.com/article.webp');
    expect(relative.image).toBe(`${PMS_SITE_URL}/images/newsletter/article.webp`);
  });

  it('emits valid raw dates and omits absent or invalid dates', () => {
    const valid = buildArticleSchema({
      ...baseInput,
      datePublished: '2026-07-25T09:00:00+03:00',
      dateModified: '2026-07-25T12:00:00.000Z',
    });
    const invalid = buildArticleSchema({
      ...baseInput,
      datePublished: 'July 25, 2026',
      dateModified: ' ',
    });

    expect(valid.datePublished).toBe('2026-07-25T09:00:00+03:00');
    expect(valid.dateModified).toBe('2026-07-25T12:00:00.000Z');
    expect(invalid).not.toHaveProperty('datePublished');
    expect(invalid).not.toHaveProperty('dateModified');
  });
});
