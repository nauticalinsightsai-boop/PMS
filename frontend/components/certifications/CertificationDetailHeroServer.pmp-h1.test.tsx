import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CertificationDetailHeroServer } from '@/components/certifications/CertificationDetailHeroServer';
import { resolveCertMarketing } from '@/lib/cert-detail';
import { certifications } from '@/data/certification-index';
import { getPhase2Seo } from '@/content/seo/phase-2-page-seo';
import { PMP_PATHWAY_PAGE } from '@/content/pmp/pathway-page';
import type { CertificationRegistryEntry, CertificationsRegistry } from '@pms/site-content';

const PHASE2_PMP_H1 = 'PMP Certification: Credential & Exam Overview';
const LEGACY_CMS_H1 = 'PMP 2026 Readiness Pathway';

function cmsOverrideRegistry(): CertificationsRegistry {
  const site = certifications.find((c) => c.id === 'pmp')!;
  const entry: CertificationRegistryEntry = {
    id: 'pmp',
    name: site.name,
    familyId: site.familyId,
    desc: site.desc,
    color: site.color,
    gradient: site.gradient,
    hidden: false,
    archived: false,
    pricing: site.pricing,
    detailHeroTitle: LEGACY_CMS_H1,
    detailHeroSubtitle: 'CMS subtitle that must not change Phase 2 H1 intent.',
  };
  return { version: 1, entries: [entry] };
}

beforeEach(() => {
  vi.stubGlobal('React', React);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('/certifications/pmp H1 vs CMS pathway override', () => {
  it('resolves Phase 2 credential H1 even when CMS publishes pathway copy', () => {
    const site = certifications.find((c) => c.id === 'pmp')!;
    const registry = cmsOverrideRegistry().entries[0];
    const resolved = resolveCertMarketing(site, registry);

    expect(getPhase2Seo('/certifications/pmp')?.h1).toBe(PHASE2_PMP_H1);
    expect(resolved.detailHeroTitle).toBe(PHASE2_PMP_H1);
    expect(resolved.detailHeroTitle).not.toBe(LEGACY_CMS_H1);
    expect(resolved.detailHeroTitle).not.toBe(PMP_PATHWAY_PAGE.h1);
    expect(PMP_PATHWAY_PAGE.h1.toLowerCase()).toMatch(/readiness pathway|preparation roadmap/);
  });

  it('renders the Phase 2 H1 when the published CMS registry still has the old pathway title', () => {
    const html = renderToStaticMarkup(
      <CertificationDetailHeroServer certId="pmp" initialRegistry={cmsOverrideRegistry()} />,
    );

    expect(html).toContain('PMP Certification: Credential &amp; Exam Overview');
    expect(html).not.toContain(LEGACY_CMS_H1);
    expect(html).not.toContain(PMP_PATHWAY_PAGE.h1);
    expect((html.match(/<h1[\s>]/g) || []).length).toBe(1);
  });
});
