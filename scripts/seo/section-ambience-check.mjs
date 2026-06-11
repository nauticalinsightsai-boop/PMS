/**
 * Guard: SectionAmbience must not wrap page content (children are ignored: breaks SSR).
 * Correct pattern: <section><SectionAmbience /><div className="relative z-10">…</div></section>
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.join(__dirname, '../../frontend');

const scanRoots = ['components', 'app'];

/** Opening tag with children on next line (not self-closing) */
const misusePattern = /<SectionAmbience[^/>]*>\s*\n\s*</g;

let failed = false;
let scanned = 0;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      walk(full, files);
    } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx')) {
      files.push(full);
    }
  }
  return files;
}

const files = scanRoots.flatMap((root) => walk(path.join(frontend, root)));

for (const filePath of files) {
  const src = fs.readFileSync(filePath, 'utf8');
  if (!src.includes('SectionAmbience')) continue;
  scanned++;
  misusePattern.lastIndex = 0;
  if (misusePattern.test(src)) {
    const rel = path.relative(frontend, filePath).replace(/\\/g, '/');
    console.error(`section-ambience-check FAIL: ${rel} wraps children in <SectionAmbience> (use sibling pattern)`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`section-ambience-check OK (${scanned} files with SectionAmbience)`);