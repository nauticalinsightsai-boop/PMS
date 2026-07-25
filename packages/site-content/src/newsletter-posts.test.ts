import { describe, expect, it } from 'vitest';
import {
  newsletterArticleToPost,
  newsletterPostToArticle,
  stripLeadingMarkdownH1,
  type NewsletterPost,
} from './newsletter-posts';

const draftPost: NewsletterPost = {
  id: 'post-example',
  slug: 'example',
  title: 'Example title',
  description: 'Reader description',
  metaTitle: 'SEO title',
  metaDescription: 'SEO description',
  keywords: 'pmp, readiness',
  status: 'draft',
  publishDate: '',
  modifiedDate: '2026-07-25T00:00:00.000Z',
  author: 'Sheikh M. Abdullah',
  authorId: '',
  topics: ['PMP'],
  youtubeUrl: '',
  featuredImageUrl: '',
  featuredImageMobileUrl: '',
  heroImageAlt: 'Example hero',
  emailSubject: '',
  emailPreheader: '',
  ctaLabel: 'Book a consultation',
  ctaUrl: '/pm-service',
  editorMeta: {
    tone: 'informative',
    template: 'news_roundup',
    segment: 'all',
    sectionCount: 4,
    rawNotes: '',
  },
  audioUrl: '',
  content: '# Example title\n\nOpening paragraph.\n\n## First section\n\nBody.',
};

describe('newsletter post rendering model', () => {
  it('removes only a leading Markdown H1 because the page template owns the H1', () => {
    expect(stripLeadingMarkdownH1(draftPost.content)).toBe(
      'Opening paragraph.\n\n## First section\n\nBody.',
    );
  });

  it('retains SEO and CTA fields while producing H1-safe renderable Markdown', () => {
    const article = newsletterPostToArticle(draftPost);

    expect(article.markdown).not.toMatch(/^#\s/m);
    expect(article.markdown).toContain('## First section');
    expect(article.metaTitle).toBe('SEO title');
    expect(article.metaDescription).toBe('SEO description');
    expect(article.ctaLabel).toBe('Book a consultation');
    expect(article.ctaUrl).toBe('/pm-service');
  });

  it('round-trips SEO and CTA fields back to the registry shape', () => {
    const article = newsletterPostToArticle(draftPost);
    const roundTrip = newsletterArticleToPost(article, 'draft');

    expect(roundTrip.metaTitle).toBe('SEO title');
    expect(roundTrip.metaDescription).toBe('SEO description');
    expect(roundTrip.ctaLabel).toBe('Book a consultation');
    expect(roundTrip.ctaUrl).toBe('/pm-service');
  });

  it('preserves replaceable mentor bylines on article conversion', () => {
    const readinessPost: NewsletterPost = {
      ...draftPost,
      author: 'PMP Readiness Mentor',
      authorId: 'author-pmp-readiness-mentor',
    };
    const article = newsletterPostToArticle(readinessPost);
    expect(article.author).toBe('PMP Readiness Mentor');
    expect(article.authorId).toBe('author-pmp-readiness-mentor');
  });

  it('preserves valid raw publication and modification timestamps', () => {
    const article = newsletterPostToArticle({
      ...draftPost,
      publishDate: '2026-08-15T09:30:00+03:00',
      modifiedDate: '2026-08-16T12:00:00.000Z',
    });

    expect(article.datePublished).toBe('2026-08-15T09:30:00+03:00');
    expect(article.dateModified).toBe('2026-08-16T12:00:00.000Z');
  });

  it('omits empty or invalid raw publication timestamps', () => {
    const article = newsletterPostToArticle({
      ...draftPost,
      publishDate: 'not-a-date',
      modifiedDate: ' ',
    });

    expect(article.datePublished).toBeUndefined();
    expect(article.dateModified).toBeUndefined();
  });
});
