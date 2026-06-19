/**
 * Curated community section photos (Unsplash license: https://unsplash.com/license).
 * Run: node scripts/process-community-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'frontend/public/images/marketing');
const sourceDir = path.join(outDir, 'community-image-sources');

/** Matches Home community grid: collab, workshop, mentor, network */
const COMMUNITY_IMAGES = [
  {
    name: 'community-collab-600',
    width: 600,
    height: 600,
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&w=900&h=900&fit=crop',
  },
  {
    name: 'community-workshop-600',
    width: 600,
    height: 450,
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&w=900&h=675&fit=crop',
  },
  {
    name: 'community-mentor-600',
    width: 600,
    height: 450,
    url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&w=900&h=675&fit=crop',
  },
  {
    name: 'community-network-600',
    width: 600,
    height: 600,
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&w=900&h=900&fit=crop',
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

  for (const { name, url, width, height } of COMMUNITY_IMAGES) {
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
