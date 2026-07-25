import type { ChannelLandingPage, ConsultationTier } from '@/types/channelLandingPage'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import type { PortalColorMode } from '@/lib/channel-landing-pages/platformThemeModes'
import {
  attributionOriginLabel,
  buildLeadAttribution,
} from '@/lib/channel-landing-pages/lead-attribution'
import { openCalendlyThemedPopup } from '@/lib/calendly/open-themed-popup'
import { getCalendlyUrlForChannelTier } from '@/lib/calendly/event-registry'
import { FUNNEL_EVENTS, trackFunnelEvent } from '@/lib/analytics/funnel'
import { mergeCalendlyUtmWithInbound } from '@/lib/analytics/utm-calendly'

export function scheduleTierClick(
  page: ChannelLandingPage,
  tier: ConsultationTier,
  ctx: { theme: PlatformPortalTheme; colorMode: PortalColorMode }
) {
  const url =
    tier.scheduleUrl?.trim() ||
    getCalendlyUrlForChannelTier(page.channelId, tier.id)
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
    channel: page.channelId,
    go_slug: page.slug,
    channel_id: page.channelId,
    content_group: 'go_portal',
    tier_id: tier.id,
    origin_label: attributionOriginLabel(attr),
    funnel_stage: 'consideration',
  })
  void openCalendlyThemedPopup(url, {
    utm: mergeCalendlyUtmWithInbound({
      utm_source: page.channelId,
      utm_medium: 'channel_portal',
      utm_campaign: tier.id,
      utm_content: page.slug,
    }),
    funnelLabel: `${page.channelId}:${tier.id}`,
    theme: ctx.colorMode,
    portalTheme: ctx.theme,
    channelId: page.channelId,
    useProxy: true,
  })
}
