/**
 * Generate 128×128 WebP learner avatars (initials + platform tint) for all 41×2 personas.
 * Run: node scripts/generate-learner-avatars.mjs
 * Requires: npm install sharp (devDependency at repo root)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const outDir = path.join(root, 'frontend/public/portal/learners')
const storiesPath = path.join(
  root,
  'packages/booking-crm/src/channel-landing-pages/portalLearnerStories.ts'
)
const scopePath = path.join(
  root,
  'packages/booking-crm/src/channel-landing-pages/platformBrandSources.ts'
)

const MIN_BYTES = 500

function parseChannelIds() {
  const src = fs.readFileSync(scopePath, 'utf8')
  const match = src.match(/IMPLEMENTATION_SCOPE_41: string\[\] = \[([\s\S]*?)\]/)
  if (!match) throw new Error('IMPLEMENTATION_SCOPE_41 not found')
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
}

function parseStoryNames() {
  const src = fs.readFileSync(storiesPath, 'utf8')
  const map = {}
  const blockRe = /^\s{2}([a-z0-9'-]+):\s*\[/gm
  let m
  const blocks = []
  while ((m = blockRe.exec(src))) {
    blocks.push({ id: m[1], start: m.index })
  }
  for (let i = 0; i < blocks.length; i++) {
    const { id, start } = blocks[i]
    const end = blocks[i + 1]?.start ?? src.length
    const chunk = src.slice(start, end)
    const names = [...chunk.matchAll(/name:\s*'([^']+)'/g)].map((x) => x[1])
    map[id] = names
  }
  return map
}

function initials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function hashColor(channelId, index) {
  let h = 0
  const s = `${channelId}-${index}`
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  const hue = h % 360
  return `hsl(${hue} 42% 38%)`
}

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('Install sharp: npm install sharp --save-dev')
    process.exit(1)
  }

  const channelIds = parseChannelIds()
  const namesByChannel = parseStoryNames()
  fs.mkdirSync(outDir, { recursive: true })

  let wrote = 0
  for (const channelId of channelIds) {
    const names = namesByChannel[channelId] ?? ['Learner A', 'Learner B']
    for (let i = 0; i < 2; i++) {
      const index = i + 1
      const name = names[i] ?? `Learner ${index}`
      const init = initials(name)
      const bg = hashColor(channelId, index)
      const file = path.join(outDir, `${channelId}-${index}.webp`)
      const size = 128
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${channelId === 'snapchat' ? 28 : 64}" fill="url(#g)"/>
  <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="system-ui,sans-serif" font-size="42" font-weight="600">${init}</text>
</svg>`
      const buf = await sharp(Buffer.from(svg)).webp({ quality: 82 }).toBuffer()
      fs.writeFileSync(file, buf)
      wrote++
    }
  }

  const small = []
  for (const channelId of channelIds) {
    for (const n of [1, 2]) {
      const f = path.join(outDir, `${channelId}-${n}.webp`)
      const stat = fs.statSync(f)
      if (stat.size < MIN_BYTES) small.push(`${channelId}-${n}.webp (${stat.size} B)`)
    }
  }
  if (small.length) {
    console.error('Files under minimum size:', small.join(', '))
    process.exit(1)
  }
  console.log(`Generated ${wrote} learner avatars in ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
