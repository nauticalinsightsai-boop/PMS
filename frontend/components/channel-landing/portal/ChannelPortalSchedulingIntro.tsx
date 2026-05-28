'use client'

import type { PortalSectionProps } from '@/components/channel-landing/portal/types'

export default function ChannelPortalSchedulingIntro({ theme, sectionOrder }: PortalSectionProps) {
  return (
    <section className="text-left mb-8" style={{ order: sectionOrder }}>
      <h3
        className="text-meta font-mono uppercase tracking-[0.2em] mb-2"
        style={{ color: theme.textMuted }}
      >
        {theme.schedulingTitle}
      </h3>
      <p className="text-body-sm max-w-3xl" style={{ color: theme.textMuted }}>
        {theme.schedulingBody}
      </p>
    </section>
  )
}
