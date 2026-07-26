import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const formSource = readFileSync(
  new URL('./CertificationRoadmapLeadForm.tsx', import.meta.url),
  'utf8',
);
const detailSource = readFileSync(
  new URL('../pages/CertificationDetail.tsx', import.meta.url),
  'utf8',
);
const hubSource = readFileSync(
  new URL('../pages/Certifications.tsx', import.meta.url),
  'utf8',
);

describe('generic certification roadmap contract', () => {
  it('submits non-PMP interest through the generic certification source', () => {
    expect(formSource).toContain("source: 'cert_roadmap_lead'");
    expect(formSource).toContain("formId: 'certification_roadmap'");
    expect(formSource).not.toContain('35-hour');
    expect(formSource).not.toContain('qualificationOutcome');
  });

  it('keeps PMP on its eligibility form and routes other details to the generic form', () => {
    expect(detailSource).toContain("cert.id === 'pmp'");
    expect(detailSource).toContain('<PmpRoadmapLeadForm');
    expect(detailSource).toContain('<CertificationRoadmapLeadForm');
  });

  it('uses a certification-neutral form on the multi-certification hub', () => {
    expect(hubSource).toContain('<CertificationRoadmapLeadForm');
    expect(hubSource).not.toContain('<PmpRoadmapLeadForm');
  });
});
