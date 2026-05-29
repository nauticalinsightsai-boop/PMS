import type { PlatformPortalTheme } from './platformThemes'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { deriveDarkFromLight } from './platformThemeDerive'
import { PLATFORM_DARK_SCOPE_EXTENDED } from './platformScopePalettes'

export type PortalColorMode = 'dark' | 'light'

export function portalThemeStorageKey(channelId: string): string {
  return `portal-color-mode:${channelId}`
}

export const DEFAULT_PORTAL_COLOR_MODE: PortalColorMode = 'dark'

/** Per-platform dark palettes (brand-accurate, not generic gray). */
export const PLATFORM_DARK_OVERRIDES: Record<string, Partial<PlatformPortalTheme>> = {
  bluesky: {
    background: '#0B1A2E',
    surface: '#122640',
    surfaceMuted: '#1A3352',
    text: '#E8F4FF',
    textMuted: '#8BB8E8',
    cardBg: '#152A45',
    cardBorder: '#2A4A6E',
    quoteBg: '#152A45',
    freeBadgeBg: '#0F2D1F',
    freeBadgeText: '#6EE7A0',
  },
  facebook: {
    background: '#18191A',
    surface: '#242526',
    surfaceMuted: '#3A3B3C',
    text: '#E4E6EB',
    textMuted: '#B0B3B8',
    cardBg: '#242526',
    cardBorder: '#3E4042',
    quoteBg: '#1C2E4A',
  },
  instagram: {
    background: '#000000',
    surface: '#121212',
    surfaceMuted: '#1C1C1C',
    text: '#FAFAFA',
    textMuted: '#A8A8A8',
    cardBg: '#1A1A1A',
    cardBorder: '#363636',
    quoteBg: '#1A1A1A',
    quoteBorder: '#C13584',
    freeBadgeBg: '#1A2E1F',
    freeBadgeText: '#4ADE80',
    priceBadgeBg: '#2A1520',
    priceBadgeText: '#F472B6',
  },
  snapchat: {
    background: '#000000',
    surface: '#111111',
    surfaceMuted: '#1A1A1A',
    text: '#FFFFFF',
    textMuted: '#B8B8B8',
    primary: '#FFFC00',
    primaryForeground: '#000000',
    accent: '#FFFC00',
    accentForeground: '#000000',
    cardBg: '#1A1A1A',
    cardBorder: '#333333',
    quoteBg: '#1A1A1A',
    quoteBorder: '#FFFC00',
    linkColor: '#FFFC00',
    recommendedBg: '#FFFC00',
    recommendedText: '#000000',
    freeBadgeBg: '#2A2800',
    freeBadgeText: '#FFFC00',
    statusDot: '#FFFC00',
    heroBg: '#FFFC00',
    heroText: '#000000',
  },
  website: {
    background: '#07071c',
    surface: 'rgba(15, 14, 56, 0.82)',
    surfaceMuted: '#262a33',
    text: '#f7f7fa',
    textMuted: '#94a3b8',
    cardBg: 'rgba(15, 14, 56, 0.72)',
    cardBorder: 'rgba(38, 42, 51, 0.85)',
    quoteBg: 'rgba(15, 14, 56, 0.68)',
    quoteBorder: '#ff4a38',
    heroBg: '#ff4a38',
    heroText: '#ffffff',
    primary: '#ff4a38',
    accent: '#bc6ae2',
    primaryForeground: '#ffffff',
    accentForeground: '#ffffff',
    contextColor: '#ff884a',
    linkColor: '#ff884a',
    recommendedBg: '#ff4a38',
    recommendedText: '#ffffff',
    verifiedColor: '#ff4a38',
    freeBadgeBg: 'rgba(255, 74, 56, 0.14)',
    freeBadgeText: '#ff884a',
    priceBadgeBg: 'rgba(40, 81, 185, 0.22)',
    priceBadgeText: '#f7f7fa',
  },
  beehiiv: {
    background: '#070B16',
    surface: '#0D1430',
    surfaceMuted: '#162246',
    text: '#EEF3FF',
    textMuted: '#A9BCE4',
    contextColor: '#6AAEFF',
    cardBg: 'rgba(13, 20, 48, 0.86)',
    cardBorder: 'rgba(89, 130, 247, 0.38)',
    quoteBg: 'rgba(16, 26, 58, 0.9)',
    quoteBorder: '#2F6BFF',
    heroBg: 'linear-gradient(135deg, #13224A 0%, #1D3C7F 55%, #2F6BFF 100%)',
    heroText: '#FFFFFF',
    primary: '#2F6BFF',
    accent: '#2F6BFF',
    primaryForeground: '#FFFFFF',
    accentForeground: '#FFFFFF',
    linkColor: '#8EC5FF',
    recommendedBg: '#2F6BFF',
    recommendedText: '#FFFFFF',
    freeBadgeBg: 'rgba(20, 47, 37, 0.9)',
    freeBadgeText: '#86EFAC',
    priceBadgeBg: 'rgba(36, 51, 93, 0.95)',
    priceBadgeText: '#E8EEFF',
    verifiedColor: '#7CC8FF',
    statusDot: '#5EEAD4',
  },
  linkedin: {
    background: '#1B1F23',
    surface: '#283037',
    surfaceMuted: '#38434F',
    text: '#FFFFFF',
    textMuted: '#C4C7CC',
    cardBg: '#283037',
    cardBorder: '#48566A',
    quoteBg: '#1E3A52',
    primary: '#0A66C2',
    primaryForeground: '#FFFFFF',
    recommendedBg: '#0A66C2',
    recommendedText: '#FFFFFF',
    heroBg: '#0A66C2',
    heroText: '#FFFFFF',
  },
  twitter: {
    background: '#000000',
    surface: '#16181C',
    surfaceMuted: '#1E2732',
    text: '#E7E9EA',
    textMuted: '#71767B',
    cardBg: '#16181C',
    cardBorder: '#2F3336',
    quoteBg: '#16181C',
  },
  webinar: {
    background: '#0A0A0A',
    surface: '#141414',
    surfaceMuted: '#1F1F1F',
    text: '#FAFAFA',
    textMuted: '#A3A3A3',
    contextColor: '#FAFAFA',
    cardBg: '#141414',
    cardBorder: '#2E2E2E',
    quoteBg: '#1A1A1A',
    quoteBorder: '#404040',
    heroBg: '#000000',
    heroText: '#FFFFFF',
    primary: '#FFFFFF',
    accent: '#E5E5E5',
    primaryForeground: '#0A0A0A',
    accentForeground: '#0A0A0A',
    linkColor: '#FAFAFA',
    recommendedBg: '#FFFFFF',
    recommendedText: '#0A0A0A',
    freeBadgeBg: '#1F1F1F',
    freeBadgeText: '#FAFAFA',
    priceBadgeBg: '#2E2E2E',
    priceBadgeText: '#FAFAFA',
    verifiedColor: '#FAFAFA',
    statusDot: '#22C55E',
  },
  youtube: {
    background: '#0F0F0F',
    surface: '#212121',
    surfaceMuted: '#303030',
    text: '#F1F1F1',
    textMuted: '#AAAAAA',
    cardBg: '#212121',
    cardBorder: '#3F3F3F',
    quoteBg: '#212121',
  },
  tiktok: {
    background: '#000000',
    surface: '#121212',
    surfaceMuted: '#1F1F1F',
    text: '#FFFFFF',
    textMuted: '#A1A1A1',
    cardBg: '#1A1A1A',
    cardBorder: '#333333',
    quoteBg: '#1F1F1F',
  },
  medium: {
    background: '#121212',
    surface: '#1A1A1A',
    surfaceMuted: '#242424',
    text: '#F2F2F2',
    textMuted: '#9E9E9E',
    cardBg: '#1A1A1A',
    cardBorder: '#333333',
    quoteBg: '#242424',
    quoteBorder: '#9E9E9E',
    priceBadgeBg: '#333333',
    priceBadgeText: '#F2F2F2',
    linkColor: '#F2F2F2',
  },
  reddit: {
    background: '#1A1A1B',
    surface: '#272729',
    surfaceMuted: '#343536',
    text: '#D7DADC',
    textMuted: '#818384',
    cardBg: '#272729',
    cardBorder: '#474748',
  },
  spotify: {
    background: '#000000',
    surface: '#121212',
    surfaceMuted: '#181818',
    text: '#FFFFFF',
    textMuted: '#B3B3B3',
    cardBg: '#181818',
    cardBorder: '#282828',
  },
  discord: {
    background: '#313338',
    surface: '#2B2D31',
    surfaceMuted: '#1E1F22',
    text: '#F2F3F5',
    textMuted: '#B5BAC1',
    cardBg: '#2B2D31',
    cardBorder: '#3F4147',
  },
  telegram: {
    background: '#0E1621',
    surface: '#17212B',
    surfaceMuted: '#242F3D',
    text: '#FFFFFF',
    textMuted: '#8BA3BE',
    cardBg: '#17212B',
    cardBorder: '#2B5278',
  },
  whatsapp: {
    background: '#0B141A',
    surface: '#111B21',
    surfaceMuted: '#1F2C34',
    text: '#E9EDEF',
    textMuted: '#8696A0',
    cardBg: '#1F2C34',
    cardBorder: '#2A3942',
    quoteBg: '#1F2C34',
    quoteBorder: '#25D366',
  },
}

