/** WCAG contrast helpers for portal theme tokens. */

const HEX_RE = /^#([0-9a-f]{6})$/i

export function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.trim().match(HEX_RE)
  if (!m) return null
  const h = m[1]
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  }
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/** Contrast ratio between two sRGB colors (1–21). */
export function contrastRatio(fgHex: string, bgHex: string): number {
  const fg = parseHexColor(fgHex)
  const bg = parseHexColor(bgHex)
  if (!fg || !bg) return 1
  const l1 = relativeLuminance(fg.r, fg.g, fg.b)
  const l2 = relativeLuminance(bg.r, bg.g, bg.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** WCAG AA normal text ≈ 4.5:1 */
export function meetsContrast(fgHex: string, bgHex: string, minRatio = 4.5): boolean {
  return contrastRatio(fgHex, bgHex) >= minRatio
}

const LIGHT_ON_DARK = '#F4F4F5'
const DARK_ON_LIGHT = '#0F172A'

function relativeLumaFromHex(hex: string): number | null {
  const rgb = parseHexColor(hex)
  if (!rgb) return null
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
}

/** True for #RRGGBB surfaces that read as light (e.g. leftover light-mode tints in dark theme). */
export function isLightHexColor(color: string): boolean {
  const luma = relativeLumaFromHex(color.trim())
  return luma != null && luma > 0.55
}

/** Buttons and badges: light text on saturated/dark brand colors (luma &lt; 0.58). */
export function pickButtonForeground(bgHex: string): string {
  const luma = relativeLumaFromHex(bgHex)
  if (luma == null) return DARK_ON_LIGHT
  return luma > 0.58 ? DARK_ON_LIGHT : LIGHT_ON_DARK
}

/** Body text on surfaces — prefers WCAG AA when both candidates work. */
export function pickReadableForeground(
  bgHex: string,
  options?: { light?: string; dark?: string; minRatio?: number }
): string {
  const light = options?.light ?? LIGHT_ON_DARK
  const dark = options?.dark ?? DARK_ON_LIGHT
  const min = options?.minRatio ?? 4.5
  const luma = relativeLumaFromHex(bgHex)
  if (luma == null) return dark
  const preferLight = luma < 0.55
  const preferred = preferLight ? light : dark
  const alternate = preferLight ? dark : light
  if (meetsContrast(preferred, bgHex, min)) return preferred
  if (meetsContrast(alternate, bgHex, min)) return alternate
  return contrastRatio(light, bgHex) >= contrastRatio(dark, bgHex) ? light : dark
}

/** Normalize primary/recommended button pair for a background hex. */
export function ensureButtonContrast(
  bgHex: string,
  fgHex: string
): { background: string; foreground: string } {
  if (meetsContrast(fgHex, bgHex, 4.5)) {
    return { background: bgHex, foreground: fgHex }
  }
  return { background: bgHex, foreground: pickReadableForeground(bgHex) }
}
