import { NextRequest, NextResponse } from 'next/server';
import { requireDashboardMutationAuth } from '@/lib/auth/api-guard';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';

type Body = {
  action?: 'saveDraft' | 'publish' | 'list';
  fieldKey?: string;
  content?: Record<string, unknown>;
  view?: 'draft' | 'published';
  /** When true with saveDraft, marks the row live in one atomic upsert. */
  publish?: boolean;
};

export async function GET(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const view = request.nextUrl.searchParams.get('view') === 'published' ? 'published' : 'draft';
  const admin = getSupabaseAdmin();
  let query = admin.from('website_data').select('*');
  if (view === 'published') query = query.eq('is_published', true);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data ?? [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireDashboardMutationAuth(request);
  if (auth) return auth;

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const fieldKey = body.fieldKey?.trim();
  if (!fieldKey) {
    return NextResponse.json({ error: 'fieldKey is required' }, { status: 400 });
  }

  if (body.action === 'saveDraft') {
    const markPublished = body.publish === true;
    const { data: existing } = await admin
      .from('website_data')
      .select('is_published')
      .eq('field_key', fieldKey)
      .maybeSingle();

    const { error } = await admin.from('website_data').upsert(
      {
        field_key: fieldKey,
        content: body.content ?? {},
        is_published: markPublished ? true : (existing?.is_published ?? false),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'field_key' },
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, published: markPublished || Boolean(existing?.is_published) });
  }

  if (body.action === 'publish') {
    const { data: existing, error: fetchError } = await admin
      .from('website_data')
      .select('id')
      .eq('field_key', fieldKey)
      .maybeSingle();
    if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
    if (!existing) {
      return NextResponse.json(
        { error: 'Nothing to publish. Save the draft first.' },
        { status: 400 },
      );
    }

    const { error } = await admin
      .from('website_data')
      .update({ is_published: true, updated_at: new Date().toISOString() })
      .eq('field_key', fieldKey);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
