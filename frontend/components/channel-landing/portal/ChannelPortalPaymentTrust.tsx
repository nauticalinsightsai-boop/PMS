'use client'

import type { PortalSectionProps } from '@/components/channel-landing/portal/types'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

export default function ChannelPortalPaymentTrust({ page, theme, sectionOrder }: PortalSectionProps) {
  if (!isConversionEnabledForChannel(page.channelId)) return null
  const items = page.conversion?.paymentMicrocopy?.slice(0, 4)
  if (!items?.length) return null

  return (
    <p
      className="portal-booking-assurances text-[10px] sm:text-[11px] mb-6 max-w-3xl leading-snug font-normal normal-case tracking-normal opacity-90"
      style={{ order: sectionOrder, color: theme.textMuted }}
      aria-label="Booking assurances"
    >
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 ? <span className="mx-2 opacity-40" aria-hidden>·</span> : null}
          {item}
        </span>
      ))}
    </p>
  )
}
