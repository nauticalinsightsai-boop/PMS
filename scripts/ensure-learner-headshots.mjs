/**
 * Ensures 82 learner headshot files exist under frontend/public/portal/learners/.
 * Skips files that already exist (keeps curated photos). Pass --force to overwrite all.
 * Pass --check to exit 1 if any file is missing or ≤500 bytes (placeholder guard).
 * Run: node scripts/ensure-learner-headshots.mjs
 * Generate real avatars: node scripts/generate-learner-avatars.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const scopePath = path.join(root, 'packages/booking-crm/src/channel-landing-pages/platformBrandSources.ts')
const outDir = path.join(root, 'frontend/public/portal/learners')
const MIN_BYTES = 500

const scopeSrc = fs.readFileSync(scopePath, 'utf8')
const match = scopeSrc.match(/IMPLEMENTATION_SCOPE_41: string\[\] = \[([\s\S]*?)\]/)
if (!match) throw new Error('IMPLEMENTATION_SCOPE_41 not found')
const channelIds = [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1])

const checkOnly = process.argv.includes('--check')
const force = process.argv.includes('--force')

/** Minimal valid 1x1 webp (placeholder only — use generate-learner-avatars.mjs for production). */
const MINI_WEBP_B64 =
  'UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/vuUAAA='
const buf = Buffer.from(MINI_WEBP_B64, 'base64')

fs.mkdirSync(outDir, { recursive: true })

if (checkOnly) {
  const failures = []
  for (const channelId of channelIds) {
    for (const n of [1, 2]) {
      const file = path.join(outDir, `${channelId}-${n}.webp`)
      if (!fs.existsSync(file)) {
        failures.push(`${channelId}-${n}.webp missing`)
        continue
      }
      if (fs.statSync(file).size <= MIN_BYTES) {
        failures.push(`${channelId}-${n}.webp too small (${fs.statSync(file).size} B)`)
      }
    }
  }
  if (failures.length) {
    console.error('Learner headshot check failed:\n' + failures.join('\n'))
    process.exit(1)
  }
  console.log(`OK: ${channelIds.length * 2} learner avatars pass size check`)
  process.exit(0)
}

let wrote = 0
let skipped = 0
for (const channelId of channelIds) {
  for (const n of [1, 2]) {
    const file = path.join(outDir, `${channelId}-${n}.webp`)
    if (!force && fs.existsSync(file) && fs.statSync(file).size > MIN_BYTES) {
      skipped++
      continue
    }
    fs.writeFileSync(file, buf)
    wrote++
  }
}

console.log(
  `Learner headshots: ${wrote} placeholder(s) written, ${skipped} kept, dir ${outDir}. Run node scripts/generate-learner-avatars.mjs for full avatars.`,
)
