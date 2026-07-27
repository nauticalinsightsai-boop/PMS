import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./PortalPathwayCard.tsx', import.meta.url), 'utf8');

describe('PortalPathwayCard disclosure contract', () => {
  it('keeps collapsed chrome with family, title, cohort, duration · tuition, and Details only', () => {
    expect(source).toContain('Details');
    expect(source).toContain('durationTuition');
    expect(source).toContain('`${duration ?? \'Flexible\'} · ${tuitionSummary}`');
    expect(source).toContain('inline-block shrink-0 text-[10px] font-mono uppercase tracking-[0.16em]');
    expect(source).not.toContain('hidden sm:inline-block shrink-0 text-[10px] font-mono uppercase tracking-[0.16em]');
    expect(source).toContain('!expanded ? (');
    expect(source).toContain('onClick={() => setExpanded(true)}');
    expect(source).toContain("isEnrollmentOpen(cert.id, regionId) ? 'View pathway' : 'View overview'");
  });

  it('exposes aria-expanded and aria-controls to a stable unique panel id', () => {
    expect(source).toContain('const panelId = `portal-pathway-panel-${cert.id}`');
    expect(source).toContain('aria-expanded={false}');
    expect(source).toContain('aria-controls={panelId}');
    expect(source).toContain('id={panelId}');
    expect(source).toContain('role="region"');
    expect(source).toContain('aria-labelledby={titleId}');
  });

  it('removes collapsed detail from the tree and puts the sole pathway action in the expanded region', () => {
    expect(source).toContain('{expanded ? (');
    expect(source).not.toContain("expanded ? 'max-h-[2400px] opacity-100' : 'max-h-0 opacity-0'");
    expect(source).not.toContain('omitCta');
    expect(source).toMatch(/<Link[\s\S]*href=\{`\/certifications\/\$\{cert\.id\}`\}[\s\S]*\{ctaLabel\}/);
    expect(source).toContain('prefetch={false}');
  });

  it('retains expanded outcome/data content', () => {
    expect(source).toContain('cert.outputValue');
    expect(source).toContain('displayDesc');
    expect(source).toContain('PortalMembershipPopout');
    expect(source).toContain("cert.learningOutcomes?.slice(0, 3)");
  });

  it('uses inline membership placement so the link is in-flow and not clipped', () => {
    expect(source).toContain('placement="inline"');
    expect(source.match(/placement="inline"/g)?.length).toBeGreaterThanOrEqual(1);
    expect(source).not.toContain('placement="overlay"');
  });

  it('keeps Prep time, Tuition, and Membership as sibling meta chips in a grid row', () => {
    expect(source).toContain('portal-pathway-meta-chip-row');
    expect(source).toContain(
      'grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-3 sm:items-stretch',
    );
    expect(source).toContain('label="Prep time"');
    expect(source).toContain('label="Tuition"');
    expect(source).toContain('PortalMembershipPopout');
    expect(source).not.toContain('portalSpacing.metaChipRow');
  });

  it('keeps the membership panel structurally outside the chip flex stack (full-span via popout)', () => {
    // Panel is not nested under a chip-column flex-col wrapper in this file; grid hosts chips,
    // and PortalMembershipPopout inline uses contents + col-span-full below the chip row.
    expect(source).toContain('placement="inline"');
    expect(source).toContain('portal-pathway-meta-chip-row');
    expect(source.match(/portal-pathway-meta-chip-row/g)?.length).toBeGreaterThanOrEqual(2);
  });

  it('uses a practical Details target and restores it when Escape closes the focused region', () => {
    expect(source).toContain('min-h-11 w-full items-center justify-center gap-2');
    expect(source).toContain('panelRef.current?.focus()');
    expect(source).toContain("if (event.key === 'Escape') closeDetails()");
    expect(source).toContain('detailsButtonRef.current?.focus()');
  });

  it('adds no analytics or page_view for disclosure', () => {
    expect(source).not.toContain('page_view');
    expect(source).not.toContain('trackFunnelEvent');
    expect(source).not.toContain('pushAnalyticsEvent');
    expect(source).not.toContain('sendGAEvent');
    expect(source).not.toContain('PMS_EVENTS');
    expect(source).not.toContain("from '@/lib/analytics");
  });
});
