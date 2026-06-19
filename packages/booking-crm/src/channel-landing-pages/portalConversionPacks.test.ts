import { describe, expect, it } from 'vitest'
import { ALL_CHANNELS } from '../constants/channelGroups'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import {
  PORTAL_CONVERSION_PACKS,
  getPortalConversionPack,
  getCredibilityTabLabels,
} from './portalConversionPacks'

describe('portalConversionPacks', () => {
  it('has a pack for every channel', () => {
    for (const ch of ALL_CHANNELS) {
      expect(getPortalConversionPack(ch.id), ch.id).toBeTruthy()
    }
    expect(Object.keys(PORTAL_CONVERSION_PACKS).length).toBe(ALL_CHANNELS.length)
  })

  it('uses unique finalCtaLabel per channel when possible', () => {
    const labels = ALL_CHANNELS.map((c) => getPortalConversionPack(c.id)?.finalCtaLabel)
    const unique = new Set(labels)
    expect(unique.size).toBeGreaterThan(30)
  })

  it('includes required conversion fields', () => {
    const pack = getPortalConversionPack('linkedin')
    expect(pack?.trustLine).toBeTruthy()
    expect(pack?.faq?.length).toBeGreaterThan(3)
    expect(pack?.valueCards?.length).toBeGreaterThanOrEqual(3)
  })

  it('uses certification-focused value cards', () => {
    const substack = getPortalConversionPack('substack')?.valueCards?.[0]?.title
    const linkedin = getPortalConversionPack('linkedin')?.valueCards?.[0]?.title
    expect(substack).toBe('Read to exam plan')
    expect(linkedin).toBe('From content to pathway')
  })

  it('withholds unverified learner-voice social proof on scope-41 channels', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      const proof = getPortalConversionPack(channelId)?.socialProof
      expect(proof?.length, channelId).toBe(0)
    }
  })

  it('uses channel-specific credibility tab labels', () => {
    expect(getCredibilityTabLabels('substack')).toEqual({
      quotes: 'Subscriber voices',
      metrics: 'Newsletter outcomes',
    })
  })

  it('platform proof metrics exclude unverified pass/cleared outcome counts', () => {
    const metrics = getPortalConversionPack('webinar')?.proofMetrics ?? []
    expect(metrics.length).toBeGreaterThanOrEqual(4)
    expect(metrics[0]?.label).toMatch(/Issuing bodies/i)
    expect(metrics[1]?.label).toMatch(/Certification pathways/i)
    const labels = metrics.map((m) => m.label).join(' ')
    expect(labels).not.toMatch(/cleared certifications/i)
    expect(labels).not.toMatch(/Professional experience|Geographic exposure/)
  })

  it('qualification excludes project consulting', () => {
    const notFor = getPortalConversionPack('website')?.qualificationNotFor ?? []
    expect(notFor.some((line) => /project delivery|compliance audits|design reviews/i.test(line))).toBe(
      true
    )
  })
})
