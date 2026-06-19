/**
 * Compress brand app icons for LCP (forms, BrandIconMark).
 * Run: node scripts/optimize-brand-icons.mjs
 * Keeps PNG + writes WebP at 128px max display size.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = path.join(root, 'frontend/public/brand');
const MAX_PX = 128;

const ICONS = [
  { base: 'pms-icon', backup: 'pms-icon.source.png' },
  { base: 'pms-icon-dark', backup: 'pms-icon-dark.source.png' },
];

async function optimizeOne(base, backupName) {
  const pngPath = path.join(brandDir, `${base}.png`);
  if (!fs.existsSync(pngPath)) {
    console.warn(`skip missing ${pngPath}`);
    return null;
  }

  const before = fs.statSync(pngPath).size;
  const backupPath = path.join(brandDir, backupName);
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(pngPath, backupPath);
    console.log(`Backed up → ${path.relative(root, backupPath)}`);
  }

  const pipeline = sharp(pngPath).resize(MAX_PX, MAX_PX, {
    fit: 'inside',
    withoutEnlargement: true,
  });

  const optimizedPng = await pipeline.clone().png({ compressionLevel: 9, palette: true }).toBuffer();
  const webp = await pipeline.clone().webp({ quality: 85 }).toBuffer();

  fs.writeFileSync(pngPath, optimizedPng);
  fs.writeFileSync(path.join(brandDir, `${base}.webp`), webp);

  const afterPng = fs.statSync(pngPath).size;
  const afterWebp = fs.statSync(path.join(brandDir, `${base}.webp`)).size;
  console.log(
    `${base}: ${Math.round(before / 1024)}KB → PNG ${Math.round(afterPng / 1024)}KB, WebP ${Math.round(afterWebp / 1024)}KB`,
  );

  return { base, before, afterPng, afterWebp };
}

async function main() {
  fs.mkdirSync(brandDir, { recursive: true });
  for (const { base, backup } of ICONS) {
    await optimizeOne(base, backup);
  }
  console.log('Done. Bump BRAND_ICON_ASSET_VERSION in frontend/lib/brand-visual.ts');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
