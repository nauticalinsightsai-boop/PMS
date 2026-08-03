import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./PathwayFeaturedCard.tsx', import.meta.url), 'utf8');

describe('PathwayFeaturedCard disclosure contract', () => {
  it('keeps optional catalog disclosure props for non-flagship cards', () => {
    expect(source).toContain('expanded?: boolean;');
    expect(source).toContain('onExpandedChange?: (expanded: boolean) => void;');
    expect(source).not.toContain('const [expanded');
  });

  it('keeps Home visual cards always open with the pathway CTA (no Details expand)', () => {
    expect(source).toContain('/** Home: featured card with gradient visual header — details + CTA always open (no expand). */');
    expect(source).toContain('<PathwayCardCta certId={cert.id} certName={displayTitle} regionId={regionId} ctaLabel={ctaLabel} ctaHref={ctaHref} />');
    const visualStart = source.indexOf('function PathwayFeaturedVisualCard');
    const catalogStart = source.indexOf('function PathwayFeaturedCatalogCard');
    const visual = source.slice(visualStart, catalogStart);
    expect(visual).not.toContain('Details');
    expect(visual).not.toContain('onExpandedChange');
    expect(visual).toContain('data-pathway-region={cert.id}');
  });

  it('keeps flagship catalog cards always open like the hero form (no Details expand)', () => {
    expect(source).toContain('const alwaysOpen = desktopFlagshipOpen;');
    expect(source).toContain('ctaLabel="View pathway"');
    expect(source).toContain('nonInteractiveMembership={alwaysOpen}');
    expect(source).not.toContain('hidden lg:block');
    expect(source).not.toContain('lg:hidden');
    const catalogStart = source.indexOf('function PathwayFeaturedCatalogCard');
    const catalog = source.slice(catalogStart);
    expect(catalog).toContain('Details');
    expect(catalog).toContain('onClick={() => setExpanded(true)}');
  });

  it('uses one styled Link for an internal pathway CTA without nesting an interactive control', () => {
    expect(source).toContain("buttonVariants({ variant: accentColor ? 'default' : 'brand' })");
    expect(source).toContain('href={href}');
    expect(source).toContain('prefetch={false}');
    expect(source).not.toContain('asChild');
    expect(source).not.toContain('<Link href={href} className="w-full" aria-label={pathwayAriaLabel}>');
    expect(source).not.toContain('<Button\n      asChild');
  });

  it('shows membership pricing on every breakpoint in a 3-column chip row', () => {
    expect(source).toContain("showMembership ? 'grid-cols-3' : 'grid-cols-2'");
    expect(source).toContain('const showMembership = Boolean(listing.membership?.trim());');
    expect(source).toContain('label={REGION_COPY.membershipChipLabel}');
    expect(source).toContain('<MembershipPriceChip');
    expect(source).not.toContain('sm:grid-cols-3');
    expect(source).not.toContain('sm:flex sm:min-h-[5rem] sm:px-2.5 lg:hidden');
  });
});
