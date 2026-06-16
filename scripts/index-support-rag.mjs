#!/usr/bin/env node
/**
 * Index public site FAQ + answer content into Chroma Cloud for support chat RAG.
 * Requires CHROMA_* env vars (see docs/SUPPORT_CHATBOT.md).
 *
 * Usage: npm run index:support-rag
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const COLLECTION = process.env.CHROMA_SUPPORT_COLLECTION?.trim() || 'pms_support';

function loadEnv() {
  for (const file of ['.env', '.env.local']) {
    const envPath = path.join(ROOT, file);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match && !process.env[match[1].trim()]) {
        process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
      }
    }
  }
}

loadEnv();

function requireChromaEnv() {
  const missing = ['CHROMA_API_KEY', 'CHROMA_TENANT', 'CHROMA_DATABASE'].filter(
    (k) => !process.env[k]?.trim(),
  );
  if (missing.length) {
    console.error(`Missing env: ${missing.join(', ')}`);
    process.exit(1);
  }
}

function chromaBaseUrl() {
  const host = (process.env.CHROMA_HOST || 'api.trychroma.com').replace(/^https?:\/\//, '');
  return `https://${host}`;
}

async function chromaFetch(apiPath, init) {
  const res = await fetch(`${chromaBaseUrl()}${apiPath}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Chroma-Token': process.env.CHROMA_API_KEY.trim(),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Chroma ${res.status}: ${text.slice(0, 300)}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

function stripMarkdownLinks(text) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
}

async function loadContentChunks() {
  const faqModule = await import(
    pathToFileURL(path.join(ROOT, 'frontend/content/faq/data.ts')).href
  );
  const answersModule = await import(
    pathToFileURL(path.join(ROOT, 'frontend/content/answers/pages.ts')).href
  );

  const chunks = [];

  for (const entry of faqModule.FAQ_ENTRIES || []) {
    chunks.push({
      id: `faq-${entry.id}`,
      document: `Q: ${entry.question}\nA: ${stripMarkdownLinks(entry.answer)}`,
      metadata: { source: 'faq', title: entry.question, cluster: entry.clusterId },
    });
  }

  for (const page of answersModule.ANSWER_PAGES || []) {
    if (page.status === 'draft' || page.status === 'planned') continue;
    const body = [
      page.title,
      page.description,
      page.shortAnswer,
      page.detailedAnswer,
      page.whoApplies,
      ...(page.nextSteps || []),
      ...(page.faqs || []).map((f) => `Q: ${f.question}\nA: ${f.answer}`),
    ]
      .filter(Boolean)
      .join('\n\n');
    chunks.push({
      id: `answer-${page.slug}`,
      document: stripMarkdownLinks(body).slice(0, 6000),
      metadata: { source: 'answer', title: page.title, path: page.path },
    });
  }

  return chunks;
}

async function ensureCollection(tenant, database) {
  const collections = await chromaFetch(
    `/api/v2/tenants/${tenant}/databases/${database}/collections`,
    { method: 'GET' },
  );
  const list = Array.isArray(collections) ? collections : collections?.data || [];
  const existing = list.find((c) => c.name === COLLECTION);
  if (existing?.id) return existing.id;

  const created = await chromaFetch(
    `/api/v2/tenants/${tenant}/databases/${database}/collections`,
    {
      method: 'POST',
      body: JSON.stringify({ name: COLLECTION, metadata: { project: 'pmstructure-support' } }),
    },
  );
  return created.id;
}

async function upsertChunks(collectionId, tenant, database, chunks) {
  const batchSize = 50;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    await chromaFetch(
      `/api/v2/tenants/${tenant}/databases/${database}/collections/${collectionId}/upsert`,
      {
        method: 'POST',
        body: JSON.stringify({
          ids: batch.map((c) => c.id),
          documents: batch.map((c) => c.document),
          metadatas: batch.map((c) => c.metadata),
        }),
      },
    );
    console.log(`Upserted ${Math.min(i + batchSize, chunks.length)} / ${chunks.length}`);
  }
}

async function main() {
  requireChromaEnv();
  const tenant = process.env.CHROMA_TENANT.trim();
  const database = process.env.CHROMA_DATABASE.trim();

  console.log('Loading FAQ + answer content…');
  const chunks = await loadContentChunks();
  console.log(`Prepared ${chunks.length} chunks`);

  console.log(`Ensuring collection "${COLLECTION}"…`);
  const collectionId = await ensureCollection(tenant, database);

  console.log('Upserting into Chroma…');
  await upsertChunks(collectionId, tenant, database, chunks);

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
