#!/usr/bin/env node
/**
 * Apply CORS on the programme-media R2 bucket so large PDF/video uploads work from the admin UI.
 *
 * Requires in .env.local (or env):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME
 *   CLOUDFLARE_API_TOKEN (R2 edit permission)
 *
 * Optional: R2_CORS_ORIGINS=https://pmstructure.com,https://www.pmstructure.com,http://localhost:3000,http://localhost:3050,http://localhost:5174
 */
import { loadMonorepoEnvIntoProcess } from './lib/monorepo-env.mjs';

loadMonorepoEnvIntoProcess();

const accountId = process.env.R2_ACCOUNT_ID?.trim();
const bucket = process.env.R2_BUCKET_NAME?.trim();
const token = process.env.CLOUDFLARE_API_TOKEN?.trim();

const defaultOrigins = [
  'https://pmstructure.com',
  'https://www.pmstructure.com',
  'http://localhost:3000',
  'http://localhost:3050',
  'http://localhost:5174',
];

const origins = (process.env.R2_CORS_ORIGINS ?? defaultOrigins.join(','))
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

if (!accountId || !bucket || !token) {
  console.error(
    'Missing R2_ACCOUNT_ID, R2_BUCKET_NAME, or CLOUDFLARE_API_TOKEN.\n' +
      'Create an API token with Cloudflare R2 → Edit, then re-run: npm run r2:cors',
  );
  process.exit(1);
}

const corsRules = [
  {
    AllowedOrigins: origins,
    AllowedMethods: ['GET', 'PUT', 'HEAD'],
    AllowedHeaders: ['*'],
    ExposeHeaders: ['ETag'],
    MaxAgeSeconds: 3600,
  },
];

const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucket}/cors`;

const res = await fetch(url, {
  method: 'PUT',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ rules: corsRules }),
});

const data = await res.json().catch(() => ({}));
if (!res.ok) {
  console.error('Failed to set R2 CORS:', JSON.stringify(data, null, 2));
  process.exit(1);
}

console.log(`R2 CORS updated for bucket "${bucket}".`);
console.log('Allowed origins:', origins.join(', '));
