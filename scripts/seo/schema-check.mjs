/**
 * Verify JSON-LD builders and key schema components exist.
 * OPEN-01: buildCourseSchema( call sites restricted to pathway Course component + schema lib.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

const requiredBuilders = [
  'buildOrganizationSchema',
  'buildWebSiteSchema',
  'buildFaqPageSchema',
  'buildBreadcrumbSchema',
  'buildWebPageSchema',
  'buildArticleSchema',
  'buildCourseSchema',
  'buildServiceSchema',
  'buildCollectionPageSchema',
  'buildItemListSchema',
];

const schemaIndex = fs.readFileSync(path.join(frontend, 'lib/schema/index.ts'), 'utf8');
const components = [
  'components/seo/OrganizationJsonLd.tsx',
  'components/seo/HomePageJsonLd.tsx',
  'components/seo/AboutPageJsonLd.tsx',
  'components/seo/CertJsonLd.tsx',
  'components/seo/FaqJsonLd.tsx',
  'components/seo/PmpPageJsonLd.tsx',
  'components/seo/PmpCourseJsonLd.tsx',
  'components/seo/AnswerJsonLd.tsx',
  'components/seo/TopicHubJsonLd.tsx',
  'components/seo/ArticleJsonLd.tsx',
  'components/seo/MarketingPageJsonLd.tsx',
  'components/seo/PmServiceJsonLd.tsx',
  'components/seo/FaqPageJsonLd.tsx',
  'components/seo/LegalPageJsonLd.tsx',
];

let failed = false;

for (const fn of requiredBuilders) {
  if (!schemaIndex.includes(`export function ${fn}`)) {
    console.error(`schema-check FAIL: missing ${fn}`);
    failed = true;
  }
}

for (const rel of components) {
  if (!fs.existsSync(path.join(frontend, rel))) {
    console.error(`schema-check FAIL: missing ${rel}`);
    failed = true;
  }
}

const courseCallAllowlist = new Set([
  path.join(frontend, 'components/seo/PmpCourseJsonLd.tsx'),
  path.join(frontend, 'lib/schema/index.ts'),
]);

function walkTsFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name.startsWith('.next.')) {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTsFiles(full, out);
    else if (/\.(tsx?|jsx?|mjs|cjs)$/.test(entry.name) && !entry.name.includes('.test.')) {
      out.push(full);
    }
  }
  return out;
}

for (const file of walkTsFiles(frontend)) {
  if (courseCallAllowlist.has(file)) continue;
  const src = fs.readFileSync(file, 'utf8');
  if (/\bbuildCourseSchema\s*\(/.test(src)) {
    console.error(
      `schema-check FAIL: buildCourseSchema( call outside allowlist: ${path.relative(root, file)}`,
    );
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`schema-check OK (${requiredBuilders.length} builders, ${components.length} components)`);
