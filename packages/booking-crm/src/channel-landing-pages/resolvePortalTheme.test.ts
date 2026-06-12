import { describe, expect, it } from 'vitest'
import { contrastRatio } from './contrastUtils'
import { resolvePortalTheme } from './resolvePortalTheme'

describe('resolvePortalTheme spotify contrast', () => {
  it('light mode uses dark cards with readable text on page and tier surfaces', () => {
    const theme = resolvePortalTheme('spotify', 'light')
    expect(theme.cardBg).toBe('#181818')
    expect(theme.quoteBg).not.toMatch(/rgb\(232, 248, 238\)/i)

    const pageContrast = contrastRatio(theme.text, theme.background)
    const cardContrast = contrastRatio(theme.text, theme.cardBg)
    expect(pageContrast).toBeGreaterThanOrEqual(4.5)
    expect(cardContrast).toBeGreaterThanOrEqual(4.5)
  })

  it('dark mode keeps dark quote and card surfaces', () => {
    const theme = resolvePortalTheme('spotify', 'dark')
    expect(theme.cardBg).toBe('#181818')
    expect(theme.quoteBg).toBe('#181818')
    expect(contrastRatio(theme.text, theme.cardBg)).toBeGreaterThanOrEqual(4.5)
  })
})
