import { describe, expect, it } from 'vitest'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { PORTAL_LEARNER_STORIES } from './portalLearnerStories'

describe('portalLearnerStories', () => {
  it('has exactly two stories per scope-41 channel', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      const stories = PORTAL_LEARNER_STORIES[channelId]
      expect(stories, channelId).toBeDefined()
      expect(stories).toHaveLength(2)
    }
    expect(Object.keys(PORTAL_LEARNER_STORIES).length).toBe(IMPLEMENTATION_SCOPE_41.length)
  })

  it('has 82 globally unique names and avatar URLs', () => {
    const names = new Set<string>()
    const avatars = new Set<string>()
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      for (const item of PORTAL_LEARNER_STORIES[channelId]!) {
        expect(item.name).toBeTruthy()
        expect(item.title).toBeTruthy()
        expect(item.avatarUrl).toMatch(/^\/portal\/learners\//)
        names.add(item.name)
        avatars.add(item.avatarUrl)
      }
    }
    expect(names.size).toBe(82)
    expect(avatars.size).toBe(82)
  })

  it('instagram and snapchat quotes avoid website attribution', () => {
    for (const channelId of ['instagram', 'snapchat'] as const) {
      const joined = PORTAL_LEARNER_STORIES[channelId]!
        .map((p) => p.quote)
        .join(' ')
        .toLowerCase()
      expect(joined).not.toMatch(/\bwebsite\b/)
      expect(joined).not.toMatch(/\bthe site\b/)
    }
  })

  it('beehiiv includes Rachel F. PgMP story', () => {
    const names = PORTAL_LEARNER_STORIES.beehiiv!.map((p) => p.name)
    expect(names).toContain('Rachel F.')
  })

  it('snapchat does not include Rachel F.', () => {
    const names = PORTAL_LEARNER_STORIES.snapchat!.map((p) => p.name)
    expect(names).not.toContain('Rachel F.')
  })
})
