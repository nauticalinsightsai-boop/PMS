'use client'

import type { ReactNode } from 'react'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
  channelId?: string
  portalLayoutChrome?: boolean
  children: ReactNode
  className?: string
}

/** Theme-tinted card surface (replaces site GlassCard on portal layout chrome). */
export default function PortalCard({ theme, portalLayoutChrome, children, className = '' }: Props) {
  const usePortalSurface = Boolean(portalLayoutChrome)

  return (
    <div
      className={`p-4 sm:p-5 ${className}`.trim()}
      data-portal-glass={usePortalSurface ? 'true' : undefined}
      style={{
        borderRadius: theme.radiusLg,
        border: `1px solid ${theme.cardBorder}`,
        backgroundColor: theme.cardBg,
        color: theme.text,
        ...(usePortalSurface
          ? {
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }
          : {}),
      }}
    >
      {children}
    </div>
  )
}
