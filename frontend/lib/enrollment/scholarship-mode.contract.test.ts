import { describe, expect, it } from 'vitest';
import fs from 'node:fs';

const formSource = fs.readFileSync(
  new URL('../../components/enrollment/ProgramEnrollmentForm.tsx', import.meta.url),
  'utf8',
);
const pageSource = fs.readFileSync(
  new URL(
    '../../app/(site)/certifications/[id]/[tierSlug]/enroll/scholarship/page.tsx',
    import.meta.url,
  ),
  'utf8',
);

describe('scholarshipMode form contract', () => {
  it('forces mentor-led and hides mode switchers when scholarshipMode', () => {
    expect(formSource).toContain("scholarshipMode ? 'mentor_led' : defaultPaymentMode(tierId)");
    expect(formSource).toContain("offerType={scholarshipMode ? 'scholarship_invite' : undefined}");
    expect(formSource).toContain('15% mentor-led scholarship · GCC &amp; Global');
    expect(formSource).toContain("router.replace(enrollPath(siteCertId, tierSlug))");
    expect(formSource).toContain('ScholarshipSessionGate');
  });

  it('keeps normal enroll defaults identical', () => {
    expect(formSource).toContain("if (tierId === 'professional') return 'self_paced'");
    expect(formSource).toContain("onClick={() => setPaymentMode('self_paced')}");
    expect(formSource).toContain("onClick={() => setPaymentMode('seat_deposit')}");
  });
});

describe('foundation scholarship route gate', () => {
  it('rejects non-scholarship tiers via isScholarshipTier + notFound', () => {
    expect(pageSource).toContain('isScholarshipTier(tierSlug)');
    expect(pageSource).toContain('notFound()');
    expect(pageSource).toContain("offering.tierId === 'foundation'");
    expect(pageSource).toContain('scholarshipMode');
    expect(pageSource).toContain('robots: { index: false, follow: false }');
  });
});
