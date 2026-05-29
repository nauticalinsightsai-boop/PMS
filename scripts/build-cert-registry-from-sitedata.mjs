/**
 * Build packages/site-content/data/certifications-registry.json from frontend/data/siteData.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as siteData from '../frontend/data/siteData.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../packages/site-content/data/certifications-registry.json');

const entries = siteData.certifications.map((cert, index) => ({
  id: cert.id,
  name: cert.name,
  familyId: cert.familyId,
  desc: cert.desc,
  color: cert.color,
  gradient: cert.gradient,
  hidden: false,
  archived: false,
  sortOrder: index,
  detailHeroTitle: `${cert.name} Pathway`,
  detailHeroSubtitle: cert.desc,
  outputValue: cert.outputValue ?? '',
  recommendedCta: cert.recommendedCTA ?? '',
  targetAudience: cert.targetAudience ?? '',
}));

const payload = { version: 1, entries };
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
console.log(`Wrote ${entries.length} certifications to ${outPath}`);
