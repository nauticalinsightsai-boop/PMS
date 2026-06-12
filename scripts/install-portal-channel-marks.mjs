#!/usr/bin/env node
/**
 * Copy staged portal mark PNGs from Cursor assets into frontend/public/images/logo/.
 * Run after dropping source files into assets/ with the filenames below.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetsDir =
  process.env.PORTAL_MARK_ASSETS_DIR ??
  path.join(process.env.USERPROFILE ?? '', '.cursor', 'projects', 'd-My-Websites-PMS', 'assets');
const outDir = path.join(root, 'frontend', 'public', 'images', 'logo');

/** Source suffix (after images_) → destination filename */
const COPY_MAP = {
  '4-2ba3a396-4a76-4895-858b-fb8237b4a8eb': 'medium-mark-dark.png',
  '5-2b3dc68f-229a-40d4-9eaf-aedf1957b10e': 'medium-mark-light.png',
  '6-f816bd14-5160-4950-92d8-3abe9cf79ebe': 'substack-mark.png',
  '7-818180d9-eeaa-4c70-85e4-e4d3585d830b': 'beehiiv-mark-light.png',
  '8-be3c598c-b7bc-4790-b4ea-88c7b1c27d6a': 'beehiiv-mark-dark.png',
  '10-346fc18a-245c-4dc8-8143-dec76b7fdf89': 'hashnode-mark.png',
  '11-fd8f5457-fea4-4d8c-bd61-efe0461a17d1': 'notion-mark-light.png',
  '12-b4553fca-c691-4cc6-b175-adcbf470d4ad': 'notion-mark-dark.png',
  '13-bb6a49f8-6f3a-4f09-9df6-6540cc9cb083': 'linkedin-mark.png',
  '14-2ac02dfe-2397-45ed-a1dd-e3077f98281a': 'x-mark-light.png',
  '15-ea9d2756-9415-4c7a-9ed0-bf869e448772': 'x-mark-dark.png',
  '16-1e8e352f-7f4d-4301-80f1-74f4ce1853a5': 'instagram-mark.png',
  '19-cfb5782b-1e05-449c-8f08-c53f46429a8b': 'vk-mark.png',
  '20-af4fde07-4a54-4deb-8611-452214e9ca4e': 'reddit-mark.png',
  '21-a893b04d-718e-4370-8db8-44ef375eb3b4': 'pinterest-mark.png',
  '22-38f237dc-81a1-4f6c-b223-f496770bc4ea': 'mastodon-mark.png',
  '23-2c078805-73b1-46a3-b0dc-70c08fa5c647': 'bluesky-mark.png',
  '24-6bb8ef27-36fd-491c-a480-f32bac3180d9': 'quora-mark.png',
  '25-65ddd591-df61-424a-aa9d-6714cc54c872': 'snapchat-mark.png',
  '26-292ee8b5-1827-493e-b347-4f6859f1549c': 'tiktok-mark.png',
  '27-dd8d7d79-6444-4746-9fc6-4004313a795e': 'vimeo-mark.png',
  '28-80449a36-f7f5-48d5-a4fc-e097e0d4003a': 'amazon-audible-mark.png',
  '29-e4ae4d58-82a6-4363-9875-a815b86027d0': 'apple-podcasts-mark.png',
  '30-4c22c3e8-02a3-4d47-9c14-bd12dbfaab89': 'google-podcasts-mark.png',
  '31-3ed3dd62-148c-4524-8129-a93c1c767330': 'podbean-mark.png',
  '32-eb0fc323-ac8a-4c61-b610-0b6d0a652ac7': 'soundcloud-mark.png',
  '33-d2426e07-8622-40be-9ccb-bdfb4ed965d9': 'spotify-mark.png',
  '34-818d2561-010f-4363-82ca-7eb72e93dc14': 'discord-mark.png',
  '35-9be85053-64d8-47d7-9a3e-b0a4992cfaa1': 'slack-mark.png',
  '36-ea7961b0-4de7-42ca-8b68-33534bc41300': 'telegram-mark.png',
  '37-b3cc20e8-a899-452f-a68b-8fdca6fcf68c': 'whatsapp-mark.png',
  '38-b4651298-ce29-48a5-b41e-e770986efe9f': 'bing-search-mark.png',
  '39-7bbab038-386a-4b5f-a70a-6edb638f4a30': 'google-search-mark.png',
  '9-6555de76-8673-4f91-8782-e69452c24582': 'ai-visibility-mark.png',
  '48-6c89908b-569c-4415-adc0-7e720292e7ab': 'api-ai-fed-mark-dark.png',
  '49-ee43fe42-684e-40d9-ab34-3c55307e453f': 'api-ai-fed-mark-light.png',
};

function findAsset(suffix) {
  if (!fs.existsSync(assetsDir)) return null;
  const hit = fs.readdirSync(assetsDir).find((name) => name.includes(`images_${suffix}.png`));
  return hit ? path.join(assetsDir, hit) : null;
}

fs.mkdirSync(outDir, { recursive: true });

let copied = 0;
let missing = 0;

for (const [suffix, destName] of Object.entries(COPY_MAP)) {
  const src = findAsset(suffix);
  const dest = path.join(outDir, destName);
  if (!src) {
    console.warn(`skip (missing source): ${destName}`);
    missing += 1;
    continue;
  }
  fs.copyFileSync(src, dest);
  console.log(`copied → ${destName}`);
  copied += 1;
}

console.log(`\nDone: ${copied} copied, ${missing} missing, output ${outDir}`);
