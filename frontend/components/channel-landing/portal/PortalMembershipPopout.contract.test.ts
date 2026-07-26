import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./PortalMembershipPopout.tsx', import.meta.url), 'utf8');

describe('PortalMembershipPopout disclosure contract', () => {
  it('uses a non-modal disclosure/popover pattern (not dialog/tooltip)', () => {
    expect(source).not.toContain('aria-haspopup="dialog"');
    expect(source).not.toContain('role="dialog"');
    expect(source).not.toContain('role="tooltip"');
    expect(source).toContain('role="region"');
    expect(source).toContain('aria-expanded={open}');
    expect(source).toContain('aria-controls={panelId}');
    expect(source).toContain('aria-labelledby={labelId}');
  });

  it('uses stable unique panel ids and click toggle', () => {
    expect(source).toContain("const panelId = `portal-membership-panel-${reactId.replace(/:/g, '')}`");
    expect(source).toContain('id={panelId}');
    expect(source).toContain('onClick={toggle}');
  });

  it('closes on Escape and returns focus to the trigger without a focus trap', () => {
    expect(source).toContain("event.key !== 'Escape'");
    expect(source).toContain('triggerRef.current?.focus()');
    expect(source).not.toContain('focus-trap');
    expect(source).not.toContain('FocusTrap');
    expect(source).not.toContain('inert');
  });

  it('conditionally removes the closed panel from the accessibility tree', () => {
    expect(source).toContain('{open ? (');
    expect(source).not.toContain('pointer-events-none');
    expect(source).not.toContain("open ? 'opacity-100");
  });

  it('preserves the membership link and CTA destination', () => {
    expect(source).toContain('href="/membership"');
    expect(source).toContain('View membership details');
  });

  it('supports inline in-flow placement as a full-span row (contents + col-span-full), not absolute', () => {
    expect(source).toContain("placement?: 'overlay' | 'inline'");
    expect(source).toContain("placement = 'overlay'");
    expect(source).toContain("const isInline = placement === 'inline'");
    expect(source).toContain("isInline ? 'contents' : 'relative'");
    expect(source).toContain("'col-span-full relative z-10 w-full min-w-0 p-4'");
    expect(source).toContain("...(isInline ? { position: 'relative' as const } : null)");
    expect(source).not.toContain("'relative z-10 mt-2 w-full p-4'");
    expect(source).not.toContain("isInline ? 'flex w-full min-w-0 flex-col'");
    expect(source).toContain(
      "'absolute right-0 top-full z-40 mt-2 w-[min(18rem,calc(100vw-2rem))] p-4 shadow-lg'",
    );
    expect(source).toContain('isInline ? undefined : show');
  });

  it('adds no analytics or page_view for popover disclosure', () => {
    expect(source).not.toContain('page_view');
    expect(source).not.toContain('trackFunnelEvent');
    expect(source).not.toContain('pushAnalyticsEvent');
    expect(source).not.toContain('sendGAEvent');
    expect(source).not.toContain('PMS_EVENTS');
    expect(source).not.toContain("from '@/lib/analytics");
  });
});
