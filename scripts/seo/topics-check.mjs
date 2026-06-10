/**
 * Verify topic hub pages exist and are in sitemap.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');

const hubsSrc = fs.readFileSync(path.join(root, 'frontend/content/topics/hubs.ts'), 'utf8');
const topicsIndex = fs.readFileSync(path.join(root, 'frontend/content/topics/index.ts'), 'utf8');
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
if (!sitemap.includes('getPublishedTopicPaths')) {
  console.error('topics-check FAIL: sitemap.ts missing getPublishedTopicPaths');
  failed = true;
}

if (!topicsIndex.includes('TOPIC_HUB_GROUPS')) {
  console.error('topics-check FAIL: topics/index.ts missing TOPIC_HUB_GROUPS');
  failed = true;
}
if (!topicsIndex.includes('getTopicFaqsForHub')) {
  console.error('topics-check FAIL: topics/index.ts missing getTopicFaqsForHub');
  failed = true;
}

const topicPage = fs.readFileSync(
  path.join(root, 'frontend/components/topics/TopicHubPage.tsx'),
  'utf8',
);
if (!topicPage.includes('Related FAQs') || !topicPage.includes('/pmp-faq')) {
  console.error('topics-check FAIL: TopicHubPage missing Related FAQs or /pmp-faq link');
  failed = true;
}

const topicsIndexPage = path.join(root, 'frontend/components/seo/TopicsIndexJsonLd.tsx');
if (!fs.existsSync(topicsIndexPage)) {
  console.error('topics-check FAIL: missing TopicsIndexJsonLd.tsx');
  failed = true;
}

const minHubs = 26;
if (slugs.length < minHubs) {
  console.error(`topics-check FAIL: expected >= ${minHubs} hubs, found ${slugs.length}`);
  failed = true;
}

const firstBatch = [
  'pmp-domain-weighting',
  'pmp-people-domain',
  'pmp-process-domain',
  'stakeholder-engagement',
  'project-delivery-readiness',
  'mock-exam-review',
  'pmp-study-plan',
  'predictive-project-management',
  'project-value-delivery',
];
for (const slug of firstBatch) {
  if (!slugs.includes(slug)) {
    console.error(`topics-check FAIL: missing first-batch hub slug: ${slug}`);
    failed = true;
  }
}

const topicSlugPage = fs.readFileSync(
  path.join(root, 'frontend/app/(site)/topics/[slug]/page.tsx'),
  'utf8',
);
if (!topicSlugPage.includes('getPublishedTopicHubs')) {
  console.error('topics-check FAIL: topic page must use getPublishedTopicHubs for static params');
  failed = true;
}
if (!topicSlugPage.includes('isTopicPublished')) {
  console.error('topics-check FAIL: topic page missing isTopicPublished noindex guard');
  failed = true;
}
if (!topicSlugPage.includes('index: false')) {
  console.error('topics-check FAIL: planned/draft hubs must set robots noindex in metadata');
  failed = true;
}
if (!topicsIndex.includes('isTopicPublished')) {
  console.error('topics-check FAIL: topics/index.ts missing isTopicPublished');
  failed = true;
}

if (failed) process.exit(1);
console.log(`topics-check OK (${slugs.length} topic hubs, planned-hub noindex wired)`);
