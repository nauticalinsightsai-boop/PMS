import { describe, expect, it } from 'vitest'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { CHANNEL_CONVERSION_OVERRIDES, getChannelConversionOverride } from './portalChannelConversionOverrides'

describe('portalChannelConversionOverrides', () => {
  it('defines overrides for all 41 slugs', () => {
    expect(Object.keys(CHANNEL_CONVERSION_OVERRIDES)).toHaveLength(IMPLEMENTATION_SCOPE_41.length)
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      const o = getChannelConversionOverride(channelId)
      expect(o?.valueCards).toHaveLength(3)
      expect(o?.credibilityTabLabels.quotes.length).toBeGreaterThan(3)
    }
  })

  it('instagram uses platform-native credibility labels', () => {
    const o = getChannelConversionOverride('instagram')!
    expect(o.credibilityTabLabels.quotes).toBe('From the feed')
    expect(o.valueCards[0]!.title).toMatch(/Reels/i)
  })
})
