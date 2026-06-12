import { describe, expect, it } from 'vitest'
import { effectiveTintedSurfaceHex, isLightPortalSurface, parseCssRgb } from './contrastUtils'

describe('contrastUtils', () => {
  it('parseCssRgb returns null for non-string input', () => {
    expect(parseCssRgb(undefined as unknown as string)).toBeNull()
    expect(parseCssRgb(null as unknown as string)).toBeNull()
  })

  it('effectiveTintedSurfaceHex handles hex page background without throwing', () => {
    const effective = effectiveTintedSurfaceHex(
      'rgba(255, 74, 56, 0.14)',
      '#0A0A0B',
      '#141416',
    )
    expect(effective).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('isLightPortalSurface detects light rgb tints on dark page backgrounds', () => {
    expect(isLightPortalSurface('rgb(230, 243, 250)', '#0E1621', '#17212B')).toBe(true)
    expect(isLightPortalSurface('#17212B', '#0E1621', '#17212B')).toBe(false)
  })
})