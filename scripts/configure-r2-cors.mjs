#!/usr/bin/env node
/**
 * Apply CORS on the programme-media R2 bucket so large PDF/video uploads work from the admin UI.
 *
 * Uses R2 S3 API credentials from .env.local (no Cloudflare API token required).
 * Optional fallback: CLOUDFLARE_API_TOKEN for the Cloudflare REST API.
 *
 * Optional: R2_CORS_ORIGINS=https://pmstructure.com,https://www.pmstructure.com,...
 */
import { loadMonorepoEnvIntoProcess } from './lib/monorepo-env.mjs';
import { PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3';

loadMonorepoEnvIntoProcess();

const accountId = process.env.R2_ACCOUNT_ID?.trim();
const bucket = process.env.R2_BUCKET_NAME?.trim();
const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
const token = process.env.CLOUDFLARE_API_TOKEN?.trim();

const defaultOrigins = [
  'https://pmstructure.com',
  'https://www.pmstructure.com',
  'http://localhost:3000',
  'http://localhost:3050',
  'http://localhost:5174',
];

if (process.env.RAILWAY_PUBLIC_DOMAIN?.trim()) {
  defaultOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN.trim()}`);
}

const origins = (process.env.R2_CORS_ORIGINS ?? defaultOrigins.join(','))
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsRules = [
  {
    AllowedOrigins: origins,
    AllowedMethods: ['GET', 'PUT', 'HEAD', 'POST'],
    AllowedHeaders: ['*'],
    ExposeHeaders: ['ETag', 'Content-Length'],
    MaxAgeSeconds: 3600,
  },
];

async function applyViaS3Api() {
  if (!accountId || !bucket || !accessKeyId || !secretAccessKey) {
    return false;
  }

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });

  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: { CORSRules: corsRules },
    }),
  );
  return true;
}

async function applyViaCloudflareApi() {
  if (!accountId || !bucket || !token) return false;

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
    console.error('Cloudflare API CORS failed:', JSON.stringify(data, null, 2));
    return false;
  }
  return true;
}

try {
  if (await applyViaS3Api()) {
    console.log(`R2 CORS updated via S3 API for bucket "${bucket}".`);
    console.log('Allowed origins:', origins.join(', '));
    process.exit(0);
  }

  if (await applyViaCloudflareApi()) {
    console.log(`R2 CORS updated via Cloudflare API for bucket "${bucket}".`);
    console.log('Allowed origins:', origins.join(', '));
    process.exit(0);
  }

  console.error(
    'Could not set R2 CORS. Need R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in .env.local',
  );
  process.exit(1);
} catch (err) {
  console.error('Failed to set R2 CORS:', err instanceof Error ? err.message : err);
  process.exit(1);
}
