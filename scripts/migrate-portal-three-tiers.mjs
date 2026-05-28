/**
 * Restore three public tiers: mentor-intro, career-pathway, services-detail.
 * Run: node scripts/migrate-portal-three-tiers.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'channel-landing-pages.json')
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'))

function mapTierId(id) {
  if (id === 'discovery') return 'mentor-intro'
  if (id === 'executive') return 'career-pathway'
  if (id === 'design-review' || id === 'services-detail') return 'services-detail'
  return id
}

const DEFAULTS = {
  'mentor-intro': {
    title: 'Free Mentor Intro',
    ctaLabel: 'Talk to a mentor',
    priceLabel: 'Free',
    isFree: true,
    recommended: false,
  },
  'career-pathway': {
    title: 'Career & Pathway Session',
    ctaLabel: 'Book pathway session',
    recommended: true,
    badge: 'Most Popular',
  },
  'services-detail': {
    title: 'Services Discussion',
    ctaLabel: 'Discuss services',
    recommended: false,
    description:
      'Review services you selected on the Project Management Structure website. Cite the page or package when you book.',
    durationLabel: '45 Minutes',
  },
}

let updated = 0
const pages = raw.pages && typeof raw.pages === 'object' ? Object.values(raw.pages) : []

for (const page of pages) {
  const tiers = page.consultationTiers ?? []
  const byId = new Map()
  for (const t of tiers) {
    const id = mapTierId(t.id)
    if (!DEFAULTS[id]) continue
    const existing = byId.get(id)
    const next = { ...t, id, ...DEFAULTS[id], bestFor: undefined, outcome: undefined }
    if (id === 'mentor-intro') {
      next.isFree = true
      next.priceLabel = 'Free'
    }
    if (!existing) byId.set(id, next)
    else if (!existing.scheduleUrl && t.scheduleUrl) {
      byId.set(id, { ...existing, scheduleUrl: t.scheduleUrl, priceLabel: t.priceLabel || existing.priceLabel })
    }
  }

  const nextTiers = ['mentor-intro', 'career-pathway', 'services-detail'].map((id) => {
    const saved = byId.get(id)
    const def = DEFAULTS[id]
    if (saved) {
      return {
        ...saved,
        title: def.title,
        ctaLabel: def.ctaLabel,
        recommended: def.recommended ?? false,
        badge: def.badge,
        description: saved.description?.trim() || def.description || saved.description,
        durationLabel: saved.durationLabel || def.durationLabel || saved.durationLabel,
      }
    }
    return {
      id,
      title: def.title,
      description: def.description || 'Mentor-led session aligned to this channel.',
      durationLabel: def.durationLabel || (id === 'mentor-intro' ? '15 Minutes' : '30 Minutes'),
      priceLabel: id === 'mentor-intro' ? 'Free' : 'Paid',
      isFree: id === 'mentor-intro',
      recommended: def.recommended ?? false,
      badge: def.badge,
      ctaLabel: def.ctaLabel,
    }
  })

  page.consultationTiers = nextTiers
  page.portalEngagement = {
    ...(page.portalEngagement ?? {}),
    templateVersion: 4,
  }
  if (page.primaryButtonText?.match(/reserve|schedule inline/i)) {
    page.primaryButtonText = 'Talk to a mentor'
  }
  updated += 1
}

fs.writeFileSync(dataPath, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
console.log(`Three-tier migration: updated ${updated} pages (template v4).`)
