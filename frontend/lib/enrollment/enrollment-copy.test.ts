import { describe, expect, it } from 'vitest';
import {
  enrollmentDescriptionForTier,
  enrollmentHeadingForTier,
  enrollmentMetadataDescriptionForTier,
  enrollmentPrimaryLabelForTier,
  enrollmentProceedLabelForTier,
} from './enrollment-copy';

describe('enrollment tier copy', () => {
  it('uses non-deposit Foundation language', () => {
    const copy = [
      enrollmentHeadingForTier('foundation'),
      enrollmentPrimaryLabelForTier('foundation'),
      enrollmentProceedLabelForTier('foundation'),
      enrollmentDescriptionForTier('foundation'),
      enrollmentMetadataDescriptionForTier('foundation'),
    ].join(' ');
    expect(copy).toContain('Self-paced enrollment');
    expect(copy).toContain('Continue to checkout');
    expect(copy).not.toMatch(/reserve|seat|deposit|pay in full/i);
  });

  it('uses delivery-choice Professional language', () => {
    const copy = [
      enrollmentHeadingForTier('professional'),
      enrollmentPrimaryLabelForTier('professional'),
      enrollmentProceedLabelForTier('professional'),
      enrollmentDescriptionForTier('professional'),
      enrollmentMetadataDescriptionForTier('professional'),
    ].join(' ');
    expect(copy).toContain('Choose your delivery option');
    expect(copy).toContain('Continue to checkout');
    expect(copy).not.toMatch(/reserve|seat|deposit|pay in full/i);
  });

  it('preserves Mastery reserve/deposit language', () => {
    expect(enrollmentHeadingForTier('mastery')).toBe('Reserve your seat');
    expect(enrollmentPrimaryLabelForTier('mastery')).toBe('Reserve your seat');
    expect(enrollmentProceedLabelForTier('mastery')).toBe('Reserve your seat');
    expect(enrollmentMetadataDescriptionForTier('mastery')).toMatch(/deposit/i);
  });
});
