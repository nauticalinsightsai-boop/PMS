/**
 * OA-009: Batch Lighthouse mobile capture for priority URLs.
 * Usage: node scripts/seo/psi-batch-capture.mjs [--base=https://pmstructure.com]
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../..');
const evidenceDir = path.join(root, 'docs/internal/evidence');

const baseArg = process.argv.find((a) => a.startsWith('--base='));
const base = (baseArg?.slice(7) ?? 'https://pmstructure.com').replace(/\/$/, '');
const stamp = new Date().toISOString().slice(0, 10);

const paths = [
  { slug: 'home', path: '/', formFactor: 'mobile' },
  { slug: 'certifications', path: '/certifications', formFactor: 'mobile' },
  { slug: 'cert-pmp', path: '/certifications/pmp', formFactor: 'mobile' },
  { slug: 'faq', path: '/faq', formFactor: 'mobile' },
  { slug: 'cert-compare', path: '/certifications/compare', formFactor: 'mobile' },
  { slug: 'answers-hub', path: '/answers', formFactor: 'mobile' },
  { slug: 'topics-hub', path: '/topics', formFactor: 'mobile' },
  { slug: 'topics-pmp-2026', path: '/topics/pmp-exam-2026', formFactor: 'mobile' },
  { slug: 'pmp-hub', path: '/pmp', formFactor: 'mobile' },
  { slug: 'pmp-exam-2026', path: '/pmp-exam-2026', formFactor: 'mobile' },
  { slug: 'go-website', path: '/go/website', formFactor: 'mobile' },
  { slug: 'legal-privacy', path: '/legal/privacy', formFactor: 'mobile' },
  { slug: 'legal-terms', path: '/legal/terms', formFactor: 'mobile' },
  { slug: 'home-desktop', path: '/', formFactor: 'desktop' },
  { slug: 'certifications-desktop', path: '/certifications', formFactor: 'desktop' },
  { slug: 'cert-pmp-desktop', path: '/certifications/pmp', formFactor: 'desktop' },
];

const summary = [];

fs.mkdirSync(evidenceDir, { recursive: true });
console.log(`psi-batch-capture: ${base} (${paths.length} runs)\n`);

for (const item of paths) {
  const url = `${base}${item.path}`;
  const file = path.join(evidenceDir, `lighthouse-${item.slug}-${stamp}.json`);
  const relOut = path.relative(root, file).replace(/\\/g, '/');
  try {
    console.log(`→ ${item.slug} (${item.formFactor})`);
    execFileSync(
      'npx',
      [
        'lighthouse',
        url,
        '--quiet',
        '--chrome-flags=--headless',
        ...(item.formFactor === 'desktop' ? ['--preset=desktop'] : [`--form-factor=${item.formFactor}`]),
        '--only-categories=performance,accessibility,best-practices,seo',
        '--output=json',
        `--output-path=${relOut}`,
      ],
      { stdio: 'pipe', cwd: root, shell: true },
    );
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    const scores = Object.fromEntries(
      Object.entries(raw.categories ?? {}).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]),
    );
    summary.push({ ...item, url, file: relOut, ok: true, scores });
    console.log(
      `  perf=${scores.performance} a11y=${scores.accessibility} bp=${scores['best-practices']} seo=${scores.seo}\n`,
    );
  } catch (err) {
    summary.push({ ...item, url, ok: false, error: err.message });
    console.error(`  FAIL: ${err.message}\n`);
  }
}

const summaryPath = path.join(evidenceDir, `psi-batch-summary-${stamp}.json`);
fs.writeFileSync(
  summaryPath,
  JSON.stringify({ base, capturedAt: new Date().toISOString(), summary }, null, 2),
);
console.log(`Wrote ${path.relative(root, summaryPath)}`);
