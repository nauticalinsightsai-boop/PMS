/**
 * Optional Chroma Cloud RAG retrieval for support chat.
 */

const COLLECTION = process.env.CHROMA_SUPPORT_COLLECTION?.trim() || 'pms_support';

function chromaConfigured() {
  return Boolean(
    process.env.CHROMA_API_KEY?.trim() &&
      process.env.CHROMA_TENANT?.trim() &&
      process.env.CHROMA_DATABASE?.trim(),
  );
}

function chromaBaseUrl() {
  const host = (process.env.CHROMA_HOST || 'api.trychroma.com').replace(/^https?:\/\//, '');
  return `https://${host}`;
}

async function chromaFetch(path, init) {
  const res = await fetch(`${chromaBaseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Chroma-Token': process.env.CHROMA_API_KEY.trim(),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Chroma ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * @param {string} query
 * @param {number} [nResults]
 * @returns {Promise<string>}
 */
export async function retrieveSupportContext(query, nResults = 6) {
  if (!chromaConfigured() || !query?.trim()) return '';

  const tenant = process.env.CHROMA_TENANT.trim();
  const database = process.env.CHROMA_DATABASE.trim();

  try {
    const collections = await chromaFetch(
      `/api/v2/tenants/${tenant}/databases/${database}/collections`,
      { method: 'GET' },
    );
    const list = Array.isArray(collections) ? collections : collections?.data || [];
    const collection = list.find((c) => c.name === COLLECTION || c.id === COLLECTION);
    if (!collection?.id) return '';

    const result = await chromaFetch(
      `/api/v2/tenants/${tenant}/databases/${database}/collections/${collection.id}/query`,
      {
        method: 'POST',
        body: JSON.stringify({
          query_texts: [query.trim()],
          n_results: nResults,
          include: ['documents', 'metadatas'],
        }),
      },
    );

    const docs = result?.documents?.[0] || [];
    const metas = result?.metadatas?.[0] || [];
    const chunks = docs.map((doc, i) => {
      const meta = metas[i] || {};
      const label = meta.source || meta.title || 'site';
      return `[${label}]\n${doc}`;
    });
    return chunks.join('\n\n---\n\n');
  } catch (err) {
    console.warn('[support-rag] retrieval failed:', err instanceof Error ? err.message : err);
    return '';
  }
}

export function isSupportRagConfigured() {
  return chromaConfigured();
}
