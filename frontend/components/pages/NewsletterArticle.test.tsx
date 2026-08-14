import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { NewsletterArticle } from '@pms/site-content/newsletter-posts';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));

import { NewsletterArticlePage } from './NewsletterArticle';

vi.stubGlobal('React', React);

const article: NewsletterArticle = {
  slug: 'workplace-safety-basics',
  title: 'Workplace Safety Basics Every Team Should Know',
  excerpt: 'Practical workplace safety guidance.',
  metaTitle: 'Workplace Safety Basics Every Team Should Know',
  metaDescription: 'Practical workplace safety guidance.',
  category: 'Workplace Safety',
  date: 'Aug 14, 2026',
  datePublished: '2026-08-14T12:04:24.575Z',
  dateModified: '2026-08-14T12:04:24.575Z',
  author: 'Sheikh M. Abdullah',
  readTime: '3 min read',
  image: '/images/marketing/community-collab-600.webp',
  imageMobile: '/images/marketing/community-collab-600.webp',
  hasExplicitHeroImage: false,
  heroImageAlt: '',
  body: ['Safety culture starts with clear expectations.'],
};

describe('newsletter article explicit visual hero rendering', () => {
  it('renders no generic hero or synthesized title alt when CMS hero fields are intentionally empty', () => {
    const html = renderToStaticMarkup(
      <NewsletterArticlePage article={article} relatedArticles={[]} />,
    );

    expect(html).toContain(article.title);
    expect(html).toContain(article.body[0]);
    expect(html).not.toContain('community-collab-600.webp');
    expect(html).not.toContain(`alt="${article.title}"`);
  });

  it('preserves responsive visual hero markup for intentional desktop and mobile media', () => {
    const html = renderToStaticMarkup(
      <NewsletterArticlePage
        article={{
          ...article,
          hasExplicitHeroImage: true,
          image: '/newsletter-assets/item-09-desktop.webp',
          imageMobile: '/newsletter-assets/item-09-mobile-v03.webp',
          heroImageAlt: 'PMI-RMP domain map',
        }}
        relatedArticles={[]}
      />,
    );

    expect(html).toContain('/newsletter-assets/item-09-desktop.webp');
    expect(html).toContain('/newsletter-assets/item-09-mobile-v03.webp');
    expect(html.match(/alt="PMI-RMP domain map"/g)).toHaveLength(2);
  });
});
