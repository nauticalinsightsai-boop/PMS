import { describe, expect, it } from 'vitest'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import {
  PRO_CONSULTATION_PORTAL_CHANNELS,
  PROFESSIONAL_FLOW,
  getPlatformOfferPack,
  usesPortalWebsiteLayoutChrome,
  usesProConsultationPortalLayout,
} from './platformOfferPack'

describe('usesPortalWebsiteLayoutChrome', () => {
  it('returns true for all 41 implementation-scope slugs', () => {
    for (const id of IMPLEMENTATION_SCOPE_41) {
      expect(usesPortalWebsiteLayoutChrome(id), id).toBe(true)
    }
  })

  it('returns false outside scope-41', () => {
    expect(usesPortalWebsiteLayoutChrome('google-podcasts')).toBe(false)
  })
})

describe('usesProConsultationPortalLayout', () => {
  it('returns true only for website and webinar (marketing gradient)', () => {
    expect(PRO_CONSULTATION_PORTAL_CHANNELS).toEqual(new Set(['website', 'webinar']))
    expect(usesProConsultationPortalLayout('website')).toBe(true)
    expect(usesProConsultationPortalLayout('webinar')).toBe(true)
  })

  it('returns false for platform slugs while layout chrome stays on', () => {
    for (const id of ['snapchat', 'instagram', 'linkedin', 'medium', 'spotify', 'vk']) {
      expect(usesProConsultationPortalLayout(id), id).toBe(false)
      expect(usesPortalWebsiteLayoutChrome(id), id).toBe(true)
    }
  })
})

describe('PROFESSIONAL_FLOW', () => {
  it('matches website reference order for all 41 implementation-scope channel packs', () => {
    expect(IMPLEMENTATION_SCOPE_41).toHaveLength(41)
    for (const id of IMPLEMENTATION_SCOPE_41) {
      const pack = getPlatformOfferPack(id)
      expect(pack?.flowOrder, id).toEqual(PROFESSIONAL_FLOW)
    }
  })

  it('places featured_pathways after context, hero_card before trust, tiers after hero_card', () => {
    const ctx = PROFESSIONAL_FLOW.indexOf('context')
    const pathways = PROFESSIONAL_FLOW.indexOf('featured_pathways')
    const trust = PROFESSIONAL_FLOW.indexOf('trust')
    const heroCard = PROFESSIONAL_FLOW.indexOf('hero_card')
    const tiers = PROFESSIONAL_FLOW.indexOf('tiers')

    expect(pathways).toBeGreaterThan(ctx)
    expect(heroCard).toBeGreaterThan(pathways)
    expect(trust).toBeGreaterThan(heroCard)
    expect(tiers).toBeGreaterThan(heroCard)
    expect(tiers).toBeGreaterThan(trust)
  })

  it('includes webinar_media after context and pathway_actions after faq', () => {
    expect(PROFESSIONAL_FLOW.indexOf('webinar_media')).toBe(
      PROFESSIONAL_FLOW.indexOf('context') + 1
    )
    expect(PROFESSIONAL_FLOW.indexOf('pathway_actions')).toBe(
      PROFESSIONAL_FLOW.indexOf('faq') + 1
    )
  })
})
