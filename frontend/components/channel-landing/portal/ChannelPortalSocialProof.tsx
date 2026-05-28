'use client'

import PortalSection from '@/components/channel-landing/portal/primitives/PortalSection'
import PortalCredibilityTabs from '@/components/channel-landing/portal/primitives/PortalCredibilityTabs'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

const MAX_METRICS = 4
const MAX_QUOTES = 2

export default function ChannelPortalSocialProof({ page, theme, sectionOrder }: PortalSectionProps) {
  if (!isConversionEnabledForChannel(page.channelId)) return null

  const metrics = page.conversion?.proofMetrics?.slice(0, MAX_METRICS) ?? []
  const quotes = page.conversion?.socialProof?.slice(0, MAX_QUOTES) ?? []
  if (!metrics.length && !quotes.length) return null

  const title = page.conversion?.credibilityHeading?.trim() || 'Why learners book here'
  const subtitle = page.conversion?.credibilityBody?.trim()

  return (
    <PortalSection
      theme={theme}
      sectionOrder={sectionOrder}
      title={title}
      titleVariant="eyebrow"
      subtitle={subtitle}
      className="portal-section-compact"
    >
      <PortalCredibilityTabs
        key={page.channelId}
        theme={theme}
        channelId={page.channelId}
        channelLabel={page.label}
        metrics={metrics}
        quotes={quotes}
      />
    </PortalSection>
  )
}
