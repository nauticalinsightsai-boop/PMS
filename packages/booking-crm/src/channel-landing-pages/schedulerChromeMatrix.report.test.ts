/**
 * Writes scheduler chrome matrix JSON for all published /go slugs × light/dark.
 * Fails if contrast/shell gates fail (same rules as resolveSchedulerChrome.test.ts).
 */
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPublishedGoChannelSlugs } from './goSlugRedirects'
import { resolveChannelIdFromLegacyKey } from './migrateChannelPages'
import { resolvePortalTheme } from './resolvePortalTheme'
import { resolveSchedulerChrome } from './resolveSchedulerChrome'
import { isLightHexColor, meetsContrast } from './contrastUtils'
import { CHANNEL_PUBLIC_SLUG } from '../types/channelLandingPage'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../../data/scheduler-chrome-matrix.json')

function withHash(h: string): string {
  return h.startsWith('#') ? h : `#${h}`
}

function channelIdsForPublishedSlugs(): { slug: string; channelId: string }[] {
  return getPublishedGoChannelSlugs().map((slug) => {
    const entry = Object.entries(CHANNEL_PUBLIC_SLUG).find(([, pub]) => pub === slug)
    const channelId = entry?.[0] ?? resolveChannelIdFromLegacyKey(slug) ?? slug
    return { slug, channelId }
  })
}

describe('scheduler chrome matrix report', () => {
  it('builds report for 41 published slugs × light/dark and passes gates', () => {
    const rows = channelIdsForPublishedSlugs()
    expect(rows.length).toBeGreaterThanOrEqual(41)

    const report: {
      generatedAt: string
      slugCount: number
      entries: Array<Record<string, unknown>>
      failures: string[]
    } = {
      generatedAt: new Date().toISOString(),
      slugCount: rows.length,
      entries: [],
      failures: [],
    }

    for (const { slug, channelId } of rows) {
      for (const mode of ['light', 'dark'] as const) {
        const theme = resolvePortalTheme(channelId, mode)
        const chrome = resolveSchedulerChrome(channelId, mode)
        const dateFill = withHash(chrome.slots.dateFill)
        const timeFill = withHash(chrome.slots.timeFill)

        const shellOk =
          chrome.shell.primary.toLowerCase() === theme.primary.replace(/^#/, '').toLowerCase() &&
          chrome.shell.background.toLowerCase() === theme.background.replace(/^#/, '').toLowerCase() &&
          chrome.shell.text.toLowerCase() === theme.text.replace(/^#/, '').toLowerCase()

        const darkFillOk =
          mode === 'light' ||
          (dateFill.toLowerCase() !== '#ffffff' &&
            timeFill.toLowerCase() !== '#ffffff' &&
            !(isLightHexColor(dateFill) && dateFill.toLowerCase() === '#ffffff'))

        const contrastOk =
          meetsContrast(withHash(chrome.slots.dateLabel), dateFill, 3) &&
          meetsContrast(
            withHash(chrome.slots.dateSelectedLabel),
            withHash(chrome.slots.dateSelectedFill),
            3,
          ) &&
          meetsContrast(withHash(chrome.slots.timeLabel), timeFill, 3)

        const formLabelOk =
          meetsContrast(withHash(chrome.form.label), withHash(chrome.shell.background), 4.5) &&
          meetsContrast(withHash(chrome.form.fieldText), '#FFFFFF', 4.5)

        if (!shellOk) report.failures.push(`${slug}/${mode}: shell ≠ resolvePortalTheme`)
        if (!darkFillOk) report.failures.push(`${slug}/${mode}: dark unselected fill is white`)
        if (!contrastOk) report.failures.push(`${slug}/${mode}: slot contrast < 3`)
        if (!formLabelOk) {
          report.failures.push(
            `${slug}/${mode}: form.label vs shell bg or fieldText vs #FFFFFF < 4.5`,
          )
        }
        report.entries.push({
          slug,
          channelId,
          mode,
          shell: chrome.shell,
          slots: chrome.slots,
          form: chrome.form,
          gates: { shellOk, darkFillOk, contrastOk, formLabelOk },
        })
      }
    }

    fs.mkdirSync(path.dirname(OUT), { recursive: true })
    fs.writeFileSync(OUT, JSON.stringify(report, null, 2))

    expect(report.failures, report.failures.join('\n')).toEqual([])
  })
})
