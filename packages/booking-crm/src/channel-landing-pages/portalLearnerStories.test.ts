import { describe, expect, it } from 'vitest'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { getPortalLearnerStories } from './portalLearnerStories'

describe('portalLearnerStories', () => {
  it('returns two learner stories per implementation-scope channel', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      const stories = getPortalLearnerStories(channelId)
      expect(stories, channelId).toHaveLength(2)
      for (const story of stories) {
        expect(story.quote.length, channelId).toBeGreaterThan(20)
        expect(story.name.length, channelId).toBeGreaterThan(0)
        expect(story.avatarUrl, channelId).toMatch(/^\/portal\/learners\//)
      }
    }
  })
})
