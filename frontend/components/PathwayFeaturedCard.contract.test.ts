import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./PathwayFeaturedCard.tsx', import.meta.url), 'utf8');

describe('PathwayFeaturedCard disclosure contract', () => {
  it('is controlled by its containing section', () => {
    expect(source).toContain('expanded: boolean;');
    expect(source).toContain('onExpandedChange: (expanded: boolean) => void;');
    expect(source).not.toContain('const [expanded');
  });

  it('renders Details only while collapsed and the pathway action only while expanded', () => {
    expect(source).toContain('onClick={() => onExpandedChange(true)}');
    expect(source).toContain('{expanded ? (');
    expect(source).toContain('<PathwayCardCta');
  });

  it('focuses expanded details and restores Details on Escape without analytics', () => {
    expect(source).toContain('detailsRegionRef.current?.focus()');
    expect(source).toContain("event.key === 'Escape'");
    expect(source).toContain('detailsButtonRef.current?.focus()');
    expect(source).not.toContain('pushAnalyticsEvent');
    expect(source).not.toContain('page_view');
  });

  it('uses one styled Link for an internal pathway CTA without nesting an interactive control', () => {
    expect(source).toContain("buttonVariants({ variant: accentColor ? 'default' : 'brand' })");
    expect(source).toContain('href={href}');
    expect(source).toContain('prefetch={false}');
    expect(source).not.toContain('asChild');
    expect(source).not.toContain('<Link href={href} className="w-full" aria-label={pathwayAriaLabel}>');
    expect(source).not.toContain('<Button\n      asChild');
  });
});
