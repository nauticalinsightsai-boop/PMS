'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { MEDIA_SOCIAL_GRID, getMediaSocialAriaLabel } from '@/constants/config'
import PortalLegalLinks from '@/components/legal/PortalLegalLinks'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'

type Props = {
  theme: PlatformPortalTheme
}

export default function ChannelPortalSocialFooter({ theme }: Props) {
  return (
    <footer
      className="mt-14 pt-8"
      style={{ borderTop: `1px solid ${theme.cardBorder}` }}
    >
      <p
        className="text-center text-meta mb-4"
        style={{ color: theme.textMuted }}
      >
        Sheikh M. Abdullah · via {theme.platformName}
      </p>
      <div className="portal-social-footer-links mb-4 flex w-full flex-nowrap items-center justify-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MEDIA_SOCIAL_GRID.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.ariaLabel ?? getMediaSocialAriaLabel(item.name)}
            className="shrink-0 whitespace-nowrap text-meta px-2.5 py-1.5 hover:opacity-80 transition-opacity"
            style={{
              borderRadius: theme.radius,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.linkColor,
            }}
          >
            {item.name}
          </a>
        ))}
      </div>
      <PortalLegalLinks linkColor={theme.linkColor} className="mb-4" />
      <p className="text-center flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-body-sm font-medium hover:opacity-80"
          style={{ color: theme.linkColor }}
        >
          Visit main website
          <ExternalLink size={14} aria-hidden />
        </Link>
      </p>
    </footer>
  )
}
