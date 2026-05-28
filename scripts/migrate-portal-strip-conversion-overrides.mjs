/**
 * Remove stored conversion overrides so runtime packs (learner copy) win at enrich.
 * Run: node scripts/migrate-portal-strip-conversion-overrides.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'channel-landing-pages.json')
const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
const pages = raw.pages && typeof raw.pages === 'object' ? raw.pages : {}
let stripped = 0

for (const page of Object.values(pages)) {
  if (!page?.conversion) continue
  delete page.conversion
  stripped += 1
}

fs.writeFileSync(dataPath, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
console.log(`Stripped conversion overrides from ${stripped} portal page(s).`)
