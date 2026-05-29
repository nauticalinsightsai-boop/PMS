import type { PlatformPortalTheme } from './platformThemes'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'

export type CornerStyle = 'sharp' | 'medium' | 'soft' | 'pill'
export type TypographyClass = 'system' | 'serif-editorial' | 'mono-accent' | 'brand-sans'
export type CardStyle = 'flat' | 'elevated' | 'glass-tinted'
export type HeroTreatment = 'gradient' | 'solid' | 'dark-block'

export type PlatformDesignLanguage = {
  cornerStyle: CornerStyle
  typographyClass: TypographyClass
  cardStyle: CardStyle
  heroTreatment: HeroTreatment
}

const RADIUS_BY_CORNER: Record<CornerStyle, { radius: string; radiusLg: string }> = {
  sharp: { radius: '0.25rem', radiusLg: '0.5rem' },
  medium: { radius: '0.75rem', radiusLg: '1rem' },
  soft: { radius: '1rem', radiusLg: '1.25rem' },
  pill: { radius: '1.5rem', radiusLg: '2rem' },
}

export const PLATFORM_DESIGN_LANGUAGE: Record<string, PlatformDesignLanguage> = {
  website: { cornerStyle: 'soft', typographyClass: 'brand-sans', cardStyle: 'glass-tinted', heroTreatment: 'gradient' },
  webinar: { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'glass-tinted', heroTreatment: 'dark-block' },
  medium: { cornerStyle: 'sharp', typographyClass: 'serif-editorial', cardStyle: 'flat', heroTreatment: 'dark-block' },
  substack: { cornerStyle: 'sharp', typographyClass: 'brand-sans', cardStyle: 'flat', heroTreatment: 'solid' },
  beehiiv: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'gradient' },
  ghost: { cornerStyle: 'sharp', typographyClass: 'brand-sans', cardStyle: 'flat', heroTreatment: 'dark-block' },
  hashnode: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'solid' },
  'notion-public': { cornerStyle: 'sharp', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'dark-block' },
  linkedin: { cornerStyle: 'sharp', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'solid' },
  twitter: { cornerStyle: 'soft', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'dark-block' },
  instagram: { cornerStyle: 'soft', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'gradient' },
  facebook: { cornerStyle: 'sharp', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'solid' },
  reddit: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'flat', heroTreatment: 'solid' },
  threads: { cornerStyle: 'soft', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'dark-block' },
  quora: { cornerStyle: 'sharp', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'solid' },
  bluesky: { cornerStyle: 'soft', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'solid' },
  mastodon: { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'solid' },
  pinterest: { cornerStyle: 'soft', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'solid' },
  vk: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'solid' },
  youtube: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'dark-block' },
  tiktok: { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'gradient' },
  snapchat: { cornerStyle: 'pill', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'solid' },
  vimeo: { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'solid' },
  spotify: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'solid' },
  'apple-podcasts': { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'solid' },
  'amazon-audible': { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'solid' },
  podbean: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'flat', heroTreatment: 'solid' },
  soundcloud: { cornerStyle: 'sharp', typographyClass: 'brand-sans', cardStyle: 'flat', heroTreatment: 'solid' },
  email: { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'solid' },
  whatsapp: { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'solid' },
  telegram: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'solid' },
  discord: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'solid' },
  slack: { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'elevated', heroTreatment: 'solid' },
  'google-search': { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'flat', heroTreatment: 'solid' },
  'youtube-search': { cornerStyle: 'medium', typographyClass: 'brand-sans', cardStyle: 'flat', heroTreatment: 'dark-block' },
  'podcast-directories': { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'solid' },
  'bing-search': { cornerStyle: 'sharp', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'solid' },
  'ai-visibility': { cornerStyle: 'soft', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'gradient' },
  'rss-feeds': { cornerStyle: 'sharp', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'solid' },
  'content-aggregators': { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'flat', heroTreatment: 'solid' },
  'api-ai-fed': { cornerStyle: 'medium', typographyClass: 'system', cardStyle: 'elevated', heroTreatment: 'solid' },
}

export function getPlatformDesignLanguage(channelId: string): PlatformDesignLanguage {
  return (
    PLATFORM_DESIGN_LANGUAGE[channelId] ?? {
      cornerStyle: 'medium',
      typographyClass: 'system',
      cardStyle: 'glass-tinted',
      heroTreatment: 'solid',
    }
  )
}

export function cornerStyleFromRadius(radius: string): CornerStyle {
  const rem = parseFloat(radius)
  if (Number.isNaN(rem)) return 'medium'
  if (rem >= 1.25) return 'pill'
  if (rem >= 0.875) return 'soft'
  if (rem <= 0.35) return 'sharp'
  return 'medium'
}

/** Fill default radius from design language when buildBaseTheme defaults remain. */
export function applyPlatformDesignLanguage(
  channelId: string,
  theme: PlatformPortalTheme
): PlatformPortalTheme {
  if (!IMPLEMENTATION_SCOPE_41.includes(channelId)) return theme
  const isDefaultRadius = theme.radius === '0.75rem' && theme.radiusLg === '1rem'
  if (!isDefaultRadius) return theme
  const lang = getPlatformDesignLanguage(channelId)
  const radii = RADIUS_BY_CORNER[lang.cornerStyle]
  return { ...theme, radius: radii.radius, radiusLg: radii.radiusLg }
}
