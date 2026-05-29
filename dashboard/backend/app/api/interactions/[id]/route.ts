import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireInteractionAdmin } from '@/lib/interactions/admin-guard';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireInteractionAdmin(request);
  if (auth instanceof NextResponse) return auth;

  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { id } = await context.params;
  if (!id?.trim()) {
    return Response.json({ error: 'Invalid id' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('form_submissions').delete().eq('id', id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
