'use client'

import { MEDIA_SOCIAL_GRID, getMediaSocialAriaLabel } from '@/constants/config'
import PortalLegalLinks from '@/components/legal/PortalLegalLinks'
import { BRAND } from '@/lib/brand-voice'
import { portalSpacing } from '@/lib/channel-landing-pages/portalSpacing'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import type { MediaSocialGridItem } from '@/constants/socialProfiles'

type Props = {
  theme: PlatformPortalTheme
}

const linkClassName =
  'shrink-0 whitespace-nowrap px-2 py-1 hover:opacity-80 transition-opacity'

function PortalSocialLink({
  item,
  theme,
  tabIndex,
}: {
  item: MediaSocialGridItem
  theme: PlatformPortalTheme
  tabIndex?: number
}) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={item.ariaLabel ?? getMediaSocialAriaLabel(item.name)}
      tabIndex={tabIndex}
      className={linkClassName}
      style={{
        borderRadius: theme.radius,
        border: `1px solid ${theme.cardBorder}`,
        color: theme.linkColor,
      }}
    >
      {item.name}
    </a>
  )
}

function PortalSocialLinkGroup({
  items,
  theme,
  keyPrefix,
  ariaHidden,
}: {
  items: MediaSocialGridItem[]
  theme: PlatformPortalTheme
  keyPrefix: string
  ariaHidden?: boolean
}) {
  return (
    <span
      {...(ariaHidden ? { 'aria-hidden': true as const } : {})}
      className="flex shrink-0 flex-nowrap items-center gap-2"
    >
      {items.map((item) => (
        <PortalSocialLink
          key={`${keyPrefix}-${item.name}`}
          item={item}
          theme={theme}
          tabIndex={ariaHidden ? -1 : undefined}
        />
      ))}
    </span>
  )
}

export default function ChannelPortalSocialFooter({ theme }: Props) {
  return (
    <footer
      className={`${portalSpacing.footer} ${portalSpacing.footerCompact}`}
      style={{ borderTop: `1px solid ${theme.cardBorder}` }}
    >
      <p
        className={`text-center ${portalSpacing.footerBlock}`}
        style={{ color: theme.textMuted }}
      >
        {BRAND.name} · via {theme.platformName}
      </p>

      {/* Mobile: infinite left-to-right marquee */}
      <div
        className={`portal-social-marquee-shell portal-social-footer-links ${portalSpacing.footerBlock} pb-0.5 sm:hidden`}
      >
        <div className="portal-social-marquee-track items-center gap-2">
          <PortalSocialLinkGroup items={MEDIA_SOCIAL_GRID} theme={theme} keyPrefix="primary" />
          <PortalSocialLinkGroup
            items={MEDIA_SOCIAL_GRID}
            theme={theme}
            keyPrefix="duplicate"
            ariaHidden
          />
        </div>
      </div>

      {/* sm+: static centered row */}
      <div
        className={`portal-social-footer-links ${portalSpacing.footerBlock} hidden w-full flex-nowrap items-center justify-center gap-2 sm:flex`}
      >
        {MEDIA_SOCIAL_GRID.map((item) => (
          <PortalSocialLink key={item.name} item={item} theme={theme} />
        ))}
      </div>

      <PortalLegalLinks linkColor={theme.linkColor} />
    </footer>
  )
}
