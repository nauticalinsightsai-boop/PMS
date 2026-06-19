/**
 * Generate self-hosted marketing WebP placeholders (brand-neutral gradients).
 * Run: node scripts/generate-marketing-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'frontend/public/images/marketing');
const brandDir = path.join(root, 'frontend/public/brand');

const GRADIENTS = {
  'hero-social-avatar-1': ['#2851b9', '#bc6ae2'],
  'hero-social-avatar-2': ['#ff4a38', '#ff884a'],
  'hero-social-avatar-3': ['#0859b3', '#57d5e2'],
  'hero-social-avatar-4': ['#696ff7', '#ef67ca'],
  'community-collab-600': ['#2851b9', '#57d5e2'],
  'community-workshop-600': ['#ff4a38', '#bc6ae2'],
  'community-mentor-600': ['#0859b3', '#bc6ae2'],
  'community-network-600': ['#696ff7', '#57d5e2'],
  'mentorship-circle-900': ['#2851b9', '#ff884a'],
  'membership-templates-500': ['#2851b9', '#bc6ae2'],
  'membership-guides-500': ['#ff4a38', '#ff884a'],
  'membership-tools-500': ['#0859b3', '#57d5e2'],
  'membership-webinars-500': ['#696ff7', '#ef67ca'],
  'about-workshop-800': ['#2851b9', '#bc6ae2'],
  'about-session-800': ['#ff4a38', '#57d5e2'],
  'pmp-avatar-amara': ['#2851b9', '#bc6ae2'],
  'pmp-avatar-david': ['#ff4a38', '#ff884a'],
  'pmp-avatar-priya': ['#0859b3', '#57d5e2'],
  'pmp-avatar-james': ['#696ff7', '#ef67ca'],
  'pmp-avatar-sarah': ['#bc6ae2', '#ff884a'],
  'pmp-avatar-hassan': ['#2851b9', '#ff4a38'],
  'pmp-avatar-elena': ['#57d5e2', '#2851b9'],
  'pmp-avatar-michael': ['#434855', '#57d5e2'],
  'pmp-avatar-fatima': ['#ff884a', '#bc6ae2'],
  'pmp-avatar-robert': ['#0859b3', '#696ff7'],
};

function svgGradient(name, w, h, [c1, c2]) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`,
  );
}

async function writeWebp(name, w, h, colors) {
  const dest = path.join(outDir, `${name}.webp`);
  await sharp(svgGradient(name, w, h, colors)).webp({ quality: 82 }).toFile(dest);
  console.log('Wrote', path.relative(root, dest));
}

async function writeWordmark(filename, bg, iconPath) {
  const w = 332;
  const h = 80;
  const bgSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="${bg}"/>
    </svg>`,
  );
  const icon = await sharp(iconPath).resize(64, 64).png().toBuffer();
  const dest = path.join(brandDir, filename);
  await sharp(bgSvg)
    .composite([{ input: icon, left: 8, top: 8 }])
    .png({ compressionLevel: 9 })
    .toFile(dest);
  console.log('Wrote', path.relative(root, dest));
}

async function writeOgDefault(iconPath) {
  const ogDir = path.join(root, 'frontend/public/og');
  fs.mkdirSync(ogDir, { recursive: true });
  const w = 1200;
  const h = 630;
  const bgSvg = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2851b9"/>
          <stop offset="50%" stop-color="#bc6ae2"/>
          <stop offset="100%" stop-color="#ff884a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>`,
  );
  const dest = path.join(ogDir, 'default.png');
  if (fs.existsSync(iconPath)) {
    const icon = await sharp(iconPath).resize(280, 280).png().toBuffer();
    await sharp(bgSvg)
      .composite([{ input: icon, left: Math.round((w - 280) / 2), top: Math.round((h - 280) / 2 - 20) }])
      .png({ compressionLevel: 9 })
      .toFile(dest);
  } else {
    await sharp(bgSvg).png({ compressionLevel: 9 }).toFile(dest);
  }
  console.log('Wrote', path.relative(root, dest));
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(brandDir, { recursive: true });

  const avatars = Object.keys(GRADIENTS).filter((k) => k.startsWith('hero-social') || k.startsWith('pmp-avatar'));
  for (const name of avatars) {
    const size = name.startsWith('pmp-avatar') ? 96 : 80;
    const dest = path.join(outDir, `${name}.webp`);
    if (name.startsWith('hero-social') && fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      console.log('Skip', path.relative(root, dest), '(curated photo; use process-hero-social-avatars.mjs)');
      continue;
    }
    if (name.startsWith('pmp-avatar') && fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      console.log('Skip', path.relative(root, dest), '(curated photo; use process-pmp-avatars.mjs)');
      continue;
    }
    await writeWebp(name, size, size, GRADIENTS[name]);
  }

  const communitySpecs = [
    ['community-collab-600', 600, 600],
    ['community-workshop-600', 600, 450],
    ['community-mentor-600', 600, 450],
    ['community-network-600', 600, 600],
  ];
  for (const [name, w, h] of communitySpecs) {
    const dest = path.join(outDir, `${name}.webp`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
      console.log('Skip', path.relative(root, dest), '(curated photo; use process-community-images.mjs)');
      continue;
    }
    await writeWebp(name, w, h, GRADIENTS[name]);
  }
  const sectionSpecs = [
    ['mentorship-circle-900', 900, 900],
    ['membership-templates-500', 500, 500],
    ['membership-guides-500', 500, 500],
    ['membership-tools-500', 500, 500],
    ['membership-webinars-500', 500, 500],
    ['about-workshop-800', 800, 1000],
    ['about-session-800', 800, 800],
  ];
  for (const [name, w, h] of sectionSpecs) {
    const dest = path.join(outDir, `${name}.webp`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 8000) {
      console.log('Skip', path.relative(root, dest), '(curated photo; use process-section-images.mjs)');
      continue;
    }
    await writeWebp(name, w, h, GRADIENTS[name]);
  }

  const iconLight = path.join(brandDir, 'pms-icon.png');
  const iconDark = path.join(brandDir, 'pms-icon-dark.png');
  if (fs.existsSync(iconLight)) {
    await writeWordmark('pms-logo-light.png', '#ffffff', iconLight);
  }
  if (fs.existsSync(iconDark)) {
    await writeWordmark('pms-logo-dark.png', '#07071c', iconDark);
  }

  if (fs.existsSync(iconLight)) {
    await writeOgDefault(iconLight);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
