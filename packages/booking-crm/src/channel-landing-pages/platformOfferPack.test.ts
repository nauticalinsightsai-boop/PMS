import { describe, expect, it } from 'vitest'
import {
  PRO_CONSULTATION_PORTAL_CHANNELS,
  usesProConsultationPortalLayout,
} from './platformOfferPack'

describe('usesProConsultationPortalLayout', () => {
  it('returns true only for website and webinar', () => {
    expect(PRO_CONSULTATION_PORTAL_CHANNELS).toEqual(new Set(['website', 'webinar']))
    expect(usesProConsultationPortalLayout('website')).toBe(true)
    expect(usesProConsultationPortalLayout('webinar')).toBe(true)
  })

  it('returns false for platform slugs', () => {
    for (const id of ['snapchat', 'instagram', 'linkedin', 'medium', 'spotify', 'vk']) {
      expect(usesProConsultationPortalLayout(id), id).toBe(false)
    }
  })
})
