import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureReportsDir, REPORTS_DIR } from './lib/report-writer.mjs';
import { AI_TEST_QUERIES } from './ai-test-queries.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

ensureReportsDir();
const queries = AI_TEST_QUERIES;

fs.writeFileSync(
  path.join(REPORTS_DIR, 'ai-answer-test-queries.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), queries }, null, 2),
);
const csv = [
  'testId,group,query,expectedUrl,status,notes',
  ...queries.map(
    (q, i) => `T${String(i + 1).padStart(2, '0')},${q.group},"${q.query.replace(/"/g, '""')}",${q.expected},NOT TESTED,`,
  ),
].join('\n');
fs.writeFileSync(path.join(REPORTS_DIR, 'ai-answer-test-queries.csv'), csv + '\n');

if (queries.length < 80) {
  console.error(`generate-ai-test-sheet FAIL: expected >= 80 queries, got ${queries.length}`);
  process.exit(1);
}
console.log('generate-ai-test-sheet OK', queries.length, 'rows');
