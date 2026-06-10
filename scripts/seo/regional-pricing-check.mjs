/**
 * Run 14 — regional pricing SEO guards.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

let failed = false;

function fail(msg) {
  console.error(`regional-pricing-check FAIL: ${msg}`);
  failed = true;
}

const canonical = fs.readFileSync(path.join(root, 'frontend/lib/canonical.ts'), 'utf8');
for (const key of ['currency', 'region', 'regionId']) {
  if (!canonical.includes(`'${key}'`)) {
    fail(`canonical.ts missing stripped query key: ${key}`);
  }
}

const regionGate = fs.readFileSync(path.join(root, 'frontend/components/RegionGate.tsx'), 'utf8');
if (regionGate.includes('isReady') && regionGate.includes('Loading')) {
  fail('RegionGate still gates on loading text');
}
if (!regionGate.includes('{children}')) {
  fail('RegionGate does not render children');
}

const checkout = fs.readFileSync(path.join(root, 'frontend/app/(site)/checkout/page.tsx'), 'utf8');
if (!checkout.includes('index: false')) {
  fail('checkout/page.tsx missing noindex robots');
}

const indexing = fs.readFileSync(path.join(root, 'frontend/lib/indexing-metadata.ts'), 'utf8');
if (!indexing.includes("'/checkout'")) {
  fail('indexing-metadata.ts missing /checkout noindex prefix');
}

const pricingJson = path.join(root, 'frontend/public/pricing-policy.json');
if (!fs.existsSync(pricingJson)) {
  fail('missing frontend/public/pricing-policy.json — run build or seo:generate-ai-files');
} else {
  const policy = JSON.parse(fs.readFileSync(pricingJson, 'utf8'));
  if (!policy.policyUrl?.includes('/legal/regional-pricing')) {
    fail('pricing-policy.json policyUrl not aligned with /legal/regional-pricing');
  }
}

const sitemap = fs.readFileSync(path.join(root, 'frontend/app/sitemap.ts'), 'utf8');
const registry = fs.readFileSync(path.join(root, 'frontend/content/legal/registry.ts'), 'utf8');
if (
  !sitemap.includes('DYNAMIC_LEGAL_SLUGS') ||
  !registry.includes('regional-pricing')
) {
  fail('sitemap/legal registry missing regional-pricing route');
}

const plan = path.join(root, 'docs/PMSTRUCTURE_REGIONAL_PRICING_SEO_PLAN.md');
if (!fs.existsSync(plan)) {
  fail('missing docs/PMSTRUCTURE_REGIONAL_PRICING_SEO_PLAN.md');
}

if (failed) process.exit(1);
console.log('regional-pricing-check OK');
