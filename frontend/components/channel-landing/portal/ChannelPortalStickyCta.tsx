'use client'

import PortalButton from '@/components/channel-landing/portal/primitives/PortalButton'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import { isConversionEnabledForChannel } from '@/lib/channel-landing-pages/portalConversionPacks'

type Props = {
  channelId: string
  theme: PlatformPortalTheme
  label: string
  onClick: () => void
}

export default function ChannelPortalStickyCta({ channelId, theme, label, onClick }: Props) {
  if (!isConversionEnabledForChannel(channelId)) return null

  return (
    <div
      className="portal-sticky-cta fixed bottom-0 left-0 right-0 z-40 p-3 sm:hidden border-t"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.cardBorder,
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
      }}
    >
      <PortalButton theme={theme} variant="recommended" className="w-full" onClick={onClick}>
        {label}
      </PortalButton>
    </div>
  )
}
