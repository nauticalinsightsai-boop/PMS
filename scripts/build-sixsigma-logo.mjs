/**
 * Build transparent Lean Six Sigma logo assets (PNG + SVG) from source raster.
 * Usage: node scripts/build-sixsigma-logo.mjs [path-to-source-png]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'frontend', 'public', 'brand');

function removeNearBlackBackground(data) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r < 45 && g < 45 && b < 45) {
      data[i + 3] = 0;
    }
  }
}

async function main() {
  const src = process.argv[2];
  if (!src || !fs.existsSync(src)) {
    console.error('Usage: node scripts/build-sixsigma-logo.mjs <path-to-source-png>');
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  removeNearBlackBackground(data);

  const rgba = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  const trimmed = await sharp(rgba).trim({ threshold: 10 }).png().toBuffer();
  const { width, height } = await sharp(trimmed).metadata();

  const pngPath = path.join(OUT_DIR, 'sixsigma-logo.png');
  fs.writeFileSync(pngPath, trimmed);

  const b64 = trimmed.toString('base64');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Lean Six Sigma">
  <image width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${b64}"/>
</svg>`;

  fs.writeFileSync(path.join(OUT_DIR, 'sixsigma-logo.svg'), svg);

  console.log(`Wrote ${pngPath} (${width}x${height})`);
  console.log(`Wrote ${path.join(OUT_DIR, 'sixsigma-logo.svg')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
