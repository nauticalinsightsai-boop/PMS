/**
 * Website portal: certification copy, no em dashes, standard tier CTAs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'channel-landing-pages.json')
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
const page = raw.pages?.website
if (!page) {
  console.error('No website page found')
  process.exit(1)
}

function stripEm(s) {
  if (typeof s !== 'string') return s
  return s.replace(/\s*—\s*/g, '. ').replace(/\s+-\s+/g, '. ').replace(/\.\s+\./g, '.').trim()
}

function walk(obj) {
  if (typeof obj === 'string') return stripEm(obj)
  if (Array.isArray(obj)) return obj.map(walk)
  if (obj && typeof obj === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(obj)) out[k] = walk(v)
    return out
  }
  return obj
}

Object.assign(page, {
  headline: 'Project Management Structure: certification and career guidance',
  subheadline:
    'Book a free mentor intro or a paid pathway session. Cite the page or asset on the site when you schedule.',
  targetMessage:
    'Reading a cert page or article? Mention it when you book. We will pick up where you left off.',
  availabilityLabel: 'Mentor sessions open',
  primaryButtonText: 'Talk to a mentor',
  consultationTiers: [
    {
      id: 'mentor-intro',
      title: 'Free mentor intro',
      description:
        '15-minute conversation on certification goal, timeline, and which pathway fits. Cite the site page or asset when you book.',
      durationLabel: '15 Minutes',
      priceLabel: 'Free',
      isFree: true,
      recommended: false,
      ctaLabel: 'Talk to a mentor',
      scheduleUrl: 'https://calendly.com/booking-sh3ikhmabz/go-website-discovery',
    },
    {
      id: 'career-pathway',
      title: 'Pathway working session',
      description:
        'Structured mentor block for exam prep, pathway depth, or services you chose on the website.',
      durationLabel: '30 Minutes',
      priceLabel: '$299',
      recommended: true,
      badge: 'Most Popular',
      ctaLabel: 'Book pathway session',
      scheduleUrl: 'https://calendly.com/booking-sh3ikhmabz/go-website-executive',
    },
  ],
})

page.headline = stripEm(page.headline)
const cleaned = walk(page.conversion)
if (cleaned) page.conversion = cleaned

fs.writeFileSync(dataPath, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
console.log('Updated website portal copy')
