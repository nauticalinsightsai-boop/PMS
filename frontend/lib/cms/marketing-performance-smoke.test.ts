import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(__dirname, '../..');

function readPage(name: string): string {
  return fs.readFileSync(path.join(ROOT, 'components/pages', name), 'utf8');
}

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

describe('marketing performance — content preservation smoke', () => {
  it('Home keeps testimonials gate, lazy sections, and single responsive hero form', () => {
    const home = readPage('Home.tsx');
    expect(home).toContain('HomeTestimonialsSection');
    expect(home).toContain('sections?.testimonials');
    expect(home).toContain('LazyWhenVisible');
    expect(home).toContain('PmpRoadmapLeadForm');
    expect(home).toContain('heroFormPlacement');
    expect(home).toContain('useIsLgUp');
    expect(home).not.toContain('useWebsiteData');
  });

  it('Certifications hub keeps one hero PmpRoadmapLeadForm', () => {
    const src = readPage('Certifications.tsx');
    expect(countOccurrences(src, '<PmpRoadmapLeadForm')).toBe(1);
    expect(src).toContain('useIsLgUp');
    expect(src).not.toContain('useWebsiteData');
  });

  it('Certification detail keeps one hero PmpRoadmapLeadForm and programme highlights', () => {
    const src = readPage('CertificationDetail.tsx');
    expect(countOccurrences(src, '<PmpRoadmapLeadForm')).toBe(1);
    expect(src).not.toContain('Pmp2026FlagshipSections');
    expect(src).toContain('CertProgramHighlightsContent');
    expect(src).toContain('LazyWhenVisible');
  });

  it('PMP exam 2026 guide stays focused; pathway page hosts flagship sections', () => {
    const authority = fs.readFileSync(path.join(ROOT, 'components/pmp/PmpAuthorityPage.tsx'), 'utf8');
    const pathway = fs.readFileSync(path.join(ROOT, 'components/pmp/Pmp2026PathwayPage.tsx'), 'utf8');
    expect(authority).not.toContain('Pmp2026FlagshipSections');
    expect(authority).not.toContain('PmpPackageTierPositioning');
    expect(pathway).toContain('Pmp2026FlagshipSections');
    expect(pathway).toContain('PmpPackageTierPositioning');
  });

  it('Community keeps store tab wiring and dynamic StoreContent', () => {
    const src = readPage('Community.tsx');
    expect(src).toContain('StoreContent');
    expect(src).toContain('/community?view=store');
    expect(src).toContain('activeTab === "store"');
    expect(src).not.toContain('useWebsiteData');
  });

  it('Marketing pages do not import useWebsiteData', () => {
    const pages = [
      'About.tsx',
      'Blog.tsx',
      'Contact.tsx',
      'Compare.tsx',
      'FAQ.tsx',
      'Membership.tsx',
      'Newsletter.tsx',
      'PMService.tsx',
    ];
    for (const page of pages) {
      const src = readPage(page);
      expect(src, page).not.toContain('useWebsiteData');
    }
  });

  it('PublicShell defers conversion widgets until idle', () => {
    const shell = fs.readFileSync(path.join(ROOT, 'components/PublicShell.tsx'), 'utf8');
    expect(shell).toContain('deferWidgets');
    expect(shell).toContain('BottomCtaRotator');
    expect(shell).toContain('SupportChatWidget');
    expect(shell).toContain('LeadRecoveryDialog');
    expect(shell).toContain('LeadRecoveryProvider');
    expect(shell).toMatch(/requestIdleCallback|setTimeout/);
  });

  it('Checkout routes dynamically import Stripe embedded panel', () => {
    const membershipCheckout = readPage('MembershipCheckout.tsx');
    const storeCheckout = readPage('StoreCheckout.tsx');
    expect(membershipCheckout).toContain('StripeEmbeddedCheckoutPanel');
    expect(membershipCheckout).toContain('dynamic(');
    expect(storeCheckout).toContain('StripeEmbeddedCheckoutPanel');
    expect(storeCheckout).toContain('dynamic(');
  });
});

describe('marketing performance — CMS fallbacks without Supabase', () => {
  it('fetchPublishedGlobalContent returns empty map when env unset', async () => {
    const { fetchPublishedGlobalContent } = await import('@/lib/cms/fetch-published-document');
    const prevUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const prevKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const map = await fetchPublishedGlobalContent();
    expect(map).toEqual({});

    process.env.NEXT_PUBLIC_SUPABASE_URL = prevUrl;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = prevKey;
  });
});
