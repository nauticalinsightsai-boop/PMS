import { describe, expect, it, vi } from 'vitest';
import { POST } from './route';

const policy = POST.__test;
const now = '2026-08-13T14:30:00.000Z';

function exactInput(overrides: Record<string, unknown> = {}) {
  return {
    action: 'create_private_draft',
    contract: {
      id: policy.RECORD_ID,
      slug: policy.SLUG,
      title: policy.TITLE,
      sourceSeedSha256: policy.SOURCE_SEED_SHA256,
      bodySha256: policy.BODY_SHA256,
      ...overrides,
    },
  };
}

function correctionInput(overrides: Record<string, unknown> = {}) {
  return {
    action: 'correct_hero_image_alt',
    contract: {
      id: policy.RECORD_ID,
      field: 'heroImageAlt',
      expectedRecordSha256: policy.EXPECTED_CORRECTION_PREIMAGE_SHA256,
      expectedHeroImageAlt: policy.TITLE,
      newHeroImageAlt: '',
      bodySha256: policy.NORMALIZED_BODY_SHA256,
      authorId: policy.CANONICAL_AUTHOR_ID,
      isPublished: false,
      ...overrides,
    },
  };
}

function correctionPreimage() {
  return {
    ...policy.buildPrivateDraft('2026-08-13T15:47:58.600Z'),
    modifiedDate: '2026-08-13T16:01:56.757Z',
    author: policy.CANONICAL_AUTHOR,
    authorId: policy.CANONICAL_AUTHOR_ID,
    content:
      '<p>Safety culture starts with clear expectations, visible leadership, and practical controls.</p>\n<h2>Start with hazard identification</h2>\n<p>Walk the site regularly and document risks before incidents occur.</p>',
    heroImageAlt: policy.TITLE,
  };
}

function request(body: unknown) {
  return new Request('https://pmstructure.com/api/cms/workplace-safety-private-draft', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://pmstructure.com' },
    body: JSON.stringify(body),
  });
}

function harness(
  initialPosts: Array<Record<string, unknown>> = [],
  livePosts: Array<Record<string, unknown>> = [],
  draftVisibility: unknown = false,
) {
  let row = {
    content: { version: 1 as const, posts: structuredClone(initialPosts) },
    is_published: draftVisibility as boolean,
    updated_at: 'before',
  };
  let writes = 0;
  const repository = {
    loadLive: vi.fn(async () => ({ content: { version: 1 as const, posts: structuredClone(livePosts) }, is_published: true, updated_at: 'live' })),
    loadDraft: vi.fn(async () => structuredClone(row)),
    compareAndSwap: vi.fn(async (expected: string, expectedPublished: false, content: { version: 1; posts: Array<Record<string, unknown>> }) => {
      if (expected !== row.updated_at || row.is_published !== expectedPublished) return false;
      writes += 1;
      row = { ...row, content: structuredClone(content), updated_at: `after-${writes}` };
      return true;
    }),
  };
  return { repository, row: () => structuredClone(row), writes: () => writes };
}

async function invoke(
  body: unknown,
  state = harness(),
  authorize: (request: Request) => Promise<Response | null> = async () => null,
) {
  const response = await policy.handleRequest(request(body), {
    authorize,
    repository: state.repository,
    now: () => now,
  });
  return { response, json: await response.json(), state, authorize };
}

