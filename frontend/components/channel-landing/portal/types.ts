import type { ChannelLandingPage } from '@/types/channelLandingPage'
import type { PlatformPortalTheme } from '@/lib/channel-landing-pages/platformThemes'
import type { PortalLayoutVariant } from '@/lib/channel-landing-pages/platformOfferPack'
import type { PortalColorMode } from '@/lib/channel-landing-pages/platformThemeModes'

export type PortalSectionProps = {
  page: ChannelLandingPage
  theme: PlatformPortalTheme
  sectionOrder: number
  channelId: string
  layoutVariant: PortalLayoutVariant
  /** Compact tier stack (TikTok, Instagram, Snapchat). */
  isImpulseFlow: boolean
  /** Identity header renders above context / target message. */
  isLeadHero?: boolean
  colorMode: PortalColorMode
  onSetColorMode?: (mode: PortalColorMode) => void
  /** Primary hero CTA — book free mentor intro or scroll to tiers. */
  onBookMentor?: () => void
  /** Sticky top bar (professional portals) — tighter spacing, no section margin. */
  topBar?: boolean
  /** Website + webinar only: marketing gradient, glass cards, footer site chips. */
  proPortalShell?: boolean
  /** Platform-native tier CTA label from channel copy pack. */
  scheduleCta?: string
}
