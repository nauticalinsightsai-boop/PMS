import { describe, expect, it } from 'vitest'
import { getPublishedGoChannelSlugs } from './goSlugRedirects'
import { resolveChannelIdFromLegacyKey } from './migrateChannelPages'
import { resolvePortalTheme } from './resolvePortalTheme'
import { resolveSchedulerChrome } from './resolveSchedulerChrome'
import { isLightHexColor, meetsContrast, parseHexColor } from './contrastUtils'
import { CHANNEL_PUBLIC_SLUG } from '../types/channelLandingPage'

function withHash(h: string): string {
  return h.startsWith('#') ? h : `#${h}`
}

function channelIdsForPublishedSlugs(): string[] {
  return getPublishedGoChannelSlugs().map((slug) => {
    // Reverse public slug → channelId
    const entry = Object.entries(CHANNEL_PUBLIC_SLUG).find(([, pub]) => pub === slug)
    if (entry) return entry[0]
    return resolveChannelIdFromLegacyKey(slug) ?? slug
  })
}

describe('resolveSchedulerChrome', () => {
  const channelIds = channelIdsForPublishedSlugs()

  it('covers all published go slugs', () => {
    expect(channelIds.length).toBeGreaterThanOrEqual(41)
  })

  for (const mode of ['light', 'dark'] as const) {
    it(`shell matches resolvePortalTheme for every channel (${mode})`, () => {
      for (const channelId of channelIds) {
        const theme = resolvePortalTheme(channelId, mode)
        const chrome = resolveSchedulerChrome(channelId, mode)
        expect(withHash(chrome.shell.background).toLowerCase()).toBe(
          theme.background.replace(/^#/, '#').toLowerCase().replace(/^##/, '#'),
        )
        // Compare without requiring exact # prefix form
        expect(chrome.shell.primary.toLowerCase()).toBe(theme.primary.replace(/^#/, '').toLowerCase())
        expect(chrome.shell.text.toLowerCase()).toBe(theme.text.replace(/^#/, '').toLowerCase())
      }
    })

    it(`dark unselected fills are never white (${mode})`, () => {
      if (mode !== 'dark') return
      for (const channelId of channelIds) {
        const chrome = resolveSchedulerChrome(channelId, mode)
        const dateFill = withHash(chrome.slots.dateFill)
        const timeFill = withHash(chrome.slots.timeFill)
        expect(dateFill.toLowerCase()).not.toBe('#ffffff')
        expect(timeFill.toLowerCase()).not.toBe('#ffffff')
        expect(isLightHexColor(dateFill) && dateFill.toLowerCase() === '#ffffff').toBe(false)
      }
    })

    it(`slot labels meet contrast ≥ 3 on fills (${mode})`, () => {
      for (const channelId of channelIds) {
        const chrome = resolveSchedulerChrome(channelId, mode)
        expect(
          meetsContrast(withHash(chrome.slots.dateLabel), withHash(chrome.slots.dateFill), 3),
        ).toBe(true)
        expect(
          meetsContrast(
            withHash(chrome.slots.dateSelectedLabel),
            withHash(chrome.slots.dateSelectedFill),
            3,
          ),
        ).toBe(true)
        expect(
          meetsContrast(withHash(chrome.slots.timeLabel), withHash(chrome.slots.timeFill), 3),
        ).toBe(true)
      }
    })

    it(`primary has no adjustHex drift (${mode})`, () => {
      for (const channelId of channelIds) {
        const theme = resolvePortalTheme(channelId, mode)
        const chrome = resolveSchedulerChrome(channelId, mode)
        expect(chrome.shell.primary.toLowerCase()).toBe(theme.primary.replace(/^#/, '').toLowerCase())
        expect(parseHexColor(withHash(chrome.shell.primary))).not.toBeNull()
      }
    })

    it(`form.label contrasts on page shell; fieldText contrasts on white (${mode})`, () => {
      for (const channelId of channelIds) {
        const chrome = resolveSchedulerChrome(channelId, mode)
        expect(
          meetsContrast(withHash(chrome.form.label), withHash(chrome.shell.background), 4.5),
        ).toBe(true)
        expect(meetsContrast(withHash(chrome.form.fieldText), '#FFFFFF', 4.5)).toBe(true)
      }
    })
  }

  it('webinar shell primary matches website palette primary', () => {
    for (const mode of ['light', 'dark'] as const) {
      const webinar = resolveSchedulerChrome('webinar', mode)
      const website = resolveSchedulerChrome('website', mode)
      expect(webinar.shell.primary).toBe(website.shell.primary)
      expect(webinar.shell.background).toBe(website.shell.background)
    }
  })
})
