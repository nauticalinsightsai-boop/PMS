import { describe, expect, it } from 'vitest'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { resolvePortalTheme } from './resolvePortalTheme'
import { usesBluishScopedDarkBaseline } from './platformThemeModes'
import { getPlatformPortalTheme } from './platformThemes'

const BLUISH_DARK_BG = '#0B1018'

describe('platformThemeModes', () => {
  it('scope-41 slugs do not resolve to bluish scoped dark baseline', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      const dark = resolvePortalTheme(channelId, 'dark')
      const bg =
        dark.background.startsWith('#') && dark.background.length === 7
          ? dark.background
          : ''
      expect(bg, channelId).not.toBe(BLUISH_DARK_BG)
      expect(usesBluishScopedDarkBaseline(channelId, getPlatformPortalTheme(channelId))).toBe(
        false
      )
    }
  })

  it('instagram dark uses brand black background', () => {
    const dark = resolvePortalTheme('instagram', 'dark')
    expect(dark.background).toBe('#000000')
  })
})
