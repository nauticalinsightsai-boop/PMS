import { createHash, randomUUID } from 'node:crypto';
import { NextRequest } from 'next/server';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ITEM07_POST_ID =
  'post-capm-2026-domain-map-fundamentals-predictive-agile-business-analysis';
const NEWSLETTER_POSTS_FIELD_KEY = 'newsletter_posts_registry';

const ITEM07_POLICY: Item07Policy = {
  postId: ITEM07_POST_ID,
  bodySha256: 'ED9B8C02D0D9048A204EB4362558C47D473377594FF3FDBD68D014BB9F920F75',
  firstTableSha256: '7AB102C26195E6A09C982A9592E909244DFAB534ED43B8C43DFEDA2717EE4CB6',
  secondTableSha256: 'A32E5550F8B9ADCF008ACDF99F55D18FEC6A92E08682F7CF29D83AEB5488837F',
};

const TABLE_MARKER = 'data-pms-responsive-table="item07-t01-stacked-cards"';
const HEADER_IDS = [
  'item07-t01-domain',
  'item07-t01-published-proportion',
  'item07-t01-evidence-question',
  'item07-t01-practice-action',
] as const;
const LABELS = ['Domain', 'Published proportion', 'Evidence question', 'Practice action'] as const;
const CONFIRM_PREFIX = 'APPLY ITEM07 T01';
const ROLLBACK_PREFIX = 'ROLLBACK ITEM07 T01';

type Item07Policy = {
  postId: string;
  bodySha256: string;
  firstTableSha256: string;
  secondTableSha256: string;
};

type RegistryPost = {
  id?: unknown;
  status?: unknown;
  content?: unknown;
  [key: string]: unknown;
};

type Registry = {
  version?: unknown;
  posts?: unknown;
  [key: string]: unknown;
};

type NewsletterRegistryRow = {
  content: unknown;
  is_published: boolean;
  updated_at: string;
};

type WriterRepository = {
  load: () => Promise<NewsletterRegistryRow | null>;
  compareAndSwap: (
    expectedUpdatedAt: string,
    content: Record<string, unknown>,
  ) => Promise<boolean>;
};

type WriterDependencies = {
  authorize: (request: Request) => Promise<Response | null>;
  repository: WriterRepository;
  policy?: Item07Policy;
};

type WriterAction = 'preview' | 'apply' | 'rollback';
type PatchClassification = 'READY' | 'NO_CHANGE' | 'ROLLBACK_AVAILABLE';

type PatchPlan = {
  classification: PatchClassification;
  nextContent: Record<string, unknown> | null;
  bodyBeforeSha256: string;
  bodyAfterSha256: string;
  firstTableBeforeSha256: string;
  firstTableAfterSha256: string;
  secondTableSha256: string;
  confirmation: string | null;
};

class WriterError extends Error {
  constructor(
    readonly code: string,
    readonly status = 409,
  ) {
    super(code);
  }
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex').toUpperCase();
}

const REQUEST_ID_HEADER = 'x-pms-request-id';
const ERROR_CODE_HEADER = 'x-pms-error-code';

function json(
  data: Record<string, unknown>,
  status = 200,
  headers?: Record<string, string>,
): Response {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store', ...headers },
  });
}

function fail(error: unknown, requestId: string): Response {
  const code = error instanceof WriterError ? error.code : 'writer_internal_error';
  const status = error instanceof WriterError ? error.status : 500;
  return json(
    { ok: false, code, requestId },
    status,
    { [REQUEST_ID_HEADER]: requestId, [ERROR_CODE_HEADER]: code },
  );
}

type TableSlice = { html: string; start: number; end: number };

function extractTables(content: string): TableSlice[] {
  const tables: TableSlice[] = [];
  const pattern = /<table\b[\s\S]*?<\/table>/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(content))) {
    tables.push({ html: match[0], start: match.index, end: match.index + match[0].length });
  }
  return tables;
}

function addAttributes(openingTag: string, attributes: string): string {
  return openingTag.replace(/>$/, ` ${attributes}>`);
}

