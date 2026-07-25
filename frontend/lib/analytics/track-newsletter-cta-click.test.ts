/**
 * Newsletter CTA Click Tracking - Test Suite
 *
 * Tests the trackNewsletterCtaClick helper to ensure:
 * - Proper event structure
 * - Non-PII context only
 * - One click = one event
 * - No duplicate tags
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackNewsletterCtaClick } from './track-newsletter-cta-click';
import * as pushEvent from './push-event';

describe('trackNewsletterCtaClick', () => {
  let pushSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushSpy = vi.spyOn(pushEvent, 'pushAnalyticsEvent').mockImplementation(() => {});
  });

  afterEach(() => {
    pushSpy.mockRestore();
  });

  it('should track newsletter CTA click with required fields', () => {
    trackNewsletterCtaClick({
      slug: 'pmp-live-training-requirements-late-q4-2026',
      ctaLabel: 'Book a PMP Pathway Consultation',
      destination: '/pm-service',
    });

    expect(pushSpy).toHaveBeenCalledOnce();
    expect(pushSpy).toHaveBeenCalledWith('select_content', {
      content_type: 'newsletter_cta',
      item_id: 'Book a PMP Pathway Consultation',
      item_name: 'pmp-live-training-requirements-late-q4-2026',
      destination: '/pm-service',
      page_path: '/',
      page_location: 'newsletter-article',
    });
  });

  it('should allow custom page_location', () => {
    trackNewsletterCtaClick({
      slug: 'new-pmp-exam-day-format-240-minutes',
      ctaLabel: 'Assess My PMP Readiness',
      destination: '/certifications/pmp',
      pageLocation: 'newsletter-cta-banner',
    });

    expect(pushSpy).toHaveBeenCalledOnce();
    const call = pushSpy.mock.calls[0];
    expect(call[1]).toMatchObject({
      page_location: 'newsletter-cta-banner',
    });
  });

  it('should not include PII in event data', () => {
    trackNewsletterCtaClick({
      slug: 'pmi-ai-standard-gcc-pmo-operating-model',
      ctaLabel: 'Discuss Your PMO Operating Model',
      destination: '/pm-service',
    });

    expect(pushSpy).toHaveBeenCalledOnce();
    const call = pushSpy.mock.calls[0];
    const eventData = call[1];

    // Ensure no PII fields
    expect(eventData).not.toHaveProperty('user_id');
    expect(eventData).not.toHaveProperty('email');
    expect(eventData).not.toHaveProperty('phone');
    expect(eventData).not.toHaveProperty('name');
    expect(eventData).not.toHaveProperty('ip');
  });

  it('should call pushAnalyticsEvent exactly once per invocation', () => {
    trackNewsletterCtaClick({
      slug: 'test-article',
      ctaLabel: 'Test CTA',
      destination: '/test',
    });

    expect(pushSpy).toHaveBeenCalledTimes(1);
  });

  it('should handle various destination types', () => {
    const destinations = [
      '/pm-service',
      '/certifications/pmp',
      '/pmp-mock-exam',
      'https://external.com/link',
    ];

    destinations.forEach((dest) => {
      pushSpy.mockClear();
      trackNewsletterCtaClick({
        slug: 'test-slug',
        ctaLabel: 'Test',
        destination: dest,
      });

      expect(pushSpy).toHaveBeenCalledOnce();
      expect(pushSpy.mock.calls[0][1]).toMatchObject({
        destination: dest,
      });
    });
  });

  it('should use consistent event structure across different articles', () => {
    const articles = [
      {
        slug: 'pmp-live-training-requirements-late-q4-2026',
        ctaLabel: 'Book a PMP Pathway Consultation',
        destination: '/pm-service',
      },
      {
        slug: 'new-pmp-exam-day-format-240-minutes',
        ctaLabel: 'Assess My PMP Readiness',
        destination: '/certifications/pmp',
      },
      {
        slug: 'pmi-ai-standard-gcc-pmo-operating-model',
        ctaLabel: 'Discuss Your PMO Operating Model',
        destination: '/pm-service',
      },
    ];

    articles.forEach((article) => {
      pushSpy.mockClear();
      trackNewsletterCtaClick(article);

      const call = pushSpy.mock.calls[0];
      expect(call[0]).toBe('select_content');
      expect(call[1]).toHaveProperty('content_type', 'newsletter_cta');
      expect(call[1]).toHaveProperty('item_id', article.ctaLabel);
      expect(call[1]).toHaveProperty('item_name', article.slug);
      expect(call[1]).toHaveProperty('destination', article.destination);
      expect(call[1]).toHaveProperty('page_path');
      expect(call[1]).toHaveProperty('page_location');
    });
  });
});
