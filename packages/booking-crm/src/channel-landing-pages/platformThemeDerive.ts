import type { PlatformPortalTheme } from './platformThemes'
import { pickReadableForeground } from './contrastUtils'

function isDarkHex(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luma < 0.45
}

/** Brand-aware dark palette derived from resolved light tokens (fallback when no explicit dark override). */
export function deriveDarkFromLight(light: PlatformPortalTheme): Partial<PlatformPortalTheme> {
  const primaryFg = pickReadableForeground(light.primary)
  const recommendedBg =
    typeof light.recommendedBg === 'string' && !light.recommendedBg.includes('gradient')
      ? light.recommendedBg
      : light.primary
  const recommendedText = pickReadableForeground(
    typeof recommendedBg === 'string' && !recommendedBg.includes('gradient')
      ? recommendedBg
      : light.primary
  )
  const heroBg =
    typeof light.heroBg === 'string' && !light.heroBg.includes('gradient')
      ? light.heroBg
      : light.primary
  const heroText = pickReadableForeground(
    typeof heroBg === 'string' && !heroBg.includes('gradient') ? heroBg : light.primary
  )

  const darkBg = isDarkHex(light.background)
    ? light.background
    : isDarkHex(light.surface)
      ? light.surface
      : '#0A0A0B'
  const darkSurface = isDarkHex(light.surface) ? light.surface : '#141416'
  const darkMuted = isDarkHex(light.surfaceMuted) ? light.surfaceMuted : '#1C1C1F'

  return {
    background: darkBg,
    surface: darkSurface,
    surfaceMuted: darkMuted,
    text: '#F4F4F5',
    textMuted: '#A1A1AA',
    cardBg: isDarkHex(light.cardBg) ? light.cardBg : '#18181B',
    cardBorder: '#27272A',
    quoteBg: isDarkHex(light.cardBg) ? light.cardBg : '#18181B',
    quoteBorder: light.primary,
    heroBg,
    heroText,
    primaryForeground: primaryFg,
    accentForeground: pickReadableForeground(light.accent),
    recommendedBg,
    recommendedText,
    freeBadgeBg: '#14291F',
    freeBadgeText: '#4ADE80',
    priceBadgeBg: darkMuted,
    priceBadgeText: '#F4F4F5',
    linkColor: light.linkColor && !isDarkHex(light.linkColor) ? light.linkColor : '#F4F4F5',
  }
}
