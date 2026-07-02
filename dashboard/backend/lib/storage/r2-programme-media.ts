import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type R2ObjectSummary = {
  key: string;
  lastModified?: Date;
};

function trimSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

export function isR2ProgrammeMediaConfigured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID?.trim() &&
      process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET_NAME?.trim() &&
      process.env.R2_PUBLIC_BASE_URL?.trim(),
  );
}

export type ProgrammeMediaStorageDriver = 'r2' | 'supabase';

/** Resolved storage backend for programme PDFs/videos/images (CMS certification uploads). */
export function programmeMediaStorageDriver(): ProgrammeMediaStorageDriver {
  const driver = process.env.PROGRAMME_MEDIA_STORAGE?.trim().toLowerCase();
  if (driver === 'supabase') return 'supabase';
  // Default: Cloudflare R2 (see .env.example). Do not fall back to Supabase silently.
  return 'r2';
}

export function programmeMediaUsesR2(): boolean {
  return programmeMediaStorageDriver() === 'r2';
}

export function programmeMediaStorageNotConfiguredMessage(): string {
  if (programmeMediaStorageDriver() === 'supabase') {
    return 'Programme media Supabase storage is not configured (SUPABASE_SERVICE_ROLE_KEY and bucket).';
  }
  return 'Cloudflare R2 is required for certification videos, PDFs, and images. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_BASE_URL on the dashboard backend.';
}

export function programmeMediaMaxBytes(): number {
  if (programmeMediaUsesR2()) {
    const mb = Number(process.env.R2_PROGRAMME_MEDIA_MAX_MB ?? '500');
    if (Number.isFinite(mb) && mb > 0) return Math.floor(mb * 1024 * 1024);
    return 500 * 1024 * 1024;
  }
  return 52_428_800;
}

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID!.trim();
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!.trim(),
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!.trim(),
    },
  });
}

function bucketName(): string {
  return process.env.R2_BUCKET_NAME!.trim();
}

export function r2PublicUrl(objectKey: string): string {
  const base = trimSlash(process.env.R2_PUBLIC_BASE_URL!.trim());
  const key = objectKey.replace(/^\/+/, '');
  return `${base}/${key}`;
}

export async function r2ListObjects(prefix: string): Promise<R2ObjectSummary[]> {
  const client = getR2Client();
  const normalizedPrefix = prefix ? `${prefix.replace(/\/+$/, '')}/` : '';
  const out: R2ObjectSummary[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucketName(),
        Prefix: normalizedPrefix || undefined,
        ContinuationToken: continuationToken,
        MaxKeys: 200,
      }),
    );

    for (const item of response.Contents ?? []) {
      if (!item.Key || item.Key.endsWith('/')) continue;
      out.push({ key: item.Key, lastModified: item.LastModified });
    }

    continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;
  } while (continuationToken);

  return out.sort((a, b) => (b.lastModified?.getTime() ?? 0) - (a.lastModified?.getTime() ?? 0));
}

export async function r2UploadObject(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<void> {
  const client = getR2Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucketName(),
      Key: params.key,
      Body: params.body,
      ContentType: params.contentType,
    }),
  );
}

export async function r2CreatePresignedPutUrl(params: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const client = getR2Client();
  const command = new PutObjectCommand({
    Bucket: bucketName(),
    Key: params.key,
    ContentType: params.contentType,
  });
  return getSignedUrl(client, command, { expiresIn: params.expiresInSeconds ?? 3600 });
}

export async function r2DeleteObject(key: string): Promise<void> {
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName(),
      Key: key,
    }),
  );
}

export function defaultR2CorsOrigins(): string[] {
  const origins = [
    'https://pmstructure.com',
    'https://www.pmstructure.com',
    'http://localhost:3000',
    'http://localhost:3050',
    'http://localhost:5174',
  ];
  const railway = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  if (railway) origins.push(`https://${railway}`);
  const extra = process.env.R2_CORS_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean) ?? [];
  return [...new Set([...origins, ...extra])];
}

/** Allow browser direct-to-R2 uploads from the admin UI (required for files over Vercel body limit). */
export async function r2ApplyBucketCors(origins: string[] = defaultR2CorsOrigins()): Promise<void> {
  const client = getR2Client();
  await client.send(
    new PutBucketCorsCommand({
      Bucket: bucketName(),
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'HEAD', 'POST'],
            AllowedOrigins: origins,
            ExposeHeaders: ['ETag', 'Content-Length'],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  );
}
