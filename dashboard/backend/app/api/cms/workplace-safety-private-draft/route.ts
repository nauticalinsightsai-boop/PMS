import { createHash } from 'node:crypto';
import { NextRequest } from 'next/server';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FIELD_KEY = 'newsletter_posts_registry';
const RECORD_ID = 'post-workplace-safety-basics';
const SLUG = 'workplace-safety-basics';
const TITLE = 'Workplace Safety Basics Every Team Should Know';
const SOURCE_SEED_SHA256 = '42374CBD0B1FDE2F16FAE0D2F0F489DFD0FCA1387D67616DF80231204F6E34CB';
const BODY_SHA256 = 'CEBDFF11E134831C04E4FEFD7AEBC36DECEC646BC958AD63B7DB824BBF328734';
const CONTENT =
  'Safety culture starts with clear expectations, visible leadership, and practical controls.\n\n## Start with hazard identification\n\nWalk the site regularly and document risks before incidents occur.';

type RegistryPost = Record<string, unknown> & {
  id?: unknown;
  slug?: unknown;
  title?: unknown;
  status?: unknown;
};

type Registry = Record<string, unknown> & {
  version: 1;
  posts: RegistryPost[];
};

type RegistryRow = {
  content: unknown;
  is_published: boolean;
  updated_at: string;
};

type Repository = {
  load: () => Promise<RegistryRow | null>;
  compareAndSwap: (expectedUpdatedAt: string, content: Registry) => Promise<boolean>;
};

type Dependencies = {
  authorize: (request: Request) => Promise<Response | null>;
  repository: Repository;
  now: () => string;
};

class ContractError extends Error {
  constructor(readonly code: string, readonly status = 409) {
    super(code);
  }
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex').toUpperCase();
}

function json(data: Record<string, unknown>, status = 200): Response {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });
}

function fail(error: unknown): Response {
  const code = error instanceof ContractError ? error.code : 'private_draft_internal_error';
  const status = error instanceof ContractError ? error.status : 500;
  return json({ ok: false, code }, status);
}

function exactKeys(value: Record<string, unknown>, expected: string[]): boolean {
  const actual = Object.keys(value).sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
}

function validateInput(raw: unknown): void {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ContractError('contract_invalid', 400);
  }
  const input = raw as Record<string, unknown>;
  if (!exactKeys(input, ['action', 'contract'])) throw new ContractError('contract_fields_invalid', 400);
  if (input.action !== 'create_private_draft') throw new ContractError('action_invalid', 400);
  if (!input.contract || typeof input.contract !== 'object' || Array.isArray(input.contract)) {
    throw new ContractError('contract_invalid', 400);
  }
  const contract = input.contract as Record<string, unknown>;
  if (!exactKeys(contract, ['bodySha256', 'id', 'slug', 'sourceSeedSha256', 'title'])) {
    throw new ContractError('contract_fields_invalid', 400);
  }
  if (contract.id !== RECORD_ID) throw new ContractError('record_id_invalid', 400);
  if (contract.slug !== SLUG) throw new ContractError('slug_invalid', 400);
  if (contract.title !== TITLE) throw new ContractError('title_invalid', 400);
  if (contract.sourceSeedSha256 !== SOURCE_SEED_SHA256) {
    throw new ContractError('source_seed_hash_invalid', 400);
  }
  if (contract.bodySha256 !== BODY_SHA256) throw new ContractError('body_hash_invalid', 400);
}

function parseRegistry(raw: unknown): Registry {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new ContractError('registry_invalid', 503);
  }
  const registry = raw as Record<string, unknown>;
  if (registry.version !== 1 || !Array.isArray(registry.posts)) {
    throw new ContractError('registry_invalid', 503);
  }
  return registry as Registry;
}

function normalizeTitle(value: unknown): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').toLowerCase() : '';
}

function matchesExactPost(post: RegistryPost): boolean {
  if (typeof post.publishDate !== 'string' || post.publishDate !== post.modifiedDate) return false;
  return JSON.stringify(post) === JSON.stringify(buildPrivateDraft(post.publishDate));
}

function classify(registry: Registry): 'missing' | 'exact_replay' {
  const idMatches = registry.posts.filter((post) => post.id === RECORD_ID);
  const slugMatches = registry.posts.filter((post) => post.slug === SLUG);
  const titleMatches = registry.posts.filter((post) => normalizeTitle(post.title) === normalizeTitle(TITLE));
  const union = new Set([...idMatches, ...slugMatches, ...titleMatches]);
  if (union.size === 0) return 'missing';
  if (
    union.size === 1 &&
    idMatches.length === 1 &&
    slugMatches.length === 1 &&
    titleMatches.length === 1 &&
    matchesExactPost(idMatches[0])
  ) {
    return 'exact_replay';
  }
  throw new ContractError('identity_conflict');
}

