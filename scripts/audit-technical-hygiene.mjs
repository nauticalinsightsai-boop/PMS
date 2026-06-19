/**
 * B09 technical hygiene audit (read-only).
 * Verifies B09 governance docs, runs insecure-content + internal link scans.
 * Usage: npm run audit:technical-hygiene
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const docsInternal = path.join(root, 'docs/internal');

const B09_DOCS = [
  'PMSTRUCTURE_TECHNICAL_HYGIENE.md',
  'pmstructure-technical-hygiene-audit.csv',
  'pmstructure-plugin-applicability-matrix.csv',
  'PMSTRUCTURE_EDITING_GUIDE.md',
  'PMSTRUCTURE_BACKUP_RESTORE_RUNBOOK.md',
];

let failed = false;

function fail(msg) {
  console.error(`audit-technical-hygiene FAIL: ${msg}`);
  failed = true;
}

function runScript(scriptRel, extraArgs = []) {
  const scriptPath = path.join(root, scriptRel);
  if (!fs.existsSync(scriptPath)) {
    fail(`missing script: ${scriptRel}`);
    return;
  }
  const result = spawnSync(process.execPath, [scriptPath, ...extraArgs], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    fail(`${scriptRel} exited ${result.status ?? 1}`);
  }
}

console.log('audit-technical-hygiene: B09 docs check\n');
for (const name of B09_DOCS) {
  const p = path.join(docsInternal, name);
  if (!fs.existsSync(p)) {
    fail(`missing docs/internal/${name}`);
  }
}
if (!failed) console.log('B09 governance artifacts present\n');

console.log('audit-technical-hygiene: delegate insecure-content scan\n');
runScript('scripts/audit-insecure-content.mjs');

console.log('\naudit-technical-hygiene: delegate internal link scan\n');
runScript('scripts/audit-links.mjs');

console.log(`\naudit-technical-hygiene: ${failed ? 'FAILED' : 'PASSED'}`);
process.exit(failed ? 1 : 0);
