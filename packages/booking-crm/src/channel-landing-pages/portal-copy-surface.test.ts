import { describe, expect, it } from 'vitest'
import { ALL_CHANNELS } from '../constants/channelGroups'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'
import { getChannelPortalCopy } from './channelPortalCopy'
import { enrichChannelLandingPage } from './portalDefaults'
import { lintChannelLandingPageDraft } from './portalPersonaLint'
import { getCertificationPortalSurface, certificationCopyKeys } from './portalCertificationCopy'
import type { ChannelLandingPage } from '../types/channelLandingPage'

const ADVISORY_TERMS =
  /\b(principal advisory|principal time|advisory block|nautical|defense or audit|working session|structured defense)\b/i

function channelLabel(channelId: string): string {
  const ch = ALL_CHANNELS.find((c) => c.id === channelId)
  return ch?.label ?? channelId
}

function minimalPage(channelId: string): ChannelLandingPage {
  const label = channelLabel(channelId)
  return {
    channelKey: channelId,
    channelId,
    label,
    slug: channelId,
    status: 'published',
    contextLabel: '',
    headline: '',
    subheadline: '',
    body: '',
    targetMessage: '',
    consultationTiers: [],
  }
}

describe('portal copy surface (certification voice)', () => {
  it('covers all 41 implementation-scope slugs', () => {
    expect(IMPLEMENTATION_SCOPE_41).toHaveLength(41)
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      expect(getCertificationPortalSurface(channelId).subheadline.length, channelId).toBeGreaterThan(20)
      expect(certificationCopyKeys(), channelId).toContain(channelId)
    }
  })

  it('subheadlines mention the platform label for social and owned channels', () => {
    for (const channelId of ['instagram', 'linkedin', 'medium', 'website', 'youtube'] as const) {
      const label = channelLabel(channelId)
      const { subheadline } = getChannelPortalCopy(channelId)!
      expect(subheadline, channelId).toMatch(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))
    }
  })

  it('enriched pages avoid legacy advisory phrasing on visible surfaces', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      const enriched = enrichChannelLandingPage(minimalPage(channelId))
      const visible = [enriched.headline, enriched.subheadline, enriched.targetMessage].join(' ')
      expect(visible, channelId).not.toMatch(ADVISORY_TERMS)
    }
  })

  it('passes persona lint for enriched headline, subheadline, and targetMessage', () => {
    for (const channelId of IMPLEMENTATION_SCOPE_41) {
      const enriched = enrichChannelLandingPage(minimalPage(channelId))
      const errors = lintChannelLandingPageDraft(enriched).filter((i) => i.severity === 'error')
      expect(errors, channelId).toEqual([])
    }
  })
})
