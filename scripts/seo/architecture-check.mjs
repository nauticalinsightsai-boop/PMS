/**
 * Site architecture guard (T-032).
 * Asserts shared breadcrumbs on priority pages and commercial PMP nav targets.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

function read(relPath) {
  return fs.readFileSync(path.join(frontend, relPath), 'utf8');
}

const navbar = read('components/Navbar.tsx');
const footer = read('components/Footer.tsx');
const certDetail = read('components/pages/CertificationDetail.tsx');
const comparePage = read('app/(site)/certifications/compare/page.tsx');
const faqPage = read('app/(site)/faq/page.tsx');
const legalLayout = read('components/legal/LegalDocumentLayout.tsx');
const answerPage = read('components/answers/AnswerPage.tsx');
const topicPage = read('components/topics/TopicHubPage.tsx');
const pmpPage = read('components/pmp/PmpAuthorityPage.tsx');
const hubs = read('content/topics/hubs.ts');
const routes = read('content/site-architecture/routes.ts');

const breadcrumbComponent = path.join(frontend, 'components/navigation/Breadcrumbs.tsx');
const breadcrumbSchema = path.join(frontend, 'components/navigation/breadcrumb-schema.ts');

let failed = false;

function fail(message) {
  console.error(`architecture-check FAIL: ${message}`);
  failed = true;
}

function assertIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    fail(`${label} missing expected "${needle}"`);
  }
}

function assertNotIncludes(content, needle, label) {
  if (content.includes(needle)) {
    fail(`${label} must not include "${needle}"`);
  }
}

if (!fs.existsSync(breadcrumbComponent)) {
  fail('components/navigation/Breadcrumbs.tsx not found');
}
if (!fs.existsSync(breadcrumbSchema)) {
  fail('components/navigation/breadcrumb-schema.ts not found');
}

assertIncludes(navbar, "href: \"/certifications/pmp\"", 'Navbar PMP link');
assertNotIncludes(navbar, 'href: "/pmp-exam-2026"', 'Navbar');
assertIncludes(navbar, 'href: "/faq"', 'Navbar FAQ link');

assertIncludes(footer, "href: '/certifications/pmp'", 'Footer primary PMP link');
assertIncludes(footer, "href: '/pmp-exam-2026'", 'Footer deep guide link');
assertIncludes(footer, "href: '/faq'", 'Footer FAQ link');
assertIncludes(footer, "href: '/topics/pmp-exam-2026'", 'Footer topic hub link');
assertIncludes(footer, "href: '/pm-service'", 'Footer PM Service link');

assertNotIncludes(navbar, '/docs/internal', 'Navbar');
assertNotIncludes(footer, '/docs/internal', 'Footer');

for (const [file, label] of [
  [certDetail, 'CertificationDetail'],
  [comparePage, 'compare page'],
  [faqPage, 'FAQ page'],
  [legalLayout, 'LegalDocumentLayout'],
  [answerPage, 'AnswerPage'],
  [topicPage, 'TopicHubPage'],
  [pmpPage, 'PmpAuthorityPage'],
]) {
  assertIncludes(file, 'Breadcrumbs', label);
  assertIncludes(file, 'site-architecture/routes', label);
}

assertIncludes(hubs, "ctaHref: '/certifications/pmp'", 'pmp-exam-2026 topic hub commercial CTA');
assertIncludes(routes, 'PMP_COMMERCIAL_PATH', 'site-architecture routes config');

if (failed) process.exit(1);
console.log('architecture-check OK');
