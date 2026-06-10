import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const REPORTS_DIR = path.join(__dirname, '../../../reports/seo');

export function ensureReportsDir() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export function writeReport(name, data) {
  ensureReportsDir();
  const file = path.join(REPORTS_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify({ generatedAt: new Date().toISOString(), ...data }, null, 2));
  return file;
}
