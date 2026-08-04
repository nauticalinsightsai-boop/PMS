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
const enrollmentPageSource = fs.readFileSync(
  new URL('../../components/pages/ProgramEnrollment.tsx', import.meta.url),
  'utf8',
);

describe('scholarshipMode form contract', () => {
  it('forces mentor-led and hides mode switchers when scholarshipMode', () => {
    expect(formSource).toContain("scholarshipMode ? 'mentor_led' : defaultPaymentMode(tierId)");
    expect(formSource).toContain('resolveEliteScholarshipPrice');
    expect(formSource).toContain('gccCountry');
    expect(formSource).toContain("offerType={scholarshipMode ? 'scholarship_invite' : undefined}");
    expect(formSource).toContain('eliteScholarshipBanner(regionId)');
    expect(formSource).toContain("router.replace(enrollPath(siteCertId, tierSlug))");
    expect(formSource).toContain('ScholarshipSessionGate');
  });

  it('keeps normal enroll defaults identical', () => {
    expect(formSource).toContain("if (tierId === 'professional') return 'self_paced'");
    expect(formSource).toContain("onClick={() => setPaymentMode('self_paced')}");
    expect(formSource).toContain("onClick={() => setPaymentMode('seat_deposit')}");
  });
});

describe('Elite scholarship page copy', () => {
  it('uses congratulations Elite heading instead of delivery-option copy', () => {
    expect(enrollmentPageSource).toContain('ELITE_SCHOLARSHIP_HEADING');
    expect(enrollmentPageSource).not.toContain('Choose your delivery option · Scholarship');
    expect(pageSource).toContain('Elite scholarship');
    expect(pageSource).toContain('isScholarshipTier(tierSlug)');
    expect(pageSource).toContain('notFound()');
    expect(pageSource).toContain("offering.tierId === 'foundation'");
    expect(pageSource).toContain('robots: { index: false, follow: false }');
  });
});
