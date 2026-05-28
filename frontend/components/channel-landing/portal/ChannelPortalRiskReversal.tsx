'use client'

import PortalSection from '@/components/channel-landing/portal/primitives/PortalSection'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

export default function ChannelPortalRiskReversal({ page, theme, sectionOrder }: PortalSectionProps) {
  if (!isConversionEnabledForChannel(page.channelId)) return null
  const text = page.conversion?.riskReversal
  if (!text?.trim()) return null

  return (
    <PortalSection
      theme={theme}
      sectionOrder={sectionOrder}
      title="Risk reversal"
      titleVariant="eyebrow"
      className="portal-section-compact"
    >
      <p className="text-body-sm leading-relaxed w-full" style={{ color: theme.textMuted }}>
        {text}
      </p>
    </PortalSection>
  )
}
