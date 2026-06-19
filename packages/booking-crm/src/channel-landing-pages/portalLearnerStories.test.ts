import { describe, expect, it } from 'vitest'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { getPortalLearnerStories } from './portalLearnerStories'

describe('portalLearnerStories', () => {
  it('returns no public stories until owner-approved permission exists', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      expect(getPortalLearnerStories(channelId), channelId).toEqual([])
    }
  })
})
