/**
 * Generates portal-theme-matrix.json + docs/portal-theme-matrix.md
 * Run: npx tsx scripts/generate-portal-theme-matrix.ts
 */
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { IMPLEMENTATION_SCOPE_41 } from '../packages/booking-crm/src/channel-landing-pages/platformBrandSources'
import { resolvePortalTheme } from '../packages/booking-crm/src/channel-landing-pages/resolvePortalTheme'
import {
  cornerStyleFromRadius,
  getPlatformDesignLanguage,
} from '../packages/booking-crm/src/channel-landing-pages/platformDesignLanguage'
import { PLATFORM_DARK_OVERRIDES } from '../packages/booking-crm/src/channel-landing-pages/platformThemeModes'
import { PLATFORM_DARK_SCOPE_EXTENDED } from '../packages/booking-crm/src/channel-landing-pages/platformScopePalettes'
import { getPortalLightPaletteTier } from '../packages/booking-crm/src/channel-landing-pages/platformThemes'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const BLUISH_DARK_BG = '#0B1018'

function lightTier(channelId: string): string {
  const tier = getPortalLightPaletteTier(channelId)
  if (tier === 'full') return 'Full'
  if (tier === 'extended') return 'Extended'
  return 'Baseline'
}

function darkSource(channelId: string): string {
  if (PLATFORM_DARK_OVERRIDES[channelId]) return 'brand-override'
  if (PLATFORM_DARK_SCOPE_EXTENDED[channelId]) return 'brand-extended'
  return 'derived'
}

function solidBg(hex: string): string {
  return hex.startsWith('#') && hex.length === 7 ? hex : hex.slice(0, 32)
}

const rows = IMPLEMENTATION_SCOPE_41.map((channelId, index) => {
  const light = resolvePortalTheme(channelId, 'light')
  const dark = resolvePortalTheme(channelId, 'dark')
  const lang = getPlatformDesignLanguage(channelId)
  const darkBg = solidBg(dark.background)
  if (darkBg === BLUISH_DARK_BG) {
    throw new Error(`Slug ${channelId} still uses bluish dark baseline ${BLUISH_DARK_BG}`)
  }
  return {
    index: index + 1,
    slug: channelId,
    url: `/go/${channelId}`,
    lightTier: lightTier(channelId),
    darkSource: darkSource(channelId),
    lightPrimary: solidBg(light.primary),
    darkBackground: darkBg,
    fontFamily: light.fontFamily,
    radius: light.radius,
    radiusLg: light.radiusLg,
    cornerStyle: cornerStyleFromRadius(light.radius),
    designLanguage: lang,
    avatarFiles: [`${channelId}-1.webp`, `${channelId}-2.webp`],
    light,
    dark,
  }
})

const jsonPath = join(root, 'packages/booking-crm/data/portal-theme-matrix.json')
mkdirSync(dirname(jsonPath), { recursive: true })
writeFileSync(jsonPath, JSON.stringify({ generatedAt: new Date().toISOString(), rows }, null, 2))

const mdLines = [
  '# Portal theme matrix (41 slugs)',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  '| # | Slug | L tier | Dark | Light primary | Dark bg | Corner | Font |',
  '|---|------|--------|------|---------------|---------|--------|------|',
  ...rows.map(
    (r) =>
      `| ${r.index} | ${r.slug} | ${r.lightTier} | ${r.darkSource} | ${r.lightPrimary} | ${r.darkBackground} | ${r.cornerStyle} | ${r.fontFamily.split(',')[0]} |`
  ),
  '',
]

const mdPath = join(root, 'docs/portal-theme-matrix.md')
mkdirSync(dirname(mdPath), { recursive: true })
writeFileSync(mdPath, mdLines.join('\n'))

console.log(`Wrote ${jsonPath} and ${mdPath} (${rows.length} slugs)`)
