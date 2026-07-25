import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const migration = readFileSync(
  new URL(
    '../../../../supabase/migrations/20260725130000_booking_operations_outbox.sql',
    import.meta.url,
  ),
  'utf8',
);

describe('booking operations migration contract', () => {
  it('deduplicates provider events, bookings, and conversion deliveries', () => {
    expect(migration).toContain('event_key text primary key');
    expect(migration).toContain('invitee_uri text not null unique');
    expect(migration).toContain(
      'unique (aggregate_type, aggregate_id, destination, event_type)',
    );
    expect(migration.match(/'ga4_booking'/g)?.length).toBeGreaterThanOrEqual(2);
    expect(migration.match(/'meta_schedule'/g)?.length).toBeGreaterThanOrEqual(2);
    expect(migration).toContain(
      'on conflict (aggregate_type, aggregate_id, destination, event_type)',
    );
  });

  it('requires the appropriate consent before queuing either conversion', () => {
    expect(migration).toContain('if coalesce(v_analytics_consent, false) then');
    expect(migration).toContain('if coalesce(v_marketing_consent, false) then');
  });

  it('stores bounded lifecycle fields instead of a raw webhook body', () => {
    expect(migration).not.toMatch(/\braw_(body|payload)\b/i);
    expect(migration).toContain('rescheduled_from_invitee_uri text');
    expect(migration).toContain('rescheduled_to_invitee_uri text');
  });

  it('claims due outbox rows atomically without exposing the RPC publicly', () => {
    expect(migration).toContain(
      'create or replace function public.claim_operations_outbox',
    );
    expect(migration).toContain("candidate.status in ('pending', 'failed')");
    expect(migration).toContain('candidate.next_attempt_at <= now()');
    expect(migration).toContain('for update skip locked');
    expect(migration).toContain("set status = 'processing'");
    expect(migration).toContain('attempts = claimed.attempts + 1');
    expect(migration).toContain(
      'limit least(greatest(coalesce(p_limit, 25), 1), 50)',
    );
    expect(migration).toContain(
      'revoke all on function public.claim_operations_outbox(integer)',
    );
    expect(migration).toContain('from public, anon, authenticated');
    expect(migration).toContain(
      'grant execute on function public.claim_operations_outbox(integer)',
    );
    expect(migration).toContain('to service_role');
  });

  it('supports terminal outbox state without making delivered rows retryable', () => {
    expect(migration).toContain(
      "check (status in ('pending', 'processing', 'delivered', 'failed', 'dead_letter'))",
    );
    expect(migration).toContain('next_attempt_at timestamptz default now()');
    expect(migration).not.toContain(
      'next_attempt_at timestamptz not null default now()',
    );
  });
});
