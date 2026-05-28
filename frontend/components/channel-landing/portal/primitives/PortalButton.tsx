'use client'

import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import { pickReadableForeground } from '@/lib/channel-landing-pages/contrastUtils'

type Variant = 'primary' | 'recommended' | 'ghost'

type Props = {
  theme: PlatformPortalTheme
  variant?: Variant
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
}

function bgForVariant(theme: PlatformPortalTheme, variant: Variant): string {
  if (variant === 'recommended') {
    const bg = theme.recommendedBg
    return typeof bg === 'string' && !bg.includes('gradient') ? bg : theme.primary
  }
  if (variant === 'ghost') return 'transparent'
  return theme.primary
}

export default function PortalButton({
  theme,
  variant = 'primary',
  children,
  onClick,
  className = '',
  type = 'button',
}: Props) {
  const bg = bgForVariant(theme, variant)
  const fg =
    variant === 'recommended'
      ? theme.recommendedText ?? pickReadableForeground(bg)
      : variant === 'ghost'
        ? theme.primary
        : theme.primaryForeground

  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2.5 text-body-sm font-semibold hover:opacity-90 transition-opacity ${className}`.trim()}
      style={{
        borderRadius: theme.radius,
        background: variant === 'ghost' ? 'transparent' : bg,
        color: fg,
        border: variant === 'ghost' ? `1px solid ${theme.cardBorder}` : 'none',
      }}
    >
      {children}
    </button>
  )
}
