'use client'

import GlassCard from '@/components/ui/cards/GlassCard'
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

const targetMessageClass = 'text-body-lg leading-relaxed'

export default function ChannelPortalContextSection({
  page,
  theme,
  sectionOrder,
  channelId,
  isImpulseFlow,
}: PortalSectionProps) {
  const isInstagram = channelId === 'instagram'
  const useSiteGlass = channelId === 'website'

  if (isImpulseFlow) {
    return (
      <section
        className="portal-context-impulse mb-6 sm:mb-8 text-left"
        style={{ order: sectionOrder }}
      >
        <ContextIntro page={page} theme={theme} />
        {page.targetMessage ? (
          <div
            className={`portal-target-hero p-5 sm:p-6 mb-4 w-full${isInstagram ? ' portal-target-instagram' : ''}`}
            style={{
              borderRadius: theme.radiusLg,
              backgroundColor: theme.surface,
              boxShadow: `0 8px 32px ${theme.primary}22`,
            }}
          >
            <p className={targetMessageClass} style={{ color: theme.text, fontFamily: theme.fontFamily }}>
              {page.targetMessage}
            </p>
          </div>
        ) : null}
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
    <section className="mb-8 sm:mb-10" style={{ order: sectionOrder }}>
      <ContextIntro page={page} theme={theme} />
      {page.targetMessage ? (
        useSiteGlass ? (
          <GlassCard
            elevation="raised"
            liquid
            hover={false}
            className="p-5 sm:p-6 mb-4 w-full portal-website-target-message"
            data-portal-glass="true"
          >
            <p className={targetMessageClass} style={{ color: theme.text, fontFamily: theme.fontFamily }}>
              {page.targetMessage}
            </p>
          </GlassCard>
        ) : (
          <div
            className="p-5 sm:p-6 mb-4 w-full border-l-4"
            style={{
              borderRadius: theme.radiusLg,
              borderLeftColor: theme.quoteBorder,
              backgroundColor: theme.quoteBg,
            }}
          >
            <p className={targetMessageClass} style={{ color: theme.text, fontFamily: theme.fontFamily }}>
              {page.targetMessage}
            </p>
          </div>
        )
      ) : null}
      {page.body ? (
        <p className="text-body whitespace-pre-wrap w-full" style={{ color: theme.textMuted }}>
          {page.body}
        </p>
      ) : null}
    </section>
  )
}
