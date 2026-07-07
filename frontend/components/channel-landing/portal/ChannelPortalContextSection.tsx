'use client'

import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing'
import type { PortalSectionProps } from '@/components/channel-landing/portal/types'

function ContextIntro({
  page,
  theme,
}: {
  page: PortalSectionProps['page']
  theme: PortalSectionProps['theme']
}) {
  return (
    <>
      {page.subheadline ? (
        <p className="text-body mb-4 w-full" style={{ color: theme.textMuted }}>
          {page.subheadline}
        </p>
      ) : null}
    </>
  )
}

export default function ChannelPortalContextSection({
  page,
  theme,
  sectionOrder,
  isImpulseFlow,
}: PortalSectionProps) {
  if (isImpulseFlow) {
    return (
      <section
        className="portal-context-impulse mb-6 sm:mb-8 text-left"
        style={{ order: sectionOrder }}
      >
        <ContextIntro page={page} theme={theme} />
        {page.body ? (
          <p
            className="text-body-sm whitespace-pre-wrap leading-relaxed w-full"
            style={{ color: theme.textMuted }}
          >
            {page.body}
          </p>
        ) : null}
      </section>
    )
  }

  return (
    <section className={portalSpacing.section} style={{ order: sectionOrder }}>
      <ContextIntro page={page} theme={theme} />
      {page.body ? (
        <p className="text-body whitespace-pre-wrap w-full" style={{ color: theme.textMuted }}>
          {page.body}
        </p>
      ) : null}
    </section>
  )
}
