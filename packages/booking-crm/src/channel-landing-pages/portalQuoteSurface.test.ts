import { describe, expect, it } from 'vitest'
import { getPlatformPortalTheme } from './platformThemes'
import { applyPortalColorMode } from './platformThemeModes'
import { resolvePortalQuoteSurface } from './portalQuoteSurface'

describe('resolvePortalQuoteSurface', () => {
  it('replaces light quote tint with card surface on dark telegram theme', () => {
    const light = getPlatformPortalTheme('telegram')
    const dark = { ...light, ...applyPortalColorMode(light, 'dark') }
    const leaked = { ...dark, quoteBg: light.quoteBg }

    const quote = resolvePortalQuoteSurface(leaked)
    expect(quote.backgroundColor).toBe('#17212B')
    expect(quote.textColor).toMatch(/^#(?:F|f)/)
  })
})