function buildPrivateDraft(now: string): RegistryPost {
  if (sha256(CONTENT) !== BODY_SHA256) throw new ContractError('compiled_body_hash_mismatch', 500);
  return {
    id: RECORD_ID,
    slug: SLUG,
    title: TITLE,
    description: 'Foundational safety practices for teams starting or refreshing their HSE program.',
    metaTitle: TITLE,
    metaDescription: 'Foundational safety practices for teams starting or refreshing their HSE program.',
    keywords: '',
    status: 'draft',
    publishDate: now,
    modifiedDate: now,
    author: 'PM Structure Editorial',
    authorId: '',
    topics: ['topic-safety'],
    youtubeUrl: '',
    featuredImageUrl: '',
    featuredImageMobileUrl: '',
    heroImageAlt: '',
    emailSubject: '',
    emailPreheader: '',
    ctaLabel: '',
    ctaUrl: '',
    editorMeta: {
      tone: 'informative',
      template: 'news_roundup',
      segment: 'all',
      sectionCount: 4,
      rawNotes: '',
    },
    audioUrl: '',
    content: CONTENT,
  };
}

function response(post: RegistryPost, wrote: boolean, updatedAt: string): Response {
  return json({
    ok: true,
    wrote,
    classification: wrote ? 'CREATED_PRIVATE_DRAFT' : 'EXACT_REPLAY_NO_WRITE',
    sourceSeedSha256: SOURCE_SEED_SHA256,
    bodySha256: BODY_SHA256,
    updatedAt,
    record: post,
  });
}

async function handleRequest(request: Request, dependencies: Dependencies): Promise<Response> {
  try {
    const auth = await dependencies.authorize(request);
    if (auth) return auth;

    let input: unknown;
    try {
      input = await request.json();
    } catch {
      throw new ContractError('invalid_json', 400);
    }
    validateInput(input);

    const row = await dependencies.repository.load();
    if (!row) throw new ContractError('registry_unavailable', 503);
    const registry = parseRegistry(row.content);
    const state = classify(registry);
    if (state === 'exact_replay') {
      const existing = registry.posts.find((post) => post.id === RECORD_ID)!;
      return response(existing, false, row.updated_at);
    }

    const post = buildPrivateDraft(dependencies.now());
    const next: Registry = { ...registry, posts: [...registry.posts, post] };
    const wrote = await dependencies.repository.compareAndSwap(row.updated_at, next);
    if (!wrote) {
      const concurrent = await dependencies.repository.load();
      if (!concurrent) throw new ContractError('compare_and_swap_failed');
      const concurrentRegistry = parseRegistry(concurrent.content);
      if (classify(concurrentRegistry) === 'exact_replay') {
        const existing = concurrentRegistry.posts.find((candidate) => candidate.id === RECORD_ID)!;
        return response(existing, false, concurrent.updated_at);
      }
      throw new ContractError('compare_and_swap_failed');
    }

    const reread = await dependencies.repository.load();
    if (!reread) throw new ContractError('hard_reread_failed', 500);
    const persisted = parseRegistry(reread.content);
    if (classify(persisted) !== 'exact_replay') {
      throw new ContractError('hard_reread_mismatch', 500);
    }
    const persistedPost = persisted.posts.find((candidate) => candidate.id === RECORD_ID)!;
    return response(persistedPost, true, reread.updated_at);
  } catch (error) {
    return fail(error);
  }
}

function productionRepository(): Repository {
  return {
    async load() {
      if (!isSupabaseAdminConfigured()) return null;
      const { data, error } = await getSupabaseAdmin()
        .from('website_data')
        .select('content,is_published,updated_at')
        .eq('field_key', FIELD_KEY)
        .maybeSingle();
      if (error) throw new ContractError('registry_read_failed', 500);
      return data as RegistryRow | null;
    },
    async compareAndSwap(expectedUpdatedAt, content) {
      if (!isSupabaseAdminConfigured()) return false;
      const updatedAt = new Date().toISOString();
      const { data, error } = await getSupabaseAdmin()
        .from('website_data')
        .update({ content, updated_at: updatedAt })
        .eq('field_key', FIELD_KEY)
        .eq('updated_at', expectedUpdatedAt)
        .select('updated_at')
        .maybeSingle();
      if (error) throw new ContractError('registry_write_failed', 500);
      return Boolean(data);
    },
  };
}

async function postHandler(request: NextRequest): Promise<Response> {
  return handleRequest(request, {
    authorize: (candidate) => requireDashboardMutationAuth(candidate as NextRequest),
    repository: productionRepository(),
    now: () => new Date().toISOString(),
  });
}

export const POST = Object.assign(postHandler, {
  __test: {
    BODY_SHA256,
    RECORD_ID,
    SLUG,
    SOURCE_SEED_SHA256,
    TITLE,
    buildPrivateDraft,
    handleRequest,
    sha256,
  },
});
