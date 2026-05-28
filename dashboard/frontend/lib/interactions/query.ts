import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { FormSubmissionRow, InteractionSource } from '@/lib/interactions/types';

export type InteractionListFilters = {
  source?: InteractionSource | null;
  q?: string;
  from?: string;
  to?: string;
  orderAsc?: boolean;
  sheetsStatus?: 'synced' | 'failed' | 'pending' | null;
};

export const INTERACTION_SELECT_COLUMNS =
  'id, created_at, source, subject, email, payload, metadata, sheets_synced_at, sheets_sync_error, sheets_sync_attempts';

/** Minimal Supabase filter chain used by list/export queries (avoids deep Postgrest generics). */
export interface InteractionFilterChain {
  eq(column: string, value: string): InteractionFilterChain;
  gte(column: string, value: string): InteractionFilterChain;
  lte(column: string, value: string): InteractionFilterChain;
  ilike(column: string, pattern: string): InteractionFilterChain;
  not(column: string, operator: 'is', value: null): InteractionFilterChain;
  is(column: string, value: null): InteractionFilterChain;
  range(from: number, to: number): InteractionListQueryBuilder;
}

type InteractionListQueryBuilder = PostgrestFilterBuilder<
  any,
  any,
  any,
  FormSubmissionRow[],
  'form_submissions',
  unknown,
  'GET'
>;

export function applyInteractionListFilters<T extends InteractionFilterChain>(
  query: T,
  filters: InteractionListFilters
): T {
  let q: InteractionFilterChain = query;

  if (
    filters.source &&
    ['contact', 'subscription', 'meeting_booking', 'documentation_request'].includes(filters.source)
  ) {
    q = q.eq('source', filters.source);
  }
  if (filters.from) {
    q = q.gte('created_at', filters.from);
  }
  if (filters.to) {
    q = q.lte('created_at', filters.to);
  }
  if (filters.q) {
    const safe = filters.q.replace(/%/g, '').replace(/,/g, '').slice(0, 120);
    if (safe.includes('@')) {
      q = q.ilike('email', `%${safe}%`);
    } else if (safe.length > 0) {
      q = q.ilike('subject', `%${safe}%`);
    }
  }
  if (filters.sheetsStatus === 'synced') {
    q = q.not('sheets_synced_at', 'is', null);
  } else if (filters.sheetsStatus === 'failed') {
    q = q.not('sheets_sync_error', 'is', null);
  } else if (filters.sheetsStatus === 'pending') {
    q = q.is('sheets_synced_at', null).is('sheets_sync_error', null);
  }

  return q as T;
}

export function parseInteractionListFilters(searchParams: URLSearchParams): InteractionListFilters {
  const source = searchParams.get('source') as InteractionSource | null;
  const sheetsRaw = searchParams.get('sheetsStatus');
  const sheetsStatus =
    sheetsRaw === 'synced' || sheetsRaw === 'failed' || sheetsRaw === 'pending' ? sheetsRaw : null;

  return {
    source:
      source &&
      ['contact', 'subscription', 'meeting_booking', 'documentation_request'].includes(source)
        ? source
        : null,
    q: searchParams.get('q')?.trim() ?? '',
    from: searchParams.get('from')?.trim() || undefined,
    to: searchParams.get('to')?.trim() || undefined,
    orderAsc: searchParams.get('order') === 'asc',
    sheetsStatus,
  };
}

export function buildInteractionListQuery(
  supabase: SupabaseClient,
  filters: InteractionListFilters,
  options: { limit: number; offset: number; count?: boolean }
): InteractionListQueryBuilder {
  const order = filters.orderAsc ? { ascending: true } : { ascending: false };
  const query = supabase
    .from('form_submissions')
    .select(INTERACTION_SELECT_COLUMNS, options.count ? { count: 'exact' } : undefined)
    .order('created_at', order);

  const filtered = applyInteractionListFilters(
    query as unknown as InteractionFilterChain,
    filters
  );
  return (filtered as InteractionFilterChain).range(
    options.offset,
    options.offset + options.limit - 1
  ) as InteractionListQueryBuilder;
}
