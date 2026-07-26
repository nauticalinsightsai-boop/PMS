'use client'

import { useEffect } from 'react'
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
}

export default function ChannelPortalStickyCta({ theme }: Props) {
  const bg = theme.recommendedBg
  const solidBg =
    typeof bg === 'string' && !bg.includes('gradient')
      ? bg
      : theme.primary
  const fg = theme.recommendedText ?? pickReadableForeground(solidBg)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const syncReservedSpace = () => {
      document.documentElement.style.setProperty(
        '--portal-sticky-cta-height',
        media.matches ? '4.5rem' : '0px',
      )
    }
    syncReservedSpace()
    media.addEventListener('change', syncReservedSpace)
    return () => {
      media.removeEventListener('change', syncReservedSpace)
      document.documentElement.style.setProperty('--portal-sticky-cta-height', '0px')
    }
  }, [])

  return (
    <div
      className="portal-sticky-cta fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden border-t"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.cardBorder,
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <a
        href="/"
        className="flex min-h-12 w-full items-center justify-center px-4 py-2.5 text-body-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          borderRadius: theme.radius,
          background: bg,
          color: fg,
        }}
      >
        Visit Website
      </a>
    </div>
  )
}
