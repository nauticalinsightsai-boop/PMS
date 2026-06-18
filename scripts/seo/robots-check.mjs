import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeReport } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const robotsPath = path.join(__dirname, '../../frontend/app/robots.ts');
const content = fs.readFileSync(robotsPath, 'utf8');
const issues = [];

if (!content.includes('sitemap')) {
  issues.push({ severity: 'critical', issue: 'robots.ts missing sitemap reference' });
}

if (!content.includes('PMS_SITE_URL') || !content.includes('/sitemap.xml')) {
  issues.push({
    severity: 'critical',
    issue: 'robots sitemap must use ${PMS_SITE_URL}/sitemap.xml (resolves to https://pmstructure.com in production)',
  });
}

if (/disallow:[\s\S]*['"]\/sitemap/i.test(content)) {
  issues.push({ severity: 'critical', issue: 'robots must not disallow /sitemap.xml' });
}

const badSitemapHosts = ['www.pmstructure.com', 'http://pmstructure.com', 'localhost:3000'];
for (const host of badSitemapHosts) {
  if (content.includes(host)) {
    issues.push({ severity: 'critical', issue: `robots.ts must not hardcode ${host} in sitemap line` });
  }
}

const publicRoutes = ['/pmp', '/pmp-faq', '/faq', '/answers', '/topics'];
for (const route of publicRoutes) {
  if (content.includes(`disallow: '${route}'`) || content.includes(`"${route}"`)) {
    issues.push({ severity: 'critical', issue: `robots may block ${route}` });
  }
}

writeReport('robots-check', { pass: issues.length === 0, issues });
if (issues.length) {
  console.error('robots-check FAIL', issues);
  process.exit(1);
}
console.log('robots-check OK');
