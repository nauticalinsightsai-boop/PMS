import { describe, expect, it } from 'vitest'
import { ALL_CHANNELS } from '../constants/channelGroups'
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
    expect(substack).toBe('Reading → exam plan')
    expect(linkedin).toBe('Certification fit first')
  })

  it('has learner-voice social proof per channel', () => {
    const quotes = new Set<string>()
    for (const ch of ALL_CHANNELS) {
      const proof = getPortalConversionPack(ch.id)?.socialProof
      expect(proof?.length).toBeGreaterThanOrEqual(2)
      for (const item of proof ?? []) {
        expect(item.quote.length).toBeGreaterThan(20)
        quotes.add(item.quote)
      }
    }
    expect(quotes.size).toBeGreaterThanOrEqual(10)
  })

  it('uses learner voices before platform track record tab labels', () => {
    expect(getCredibilityTabLabels('substack')).toEqual({
      quotes: 'Learner voices',
      metrics: 'Platform track record',
    })
  })

  it('substack social proof references certification prep', () => {
    const proof = getPortalConversionPack('substack')?.socialProof ?? []
    const joined = proof.map((p) => p.quote).join(' ')
    expect(joined).toMatch(/prep|PMP|CAPM|certification|membership/i)
  })

  it('website social proof focuses on learners not project deliverables', () => {
    const proof = getPortalConversionPack('website')?.socialProof ?? []
    const joined = proof.map((p) => p.quote).join(' ').toLowerCase()
    expect(joined).not.toContain('deliverable list')
    expect(joined).toMatch(/prep|certification|pathway|mentor/i)
  })

  it('platform proof metrics are aggregate not individual CV', () => {
    const metrics = getPortalConversionPack('webinar')?.proofMetrics ?? []
    expect(metrics.length).toBeGreaterThanOrEqual(4)
    expect(metrics[0]?.label).toMatch(/cleared certifications/i)
    expect(metrics[1]?.label).toMatch(/Issuing bodies/i)
    expect(metrics[2]?.label).toMatch(/Certification pathways/i)
    const labels = metrics.map((m) => m.label).join(' ')
    expect(labels).not.toMatch(/Professional experience|Geographic exposure/)
  })

  it('social proof uses name and title not community member labels', () => {
    const proof = getPortalConversionPack('whatsapp')?.socialProof ?? []
    const joined = proof.map((p) => `${p.quote} ${p.name ?? ''} ${p.title ?? ''} ${p.role ?? ''}`).join(' ')
    expect(joined).not.toMatch(/community sent me here/i)
    expect(joined).not.toMatch(/Community member · study plan/i)
    expect(proof.every((p) => p.name && p.name.length > 0)).toBe(true)
  })

  it('qualification excludes project consulting', () => {
    const notFor = getPortalConversionPack('website')?.qualificationNotFor ?? []
    expect(notFor.some((line) => /project delivery|compliance audits|design reviews/i.test(line))).toBe(
      true
    )
  })

  it('finalCtaBody avoids upgrade-tier framing', () => {
    for (const ch of ALL_CHANNELS) {
      const body = getPortalConversionPack(ch.id)?.finalCtaBody ?? ''
      expect(body.toLowerCase()).not.toMatch(/\bupgrade\b/)
    }
  })
})