describe('GSC111 fixed exact-ID private-draft control', () => {
  it('authorizes before parsing or reading and returns the auth response unchanged', async () => {
    const state = harness();
    const denied = new Response('unauthorized', { status: 401 });
    const authorize = vi.fn(async () => denied);
    const result = await policy.handleRequest(new Request('https://pmstructure.com', { method: 'POST' }), {
      authorize,
      repository: state.repository,
      now: () => now,
    });
    expect(result).toBe(denied);
    expect(authorize).toHaveBeenCalledOnce();
    expect(state.repository.loadLive).not.toHaveBeenCalled();
    expect(state.repository.loadDraft).not.toHaveBeenCalled();
    expect(state.writes()).toBe(0);
  });

  it.each([
    ['unauthenticated', 401, 'unauthorized'],
    ['non-admin', 403, 'administrator_required'],
    ['invalid CSRF origin', 403, 'invalid_origin'],
    ['request binding failure', 403, 'request_binding_invalid'],
  ])('fails closed for %s before parsing, reading, or writing', async (_name, status, code) => {
    const state = harness();
    const authorize = vi.fn(async () => Response.json({ ok: false, code }, { status }));
    const result = await invoke(exactInput(), state, authorize);
    expect(result.response.status).toBe(status);
    expect(result.state.repository.loadLive).not.toHaveBeenCalled();
    expect(result.state.repository.loadDraft).not.toHaveBeenCalled();
    expect(result.state.writes()).toBe(0);
  });

  it.each([
    ['wrong id', { id: 'post-anything-else' }, 'record_id_invalid'],
    ['wrong slug', { slug: 'anything-else' }, 'slug_invalid'],
    ['wrong title', { title: 'Anything else' }, 'title_invalid'],
    ['wrong seed', { sourceSeedSha256: 'A'.repeat(64) }, 'source_seed_hash_invalid'],
    ['wrong body', { bodySha256: 'A'.repeat(64) }, 'body_hash_invalid'],
  ])('rejects %s with no read or write', async (_name, overrides, code) => {
    const result = await invoke(exactInput(overrides));
    expect(result.response.status).toBe(400);
    expect(result.json.code).toBe(code);
    expect(result.state.repository.loadLive).not.toHaveBeenCalled();
    expect(result.state.repository.loadDraft).not.toHaveBeenCalled();
    expect(result.state.writes()).toBe(0);
  });

  it.each([
    ['array', [exactInput()]],
    ['batch field', { ...exactInput(), objects: [exactInput()] }],
    ['publish injection', { ...exactInput(), publish: true }],
    ['status injection', { ...exactInput(), status: 'published' }],
    ['schedule injection', { ...exactInput(), schedule: now }],
    ['migration invocation', { action: 'seed_all', contract: exactInput().contract }],
  ])('rejects %s and keeps the registry untouched', async (_name, body) => {
    const result = await invoke(body);
    expect(result.response.status).toBe(400);
    expect(result.state.writes()).toBe(0);
  });

  it('rejects missing and extra contract fields', async () => {
    const missing = exactInput();
    delete (missing.contract as Partial<typeof missing.contract>).bodySha256;
    expect((await invoke(missing)).json.code).toBe('contract_fields_invalid');
    expect((await invoke(exactInput({ extra: 'no' }))).json.code).toBe('contract_fields_invalid');
  });

  it.each([
    [{ id: policy.RECORD_ID }, 'existing id'],
    [{ slug: policy.SLUG }, 'existing slug'],
    [{ title: policy.TITLE }, 'existing title'],
  ])('rejects conflicting %s without a write', async (conflict, _name) => {
    const sibling = { id: 'sibling', slug: 'sibling', title: 'Sibling', status: 'draft', ...conflict };
    const result = await invoke(exactInput(), harness([sibling]));
    expect(result.response.status).toBe(409);
    expect(result.json.code).toBe('identity_conflict');
    expect(result.state.writes()).toBe(0);
  });

  it('rejects an exact identity conflict in the live registry without touching the draft', async () => {
    const live = { id: policy.RECORD_ID, slug: policy.SLUG, title: policy.TITLE, status: 'published' };
    const result = await invoke(exactInput(), harness([], [live]));
    expect(result.response.status).toBe(409);
    expect(result.json.code).toBe('identity_conflict');
    expect(result.state.writes()).toBe(0);
  });

  it.each([
    ['true', true],
    ['null', null],
    ['missing', undefined],
  ])('rejects initial draft visibility %s before any write', async (_name, visibility) => {
    const state = harness();
    state.repository.loadDraft.mockResolvedValueOnce({
      content: { version: 1, posts: [] },
      updated_at: 'before',
      ...(visibility === undefined ? {} : { is_published: visibility }),
    } as never);
    const result = await invoke(exactInput(), state);
    expect(result.response.status).toBe(409);
    expect(result.json.code).toBe('draft_visibility_invalid');
    expect(result.state.writes()).toBe(0);
  });

  it('creates exactly one private draft, hard-rereads it, and preserves siblings', async () => {
    const sibling = { id: 'sibling', slug: 'sibling', title: 'Sibling', status: 'published', content: 'unchanged' };
    const result = await invoke(exactInput(), harness([sibling]));
    expect(result.response.status).toBe(200);
    expect(result.json.wrote).toBe(true);
    expect(result.json.classification).toBe('CREATED_PRIVATE_DRAFT');
    expect(result.state.writes()).toBe(1);
    expect(result.state.row().content.posts[0]).toEqual(sibling);
    const created = result.state.row().content.posts[1];
    expect(created.id).toBe(policy.RECORD_ID);
    expect(created.status).toBe('draft');
    expect(created.publishDate).toBe(now);
    expect(policy.sha256(String(created.content))).toBe(policy.BODY_SHA256);
    expect(result.json.record).toEqual(created);
  });

  it('is idempotent on exact replay and writes zero additional rows', async () => {
    const state = harness();
    const first = await invoke(exactInput(), state);
    const second = await invoke(exactInput(), state);
    expect(first.json.wrote).toBe(true);
    expect(second.json.wrote).toBe(false);
    expect(second.json.classification).toBe('EXACT_REPLAY_NO_WRITE');
    expect(state.writes()).toBe(1);
    expect(state.row().content.posts.filter((post) => post.id === policy.RECORD_ID)).toHaveLength(1);
  });

  it('treats JSONB object-key reordering as an exact no-write replay', async () => {
    const created = policy.buildPrivateDraft(now);
    const reordered = Object.fromEntries(Object.entries(created).reverse());
    const result = await invoke(exactInput(), harness([reordered]));
    expect(result.response.status).toBe(200);
    expect(result.json.classification).toBe('EXACT_REPLAY_NO_WRITE');
    expect(result.state.writes()).toBe(0);
  });

  it('rejects an exact replay whose draft row is publicly visible', async () => {
    const result = await invoke(exactInput(), harness([policy.buildPrivateDraft(now)], [], true));
    expect(result.response.status).toBe(409);
    expect(result.json.code).toBe('draft_visibility_invalid');
    expect(result.state.writes()).toBe(0);
  });

  it('rejects a same-identity draft whose persisted full field set has drifted', async () => {
    const drifted = { ...policy.buildPrivateDraft(now), ctaLabel: 'unexpected' };
    const result = await invoke(exactInput(), harness([drifted]));
    expect(result.response.status).toBe(409);
    expect(result.json.code).toBe('identity_conflict');
    expect(result.state.writes()).toBe(0);
  });

  it('converges concurrent CAS loss to one exact no-write replay', async () => {
    const created = policy.buildPrivateDraft(now);
    let loadCount = 0;
    const repository = {
      loadLive: vi.fn(async () => ({ content: { version: 1, posts: [] }, is_published: true, updated_at: 'live' })),
      loadDraft: vi.fn(async () => {
        loadCount += 1;
        return loadCount === 1
          ? { content: { version: 1, posts: [] }, is_published: false, updated_at: 'before' }
          : { content: { version: 1, posts: [created] }, is_published: false, updated_at: 'other-writer' };
      }),
      compareAndSwap: vi.fn(async () => false),
    };
    const response = await policy.handleRequest(request(exactInput()), {
      authorize: async () => null,
      repository,
      now: () => now,
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.wrote).toBe(false);
    expect(body.classification).toBe('EXACT_REPLAY_NO_WRITE');
    expect(repository.compareAndSwap).toHaveBeenCalledOnce();
  });

  it('fails closed when visibility flips true before CAS', async () => {
    const state = harness();
    state.repository.compareAndSwap.mockImplementationOnce(async () => {
      (state.row as unknown as { visibility?: boolean }).visibility = true;
      return false;
    });
    state.repository.loadDraft.mockResolvedValueOnce({
      content: { version: 1, posts: [] }, is_published: false, updated_at: 'before',
    }).mockResolvedValueOnce({
      content: { version: 1, posts: [] }, is_published: true, updated_at: 'flipped',
    });
    const result = await invoke(exactInput(), state);
    expect(result.response.status).toBe(409);
    expect(result.json.code).toBe('draft_visibility_invalid');
  });

  it.each([
    ['true', true],
    ['null', null],
    ['missing', undefined],
  ])('rejects hard reread visibility %s after the one in-memory CAS', async (_name, visibility) => {
    const state = harness();
    const originalLoad = state.repository.loadDraft;
    originalLoad.mockImplementationOnce(async () => ({
      content: { version: 1, posts: [] }, is_published: false, updated_at: 'before',
    })).mockImplementationOnce(async () => ({
      content: state.row().content, is_published: visibility as boolean, updated_at: 'after-1',
    }));
    const result = await invoke(exactInput(), state);
    expect(result.response.status).toBe(500);
    expect(result.json.code).toBe('hard_reread_visibility_invalid');
  });
});

describe('GSC111 fixed one-field hero alt correction', () => {
  it('binds the documented preimage and postimage semantic hashes', () => {
    const before = correctionPreimage();
    const after = { ...before, heroImageAlt: '' };
    expect(policy.semanticHash(before)).toBe(policy.EXPECTED_CORRECTION_PREIMAGE_SHA256);
    expect(policy.semanticHash(after)).toBe(policy.EXPECTED_CORRECTION_POSTIMAGE_SHA256);
  });

  it('authorizes before parsing or data access', async () => {
    const state = harness([correctionPreimage()]);
    const denied = new Response('unauthorized', { status: 401 });
    const result = await policy.handleRequest(request(correctionInput()), {
      authorize: async () => denied,
      repository: state.repository,
      now: () => now,
    });
    expect(result).toBe(denied);
    expect(state.repository.loadLive).not.toHaveBeenCalled();
    expect(state.repository.loadDraft).not.toHaveBeenCalled();
    expect(state.writes()).toBe(0);
  });

  it.each([
    ['wrong ID', { id: 'post-other' }, 'record_id_invalid'],
    ['wrong field', { field: 'title' }, 'field_invalid'],
    ['wrong current value', { expectedHeroImageAlt: '' }, 'current_value_invalid'],
    ['wrong new value', { newHeroImageAlt: 'replacement' }, 'new_value_invalid'],
    ['wrong record hash', { expectedRecordSha256: 'A'.repeat(64) }, 'record_hash_invalid'],
    ['wrong body hash', { bodySha256: 'A'.repeat(64) }, 'body_hash_invalid'],
    ['wrong author', { authorId: 'author-other' }, 'author_invalid'],
    ['wrong visibility', { isPublished: true }, 'visibility_invalid'],
  ])('rejects %s before data access', async (_name, override, code) => {
    const result = await invoke(correctionInput(override));
    expect(result.response.status).toBe(400);
    expect(result.json.code).toBe(code);
    expect(result.state.repository.loadLive).not.toHaveBeenCalled();
    expect(result.state.writes()).toBe(0);
  });

  it.each([
    ['extra field', { ...correctionInput(), extra: true }],
    ['array', [correctionInput()]],
    ['publish injection', { ...correctionInput(), publish: true }],
    ['batch injection', { ...correctionInput(), objects: [correctionInput()] }],
  ])('rejects %s with zero writes', async (_name, body) => {
    const result = await invoke(body);
    expect(result.response.status).toBe(400);
    expect(result.state.writes()).toBe(0);
  });

  it('changes only heroImageAlt and hard-rereads the private draft', async () => {
    const sibling = { id: 'sibling', slug: 'sibling', title: 'Sibling', content: 'unchanged' };
    const before = correctionPreimage();
    const state = harness([sibling, before]);
    const result = await invoke(correctionInput(), state);
    expect(result.response.status).toBe(200);
    expect(result.json.classification).toBe('HERO_IMAGE_ALT_CORRECTED');
    expect(result.json.wrote).toBe(true);
    expect(result.state.writes()).toBe(1);
    expect(result.state.row().is_published).toBe(false);
    expect(result.state.row().content.posts[0]).toEqual(sibling);
    const after = result.state.row().content.posts[1];
    expect(after).toEqual({ ...before, heroImageAlt: '' });
    expect(result.json.beforeSha256).toBe(policy.EXPECTED_CORRECTION_PREIMAGE_SHA256);
    expect(result.json.afterSha256).toBe(policy.EXPECTED_CORRECTION_POSTIMAGE_SHA256);
    expect(result.json.bodySha256).toBe(policy.NORMALIZED_BODY_SHA256);
  });

  it('returns explicit already-correct no-write on exact replay', async () => {
    const corrected = { ...correctionPreimage(), heroImageAlt: '' };
    const result = await invoke(correctionInput(), harness([corrected]));
    expect(result.response.status).toBe(200);
    expect(result.json.classification).toBe('HERO_IMAGE_ALT_ALREADY_CORRECT');
    expect(result.json.wrote).toBe(false);
    expect(result.state.writes()).toBe(0);
  });

  it.each([
    ['body', { content: 'drift' }, 'record_hash_mismatch'],
    ['author', { authorId: 'author-other' }, 'record_hash_mismatch'],
    ['visibility', { status: 'published' }, 'record_hash_mismatch'],
    ['unrelated field', { ctaLabel: 'drift' }, 'record_hash_mismatch'],
  ])('fails closed for persisted %s drift', async (_name, drift, code) => {
    const result = await invoke(correctionInput(), harness([{ ...correctionPreimage(), ...drift }]));
    expect(result.response.status).toBe(409);
    expect(result.json.code).toBe(code);
    expect(result.state.writes()).toBe(0);
  });

  it('rejects live identity conflict without touching the draft', async () => {
    const result = await invoke(
      correctionInput(),
      harness([correctionPreimage()], [{ id: policy.RECORD_ID, slug: policy.SLUG, title: policy.TITLE }]),
    );
    expect(result.response.status).toBe(409);
    expect(result.json.code).toBe('identity_conflict');
    expect(result.state.writes()).toBe(0);
  });

  it('converges CAS loss only to the exact corrected postimage', async () => {
    const before = correctionPreimage();
    const after = { ...before, heroImageAlt: '' };
    let reads = 0;
    const repository = {
      loadLive: vi.fn(async () => ({ content: { version: 1, posts: [] }, is_published: true, updated_at: 'live' })),
      loadDraft: vi.fn(async () => (++reads === 1
        ? { content: { version: 1, posts: [before] }, is_published: false, updated_at: 'before' }
        : { content: { version: 1, posts: [after] }, is_published: false, updated_at: 'concurrent' })),
      compareAndSwap: vi.fn(async () => false),
    };
    const response = await policy.handleRequest(request(correctionInput()), {
      authorize: async () => null,
      repository,
      now: () => now,
    });
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body.classification).toBe('HERO_IMAGE_ALT_ALREADY_CORRECT');
    expect(body.wrote).toBe(false);
  });

  it('fails closed on CAS loss to drift and on hard-reread mismatch', async () => {
    const before = correctionPreimage();
    const drifted = { ...before, heroImageAlt: '', ctaLabel: 'drift' };
    let reads = 0;
    const casLoss = {
      loadLive: vi.fn(async () => ({ content: { version: 1, posts: [] }, is_published: true, updated_at: 'live' })),
      loadDraft: vi.fn(async () => (++reads === 1
        ? { content: { version: 1, posts: [before] }, is_published: false, updated_at: 'before' }
        : { content: { version: 1, posts: [drifted] }, is_published: false, updated_at: 'other' })),
      compareAndSwap: vi.fn(async () => false),
    };
    const failedCas = await policy.handleRequest(request(correctionInput()), {
      authorize: async () => null, repository: casLoss, now: () => now,
    });
    expect(failedCas.status).toBe(409);

    const state = harness([before]);
    state.repository.loadDraft
      .mockImplementationOnce(async () => ({ content: { version: 1, posts: [before] }, is_published: false, updated_at: 'before' }))
      .mockImplementationOnce(async () => ({ content: { version: 1, posts: [drifted] }, is_published: false, updated_at: 'after' }));
    const reread = await invoke(correctionInput(), state);
    expect(reread.response.status).toBe(500);
    expect(reread.json.code).toBe('hard_reread_mismatch');
  });
});
