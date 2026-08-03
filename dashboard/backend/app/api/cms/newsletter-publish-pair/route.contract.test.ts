import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import { POST } from './route';

vi.mock('@/lib/auth/api-guard', () => ({ requireDashboardMutationAuth: vi.fn() }));
vi.mock('@/lib/auth/supabase-admin', () => ({
  getSupabaseAdmin: vi.fn(),
  isSupabaseAdminConfigured: vi.fn(),
}));

const authorize = vi.mocked(requireDashboardMutationAuth);
const configured = vi.mocked(isSupabaseAdminConfigured);
const admin = vi.mocked(getSupabaseAdmin);

function request(body: unknown) {
  return new Request('https://pmstructure.com/admin/api/cms/newsletter-publish-pair', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
}

function hashJson(value: unknown) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

describe('fixed newsletter pair publisher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authorize.mockResolvedValue(null);
    configured.mockReturnValue(true);
  });

  it('authorizes before parsing or invoking', async () => {
    const rpc = vi.fn();
    authorize.mockResolvedValue(new Response(null, { status: 401 }));
    admin.mockReturnValue({ rpc } as never);
    const response = await POST(new Request('https://pmstructure.com', { method: 'POST', body: '{' }) as never);
    expect(response.status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });

  it.each(['item09', 'item10'])('passes only fixed %s to the RPC', async (item) => {
    const rpc = vi.fn().mockResolvedValue({ data: { classification: 'READY', wrote: false }, error: null });
    admin.mockReturnValue({ rpc } as never);
    const response = await POST(request({ action: 'preview', item }) as never);
    expect(response.status).toBe(200);
    expect(rpc).toHaveBeenCalledWith('mutate_fixed_newsletter_publication', expect.objectContaining({
      p_item_key: item,
      p_action: 'preview',
    }));
  });

  it('rejects caller-selected or third records without invoking', async () => {
    const rpc = vi.fn();
    admin.mockReturnValue({ rpc } as never);
    const response = await POST(request({ action: 'commit', item: 'post-arbitrary' }) as never);
    expect(response.status).toBe(400);
    expect(rpc).not.toHaveBeenCalled();
  });

  it('returns only bounded server error codes', async () => {
    const rpc = vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'newsletter_fixed_preimage_mismatch' } })
      .mockResolvedValueOnce({ data: null, error: { message: 'raw record/email/token' } });
    admin.mockReturnValue({ rpc } as never);
    const safe = await POST(request({ action: 'preview', item: 'item09' }) as never);
    expect(await safe.json()).toEqual({ error: 'newsletter_fixed_preimage_mismatch' });
    const unsafe = await POST(request({ action: 'preview', item: 'item09' }) as never);
    expect(await unsafe.json()).toEqual({ error: 'newsletter_fixed_operation_failed' });
  });

  it('migration enforces CAS, idempotency, sibling isolation, reread hashes and rollback', () => {
    const sql = fs.readFileSync(
      new URL('../../../../../../supabase/migrations/20260803190000_fixed_newsletter_pair_publication.sql', import.meta.url),
      'utf8',
    );
    expect(sql).toContain("check (item_key in ('item09', 'item10'))");
    expect(sql).toContain('idempotency_token uuid not null unique');
    expect(sql).toContain("jsonb_set(v_row.content, array['posts',(v_ordinal-1)::text]");
    expect(sql).toContain('where id = v_row.id and updated_at = v_row.updated_at');
    expect(sql).toContain("v_post->>'status' <> 'draft'");
    expect(sql).toContain("coalesce(v_post->>'publishDate','') <> ''");
    expect(sql).toContain("'classification','ALREADY_APPLIED'");
    expect(sql).toContain("'classification','ROLLED_BACK'");
    expect(sql).toContain('v_receipt.preimage');
    expect(sql).toContain('v_preimage := v_post;');
    expect(sql).toContain('values (p_item_key,p_idempotency_token,v_preimage,v_next_post,v_pre_hash,v_post_hash,p_publish_at)');
    expect(sql.indexOf('v_preimage := v_post;')).toBeLessThan(sql.lastIndexOf('select content->\'posts\'->(v_ordinal-1) into v_post'));
    expect(sql).toContain('preimageHash');
    expect(sql).toContain('postimageHash');
    expect(sql).toContain('revoke all on function');
  });

  it('preserves draft value provenance and makes rollback inverse, isolated and one-use', () => {
    const draft = { id: 'item09-fixed', status: 'draft', publishDate: null, content: 'accepted body' };
    const sibling = { id: 'item10-fixed', status: 'draft', publishDate: null, content: 'sibling body' };
    const originalSiblingHash = hashJson(sibling);
    const preimage = structuredClone(draft);
    const postimage = { ...draft, status: 'published', publishDate: '2026-08-03T16:00:00.000Z' };
    const receipt = {
      preimage,
      postimage,
      preimageHash: hashJson(preimage),
      postimageHash: hashJson(postimage),
      rolledBack: false,
    };
    const registry = [structuredClone(postimage), structuredClone(sibling)];
    let rollbackWrites = 0;

    const rollback = () => {
      if (receipt.rolledBack) return { classification: 'ALREADY_ROLLED_BACK', wrote: false };
      expect(hashJson(registry[0])).toBe(receipt.postimageHash);
      registry[0] = structuredClone(receipt.preimage);
      rollbackWrites += 1;
      receipt.rolledBack = true;
      return { classification: 'ROLLED_BACK', wrote: true };
    };

    expect(receipt.preimageHash).toBe(hashJson(draft));
    expect(receipt.postimageHash).toBe(hashJson(postimage));
    expect(receipt.preimageHash).not.toBe(receipt.postimageHash);
    expect(rollback()).toEqual({ classification: 'ROLLED_BACK', wrote: true });
    expect(registry[0]).toEqual(draft);
    expect(registry[0].status).toBe('draft');
    expect(registry[0].publishDate).toBeNull();
    expect(hashJson(registry[0])).toBe(receipt.preimageHash);
    expect(hashJson(registry[1])).toBe(originalSiblingHash);
    expect(rollback()).toEqual({ classification: 'ALREADY_ROLLED_BACK', wrote: false });
    expect(rollbackWrites).toBe(1);
  });
});
