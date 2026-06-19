/**
 * Section / membership / about photos (Unsplash license: https://unsplash.com/license).
 * Run: node scripts/process-section-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'frontend/public/images/marketing');
const sourceDir = path.join(outDir, 'section-image-sources');

const SECTION_IMAGES = [
  {
    name: 'mentorship-circle-900',
    width: 900,
    height: 900,
    url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&w=1200&h=1200&fit=crop',
  },
  {
    name: 'membership-templates-500',
    width: 500,
    height: 500,
    url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&w=800&h=800&fit=crop',
  },
  {
    name: 'membership-guides-500',
    width: 500,
    height: 500,
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&w=800&h=800&fit=crop',
  },
  {
    name: 'membership-tools-500',
    width: 500,
    height: 500,
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&w=800&h=800&fit=crop',
  },
  {
    name: 'membership-webinars-500',
    width: 500,
    height: 500,
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&w=800&h=800&fit=crop',
  },
  {
    name: 'about-workshop-800',
    width: 800,
    height: 1000,
    url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&w=900&h=1125&fit=crop',
  },
  {
    name: 'about-session-800',
    width: 800,
    height: 800,
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&w=900&h=900&fit=crop',
  },
];

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });

  for (const { name, url, width, height } of SECTION_IMAGES) {
    const sourcePath = path.join(sourceDir, `${name}.jpg`);
    const outPath = path.join(outDir, `${name}.webp`);

    if (!fs.existsSync(sourcePath)) {
      const buf = await fetchBuffer(url);
      fs.writeFileSync(sourcePath, buf);
      console.log(`Downloaded ${path.relative(root, sourcePath)}`);
    }

    const out = await sharp(sourcePath)
      .resize(width, height, { fit: 'cover', position: 'attention' })
      .webp({ quality: 82 })
      .toBuffer();

    fs.writeFileSync(outPath, out);
    console.log(`${name}: ${width}×${height} ${out.length} bytes`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
