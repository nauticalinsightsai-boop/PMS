'use client'

import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

/** Slim trust row shown above session tiers. */
export default function ChannelPortalTrustLine({ page, theme, sectionOrder }: PortalSectionProps) {
  if (!isConversionEnabledForChannel(page.channelId)) return null

  const items = page.conversion?.paymentMicrocopy?.slice(0, 4) ?? []
  if (!items.length) return null

  return (
    <div
      className="portal-trust-line w-full mb-4 sm:mb-5"
      style={{ order: sectionOrder }}
      aria-label="Booking assurances"
    >
      <p
        className="text-[10px] sm:text-[11px] w-full text-center leading-snug font-normal normal-case tracking-normal flex flex-wrap justify-center gap-x-2 gap-y-1"
        style={{ color: theme.textMuted }}
      >
        {items.map((item, i) => (
          <span key={item} className="inline-flex items-center">
            {i > 0 ? <span className="mx-1 opacity-40" aria-hidden>·</span> : null}
            {item}
          </span>
        ))}
      </p>
    </div>
  )
}