/** Transform only the exact locked first table; cell text is never supplied by the caller. */
function buildSemanticFirstTable(tableHtml: string): string {
  if (!/<table\b/i.test(tableHtml)) {
    throw new WriterError('first_table_invalid');
  }

  let headerIndex = 0;
  let bodyCellIndex = 0;
  let inBody = false;
  const tokens = tableHtml.split(/(<\/?(?:table|thead|tbody|tr|th|td)\b[^>]*>)/gi);

  const transformed = tokens.map((token) => {
    if (/^<tbody\b/i.test(token)) inBody = true;
    if (/^<\/tbody\b/i.test(token)) inBody = false;

    if (/^<table\b/i.test(token)) {
      return addAttributes(token, TABLE_MARKER);
    }
    if (!inBody && /^<th\b/i.test(token)) {
      if (headerIndex >= HEADER_IDS.length) throw new WriterError('first_table_header_count_invalid');
      const result = addAttributes(
        token,
        `id="${HEADER_IDS[headerIndex]}" scope="col"`,
      );
      headerIndex += 1;
      return result;
    }
    if (inBody && /^<td\b/i.test(token)) {
      const column = bodyCellIndex % HEADER_IDS.length;
      const attributes = `headers="${HEADER_IDS[column]}" data-label="${LABELS[column]}"`;
      bodyCellIndex += 1;
      if (column === 0) {
        return addAttributes(token.replace(/^<td\b/i, '<th'), `${attributes} scope="row"`);
      }
      return addAttributes(token, attributes);
    }
    if (inBody && /^<\/td>/i.test(token) && (bodyCellIndex - 1) % HEADER_IDS.length === 0) {
      return token.replace(/^<\/td>/i, '</th>');
    }
    return token;
  });

  if (headerIndex !== 4 || bodyCellIndex !== 16) {
    throw new WriterError('first_table_shape_invalid');
  }
  return transformed.join('');
}

function restoreLockedFirstTable(tableHtml: string): string {
  if (!tableHtml.includes(TABLE_MARKER)) throw new WriterError('rollback_marker_missing');
  return tableHtml
    .replace(
      /<th([^>]*) headers="item07-t01-domain" data-label="Domain" scope="row">([\s\S]*?)<\/th>/gi,
      '<td$1>$2</td>',
    )
    .replace(` ${TABLE_MARKER}`, '')
    .replace(/ id="item07-t01-[^"]+" scope="col"/g, '')
    .replace(/ headers="item07-t01-[^"]+" data-label="[^"]+"/g, '');
}

function parseRegistry(raw: unknown): { registry: Registry & { posts: RegistryPost[] }; postIndex: number } {
  if (!raw || typeof raw !== 'object') throw new WriterError('registry_invalid');
  const registry = raw as Registry;
  if (registry.version !== 1 || !Array.isArray(registry.posts)) {
    throw new WriterError('registry_invalid');
  }
  const posts = registry.posts as RegistryPost[];
  const matches = posts
    .map((post, index) => ({ post, index }))
    .filter(({ post }) => post && post.id === ITEM07_POST_ID);
  if (matches.length !== 1) throw new WriterError('item07_uniqueness_invalid');
  return { registry: registry as Registry & { posts: RegistryPost[] }, postIndex: matches[0].index };
}

function makePlan(raw: unknown, action: WriterAction, policy: Item07Policy): PatchPlan {
  const { registry, postIndex } = parseRegistry(raw);
  const post = registry.posts[postIndex];
  if (post.id !== policy.postId) throw new WriterError('item07_identity_invalid');
  if (post.status !== 'draft') throw new WriterError('item07_not_draft');
  if (typeof post.content !== 'string') throw new WriterError('item07_body_invalid');

  const body = post.content;
  const tables = extractTables(body);
  if (tables.length < 2) throw new WriterError('item07_table_count_invalid');
  const first = tables[0];
  const second = tables[1];
  if (sha256(second.html) !== policy.secondTableSha256) {
    throw new WriterError('second_table_hash_mismatch');
  }

  const currentBodySha = sha256(body);
  const currentFirstSha = sha256(first.html);
  const isLockedBefore =
    currentBodySha === policy.bodySha256 && currentFirstSha === policy.firstTableSha256;
  const isSuccessor = first.html.includes(TABLE_MARKER);

  let nextFirst: string;
  let classification: PatchClassification;
  let confirmation: string | null;

  if (isLockedBefore) {
    nextFirst = buildSemanticFirstTable(first.html);
    classification = 'READY';
    confirmation = `${CONFIRM_PREFIX} ${policy.bodySha256.slice(0, 8)}`;
    if (action === 'rollback') throw new WriterError('rollback_not_available');
  } else if (isSuccessor) {
    nextFirst = restoreLockedFirstTable(first.html);
    const restoredBody = body.slice(0, first.start) + nextFirst + body.slice(first.end);
    if (
      sha256(nextFirst) !== policy.firstTableSha256 ||
      sha256(restoredBody) !== policy.bodySha256
    ) {
      throw new WriterError('successor_hash_mismatch');
    }
    classification = action === 'rollback' ? 'ROLLBACK_AVAILABLE' : 'NO_CHANGE';
    confirmation = action === 'rollback'
      ? `${ROLLBACK_PREFIX} ${sha256(body).slice(0, 8)}`
      : null;
  } else {
    throw new WriterError('item07_body_hash_mismatch');
  }

  const nextBody = body.slice(0, first.start) + nextFirst + body.slice(first.end);
  const beforeOutside = body.slice(0, first.start) + body.slice(first.end);
  const afterOutside = nextBody.slice(0, first.start) + nextBody.slice(first.start + nextFirst.length);
  if (beforeOutside !== afterOutside) throw new WriterError('outside_subtree_changed');

  let nextContent: Record<string, unknown> | null = null;
  if ((action === 'apply' && classification === 'READY') || action === 'rollback') {
    const nextPosts = registry.posts.map((candidate, index) =>
      index === postIndex ? { ...candidate, content: nextBody } : candidate,
    );
    nextContent = { ...registry, posts: nextPosts };
  }

  return {
    classification,
    nextContent,
    bodyBeforeSha256: currentBodySha,
    bodyAfterSha256: sha256(nextBody),
    firstTableBeforeSha256: currentFirstSha,
    firstTableAfterSha256: sha256(nextFirst),
    secondTableSha256: sha256(second.html),
    confirmation,
  };
}

