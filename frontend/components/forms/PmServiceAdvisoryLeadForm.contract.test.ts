import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  PM_SERVICE_INDUSTRY_OPTIONS,
  PM_SERVICE_INTEREST_OPTIONS,
} from '@/lib/pm-service-form-options';

const source = readFileSync(
  resolve(process.cwd(), 'components/forms/PmServiceAdvisoryLeadForm.tsx'),
  'utf8',
);

describe('PM Service advisory exact-four choice contract', () => {
  it('builds exactly four visible choices for Interest and Industry', () => {
    expect(PM_SERVICE_INTEREST_OPTIONS).toHaveLength(3);
    expect(PM_SERVICE_INDUSTRY_OPTIONS).toHaveLength(3);
    expect(source).toContain('const PM_SERVICE_INTEREST_CHOICES = [');
    expect(source).toContain('const PM_SERVICE_INDUSTRY_CHOICES = [');
    expect(source.match(/\{ value: 'other', label: 'Other' \}/g)).toHaveLength(2);
    expect(source).toContain(
      "formChoiceGroupClass(PM_SERVICE_INTEREST_CHOICES.length, 'site')",
    );
    expect(source).toContain(
      "formChoiceGroupClass(PM_SERVICE_INDUSTRY_CHOICES.length, 'site')",
    );
    expect(source).toContain('const PM_SERVICE_INTEREST_CHIP_CLASS =');
    expect(source).toContain(
      "'w-full min-w-0 whitespace-normal break-words px-3 text-center leading-snug tracking-[-0.04em] sm:px-3 sm:tracking-normal md:px-3 md:tracking-normal'",
    );
    expect(source).toContain('PM_SERVICE_INTEREST_CHIP_CLASS');
    expect(source).not.toContain(
      'formChoiceChipLayoutClass(PM_SERVICE_INTEREST_CHOICES.length)',
    );
    expect(source).toContain(
      'formChoiceChipLayoutClass(PM_SERVICE_INDUSTRY_CHOICES.length)',
    );
    expect(source).not.toContain('truncate');
    expect(source).not.toContain('overflow-hidden text-ellipsis');
    expect(source).not.toContain("'-mx-2.5 sm:-mx-6'");
    expect(source).toContain(
      "'tracking-[-0.02em] sm:tracking-[-0.045em] md:tracking-[-0.045em]'",
    );
    expect(source).toContain(
      "'relative left-1/2 w-[calc(100%+0.5rem)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 sm:w-[calc(100%+2rem)] sm:max-w-[calc(100vw-3rem)]'",
    );
    expect(source).toContain('min-h-12');
    expect(source).toContain("currentStep === 'interest'");
    expect(source).toContain("currentStep === 'contact'");
    expect(source).toContain('Step {stepNumber} of 2');
    expect(source).toContain('Continue');
    expect(source).toContain('Back');
    expect(source).not.toContain('min-h-11');
    expect(source).not.toContain('Please describe your specific question');
    expect(source).toContain('Website, LinkedIn');
    expect(source).toContain('profileUrl: profileUrl.trim() || undefined');
    expect(source).toMatch(
      /data-step="interest"[\s\S]*?Website, LinkedIn[\s\S]*?data-step="contact"/,
    );
  });

  it('keeps each Other detail subordinate, required, and stale-payload safe', () => {
    expect(source).toContain("serviceInterest === 'other' ? (");
    expect(source).toContain("industry === 'other' ? (");
    expect(source).toContain('aria-label="Specify other interest"');
    expect(source).toContain('aria-label="Specify other industry"');
    expect(source).toMatch(
      /serviceInterest === 'other' \? \([\s\S]*?required[\s\S]*?aria-label="Specify other interest"/,
    );
    expect(source).toMatch(
      /industry === 'other' \? \([\s\S]*?required[\s\S]*?aria-label="Specify other industry"/,
    );
    expect(source).toContain(
      "serviceInterestOther: serviceInterest === 'other' ? serviceInterestOther.trim() : undefined",
    );
    expect(source).toContain(
      "industryOther: industry === 'other' ? industryOther.trim() : undefined",
    );
    expect(source).toContain("setServiceInterestOther('')");
    expect(source).toContain("setIndustryOther('')");
  });

  it('preserves the existing persistence and event-neutral boundary', () => {
    expect(source).toContain("source: 'consultation'");
    expect(source).toContain("formId: 'pm_service_advisory'");
    expect(source).toContain('submitPublicInteraction({');
    expect(source).not.toContain('pushAnalyticsEvent');
    expect(source).not.toContain('PMS_EVENTS');
    expect(source).not.toContain('preferredContactChannel');
    expect(source).not.toContain('preferredContactWindow');
    expect(source).not.toContain('instagram');
    expect(source).not.toContain('messenger');
  });
});
