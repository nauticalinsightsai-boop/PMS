/**
 * Aggregate SEO validation summary to reports/seo/summary.json
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureReportsDir, REPORTS_DIR } from './lib/report-writer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reportsDir = REPORTS_DIR;

ensureReportsDir();
const reportFiles = fs.existsSync(reportsDir)
  ? fs.readdirSync(reportsDir).filter((f) => f.endsWith('.json') && f !== 'summary.json')
  : [];

const checks = reportFiles.map((file) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(reportsDir, file), 'utf8'));
    return {
      file,
      pass: data.pass !== false,
      generatedAt: data.generatedAt,
    };
  } catch {
    return { file, pass: false, error: 'parse failed' };
  }
});

const summary = {
  generatedAt: new Date().toISOString(),
  reportCount: checks.length,
  passCount: checks.filter((c) => c.pass).length,
  failCount: checks.filter((c) => !c.pass).length,
  checks,
};

fs.writeFileSync(path.join(reportsDir, 'summary.json'), JSON.stringify(summary, null, 2));
console.log('seo-summary OK', summary.passCount, 'pass', summary.failCount, 'fail');
