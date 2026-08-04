import { beforeEach, describe, expect, it, vi } from 'vitest';

const createAnalyticsEventId = vi.hoisted(() => vi.fn(() => 'contact_opaque'));
const pushAnalyticsEvent = vi.hoisted(() => vi.fn(() => true));
const trackMetaContact = vi.hoisted(() => vi.fn());

vi.mock('@/lib/analytics/event-id', () => ({
  createAnalyticsEventId,
}));
vi.mock('@/lib/analytics/push-event', () => ({
  pushAnalyticsEvent,
}));
vi.mock('@/lib/analytics/meta-browser', () => ({
  trackMetaContact,
}));

import { PMS_EVENTS } from '@/lib/analytics/pms-events';
import { trackContactClick } from '@/lib/analytics/track-contact-click';

describe('contact intent measurement boundary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each([
    ['email', 'support', 'Email support', '/contact'],
    ['whatsapp', 'roadmap', 'Ask on WhatsApp', '/certifications/pmp'],
    ['other', 'general', 'Open contact link', '/about'],
  ] as const)(
    'keeps %s intent clicks in GA without dispatching a Meta Contact event',
    (contactMethod, contactContext, ctaText, pagePath) => {
      trackContactClick({ contactMethod, contactContext, ctaText, pagePath });

      expect(pushAnalyticsEvent).toHaveBeenCalledOnce();
      expect(pushAnalyticsEvent).toHaveBeenCalledWith(PMS_EVENTS.CONTACT_CLICK, {
        event_id: 'contact_opaque',
        contact_method: contactMethod,
        contact_context: contactContext,
        page_path: pagePath,
        cta_text: ctaText,
      });
      expect(trackMetaContact).not.toHaveBeenCalled();
    },
  );

  it('does not expose a Meta pixel, CAPI, Gateway, or business-event dispatch in the helper', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    trackContactClick({
      contactMethod: 'email',
      contactContext: 'corporate',
      pagePath: '/corporate',
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(trackMetaContact).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
