/**
 * Curated testimonial headshots (Unsplash license: https://unsplash.com/license).
 * Run: node scripts/process-pmp-avatars.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'frontend/public/images/marketing');
const sourceDir = path.join(outDir, 'pmp-avatar-sources');

/** Diverse professional portraits for testimonials and social proof. */
const PMP_AVATARS = [
  {
    name: 'pmp-avatar-sarah',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-michael',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-elena',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-james',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-amara',
    url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-david',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-priya',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-hassan',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-fatima',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
  {
    name: 'pmp-avatar-robert',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&w=256&h=256&fit=crop&crop=faces',
  },
];

const OUT_SIZE = 128;

async function fetchBuffer(url) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });

  for (const { name, url } of PMP_AVATARS) {
    const sourcePath = path.join(sourceDir, `${name}.jpg`);
    const outPath = path.join(outDir, `${name}.webp`);

    if (!fs.existsSync(sourcePath)) {
      const buf = await fetchBuffer(url);
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
