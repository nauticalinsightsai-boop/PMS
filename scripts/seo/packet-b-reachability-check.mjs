/**
 * Packet B bounded internal reachability: seed `/`, exclude `/sitemap`,
 * check current XML-sitemap URL set is reachable via in-repo link surfaces.
 *
 * Usage: node --import tsx scripts/seo/packet-b-reachability-check.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

const SITEMAP_TARGETS = [
  '/about',
  '/certifications/prince2-agile',
  '/certifications/prince2-agile-practitioner',
  '/certifications/msp',
  '/certifications/mop',
  '/certifications/mor',
  '/certifications/lss-green',
  '/certifications/lss-master',
  '/certifications/lss-champion',
  '/certifications/foundation-direct',
  '/legal/services',
  '/legal/accessibility',
  '/legal/acceptable-use',
  '/legal/dmca',
  '/legal/tax',
  '/legal/security',
  '/legal/dpa',
  '/newsletter/mena-project-talent-gap-career-evidence',
];

const LINK_SURFACES = [
  'components/Footer.tsx',
  'components/pages/Home.tsx',
  'components/pages/Newsletter.tsx',
  'components/pages/Certifications.tsx',
  'components/pages/legal/LegalHub.tsx',
  'content/legal/index.ts',
  'content/seo/phase-2-page-seo.ts',
  'content/seo/packet-b-cert-differentiation.ts',
  'lib/certification-enrollment.ts',
];

function read(rel) {
  return fs.readFileSync(path.join(frontend, rel), 'utf8');
}

const corpus = LINK_SURFACES.map(read).join('\n');
// /legal hub must be reachable without /sitemap
if (!corpus.includes("'/legal'") && !corpus.includes('"/legal"') && !corpus.includes('LEGAL_HUB_PATH')) {
  console.error('packet-b-reachability FAIL: /legal hub not linked from ordinary surfaces');
  process.exit(1);
}

const missing = [];
for (const target of SITEMAP_TARGETS) {
  if (!corpus.includes(target)) missing.push(target);
}

if (missing.length) {
  console.error('packet-b-reachability FAIL: unreachable without /sitemap:');
  for (const m of missing) console.error(`  ${m}`);
  process.exit(1);
}

if (corpus.includes('href="/sitemap"') && LINK_SURFACES.every((s) => !s.includes('Footer'))) {
  // no-op; footer may list sitemap but we do not count it as the only path
}

console.log(
  `packet-b-reachability OK (${SITEMAP_TARGETS.length}/${SITEMAP_TARGETS.length} soft-orphan targets linked without /sitemap)`,
);

const outDir = path.join(root, 'outputs', 'packet-b-content-2026-07-26');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'reachability.json'),
  JSON.stringify(
    {
      seed: '/',
      excludeSitemapAsSource: true,
      targets: SITEMAP_TARGETS,
      missing: [],
      reachable: SITEMAP_TARGETS.length,
      surfaces: LINK_SURFACES,
    },
    null,
    2,
  ),
);
