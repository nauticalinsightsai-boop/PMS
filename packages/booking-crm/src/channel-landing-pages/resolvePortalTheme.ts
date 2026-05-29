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

function isSolidHex(color: string): boolean {
  return color.startsWith('#') && color.length === 7
}

function resolveBadgeText(
  theme: PlatformPortalTheme,
  bgKey: 'freeBadgeBg' | 'priceBadgeBg',
  textKey: 'freeBadgeText' | 'priceBadgeText'
): string {
  const bg = theme[bgKey]
  if (isSolidHex(bg)) {
    return pickReadableForeground(bg)
  }
  if (theme[textKey]) {
    return theme[textKey]
  }
  const underlay = solidHex(theme.cardBg, solidHex(theme.background, theme.surface))
  return pickReadableForeground(solidHex(underlay, '#0F172A'))
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
    freeBadgeText: resolveBadgeText(theme, 'freeBadgeBg', 'freeBadgeText'),
    priceBadgeText: resolveBadgeText(theme, 'priceBadgeBg', 'priceBadgeText'),
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
    '--portal-radius': theme.radius,
    '--portal-radius-lg': theme.radiusLg,
    '--portal-font': theme.fontFamily,
  }
}
