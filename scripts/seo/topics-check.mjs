/**
 * Verify topic hub pages exist and are in sitemap.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

const hubsSrc = fs.readFileSync(path.join(root, 'frontend/content/topics/hubs.ts'), 'utf8');
const slugs = [...hubsSrc.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]);

let failed = false;

const dynamicPage = path.join(root, 'frontend/app/(site)/topics/[slug]/page.tsx');
const indexPage = path.join(root, 'frontend/app/(site)/topics/page.tsx');

if (!fs.existsSync(dynamicPage)) {
  console.error('topics-check FAIL: missing topics/[slug]/page.tsx');
  failed = true;
}
if (!fs.existsSync(indexPage)) {
  console.error('topics-check FAIL: missing topics/page.tsx');
  failed = true;
}

const sitemap = fs.readFileSync(path.join(root, 'frontend/app/sitemap.ts'), 'utf8');
if (!sitemap.includes('TOPIC_PATHS')) {
  console.error('topics-check FAIL: sitemap.ts missing TOPIC_PATHS');
  failed = true;
}

const minHubs = 17;
if (slugs.length < minHubs) {
  console.error(`topics-check FAIL: expected >= ${minHubs} hubs, found ${slugs.length}`);
  failed = true;
}

if (failed) process.exit(1);
console.log(`topics-check OK (${slugs.length} topic hubs)`);
