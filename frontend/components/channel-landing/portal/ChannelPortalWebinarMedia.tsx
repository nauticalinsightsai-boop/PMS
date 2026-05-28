'use client'

import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { toWebinarEmbedSrc } from '@/lib/channel-landing-pages/webinarVideoEmbed'

export default function ChannelPortalWebinarMedia({
  page,
  theme,
  sectionOrder,
}: PortalSectionProps) {
  const about = page.webinarAbout?.trim() || page.body?.trim()
  const embedSrc = page.webinarVideoUrl ? toWebinarEmbedSrc(page.webinarVideoUrl) : null

  if (!about && !embedSrc) return null

  return (
    <section
      className="portal-webinar-media mb-6 sm:mb-8 w-full"
      style={{ order: sectionOrder }}
      aria-labelledby="portal-webinar-heading"
    >
      <p
        id="portal-webinar-heading"
        className="portal-section-eyebrow text-meta font-semibold uppercase tracking-wider mb-3"
        style={{ color: theme.contextColor }}
      >
        About this webinar
      </p>
      {embedSrc ? (
        <div
          className="relative w-full overflow-hidden mb-5"
          style={{
            borderRadius: theme.radiusLg,
            border: `1px solid ${theme.cardBorder}`,
            aspectRatio: '16 / 9',
            backgroundColor: theme.surfaceMuted,
          }}
        >
          <iframe
            src={embedSrc}
            title="Webinar briefing video"
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
      {about ? (
        <div
          className="p-5 sm:p-6 w-full text-body-lg leading-relaxed whitespace-pre-wrap"
          style={{
            borderRadius: theme.radiusLg,
            backgroundColor: theme.surface,
            color: theme.text,
            borderLeft: `4px solid ${theme.primary}`,
          }}
        >
          {about}
        </div>
      ) : null}
    </section>
  )
}
