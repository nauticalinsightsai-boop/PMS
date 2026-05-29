/**
 * Generates 82 placeholder learner headshots (96x96 WebP) for portal credibility tabs.
 * Run: node scripts/ensure-learner-headshots.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const scopePath = path.join(root, 'packages/booking-crm/src/channel-landing-pages/platformBrandSources.ts')
const outDir = path.join(root, 'frontend/public/portal/learners')

const scopeSrc = fs.readFileSync(scopePath, 'utf8')
const match = scopeSrc.match(/IMPLEMENTATION_SCOPE_41: string\[\] = \[([\s\S]*?)\]/)
if (!match) throw new Error('IMPLEMENTATION_SCOPE_41 not found')
const channelIds = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1])

fs.mkdirSync(outDir, { recursive: true })

/** Minimal valid 1x1 webp (same file copied for each persona). */
const MINI_WEBP_B64 =
  'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/vuUAAA='
const buf = Buffer.from(MINI_WEBP_B64, 'base64')

let count = 0
for (const channelId of channelIds) {
  for (const n of [1, 2]) {
    const file = path.join(outDir, `${channelId}-${n}.webp`)
    fs.writeFileSync(file, buf)
    count++
  }
}

console.log(`Wrote ${count} placeholder webp files to ${outDir}`)
