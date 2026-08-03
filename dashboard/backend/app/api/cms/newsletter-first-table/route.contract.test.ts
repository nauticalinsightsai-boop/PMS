import { describe, expect, it } from 'vitest';
import { POST } from './route';

const {
  ITEM07_POST_ID,
  buildSemanticFirstTable,
  handleNewsletterFirstTableRequest,
  restoreLockedFirstTable,
  sha256,
} = POST.__test;

type Item07Policy = {
  postId: string;
  bodySha256: string;
  firstTableSha256: string;
  secondTableSha256: string;
};
type NewsletterRegistryRow = {
  content: unknown;
  is_published: boolean;
  updated_at: string;
};
type WriterDependencies = Parameters<typeof handleNewsletterFirstTableRequest>[1];

const FIRST_TABLE = `<table>
<thead><tr>
<th>Domain</th><th align="right">Published proportion</th><th>Evidence question</th><th>Practice action</th>
</tr></thead>
<tbody><tr>
<td>Fundamentals and Core Concepts</td><td align="right">36%</td><td>Question 1</td><td>Action 1</td>
</tr><tr>
<td>Predictive, Plan-Based Methodologies</td><td align="right">17%</td><td>Question 2</td><td>Action 2</td>
</tr><tr>
<td>Agile Frameworks/Methodologies</td><td align="right">20%</td><td>Question 3</td><td>Action 3</td>
</tr><tr>
<td>Business Analysis Frameworks</td><td align="right">27%</td><td>Question 4</td><td>Action 4</td>
</tr></tbody></table>`;

const SECOND_TABLE = '<table><thead><tr><th>Month</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>';
const BODY = `<p>Before</p>${FIRST_TABLE}<p>Between</p>${SECOND_TABLE}<p>After</p>`;
const POLICY: Item07Policy = {
  postId: ITEM07_POST_ID,
  bodySha256: sha256(BODY),
  firstTableSha256: sha256(FIRST_TABLE),
  secondTableSha256: sha256(SECOND_TABLE),
};

function registry(body = BODY, status = 'draft') {
  return {
    version: 1,
    posts: [
      { id: 'post-control', status: 'draft', content: '<p>Control</p>', title: 'Control' },
      {
        id: ITEM07_POST_ID,
        status,
        content: body,
        title: 'Locked title',
        authorId: 'locked-author',
      },
      { id: 'post-item08-control', status: 'draft', content: '<p>Item08 unchanged</p>' },
    ],
  };
}

function request(action: 'preview' | 'apply' | 'rollback', extra: Record<string, unknown> = {}) {
  return new Request('https://pmstructure.test/admin/api/cms/newsletter-first-table', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...extra }),
  });
}

function harness(initialContent = registry()) {
  let row: NewsletterRegistryRow = {
    content: initialContent,
    is_published: true,
    updated_at: '2026-08-03T10:00:00.000Z',
  };
  let writes = 0;
  let reads = 0;
  let captured: Record<string, unknown> | null = null;
  const dependencies: WriterDependencies = {
    policy: POLICY,
    authorize: async () => null,
    repository: {
      async load() {
        reads += 1;
        return structuredClone(row);
      },
      async compareAndSwap(expectedUpdatedAt, content) {
        if (expectedUpdatedAt !== row.updated_at) return false;
        writes += 1;
        captured = structuredClone(content);
        row = {
          ...row,
          content: structuredClone(content),
          updated_at: `2026-08-03T10:00:0${writes}.000Z`,
        };
        return true;
      },
    },
  };
  return {
    dependencies,
    get writes() { return writes; },
    get reads() { return reads; },
    get captured() { return captured; },
    get row() { return row; },
  };
}

type WriterPayload = {
  classification: string;
  wrote: boolean;
  confirmation: string | null;
  updatedAt: string;
  hashes: Record<string, string>;
};

async function bodyOf(response: Response): Promise<WriterPayload> {
  return response.json() as Promise<WriterPayload>;
}

