import {
  effectiveTintedSurfaceHex,
  isLightPortalSurface,
  meetsContrast,
  pickReadableForeground,
} from './contrastUtils'
import type { PlatformPortalTheme } from './platformThemes'

function solidHex(color: string, fallback: string): string {
  return color.startsWith('#') && color.length === 7 ? color : fallback
}

function quoteSurfaceHex(theme: PlatformPortalTheme, backgroundColor: string): string {
  if (backgroundColor.startsWith('#') && backgroundColor.length === 7) return backgroundColor
  if (backgroundColor.trim()) {
    return effectiveTintedSurfaceHex(backgroundColor, theme.background, theme.cardBg)
  }
  return solidHex(theme.cardBg, theme.surface)
}

/** Quote / testimonial blocks: dark-safe background + readable foreground pair. */
export function resolvePortalQuoteSurface(theme: PlatformPortalTheme) {
  let backgroundColor = theme.quoteBg
  const cardBg = solidHex(theme.cardBg, theme.surface)

  if (typeof backgroundColor === 'string' && isLightPortalSurface(backgroundColor, theme.background, theme.cardBg)) {
    backgroundColor = cardBg
  }

  const surfaceHex = quoteSurfaceHex(theme, backgroundColor)
  const textColor = pickReadableForeground(surfaceHex)
  const mutedTextColor = meetsContrast(theme.textMuted, surfaceHex, 4.5)
    ? theme.textMuted
    : pickReadableForeground(surfaceHex, { minRatio: 3 })

  return {
    backgroundColor,
    borderColor: theme.quoteBorder,
    textColor,
    mutedTextColor,
  }
}
