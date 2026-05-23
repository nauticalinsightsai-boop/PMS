import { describe, expect, it } from 'vitest';
import { resolveTierPathwayCta, tierDeliveryLine, tierPathwaySummary } from './pathway-tier-cta';

describe('pathway-tier-cta', () => {
  it('foundation with direct checkout opens enroll modal flow', () => {
    const cta = resolveTierPathwayCta(
      'foundation',
      'pmp-preparation-foundation',
      'pmp',
      'direct_checkout',
      'Enroll Now',
    );
    expect(cta.modalMode).toBe('enroll');
    expect(cta.label).toMatch(/enroll/i);
    expect(cta.proceedHref).toContain('checkout');
  });

  it('professional always uses consultation flow', () => {
    const cta = resolveTierPathwayCta(
      'professional',
      'pmp-preparation-professional',
      'pmp',
      'direct_checkout',
      'Enroll Now',
    );
    expect(cta.modalMode).toBe('consultation');
    expect(cta.label).toMatch(/consultation/i);
    expect(cta.proceedHref).toContain('consultation');
  });

  it('mastery uses consultation label', () => {
    const cta = resolveTierPathwayCta(
      'mastery',
      'pmp-preparation-mastery',
      'pmp',
      'consultation_required',
      'Book Mastery Consultation',
    );
    expect(cta.modalMode).toBe('consultation');
    expect(cta.label).toMatch(/consultation/i);
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
