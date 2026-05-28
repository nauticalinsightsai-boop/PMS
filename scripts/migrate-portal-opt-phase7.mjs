/**
 * OPT-PORTAL: two public tiers, free mentor-intro, remove services-detail.
 * Run: node scripts/migrate-portal-opt-phase7.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const dataPath = path.join(root, 'data', 'channel-landing-pages.json')

const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

function mapTierId(id) {
  if (id === 'discovery') return 'mentor-intro'
  if (id === 'executive' || id === 'design-review' || id === 'services-detail') return 'career-pathway'
  return id
}

let updated = 0
const pages = raw.pages && typeof raw.pages === 'object' ? Object.values(raw.pages) : []
for (const page of pages) {
  const tiers = page.consultationTiers ?? []
  const byId = new Map()
  for (const t of tiers) {
    const id = mapTierId(t.id)
    if (id !== 'mentor-intro' && id !== 'career-pathway') continue
    const existing = byId.get(id)
    const next = {
      ...t,
      id,
      bestFor: undefined,
      outcome: undefined,
      isFree: id === 'mentor-intro' ? true : t.isFree,
      priceLabel: id === 'mentor-intro' ? 'Free' : t.priceLabel,
      ctaLabel:
        id === 'mentor-intro'
          ? t.ctaLabel || 'Talk to a mentor'
          : t.ctaLabel || 'Book pathway session',
      recommended: id === 'career-pathway' ? true : false,
      badge: id === 'career-pathway' ? t.badge || 'Most Popular' : undefined,
    }
    if (!existing) byId.set(id, next)
    else if (id === 'career-pathway' && t.scheduleUrl && !existing.scheduleUrl) {
      byId.set(id, { ...existing, scheduleUrl: t.scheduleUrl, priceLabel: t.priceLabel || existing.priceLabel })
    }
  }
  const nextTiers = ['mentor-intro', 'career-pathway'].map((id) => byId.get(id)).filter(Boolean)
  if (nextTiers.length !== 2) continue
  page.consultationTiers = nextTiers
  page.portalEngagement = {
    ...(page.portalEngagement ?? {}),
    templateVersion: 3,
    showCommunityLink: false,
  }
  updated += 1
}

fs.writeFileSync(dataPath, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
console.log(`OPT-PORTAL migration: updated ${updated} pages in channel-landing-pages.json`)