function responseForPlan(plan: PatchPlan, updatedAt: string, wrote: boolean): Response {
  return json({
    ok: true,
    record: ITEM07_POST_ID,
    classification: plan.classification,
    wrote,
    updatedAt,
    confirmation: plan.confirmation,
    hashes: {
      bodyBefore: plan.bodyBeforeSha256,
      bodyAfter: plan.bodyAfterSha256,
      firstTableBefore: plan.firstTableBeforeSha256,
      firstTableAfter: plan.firstTableAfterSha256,
      secondTable: plan.secondTableSha256,
    },
  });
}

async function handleNewsletterFirstTableRequest(
  request: Request,
  dependencies: WriterDependencies,
): Promise<Response> {
  const requestId = randomUUID();
  try {
    const auth = await dependencies.authorize(request);
    if (auth) return auth;

    let input: { action?: unknown; expectedUpdatedAt?: unknown; confirmation?: unknown };
    try {
      input = (await request.json()) as typeof input;
    } catch {
      throw new WriterError('invalid_json', 400);
    }
    if (!['preview', 'apply', 'rollback'].includes(String(input.action))) {
      throw new WriterError('action_invalid', 400);
    }
    const action = input.action as WriterAction;
    const row = await dependencies.repository.load();
    if (!row) throw new WriterError('registry_unavailable', 503);
    const policy = dependencies.policy ?? ITEM07_POLICY;
    const plan = makePlan(row.content, action, policy);

    const isRollbackPreview =
      action === 'rollback' &&
      input.expectedUpdatedAt === undefined &&
      input.confirmation === undefined;
    if (action === 'preview' || isRollbackPreview || plan.classification === 'NO_CHANGE') {
      return responseForPlan(plan, row.updated_at, false);
    }
    if (input.expectedUpdatedAt !== row.updated_at) {
      throw new WriterError('preview_stale');
    }
    if (typeof input.confirmation !== 'string' || input.confirmation !== plan.confirmation) {
      throw new WriterError('confirmation_invalid');
    }
    if (!plan.nextContent) throw new WriterError('writer_plan_invalid');

    const wrote = await dependencies.repository.compareAndSwap(row.updated_at, plan.nextContent);
    if (!wrote) throw new WriterError('compare_and_swap_failed');

    const reread = await dependencies.repository.load();
    if (!reread) throw new WriterError('hard_reread_failed', 500);
    const verified = makePlan(reread.content, 'preview', policy);
    if (action === 'apply' && verified.classification !== 'NO_CHANGE') {
      throw new WriterError('hard_reread_mismatch', 500);
    }
    if (action === 'rollback' && verified.classification !== 'READY') {
      throw new WriterError('hard_reread_mismatch', 500);
    }
    return responseForPlan(plan, reread.updated_at, true);
  } catch (error) {
    return fail(error, requestId);
  }
}

function productionRepository(): WriterRepository {
  return {
    async load() {
      if (!isSupabaseAdminConfigured()) return null;
      const { data, error } = await getSupabaseAdmin()
        .from('website_data')
        .select('content,is_published,updated_at')
        .eq('field_key', NEWSLETTER_POSTS_FIELD_KEY)
        .maybeSingle();
      if (error) throw new WriterError('registry_read_failed', 500);
      return data as NewsletterRegistryRow | null;
    },
    async compareAndSwap(expectedUpdatedAt, content) {
      if (!isSupabaseAdminConfigured()) return false;
      const nextUpdatedAt = new Date().toISOString();
      const { data, error } = await getSupabaseAdmin()
        .from('website_data')
        .update({ content, updated_at: nextUpdatedAt })
        .eq('field_key', NEWSLETTER_POSTS_FIELD_KEY)
        .eq('updated_at', expectedUpdatedAt)
        .select('updated_at')
        .maybeSingle();
      if (error) throw new WriterError('registry_write_failed', 500);
      return Boolean(data);
    },
  };
}

async function postHandler(request: NextRequest): Promise<Response> {
  return handleNewsletterFirstTableRequest(request, {
    authorize: (candidate) => requireDashboardMutationAuth(candidate as NextRequest),
    repository: productionRepository(),
  });
}

export const POST = Object.assign(postHandler, {
  __test: {
    ITEM07_POST_ID,
    buildSemanticFirstTable,
    handleNewsletterFirstTableRequest,
    restoreLockedFirstTable,
    sha256,
  },
});
