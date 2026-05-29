import { describe, expect, it } from 'vitest'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import {
  buildGoPathForChannelId,
  getScope41PortalGoLinks,
  groupPortalGoLinksByCategory,
} from './portalGoLinks'

describe('portalGoLinks', () => {
  it('builds alias paths for public slug overrides', () => {
    expect(buildGoPathForChannelId('twitter')).toBe('/go/x')
    expect(buildGoPathForChannelId('notion-public')).toBe('/go/notion')
    expect(buildGoPathForChannelId('website')).toBe('/go/website')
  })

  it('returns one link per scope-41 channel', () => {
    const links = getScope41PortalGoLinks()
    expect(links).toHaveLength(IMPLEMENTATION_SCOPE_41.length)
    expect(new Set(links.map((l) => l.href)).size).toBe(links.length)
  })

  it('groups links by platform category without empty groups', () => {
    const groups = groupPortalGoLinksByCategory(getScope41PortalGoLinks())
    expect(groups.length).toBeGreaterThan(0)
    expect(groups.every((g) => g.links.length > 0)).toBe(true)
    const total = groups.reduce((n, g) => n + g.links.length, 0)
    expect(total).toBe(IMPLEMENTATION_SCOPE_41.length)
  })
})
