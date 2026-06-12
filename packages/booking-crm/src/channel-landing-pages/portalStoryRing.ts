import { meetsContrast, pickReadableForeground } from './contrastUtils'
import type { PlatformPortalTheme } from './platformThemes'

function solidHex(color: unknown, fallback: string): string {
  return typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color.trim()) ? color.trim() : fallback
}

/** Lucide icon + inner circle for bold / Instagram story rings (no custom PNG). */
export function resolvePortalStoryRingInnerStyle(
  theme: PlatformPortalTheme,
): { backgroundColor: string; color: string } {
  const backgroundColor = solidHex(theme.surface, '#FFFFFF')
  const candidates = [
    theme.linkColor,
    theme.contextColor,
    theme.verifiedColor,
    theme.accent,
    theme.text,
    theme.primary,
  ]
  for (const raw of candidates) {
    const color = solidHex(raw, '')
    if (color && meetsContrast(color, backgroundColor, 3)) {
      return { backgroundColor, color }
    }
  }
  return { backgroundColor, color: pickReadableForeground(backgroundColor) }
}
