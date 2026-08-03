import { describe, expect, it } from 'vitest';
import { resolveTierPathwayCta, tierDeliveryLine, tierPathwaySummary } from './pathway-tier-cta';

describe('pathway-tier-cta', () => {
  it('foundation with direct checkout uses self-paced and checkout language', () => {
    const cta = resolveTierPathwayCta(
      'foundation',
      'pmp-preparation-foundation',
      'pmp',
      'direct_checkout',
      'Enroll Now',
    );
    expect(cta.modalMode).toBe('enroll');
    expect(cta.label).toBe('Self-paced enrollment');
    expect(cta.proceedHref).toContain('/certifications/pmp/foundation/enroll');
    expect(cta.enrollHref).toContain('/enroll');
    expect(cta.showConsultationInModal).toBe(false);
    expect(cta.enrollLabel).toBe('Continue to checkout');
  });

  it('foundation scholarship_verify keeps non-deposit enrollment language', () => {
    const cta = resolveTierPathwayCta(
      'foundation',
      'pmp-preparation-foundation',
      'pmp',
      'scholarship_verify',
      'Enroll Now',
    );
    expect(cta.label).toBe('Self-paced enrollment');
    expect(cta.proceedLabel).toBe('Continue to checkout');
    expect(cta.enrollHref).toContain('/enroll');
    expect(cta.enrollLabel).toBe('Continue to checkout');
  });

  it('non-PMP foundation uses the same non-deposit language', () => {
    const cta = resolveTierPathwayCta(
      'foundation',
      'pmi-acp-preparation-foundation',
      'pmi-acp',
      'direct_checkout',
      'Reserve your seat',
    );
    expect(cta.label).toBe('Self-paced enrollment');
    expect(cta.proceedLabel).toBe('Continue to checkout');
    expect(cta.enrollLabel).toBe('Continue to checkout');
    expect(cta.enrollHref).toContain('/certifications/pmi-acp/foundation/enroll');
  });

  it('professional direct checkout uses the enrollment action', () => {
    const cta = resolveTierPathwayCta(
      'professional',
      'pmp-preparation-professional',
      'pmp',
      'direct_checkout',
      'Enroll Now',
    );
    expect(cta.label).toBe('Choose delivery option');
    expect(cta.modalMode).toBe('enroll');
    expect(cta.showConsultationInModal).toBe(false);
    expect(cta.proceedLabel).toBe('Continue to checkout');
    expect(cta.consultationLabel).toBeUndefined();
    expect(cta.enrollHref).toContain('/certifications/pmp/professional/enroll');
    expect(cta.enrollLabel).toBe('Continue to checkout');
  });

  it('mastery requires consultation before enrollment', () => {
    const cta = resolveTierPathwayCta(
      'mastery',
      'pmp-preparation-mastery',
      'pmp',
      'consultation_required',
      'Reserve your seat',
    );
    expect(cta.modalMode).toBe('consultation');
    expect(cta.showConsultationInModal).toBe(true);
    expect(cta.proceedLabel).toBe('Talk to a Mentor');
    expect(cta.consultationLabel).toBe('Talk to a Mentor');
    expect(cta.proceedHref).toContain('topic=consultation');
    expect(cta.enrollHref).toBeNull();
    expect(cta.enrollLabel).toBe('Reserve your seat');
  });

  it('mastery_corporate requires consultation before enrollment', () => {
    const cta = resolveTierPathwayCta(
      'mastery_corporate',
      'six-sigma-champion-mastery_corporate',
      'six-sigma-champion',
      'consultation_required',
      'Reserve your seat',
    );
    expect(cta.modalMode).toBe('consultation');
    expect(cta.showConsultationInModal).toBe(true);
    expect(cta.proceedHref).toContain('topic=consultation');
    expect(cta.enrollHref).toBeNull();
    expect(cta.enrollLabel).toBe('Reserve your seat');
  });

  it('tier summaries are distinct from raw delivery mode', () => {
    expect(tierPathwaySummary('foundation')).toMatch(/guidance meeting|mentor/i);
    expect(tierPathwaySummary('professional')).toMatch(/mentor-led|self-paced/i);
    expect(tierPathwaySummary('professional')).toMatch(/two one-hour|start and end/i);
    expect(tierPathwaySummary('mastery')).toMatch(/two mentor meetings/i);
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
