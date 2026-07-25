import { pushAnalyticsEvent } from '@/lib/analytics/push-event';

/**
 * Track newsletter CTA clicks (article-level calls to action)
 *
 * Tracks when users click CTAs embedded in newsletter articles.
 * One click = one event. No duplicate tags.
 *
 * @param opts - Context about the newsletter CTA click
 */
export function trackNewsletterCtaClick(opts: {
  /** Newsletter article slug */
  slug: string;
  /** CTA label text */
  ctaLabel: string;
  /** CTA destination URL */
  destination: string;
  /** Page location context */
  pageLocation?: string;
}): void {
  pushAnalyticsEvent('select_content', {
    content_type: 'newsletter_cta',
    item_id: opts.ctaLabel,
    item_name: opts.slug,
    destination: opts.destination,
    page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
    page_location: opts.pageLocation ?? 'newsletter-article',
  });
}
