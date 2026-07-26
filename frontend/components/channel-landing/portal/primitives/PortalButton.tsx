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
  disabled?: boolean
}

function bgForVariant(theme: PlatformPortalTheme, variant: Variant): string {
  if (variant === 'recommended') {
    return theme.recommendedBg
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
  disabled = false,
}: Props) {
  const bg = bgForVariant(theme, variant)
  const hasGradientBackground = bg.includes('gradient')
  const fg =
    variant === 'recommended'
      ? theme.recommendedText ??
        (hasGradientBackground ? theme.primaryForeground : pickReadableForeground(bg))
      : variant === 'ghost'
        ? theme.primary
        : theme.primaryForeground

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`min-h-12 px-4 py-2.5 text-body-sm font-semibold leading-snug hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 ${className}`.trim()}
      style={{
        borderRadius: theme.radius,
        background: variant === 'ghost' ? 'transparent' : bg,
        color: fg,
        border: variant === 'ghost' ? `1px solid ${theme.cardBorder}` : 'none',
        outlineColor: theme.primary,
      }}
    >
      {children}
    </button>
  )
}
