/**
 * Internal linking guard. PMP hub, homepage, and footer link to answers/topics.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const frontend = path.join(root, 'frontend');

const hub = fs.readFileSync(path.join(frontend, 'components/pmp/PmpHubPage.tsx'), 'utf8');
const pages = fs.readFileSync(path.join(frontend, 'content/pmp/pages.ts'), 'utf8');
const home = fs.readFileSync(path.join(frontend, 'components/pages/Home.tsx'), 'utf8');
const homePage = fs.readFileSync(path.join(frontend, 'app/(site)/page.tsx'), 'utf8');
const phase2Path = path.join(frontend, 'content/seo/phase-2-page-seo.ts');
let homePhase2Block = '';
if (fs.existsSync(phase2Path)) {
  const phase2 = fs.readFileSync(phase2Path, 'utf8');
  const homeStart = phase2.indexOf("  '/': {");
  const homeEnd = phase2.indexOf("  '/certifications': {");
  if (homeStart >= 0 && homeEnd > homeStart) {
    homePhase2Block = phase2.slice(homeStart, homeEnd);
  }
}
const homeUsesPhase2Related =
  (homePage.includes('RelatedGuidesLinks') && homePage.includes('getPhase2Seo')) ||
  (home.includes('RelatedGuidesLinks') && home.includes('getPhase2Seo'));
const homeLinks = home + homePage + (homeUsesPhase2Related ? homePhase2Block : '');
const footer = fs.readFileSync(path.join(frontend, 'components/Footer.tsx'), 'utf8');
const footerPmpNav = fs.readFileSync(
  path.join(frontend, 'components/footer/FooterPmpExam2026Nav.tsx'),
  'utf8',
);
const footerLinks = footer + footerPmpNav;
const hubRenderedLinks = hub + pages;

const hubLinks = [
  '/answers',
  '/topics',
  '/pmp-exam-2026',
  '/pmp-readiness-diagnostic',
  '/pmp-enrollment',
];
const homeRequiredLinks = ['/answers', '/topics', '/pmp-exam-2026'];
const footerRequiredLinks = ['/pmp-exam-2026'];
const obsoleteConsolidatedLinks = ['/topics/pmp-exam-2026'];
const liveLinkSurfaces = [
  ['PMP hub', hub],
  ['PMP cluster pages', pages],
  ['Home', homeLinks],
  ['Footer', footerLinks],
  [
    'Newsletter draft registry',
    fs.readFileSync(path.join(root, 'packages/site-content/src/newsletter-draft-registry.ts'), 'utf8'),
  ],
];

let failed = false;

for (const href of hubLinks) {
  if (!hubRenderedLinks.includes(href)) {
    console.error(`internal-links-check FAIL: PmpHubPage missing link to ${href}`);
    failed = true;
  }
}

if (!pages.includes('/answers')) {
  console.error('internal-links-check FAIL: PMP cluster relatedLinks missing /answers');
  failed = true;
}

for (const href of homeRequiredLinks) {
  if (!homeLinks.includes(href)) {
    console.error(`internal-links-check FAIL: Home missing link to ${href}`);
    failed = true;
  }
}

for (const href of footerRequiredLinks) {
  if (!footerLinks.includes(href)) {
    console.error(`internal-links-check FAIL: Footer missing link to ${href}`);
    failed = true;
  }
}

for (const obsoleteHref of obsoleteConsolidatedLinks) {
  for (const [surfaceName, source] of liveLinkSurfaces) {
    if (source.includes(obsoleteHref)) {
      console.error(
        `internal-links-check FAIL: ${surfaceName} contains obsolete consolidated link ${obsoleteHref}; use /pmp-exam-2026`,
      );
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('internal-links-check OK');
