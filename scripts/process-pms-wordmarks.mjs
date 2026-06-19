import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const brandDir = path.join(root, 'frontend/public/brand');

const SOURCES = {
  light:
    'C:/Users/Sh3ik/.cursor/projects/d-My-Websites-PMS/assets/c__Users_Sh3ik_AppData_Roaming_Cursor_User_workspaceStorage_f66bd09cedd349481f143b4d261adc3f_images_1-e1a4ae94-62a5-45ee-8383-dd3bdf18539f.png',
  dark:
    'C:/Users/Sh3ik/.cursor/projects/d-My-Websites-PMS/assets/c__Users_Sh3ik_AppData_Roaming_Cursor_User_workspaceStorage_f66bd09cedd349481f143b4d261adc3f_images_2-94baaa70-17b2-4f3e-a3a7-e029b4d384b1.png',
};

/** Square PMS mark for mobile nav/footer */
const MARK_SOURCES = {
  light:
    'C:/Users/Sh3ik/.cursor/projects/d-My-Websites-PMS/assets/c__Users_Sh3ik_AppData_Roaming_Cursor_User_workspaceStorage_f66bd09cedd349481f143b4d261adc3f_images_8-07e364b8-d874-4272-8d60-348a99fd9243.png',
  dark:
    'C:/Users/Sh3ik/.cursor/projects/d-My-Websites-PMS/assets/c__Users_Sh3ik_AppData_Roaming_Cursor_User_workspaceStorage_f66bd09cedd349481f143b4d261adc3f_images_9-3532bf78-c984-4ce8-b261-048d362f4bdb.png',
};

const MAX_WIDTH = 640;
const MARK_SIZE = 128;
const KEY_THRESHOLD = 24;
const CROP_PAD = 4;
const DARK_BG = { r: 7, g: 7, b: 28 };

/** Key near-black pixels and crop to visible bounds (trim() clips gradient text on wide wordmarks). */
function keyCropAndResizeFromBuffer(inputBuffer, maxWidth) {
  const { data, info } = inputBuffer;
  let minX = info.width;
  let minY = info.height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      let alpha = data[i + 3];
      if (r <= KEY_THRESHOLD && g <= KEY_THRESHOLD && b <= KEY_THRESHOLD) {
        alpha = 0;
        data[i + 3] = 0;
      } else {
        data[i + 3] = 255;
      }
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  minX = Math.max(0, minX - CROP_PAD);
  minY = Math.max(0, minY - CROP_PAD);
  maxX = Math.min(info.width - 1, maxX + CROP_PAD);
  maxY = Math.min(info.height - 1, maxY + CROP_PAD);
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  const keyed = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  const outW = Math.min(maxWidth, cropW);
  const outH = Math.round((cropH / cropW) * outW);
  return keyed
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .resize(outW, outH, { fit: 'inside', kernel: sharp.kernel.lanczos3 });
}

async function keyCropAndResize(sourcePath, maxWidth) {
  const inputBuffer = await sharp(sourcePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return keyCropAndResizeFromBuffer(inputBuffer, maxWidth);
}

async function processLight(sourcePath, outPath) {
  const pipeline = await keyCropAndResize(sourcePath, MAX_WIDTH);
  const out = await pipeline
    .flatten({ background: '#ffffff' })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toBuffer();
  fs.writeFileSync(outPath, out);
  return sharp(out).metadata();
}

async function processDark(sourcePath, outPath) {
  const pipeline = await keyCropAndResize(sourcePath, MAX_WIDTH);
  const keyed = await pipeline.png().toBuffer();
  const hasVisibleOnDark = await sharp(keyed).stats().then((s) => s.channels[3].mean > 2);
  let finalPipeline = sharp(keyed);
  if (!hasVisibleOnDark) {
    finalPipeline = finalPipeline.flatten({ background: DARK_BG });
  }
  const out = await finalPipeline
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toBuffer();
  fs.writeFileSync(outPath, out);
  return sharp(out).metadata();
}

async function keyNearBlack(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= KEY_THRESHOLD && g <= KEY_THRESHOLD && b <= KEY_THRESHOLD) {
      data[i + 3] = 0;
    }
  }
  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function processMarkLight(sourcePath, outPath) {
  let pipeline = sharp(sourcePath).trim({ threshold: 10 });
  const trimmedBuf = await pipeline.png().toBuffer();
  pipeline = await keyNearBlack(trimmedBuf);
  const out = await pipeline
    .resize(MARK_SIZE, MARK_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toBuffer();
  fs.writeFileSync(outPath, out);
  return sharp(out).metadata();
}

async function processMarkDark(sourcePath, outPath) {
  let pipeline = sharp(sourcePath).trim({ threshold: 10 });
  const trimmedBuf = await pipeline.png().toBuffer();
  pipeline = await keyNearBlack(trimmedBuf);
  const out = await pipeline
    .resize(MARK_SIZE, MARK_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true, palette: false })
    .toBuffer();
  fs.writeFileSync(outPath, out);
  return sharp(out).metadata();
}

async function main() {
  fs.mkdirSync(brandDir, { recursive: true });
  for (const mode of ['light', 'dark']) {
    const srcUser = SOURCES[mode];
    const backup = path.join(brandDir, `pms-logo-${mode}.source.png`);
    const out = path.join(brandDir, `pms-logo-${mode}.png`);
    fs.copyFileSync(srcUser, backup);
    console.log(`Backed up ${mode} -> ${path.relative(root, backup)}`);
    const meta =
      mode === 'light'
        ? // Light wordmark: derive from the dark master (light upload composites are unreliable)
          await processLight(SOURCES.dark, out)
        : await processDark(backup, out);
    const size = fs.statSync(out).size;
    console.log(
      `wordmark ${mode}: ${meta.width}x${meta.height} aspect=${(meta.width / meta.height).toFixed(3)} ${size} bytes`,
    );
  }
  for (const mode of ['light', 'dark']) {
    const srcUser = MARK_SOURCES[mode];
    const backup = path.join(brandDir, `pms-mark-${mode}.source.png`);
    const out = path.join(brandDir, `pms-mark-${mode}.png`);
    fs.copyFileSync(srcUser, backup);
    console.log(`Backed up mark ${mode} -> ${path.relative(root, backup)}`);
    const meta =
      mode === 'light' ? await processMarkLight(backup, out) : await processMarkDark(backup, out);
    const size = fs.statSync(out).size;
    console.log(`mark ${mode}: ${meta.width}x${meta.height} ${size} bytes`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
