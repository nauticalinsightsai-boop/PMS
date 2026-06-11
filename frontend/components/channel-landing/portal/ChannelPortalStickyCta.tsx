'use client'

import Link from 'next/link'
import { CTAS } from '@/lib/brand-voice'
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
}

export default function ChannelPortalStickyCta({ theme }: Props) {
  const bg =
    typeof theme.recommendedBg === 'string' && !theme.recommendedBg.includes('gradient')
      ? theme.recommendedBg
      : theme.primary
  const fg = theme.recommendedText ?? pickReadableForeground(bg)

  return (
    <div
      className="portal-sticky-cta fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden border-t"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.cardBorder,
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <Link
        href="/"
        className="flex w-full items-center justify-center px-4 py-2.5 text-body-sm font-semibold hover:opacity-90 transition-opacity"
        style={{
          borderRadius: theme.radius,
          background: bg,
          color: fg,
        }}
      >
        {CTAS.portalVisitWebsite}
      </Link>
    </div>
  )
}
