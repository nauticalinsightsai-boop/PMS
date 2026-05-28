import type { ChannelLandingPage, ConsultationTier } from '@/types/channelLandingPage'
import {
  attributionOriginLabel,
  buildLeadAttribution,
} from '@/lib/channel-landing-pages/lead-attribution'
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup'
import { CALENDLY_DEFAULT_SCHEDULING_URLS } from '@/lib/calendly/scheduling-urls'
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics/funnel'

export function scheduleTierClick(page: ChannelLandingPage, tier: ConsultationTier) {
  const url =
    tier.scheduleUrl?.trim() ||
    (tier.isFree
      ? CALENDLY_DEFAULT_SCHEDULING_URLS.guideDownload
      : tier.recommended
        ? CALENDLY_DEFAULT_SCHEDULING_URLS.projectReview
        : CALENDLY_DEFAULT_SCHEDULING_URLS.strategyAdvisory)
  const attr = buildLeadAttribution({
    source: 'channel_portal',
    channelId: page.channelId,
    channelKey: page.channelKey,
    landingSlug: page.slug,
    tierId: tier.id,
    tierTitle: tier.title,
    pagePath: typeof window !== 'undefined' ? window.location.pathname : undefined,
  })
  trackFunnelEvent(FUNNEL_EVENTS.BOOKING_MODAL_OPEN, {
    cta_type: 'portal_tier_schedule',
    channel_id: page.channelId,
    tier_id: tier.id,
    origin_label: attributionOriginLabel(attr),
    funnel_stage: 'consideration',
  })
  void openCalendlyThemedPopup(url, {
    utm: {
      utm_source: page.channelId,
      utm_medium: 'channel_portal',
      utm_campaign: tier.id,
      utm_content: page.slug,
    },
    funnelLabel: `${page.channelId}:${tier.id}`,
  })
}
