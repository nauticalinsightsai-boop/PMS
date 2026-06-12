import { describe, expect, it } from 'vitest'
import { getPlatformPortalTheme } from './platformThemes'
import { resolvePortalTheme } from './resolvePortalTheme'
import { resolvePortalStoryRingInnerStyle } from './portalStoryRing'

describe('resolvePortalStoryRingInnerStyle', () => {
  it('uses readable icon color on Threads dark (not black on #101010)', () => {
    const theme = resolvePortalTheme('threads', 'dark')
    const style = resolvePortalStoryRingInnerStyle(theme)
    expect(style.backgroundColor.toLowerCase()).toBe('#101010')
    expect(style.color.toLowerCase()).not.toBe('#000000')
    expect(style.color.toLowerCase()).toBe('#fafafa')
  })

  it('uses black icon on Threads light surface', () => {
    const theme = resolvePortalTheme('threads', 'light')
    const style = resolvePortalStoryRingInnerStyle(theme)
    expect(style.backgroundColor.toLowerCase()).toBe('#ffffff')
    expect(style.color.toLowerCase()).toBe('#000000')
  })

  it('uses link blue on X dark', () => {
    const theme = resolvePortalTheme('twitter', 'dark')
    const style = resolvePortalStoryRingInnerStyle(theme)
    expect(style.color.toLowerCase()).toBe('#1d9bf0')
  })
})
