import { describe, expect, it } from 'vitest';
import { resolveTierPathwayCta, tierDeliveryLine, tierPathwaySummary } from './pathway-tier-cta';

describe('pathway-tier-cta', () => {
  it('foundation with direct checkout uses Enroll now and enroll path', () => {
    const cta = resolveTierPathwayCta(
      'foundation',
      'pmp-preparation-foundation',
      'pmp',
      'direct_checkout',
      'Enroll Now',
    );
    expect(cta.modalMode).toBe('enroll');
    expect(cta.label).toBe('Enroll now');
    expect(cta.proceedHref).toContain('/certifications/pmp/foundation/enroll');
    expect(cta.enrollHref).toContain('/enroll');
    expect(cta.showConsultationInModal).toBe(false);
  });

  it('foundation scholarship_verify still enrolls with Enroll now label', () => {
    const cta = resolveTierPathwayCta(
      'foundation',
      'pmp-preparation-foundation',
      'pmp',
      'scholarship_verify',
      'Enroll Now',
    );
    expect(cta.label).toBe('Enroll now');
    expect(cta.proceedLabel).toBe('Enroll now');
    expect(cta.enrollHref).toContain('/enroll');
  });

  it('professional offers dual modal actions', () => {
    const cta = resolveTierPathwayCta(
      'professional',
      'pmp-preparation-professional',
      'pmp',
      'direct_checkout',
      'Enroll Now',
    );
    expect(cta.label).toBe('View pathway');
    expect(cta.showConsultationInModal).toBe(true);
    expect(cta.enrollHref).toContain('/certifications/pmp/professional/enroll');
  });

  it('mastery offers consultation in modal', () => {
    const cta = resolveTierPathwayCta(
      'mastery',
      'pmp-preparation-mastery',
      'pmp',
      'consultation_required',
      'Book Mastery Consultation',
    );
    expect(cta.modalMode).toBe('consultation');
    expect(cta.showConsultationInModal).toBe(true);
  });

  it('tier summaries are distinct from raw delivery mode', () => {
    expect(tierPathwaySummary('foundation')).toMatch(/LMS/i);
    expect(tierPathwaySummary('professional')).toMatch(/weekend/i);
  });

  it('tierDeliveryLine includes all mastery clauses, not only the first', () => {
    const professional =
      'Exam-focused LMS + mocks + templates + WhatsApp support + limited 1:1/review';
    expect(tierDeliveryLine(professional)).toBe(professional);

    const mastery =
      'Mentor-led; weekend/live sessions; WhatsApp support; consultation/review before access';
    expect(tierDeliveryLine(mastery)).toBe(
      'Mentor-led + weekend/live sessions + WhatsApp support + consultation/review before access',
    );
  });
});
