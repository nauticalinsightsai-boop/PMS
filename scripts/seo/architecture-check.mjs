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
const footerPmpNav = read('components/footer/FooterPmpExam2026Nav.tsx');
const footerExamLinks = read('content/pmp/footer-exam-2026-nav.ts');
const certDetail = read('components/pages/CertificationDetail.tsx');
const comparePage = read('app/(site)/certifications/compare/page.tsx');
const faqPage = read('app/(site)/faq/page.tsx');
const legalLayout = read('components/legal/LegalDocumentLayout.tsx');
const answerPage = read('components/answers/AnswerPage.tsx');
const topicPage = read('components/topics/TopicHubPage.tsx');
const pmpPage = read('components/pmp/PmpAuthorityPage.tsx');
const hubs = read('content/topics/hubs.ts');
const routes = read('content/site-architecture/routes.ts');
const faqConstants = read('constants/faq.ts');

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

function assertPattern(content, pattern, label) {
  if (!pattern.test(content)) {
    fail(`${label} missing expected pattern ${pattern}`);
  }
}

if (!fs.existsSync(breadcrumbComponent)) {
  fail('components/navigation/Breadcrumbs.tsx not found');
}
if (!fs.existsSync(breadcrumbSchema)) {
  fail('components/navigation/breadcrumb-schema.ts not found');
}

assertPattern(navbar, /href:\s*["']\/certifications\/pmp["']/, 'Navbar PMP link');
assertNotIncludes(navbar, 'href: "/pmp-exam-2026"', 'Navbar');
assertPattern(navbar, /href:\s*["']\/pm-service["']/, 'Navbar PM Service link');

assertIncludes(footer, 'FAQ_HUB_PATH', 'Footer FAQ hub constant');
assertIncludes(footer, 'FooterPmpExam2026Nav', 'Footer PMP 2026 nav component');
assertIncludes(footerExamLinks, "href: '/certifications/pmp'", 'footer-exam-2026-nav PMP link');
assertIncludes(footerExamLinks, "href: '/faq'", 'footer-exam-2026-nav FAQ link');
assertIncludes(footerPmpNav, 'href="/pmp-exam-2026"', 'FooterPmpExam2026Nav deep guide link');
assertIncludes(faqConstants, "FAQ_HUB_PATH = '/faq'", 'FAQ_HUB_PATH');

assertNotIncludes(navbar, '/docs/internal', 'Navbar');
assertNotIncludes(footer, '/docs/internal', 'Footer');

for (const [file, label] of [
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

assertPattern(
  certDetail,
  /ArrowLeft|getPhase2RelatedBlock/,
  'CertificationDetail navigation or related block',
);

assertPattern(
  hubs,
  /slug:\s*['"]pmp-exam-2026['"][\s\S]*?ctaHref:\s*['"]\/certifications\/pmp/,
  'pmp-exam-2026 topic hub commercial CTA',
);
assertIncludes(routes, 'PMP_COMMERCIAL_PATH', 'site-architecture routes config');

if (failed) process.exit(1);
console.log('architecture-check OK');
