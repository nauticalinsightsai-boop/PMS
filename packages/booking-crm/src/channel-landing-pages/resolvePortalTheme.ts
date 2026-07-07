import type { PlatformPortalTheme } from './platformThemes'
import { getPlatformPortalTheme } from './platformThemes'
import {
  type PortalColorMode,
  applyPortalColorMode,
} from './platformThemeModes'
import {
  effectiveTintedSurfaceHex,
  isLightHexColor,
  meetsContrast,
  pickButtonForeground,
  pickReadableForeground,
} from './contrastUtils'
import { resolvePortalQuoteSurface } from './portalQuoteSurface'

/** Replace light-mode tints and mismatched surfaces (dark pages with light cards). */
function harmonizePortalThemeContrast(
  theme: PlatformPortalTheme,
  mode: PortalColorMode
): PlatformPortalTheme {
  const pageBg = solidHex(theme.background, mode === 'dark' ? '#0A0A0B' : '#FFFFFF')
  const next = { ...theme }

  if (!isLightHexColor(pageBg)) {
    const card = solidHex(next.cardBg, next.surface)
    if (isLightHexColor(card)) {
      next.cardBg = solidHex(next.surface, '#181818')
    }
    if (isLightHexColor(solidHex(next.surface, next.cardBg))) {
      next.surface = next.cardBg
    }
    const muted = solidHex(next.surfaceMuted, next.surface)
    if (isLightHexColor(muted)) {
      next.surfaceMuted = next.cardBg
    }
  }

  if (mode === 'dark' && isLightHexColor(solidHex(next.priceBadgeBg, pageBg))) {
    next.priceBadgeBg = next.surfaceMuted
  }

  const quoteSurface = resolvePortalQuoteSurface(next)
  next.quoteBg = quoteSurface.backgroundColor
  next.quoteBorder = quoteSurface.borderColor

  const linkHex = solidHex(next.linkColor, next.primary)
  if (!isLightHexColor(pageBg) && !meetsContrast(linkHex, pageBg, 3)) {
    next.linkColor = next.text
  }

  const quoteBgHex = solidHex(next.quoteBg, next.surface)
  const quoteBorderHex = solidHex(next.quoteBorder, next.primary)
  if (!meetsContrast(quoteBorderHex, quoteBgHex, 2.5)) {
    next.quoteBorder = next.textMuted
  }

  return next
}

function solidHex(color: unknown, fallback: string): string {
  return typeof color === 'string' && color.startsWith('#') && color.length === 7 ? color : fallback
}

function isSolidHex(color: unknown): color is string {
  return typeof color === 'string' && color.startsWith('#') && color.length === 7
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
  const tint = typeof bg === 'string' ? bg : solidHex(theme.surfaceMuted, '#1F2937')
  const effectiveBg = effectiveTintedSurfaceHex(tint, theme.background, theme.cardBg)
  const token = theme[textKey]
  if (token && meetsContrast(token, effectiveBg, 4.5)) {
    return token
  }
  return pickReadableForeground(effectiveBg)
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

/** Visual palette aliases — webinar uses the website marketing shell. */
const PORTAL_THEME_CHANNEL_ALIASES: Record<string, string> = {
  webinar: 'website',
}

/** Labels and copy stay on the requested channel; only colors/layout tokens come from the alias. */
const PORTAL_THEME_IDENTITY_KEYS = [
  'channelId',
  'platformName',
  'iconName',
  'presenceTag',
  'schedulingTitle',
  'schedulingBody',
  'heroCardTitle',
  'heroCardBody',
  'scheduleTierCta',
] as const satisfies ReadonlyArray<keyof PlatformPortalTheme>

function resolveThemeChannelId(channelId: string): string {
  return PORTAL_THEME_CHANNEL_ALIASES[channelId] ?? channelId
}

function applyPortalChannelIdentity(
  palette: PlatformPortalTheme,
  channelId: string,
  typeLabel?: string
): PlatformPortalTheme {
  const paletteChannelId = resolveThemeChannelId(channelId)
  if (paletteChannelId === channelId) return palette
  const identity = getPlatformPortalTheme(channelId, typeLabel)
  const merged = { ...palette }
  for (const key of PORTAL_THEME_IDENTITY_KEYS) {
    merged[key] = identity[key]
  }
  return merged
}

/** Full resolved palette for light or dark: use everywhere instead of partial applyPortalColorMode. */
export function resolvePortalTheme(
  channelId: string,
  mode: PortalColorMode,
  typeLabel?: string
): PlatformPortalTheme {
  const themeChannelId = resolveThemeChannelId(channelId)
  const light = getPlatformPortalTheme(themeChannelId, typeLabel)
  const harmonized = harmonizePortalThemeContrast(light, mode)
  if (mode === 'light') {
    return applyPortalChannelIdentity(finalizeThemeTokens(harmonized), channelId, typeLabel)
  }
  const dark = applyPortalColorMode(light, 'dark')
  return applyPortalChannelIdentity(
    finalizeThemeTokens(harmonizePortalThemeContrast(dark, 'dark')),
    channelId,
    typeLabel
  )
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
    '--portal-accent': theme.accent,
    '--portal-link': theme.linkColor,
    '--portal-context': theme.contextColor,
    '--portal-verified': theme.verifiedColor,
    '--portal-recommended-bg':
      typeof theme.recommendedBg === 'string' ? theme.recommendedBg : theme.primary,
    '--portal-recommended-fg': theme.recommendedText ?? theme.primaryForeground,
    '--portal-quote-bg': theme.quoteBg,
    '--portal-quote-border': theme.quoteBorder,
    '--portal-radius': theme.radius,
    '--portal-radius-lg': theme.radiusLg,
    '--portal-font': theme.fontFamily,
    /* Keep shadcn typography utilities aligned with portal light/dark palette */
    '--foreground': theme.text,
    '--muted-foreground': theme.textMuted,
    '--card-foreground': theme.text,
    /* Popovers portaled outside .portal-root (e.g. roadmap dial select) */
    '--popover': theme.surface,
    '--popover-foreground': theme.text,
    '--accent': theme.surfaceMuted,
    '--accent-foreground': theme.text,
    '--border': theme.cardBorder,
  }
}