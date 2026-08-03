import { NextRequest, NextResponse } from 'next/server';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';

type Action = 'preview' | 'commit' | 'rollback';
type ItemKey = 'item09' | 'item10';
type Input = {
  action?: unknown;
  item?: unknown;
  expectedUpdatedAt?: unknown;
  expectedPreimageHash?: unknown;
  idempotencyToken?: unknown;
  confirmation?: unknown;
  publishAt?: unknown;
};

const SAFE_ERROR = /^newsletter_fixed_[a-z_]{1,64}$/;

async function handleFixedNewsletterPublish(
  request: Request,
  dependencies: {
    authorize: (request: Request) => Promise<Response | null>;
    invoke: (args: Record<string, unknown>) => Promise<{ data: unknown; error: { message?: string } | null }>;
  },
): Promise<Response> {
  const auth = await dependencies.authorize(request);
  if (auth) return auth;
  let input: Input;
  try { input = await request.json() as Input; } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }
  if (!['preview', 'commit', 'rollback'].includes(String(input.action))) return NextResponse.json({ error: 'action_invalid' }, { status: 400 });
  if (!['item09', 'item10'].includes(String(input.item))) return NextResponse.json({ error: 'item_invalid' }, { status: 400 });
  const action = input.action as Action;
  const item = input.item as ItemKey;
  const { data, error } = await dependencies.invoke({
    p_item_key: item,
    p_action: action,
    p_expected_updated_at: typeof input.expectedUpdatedAt === 'string' ? input.expectedUpdatedAt : null,
    p_expected_preimage_hash: typeof input.expectedPreimageHash === 'string' ? input.expectedPreimageHash : null,
    p_idempotency_token: typeof input.idempotencyToken === 'string' ? input.idempotencyToken : null,
    p_confirmation: typeof input.confirmation === 'string' ? input.confirmation : null,
    p_publish_at: typeof input.publishAt === 'string' ? input.publishAt : null,
  });
  if (error) {
    const code = SAFE_ERROR.test(error.message ?? '') ? error.message : 'newsletter_fixed_operation_failed';
    return NextResponse.json({ error: code }, { status: 409 });
  }
  return NextResponse.json(data, { status: 200 });
}

async function postHandler(request: NextRequest): Promise<Response> {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;
  if (!isSupabaseAdminConfigured()) return NextResponse.json({ error: 'database_unavailable' }, { status: 503 });
  return handleFixedNewsletterPublish(request, {
    authorize: async () => null,
    invoke: async (args) => {
      const result = await getSupabaseAdmin().rpc('mutate_fixed_newsletter_publication', args);
      return { data: result.data, error: result.error ? { message: result.error.message } : null };
    },
  });
}

export const POST = postHandler;
