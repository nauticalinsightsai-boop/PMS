/**
 * Turn off explore/compare pathway buttons on portals (browse links moved to page end).
 * Run: node scripts/migrate-portal-engagement-flags.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'channel-landing-pages.json')
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
const pages = Object.values(raw.pages ?? {})

let n = 0
for (const page of pages) {
  if (!page.portalEngagement) continue
  page.portalEngagement.showExplorePathways = false
  page.portalEngagement.showComparePathways = false
  page.portalEngagement.showCommunityLink = false
  n += 1
}

fs.writeFileSync(dataPath, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
console.log(`Updated portalEngagement flags on ${n} pages`)
