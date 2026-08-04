import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');

describe('canonical Booking CRM source contract', () => {
  it('keeps active navigation limited to the three approved destinations', () => {
    const routes = read('dashboard/frontend/constants/dashboardRoutes.ts');
    const bookings = routes.slice(routes.indexOf('bookings: ['), routes.indexOf('admin: ['));

    expect(bookings).toContain("path: '/dashboard/booking-crm/cta'");
    expect(bookings).toContain("path: '/dashboard/booking-crm/interactions/sheets'");
    expect(bookings).toContain("path: '/dashboard/account/region'");
    expect(bookings.match(/path:/g)).toHaveLength(3);
    expect(bookings).not.toContain('/interactions/inbox');
  });

  it('makes CTA category and channel selection explicitly operable without hover', () => {
    const source = read('dashboard/frontend/components/booking-crm/CTACollection.tsx');

    expect(source).not.toContain('queueCategoryHoverSelection');
    expect(source).not.toContain('onMouseEnter={() => onChannelChange');
    expect(source).not.toContain('group-hover/cta-header:grid-rows');
    expect(source).not.toContain('min-w-[20rem]');
    expect(source).toContain('role="tablist"');
    expect(source).toContain('aria-selected={active}');
    expect(source).toContain('aria-pressed={active}');
    expect(source).toContain('aria-label={`Remove ${tab.label}`}');
    expect(source).toContain('aria-label={`Remove ${ch.label}`}');
  });

  it('renders privacy-minimized mobile cards while preserving the desktop table', () => {
    const source = read('dashboard/frontend/components/booking-crm/InteractionsSheetsRecords.tsx');

    expect(source).toContain('aria-label="Sheet records mobile list"');
    expect(source).toContain('md:hidden');
    expect(source).toContain('md:block');
    expect(source).toContain('maskEmail(record.email)');
    expect(source).toContain('maskPhone(phoneFromPayload(record.payload))');
    expect(source).toContain('detailReturnFocusRef');
    expect(source).toContain('returnTarget?.focus()');
    expect(source).toContain('role="status"');
    expect(source).toContain('role="alert"');
  });

  it('keeps Sync, Verify, and Backfill closed and removes the active legacy inbox link', () => {
    const page = read('dashboard/frontend/components/booking-crm/InteractionsSheetsRecords.tsx');
    const setup = read('dashboard/frontend/components/booking-crm/SheetsRecordsSetupPanel.tsx');

    expect(page).not.toContain('InteractionService');
    expect(page).not.toContain('handleSyncPending');
    expect(page).not.toContain('handleVerifyConnection');
    expect(page).toContain('operationalActionsEnabled={false}');
    expect(setup).toContain('Sync, Verify, and Backfill are unavailable');
    expect(setup).not.toContain('href="/dashboard/booking-crm/interactions/inbox"');
  });

  it('exposes the selected account region programmatically', () => {
    const source = read('dashboard/frontend/components/region/RegionSelectorPanel.tsx');
    expect(source).toContain('aria-pressed={isSelected}');
  });

  it('does not touch the canonical form-submission source of truth', () => {
    const source = read('packages/booking-crm/src/form-submissions.ts');
    expect(source).toContain('All `form_submissions.source` values');
    expect(source).toContain('export const INTERACTION_SOURCES');
  });
});
