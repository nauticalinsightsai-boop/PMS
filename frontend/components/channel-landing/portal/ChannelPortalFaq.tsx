'use client'

import PortalFaqItem from '@/components/channel-landing/portal/primitives/PortalFaqItem'
import PortalSection from '@/components/channel-landing/portal/primitives/PortalSection'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

export default function ChannelPortalFaq({ page, theme, sectionOrder }: PortalSectionProps) {
  if (!isConversionEnabledForChannel(page.channelId)) return null
  const faq = page.conversion?.faq?.slice(0, 5)
  if (!faq?.length) return null

  return (
    <PortalSection
      theme={theme}
      sectionOrder={sectionOrder}
      title="Prep, pricing & booking"
      titleVariant="eyebrow"
      subtitle="Certification pathways, mentor calls, and membership — answered before you reserve."
      className="portal-section-compact"
    >
      <ul className="w-full">
        {faq.map((item) => (
          <li key={item.question}>
            <PortalFaqItem theme={theme} question={item.question} answer={item.answer} />
          </li>
        ))}
      </ul>
    </PortalSection>
  )
}
