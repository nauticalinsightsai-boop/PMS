'use client'

import type { ReactNode } from 'react'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import GlassCard from '@/components/ui/cards/GlassCard'

type Props = {
  theme: PlatformPortalTheme
  channelId?: string
  portalLayoutChrome?: boolean
  children: ReactNode
  className?: string
}

export default function PortalCard({ theme, portalLayoutChrome, children, className = '' }: Props) {
  const useSiteGlass = Boolean(portalLayoutChrome)

  if (useSiteGlass) {
    return (
      <GlassCard
        elevation="surface"
        liquid
        liquidIntensity={0.85}
        hover={false}
        className={`p-4 sm:p-5 ${className}`.trim()}
        data-portal-glass="true"
      >
        {children}
      </GlassCard>
    )
  }

  return (
    <div
      className={`p-4 sm:p-5 ${className}`.trim()}
      style={{
        borderRadius: theme.radiusLg,
        border: `1px solid ${theme.cardBorder}`,
        backgroundColor: theme.cardBg,
        color: theme.text,
      }}
    >
      {children}
    </div>
  )
}