const IMPLEMENTATION_SCOPE_41_SET = new Set(IMPLEMENTATION_SCOPE_41)

function genericDarkPalette(theme: PlatformPortalTheme): Partial<PlatformPortalTheme> {
  return {
    background: '#0A0A0B',
    surface: '#141416',
    surfaceMuted: '#1C1C1F',
    text: '#F4F4F5',
    textMuted: '#A1A1AA',
    cardBg: '#18181B',
    cardBorder: '#27272A',
    quoteBg: '#18181B',
    freeBadgeBg: '#14291F',
    freeBadgeText: '#4ADE80',
    priceBadgeBg: '#1F1520',
    priceBadgeText: theme.primary,
    primaryForeground: '#FFFFFF',
  }
}

/** @deprecated Use resolvePortalTheme(channelId, mode) for full palettes. */
export function applyPortalColorMode(
  theme: PlatformPortalTheme,
  mode: PortalColorMode
): PlatformPortalTheme {
  if (mode === 'light') return theme
  const darkPartial =
    PLATFORM_DARK_OVERRIDES[theme.channelId] ??
    PLATFORM_DARK_SCOPE_EXTENDED[theme.channelId] ??
    (IMPLEMENTATION_SCOPE_41_SET.has(theme.channelId)
      ? deriveDarkFromLight(theme)
      : genericDarkPalette(theme))
  return { ...theme, ...darkPartial }
}

/** True when dark mode would use the legacy bluish scoped baseline (must stay false for scope-41). */
export function usesBluishScopedDarkBaseline(channelId: string, light: PlatformPortalTheme): boolean {
  if (PLATFORM_DARK_OVERRIDES[channelId] || PLATFORM_DARK_SCOPE_EXTENDED[channelId]) return false
  if (!IMPLEMENTATION_SCOPE_41_SET.has(channelId)) return false
  const derived = deriveDarkFromLight(light)
  return derived.background === '#0B1018'
}