describe('Item07 semantic first-table writer', () => {
  it('constructs the exact semantic successor from existing cell text and reverses byte-exactly', () => {
    const successor = buildSemanticFirstTable(FIRST_TABLE);
    expect(successor).toContain('data-pms-responsive-table="item07-t01-stacked-cards"');
    expect(successor.match(/scope="col"/g)).toHaveLength(4);
    expect(successor.match(/scope="row"/g)).toHaveLength(4);
    expect(successor.match(/headers="item07-t01-/g)).toHaveLength(16);
    expect(successor.match(/data-label="/g)).toHaveLength(16);
    expect(successor).toContain('36%');
    expect(successor).toContain('17%');
    expect(successor).toContain('20%');
    expect(successor).toContain('27%');
    expect(restoreLockedFirstTable(successor)).toBe(FIRST_TABLE);
  });

  it('previews with zero writes and returns hashes/classification only', async () => {
    const h = harness();
    const response = await handleNewsletterFirstTableRequest(request('preview'), h.dependencies);
    const payload = await bodyOf(response);
    expect(response.status).toBe(200);
    expect(payload.classification).toBe('READY');
    expect(payload.wrote).toBe(false);
    expect(payload.confirmation).toBe(`APPLY ITEM07 T01 ${POLICY.bodySha256.slice(0, 8)}`);
    expect(h.writes).toBe(0);
    expect(JSON.stringify(payload)).not.toContain('Locked title');
    expect(JSON.stringify(payload)).not.toContain('Question 1');
    expect(payload.hashes.secondTable).toBe(POLICY.secondTableSha256);
  });

  it('applies exactly once, preserves every non-content field/post and hard-rereads', async () => {
    const h = harness();
    const before = structuredClone(h.row.content) as ReturnType<typeof registry>;
    const preview = await bodyOf(
      await handleNewsletterFirstTableRequest(request('preview'), h.dependencies),
    );
    const response = await handleNewsletterFirstTableRequest(
      request('apply', {
        expectedUpdatedAt: preview.updatedAt,
        confirmation: preview.confirmation,
      }),
      h.dependencies,
    );
    const payload = await bodyOf(response);
    expect(response.status).toBe(200);
    expect(payload.wrote).toBe(true);
    expect(h.writes).toBe(1);
    expect(h.reads).toBe(3);
    const after = h.captured as ReturnType<typeof registry>;
    expect(after.version).toBe(before.version);
    expect(after.posts[0]).toEqual(before.posts[0]);
    expect(after.posts[2]).toEqual(before.posts[2]);
    expect({ ...after.posts[1], content: before.posts[1].content }).toEqual(before.posts[1]);
    expect(after.posts[1].content).toContain('data-pms-responsive-table');
    expect(after.posts[1].content.split(SECOND_TABLE)).toHaveLength(2);

    const repeat = await bodyOf(
      await handleNewsletterFirstTableRequest(request('preview'), h.dependencies),
    );
    expect(repeat.classification).toBe('NO_CHANGE');
    expect(h.writes).toBe(1);
  });

  it('rolls back only the exact successor through one conditional write and hard reread', async () => {
    const h = harness();
    const preview = await bodyOf(
      await handleNewsletterFirstTableRequest(request('preview'), h.dependencies),
    );
    await handleNewsletterFirstTableRequest(
      request('apply', { expectedUpdatedAt: preview.updatedAt, confirmation: preview.confirmation }),
      h.dependencies,
    );
    const rollbackPreview = await bodyOf(
      await handleNewsletterFirstTableRequest(request('rollback'), h.dependencies),
    );
    const rolledBack = await bodyOf(
      await handleNewsletterFirstTableRequest(
        request('rollback', {
          expectedUpdatedAt: rollbackPreview.updatedAt,
          confirmation: rollbackPreview.confirmation,
        }),
        h.dependencies,
      ),
    );
    expect(rolledBack.wrote).toBe(true);
    expect(h.writes).toBe(2);
    expect((h.row.content as ReturnType<typeof registry>).posts[1].content).toBe(BODY);
  });

  it('fails closed for stale confirmation, wrong hashes, non-draft, duplicates and unauthorized requests', async () => {
    const stale = harness();
    const preview = await bodyOf(
      await handleNewsletterFirstTableRequest(request('preview'), stale.dependencies),
    );
    for (const extra of [
      { expectedUpdatedAt: 'stale', confirmation: preview.confirmation },
      { expectedUpdatedAt: preview.updatedAt, confirmation: 'wrong' },
    ]) {
      const response = await handleNewsletterFirstTableRequest(request('apply', extra), stale.dependencies);
      expect(response.status).toBe(409);
    }
    expect(stale.writes).toBe(0);

    for (const bad of [
      registry(`${BODY}drift`),
      registry(BODY, 'published'),
      { version: 1, posts: [...registry().posts, registry().posts[1]] },
    ]) {
      const h = harness(bad);
      const response = await handleNewsletterFirstTableRequest(request('preview'), h.dependencies);
      expect(response.status).toBe(409);
      expect(h.writes).toBe(0);
    }

    let authReads = 0;
    const unauthorized: WriterDependencies = {
      policy: POLICY,
      authorize: async () => Response.json({ error: 'unauthorized' }, { status: 401 }),
      repository: {
        load: async () => { authReads += 1; return null; },
        compareAndSwap: async () => false,
      },
    };
    const authResponse = await handleNewsletterFirstTableRequest(request('preview'), unauthorized);
    expect(authResponse.status).toBe(401);
    expect(authReads).toBe(0);
  });
});
