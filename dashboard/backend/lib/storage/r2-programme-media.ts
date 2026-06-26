import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

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

export function programmeMediaUsesR2(): boolean {
  const driver = process.env.PROGRAMME_MEDIA_STORAGE?.trim().toLowerCase();
  if (driver === 'supabase') return false;
  if (driver === 'r2') return isR2ProgrammeMediaConfigured();
  return isR2ProgrammeMediaConfigured();
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

export async function r2DeleteObject(key: string): Promise<void> {
  const client = getR2Client();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName(),
      Key: key,
    }),
  );
}
