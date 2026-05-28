'use client'

import type { ReactNode } from 'react'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
  sectionOrder: number
  title?: string
  subtitle?: string
  /** eyebrow = small caps label; tier = matches portal tier card titles */
  titleVariant?: 'default' | 'eyebrow' | 'tier'
  children: ReactNode
  className?: string
}

export default function PortalSection({
  theme,
  sectionOrder,
  title,
  subtitle,
  titleVariant = 'default',
  children,
  className = '',
}: Props) {
  const isCompact = className.includes('portal-section-compact')
  return (
    <section
      className={`${isCompact ? 'mb-6 sm:mb-8' : 'mb-8 sm:mb-10'} ${className}`.trim()}
      style={{ order: sectionOrder }}
    >
      {title ? (
        titleVariant === 'eyebrow' ? (
          <p
            className="portal-section-eyebrow"
            style={{ color: theme.textMuted }}
          >
            {title}
          </p>
        ) : titleVariant === 'tier' ? (
          <h3
            className="portal-tier-title text-h4 leading-snug mb-3 w-full"
            style={{ color: theme.text, fontFamily: theme.fontFamily }}
          >
            {title}
          </h3>
        ) : (
          <h3
            className="text-h4 sm:text-h3 mb-2"
            style={{ color: theme.text, fontFamily: theme.fontFamily }}
          >
            {title}
          </h3>
        )
      ) : null}
      {subtitle ? (
        <p className="text-body-sm mb-4 max-w-3xl" style={{ color: theme.textMuted }}>
          {subtitle}
        </p>
      ) : null}
      {children}
    </section>
  )
}
