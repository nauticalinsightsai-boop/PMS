'use client'

import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'

export default function ChannelPortalContextSection({
  page,
  theme,
  sectionOrder,
  isImpulseFlow,
}: PortalSectionProps) {
  const context = [page.body, page.targetMessage].filter(Boolean).join('\n\n')
  if (!context) return null

  if (isImpulseFlow) {
    return (
      <section
        className="portal-context-impulse mb-6 sm:mb-8 text-left"
        style={{ order: sectionOrder }}
      >
        <p
          className="text-body-sm whitespace-pre-wrap leading-relaxed w-full"
          style={{ color: theme.textMuted }}
        >
          {context}
        </p>
      </section>
    )
  }

  return (
    <section className={portalSpacing.section} style={{ order: sectionOrder }}>
      <p
        className="text-body-sm whitespace-pre-wrap leading-relaxed w-full"
        style={{ color: theme.textMuted }}
      >
        {context}
      </p>
    </section>
  )
}
