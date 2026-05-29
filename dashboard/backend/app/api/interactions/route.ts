import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireInteractionAdmin } from '@/lib/interactions/admin-guard';
import {
  buildInteractionListQuery,
  parseInteractionListFilters,
} from '@/lib/interactions/query';
import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireInteractionAdmin(request);
  if (auth instanceof NextResponse) return auth;

  if (!isSupabaseConfigured) {
    return Response.json({ error: 'Database not configured' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(0, Number(searchParams.get('page') ?? 0));
  const limit = Math.min(Math.max(1, Number(searchParams.get('limit') ?? 50)), 200);
  const filters = parseInteractionListFilters(searchParams);

  const { data, error, count } = await buildInteractionListQuery(supabaseAdmin, filters, {
    limit,
    offset: page * limit,
    count: true,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ data, count });
}
