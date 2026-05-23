/**
 * Build transparent PRINCE2 logo assets (PNG + SVG) from source raster.
 * Usage: node scripts/build-prince2-logo.mjs [path-to-source-png]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DEFAULT_SRC =
  process.argv[2] ||
  path.join(
    ROOT,
    '..',
    '.cursor',
    'projects',
    'd-My-Websites-PMS-PMS',
    'assets',
    'c__Users_Sh3ik_AppData_Roaming_Cursor_User_workspaceStorage_cd3d5e49725791ff9128444b8295787d_images_image-ef5408ab-37d1-4d9e-8e90-ed180331100c.png',
  );

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
  const src = fs.existsSync(DEFAULT_SRC)
    ? DEFAULT_SRC
    : process.argv[2];
  if (!src || !fs.existsSync(src)) {
    console.error('Source image not found:', DEFAULT_SRC);
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

  const pngPath = path.join(OUT_DIR, 'prince2-logo.png');
  fs.writeFileSync(pngPath, trimmed);

  const b64 = trimmed.toString('base64');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="PRINCE2">
  <image width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${b64}"/>
</svg>`;

  const svgPath = path.join(OUT_DIR, 'prince2-logo.svg');
  fs.writeFileSync(svgPath, svg);

  console.log(`Wrote ${pngPath} (${width}x${height})`);
  console.log(`Wrote ${svgPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
