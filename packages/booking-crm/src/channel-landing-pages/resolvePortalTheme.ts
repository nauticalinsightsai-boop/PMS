import type { PlatformPortalTheme } from './platformThemes'
import { getPlatformPortalTheme } from './platformThemes'
import {
  type PortalColorMode,
  applyPortalColorMode,
} from './platformThemeModes'
import {
  isLightHexColor,
  meetsContrast,
  pickButtonForeground,
  pickReadableForeground,
} from './contrastUtils'

function isDarkHex(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luma < 0.45
}

function deriveDarkFromLight(light: PlatformPortalTheme): Partial<PlatformPortalTheme> {
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

  return {
    background: isDarkHex(light.background) ? light.background : '#0A0A0B',
    surface: isDarkHex(light.surface) ? light.surface : '#141416',
    surfaceMuted: isDarkHex(light.surfaceMuted) ? light.surfaceMuted : '#1C1C1F',
    text: '#F4F4F5',
    textMuted: '#A1A1AA',
    cardBg: isDarkHex(light.cardBg) ? light.cardBg : '#18181B',
    cardBorder: '#27272A',
    quoteBg: '#18181B',
    heroBg,
    heroText,
    primaryForeground: primaryFg,
    accentForeground: pickReadableForeground(light.accent),
    recommendedBg,
    recommendedText,
    freeBadgeBg: '#14291F',
    freeBadgeText: '#4ADE80',
    priceBadgeBg: '#27272A',
    linkColor: '#F4F4F5',
  }
}

/** Replace light-mode tints that survive partial dark overrides (e.g. Medium price pills). */
function harmonizeDarkPortalTheme(theme: PlatformPortalTheme): PlatformPortalTheme {
  const pageBg = solidHex(theme.background, '#0A0A0B')
  const next = { ...theme }

  if (isLightHexColor(solidHex(next.priceBadgeBg, pageBg))) {
    next.priceBadgeBg = next.surfaceMuted
  }
  if (isLightHexColor(solidHex(next.quoteBg, pageBg))) {
    next.quoteBg = solidHex(next.cardBg, next.surface)
  }

  const linkHex = solidHex(next.linkColor, next.primary)
  if (!meetsContrast(linkHex, pageBg, 3)) {
    next.linkColor = next.text
  }

  const quoteBgHex = solidHex(next.quoteBg, next.surface)
  const quoteBorderHex = solidHex(next.quoteBorder, next.primary)
  if (!meetsContrast(quoteBorderHex, quoteBgHex, 2.5)) {
    next.quoteBorder = next.textMuted
  }

  return next
}

function solidHex(color: string, fallback: string): string {
  return color.startsWith('#') && color.length === 7 ? color : fallback
}

function finalizeThemeTokens(theme: PlatformPortalTheme): PlatformPortalTheme {
  const primaryBg = solidHex(theme.primary, '#0A66C2')
  const recBg = solidHex(
    typeof theme.recommendedBg === 'string' ? theme.recommendedBg : primaryBg,
    primaryBg
  )
  const heroBg = solidHex(
    typeof theme.heroBg === 'string' ? theme.heroBg : recBg,
    recBg
  )

  return {
    ...theme,
    primaryForeground: pickButtonForeground(primaryBg),
    accentForeground: pickButtonForeground(solidHex(theme.accent, primaryBg)),
    recommendedText: pickButtonForeground(recBg),
    heroText: pickButtonForeground(heroBg),
    freeBadgeText: pickReadableForeground(solidHex(theme.freeBadgeBg, theme.surface)),
    priceBadgeText: pickReadableForeground(solidHex(theme.priceBadgeBg, theme.surface)),
  }
}

/** Full resolved palette for light or dark — use everywhere instead of partial applyPortalColorMode. */
export function resolvePortalTheme(
  channelId: string,
  mode: PortalColorMode,
  typeLabel?: string
): PlatformPortalTheme {
  const light = getPlatformPortalTheme(channelId, typeLabel)
  if (mode === 'light') {
    return finalizeThemeTokens(light)
  }
  const dark = applyPortalColorMode(light, 'dark')
  return finalizeThemeTokens(harmonizeDarkPortalTheme(dark))
}

/** CSS custom properties for .portal-root */
export function portalThemeToCssVars(theme: PlatformPortalTheme): Record<string, string> {
  return {
    '--portal-bg': theme.background,
    '--portal-text': theme.text,
    '--portal-text-muted': theme.textMuted,
    '--portal-surface': theme.surface,
    '--portal-surface-muted': theme.surfaceMuted,
    '--portal-card-bg': theme.cardBg,
    '--portal-card-border': theme.cardBorder,
    '--portal-primary': theme.primary,
    '--portal-primary-fg': theme.primaryForeground,
    '--portal-recommended-bg':
      typeof theme.recommendedBg === 'string' ? theme.recommendedBg : theme.primary,
    '--portal-recommended-fg': theme.recommendedText ?? theme.primaryForeground,
    '--portal-quote-bg': theme.quoteBg,
    '--portal-quote-border': theme.quoteBorder,
  }
}
