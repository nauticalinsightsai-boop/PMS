/**
 * Download diverse professional headshots and write hero social avatars (96×96 WebP).
 * Run: node scripts/process-hero-social-avatars.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'frontend/public/images/marketing');
const sourceDir = path.join(outDir, 'hero-social-avatar-sources');

/** Unsplash — free for commercial use (https://unsplash.com/license) */
const AVATARS = [
  {
    name: 'hero-social-avatar-1',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&w=256&h=256&fit=crop&crop=faces',
    alt: 'Professional learner portrait',
  },
  {
    name: 'hero-social-avatar-2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&w=256&h=256&fit=crop&crop=faces',
    alt: 'Professional learner portrait',
  },
  {
    name: 'hero-social-avatar-3',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&w=256&h=256&fit=crop&crop=faces',
    alt: 'Professional learner portrait',
  },
  {
    name: 'hero-social-avatar-4',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=256&h=256&fit=crop&crop=faces',
    alt: 'Professional learner portrait',
  },
  /** Owner-provided portrait — source only (no remote fetch). */
  {
    name: 'hero-social-avatar-founder',
    localOnly: true,
    alt: 'Sheikh M. Abdullah',
  },
];

const OUT_SIZE = 96;

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });

  for (const entry of AVATARS) {
    const { name } = entry;
    const sourcePath = path.join(
      sourceDir,
      `${name}${fs.existsSync(path.join(sourceDir, `${name}.png`)) ? '.png' : '.jpg'}`,
    );
    const outPath = path.join(outDir, `${name}.webp`);

    if (!fs.existsSync(sourcePath)) {
      if (entry.localOnly) {
        console.warn(`Skip ${name}: add source at ${path.relative(root, path.join(sourceDir, `${name}.png`))}`);
        continue;
      }
      const buf = await fetchBuffer(entry.url);
      fs.writeFileSync(sourcePath, buf);
      console.log(`Downloaded ${path.relative(root, sourcePath)}`);
    }

    const out = await sharp(sourcePath)
      .resize(OUT_SIZE, OUT_SIZE, { fit: 'cover', position: 'attention' })
      .webp({ quality: 85 })
      .toBuffer();

    fs.writeFileSync(outPath, out);
    console.log(`${name}: ${OUT_SIZE}×${OUT_SIZE} ${out.length} bytes`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
