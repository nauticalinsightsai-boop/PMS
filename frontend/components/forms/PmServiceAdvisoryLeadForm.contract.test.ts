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
    expect(source).toContain(
      'formChoiceChipLayoutClass(PM_SERVICE_INTEREST_CHOICES.length)',
    );
    expect(source).toContain(
      'formChoiceChipLayoutClass(PM_SERVICE_INDUSTRY_CHOICES.length)',
    );
    expect(source).toContain('min-h-11');
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
