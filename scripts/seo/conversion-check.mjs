import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeReport } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.join(__dirname, '../../frontend');
const issues = [];

const checkoutPaths = ['checkout', 'checkout/success', 'checkout/cancel'];
for (const p of checkoutPaths) {
  const candidates = [
    path.join(frontend, `app/(site)/${p}/page.tsx`),
    path.join(frontend, `app/(site)/${p}/layout.tsx`),
  ];
  const text = candidates.filter((f) => fs.existsSync(f)).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
  if (!text) continue;
  const hasNoindex =
    text.includes('index: false') ||
    text.includes('noindex') ||
    text.includes('robots: { index: false');
  if (!hasNoindex) {
    issues.push({ severity: 'high', path: `/${p}`, issue: 'verify noindex on checkout route' });
  }
}

const conversionEvents = path.join(frontend, 'lib/analytics/conversion-events.ts');
if (!fs.existsSync(conversionEvents)) {
  issues.push({ severity: 'medium', issue: 'missing conversion-events.ts' });
} else {
  const ce = fs.readFileSync(conversionEvents, 'utf8');
  for (const ev of [
    'view_pmp_exam_2026',
    'click_enroll_pmp_foundation',
    'click_pmp_diagnostic',
    'view_pmp_faq',
    'view_answer_page',
    'view_topic_hub',
    'start_checkout',
    'consultation_book',
    'region_select',
    'view_pmp_pathway',
  ]) {
    if (!ce.includes(ev)) {
      issues.push({ severity: 'medium', issue: `conversion-events missing ${ev}` });
    }
  }
}

const legalConstants = fs.readFileSync(path.join(frontend, 'constants/legal.ts'), 'utf8');
const footer = fs.readFileSync(path.join(frontend, 'components/Footer.tsx'), 'utf8');
if (
  !legalConstants.includes("'privacy'") ||
  !footer.includes('FOOTER_LEGAL_LINKS')
) {
  issues.push({ severity: 'medium', issue: 'footer missing privacy link' });
}

const regionModal = fs.readFileSync(
  path.join(frontend, 'components/RegionSelectorModal.tsx'),
  'utf8',
);
if (!regionModal.includes('REGION_SELECT')) {
  issues.push({ severity: 'medium', issue: 'RegionSelectorModal missing region_select event' });
}

const certDetail = fs.readFileSync(
  path.join(frontend, 'components/pages/CertificationDetail.tsx'),
  'utf8',
);
if (!certDetail.includes('VIEW_PMP_PATHWAY')) {
  issues.push({ severity: 'medium', issue: 'CertificationDetail missing view_pmp_pathway tracker' });
}

writeReport('conversion-check', { pass: issues.length === 0, issues });
if (issues.some((i) => i.severity === 'critical')) process.exit(1);
console.log(issues.length ? `conversion-check WARN (${issues.length})` : 'conversion-check OK');
