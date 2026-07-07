/**
 * Sync stored headline/subheadline/targetMessage in channel-landing-pages.json
 * to certification voice from enrichChannelLandingPage.
 * Run: node --import tsx scripts/sync-portal-surface-copy.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { enrichChannelLandingPage } from '../packages/booking-crm/src/channel-landing-pages/portalDefaults.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataPath = path.join(root, 'data', 'channel-landing-pages.json')

const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
let updated = 0

for (const [slug, page] of Object.entries(raw.pages ?? {})) {
  const enriched = enrichChannelLandingPage(page)
  let changed = false
  for (const field of ['headline', 'subheadline', 'targetMessage']) {
    if (page[field] !== enriched[field]) {
      page[field] = enriched[field]
      changed = true
    }
  }
  if (page.showBookingForm !== false) {
    page.showBookingForm = false
    changed = true
  }
  const engagement = page.portalEngagement ?? {}
  if (!Array.isArray(engagement.featuredCertIds) || engagement.featuredCertIds.length === 0) {
    page.portalEngagement = {
      ...engagement,
      featuredCertIds: engagement.featuredCertIds ?? ['pmp', 'capm', 'prince2-foundation'],
      templateVersion: engagement.templateVersion ?? 3,
      showCommunityLink: engagement.showCommunityLink ?? false,
    }
    changed = true
  }
  if (changed) {
    page.updatedAt = new Date().toISOString()
    updated += 1
    console.log(`Updated ${slug}`)
  }
}

fs.writeFileSync(dataPath, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
console.log(`sync-portal-surface-copy: updated ${updated} pages`)
