'use client'

import PortalSection from '@/components/channel-landing/portal/primitives/PortalSection'
import PortalCredibilityTabs from '@/components/channel-landing/portal/primitives/PortalCredibilityTabs'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

const PORTAL_SOCIAL_PROOF_PENDING_MESSAGE =
  'Verified learner stories are being collected and will be added only after permission is confirmed.'

const MAX_METRICS = 4
const MAX_QUOTES = 2

export default function ChannelPortalSocialProof({ page, theme, sectionOrder }: PortalSectionProps) {
  if (!isConversionEnabledForChannel(page.channelId)) return null

  const metrics = page.conversion?.proofMetrics?.slice(0, MAX_METRICS) ?? []
  const quotes = page.conversion?.socialProof?.slice(0, MAX_QUOTES) ?? []
  if (!metrics.length && !quotes.length) {
    return (
      <PortalSection
        theme={theme}
        sectionOrder={sectionOrder}
        title={page.conversion?.credibilityHeading?.trim() || 'Why learners schedule mentor time here'}
        titleVariant="eyebrow"
        subtitle={page.conversion?.credibilityBody?.trim()}
        className="portal-section-compact"
      >
        <p className="text-body-sm text-slate-600 dark:text-slate-400">{PORTAL_SOCIAL_PROOF_PENDING_MESSAGE}</p>
      </PortalSection>
    )
  }

  const title = page.conversion?.credibilityHeading?.trim() || 'Why learners schedule mentor time here'
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
        quotesPlaceholder={quotes.length === 0 ? PORTAL_SOCIAL_PROOF_PENDING_MESSAGE : undefined}
      />
    </PortalSection>
  )
}
