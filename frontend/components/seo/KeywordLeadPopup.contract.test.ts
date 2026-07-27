import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  formChoiceChipLayoutClass,
  formChoiceGroupClass,
} from '@/lib/form-choice-group-layout';
import { PMP_JOB_EXPERIENCE_OPTIONS } from '@/lib/pmp-roadmap-form-options';

const source = readFileSync(new URL('./KeywordLeadPopup.tsx', import.meta.url), 'utf8');
const optionsSource = readFileSync(
  new URL('../../lib/pmp-roadmap-form-options.ts', import.meta.url),
  'utf8',
);

describe('KeywordLeadPopup experience option layout contract', () => {
  it('uses the authoritative shared four-choice experience taxonomy and layout', () => {
    expect(PMP_JOB_EXPERIENCE_OPTIONS).toEqual([
      { value: 'under_2', label: 'Less than 2 years' },
      { value: '2_to_5', label: '2–5 years' },
      { value: '5_to_7', label: '5–7 years' },
      { value: 'other', label: 'Other' },
    ]);
    expect(optionsSource).toContain(
      "import { PM_EXPERIENCE_OPTIONS } from '@/lib/pmp-qualification-options'",
    );
    expect(source).toContain("from '@/lib/form-choice-group-layout'");
    expect(source).toContain(
      "formChoiceGroupClass(PMP_JOB_EXPERIENCE_OPTIONS.length, 'site')",
    );
    expect(source).toContain(
      'formChoiceChipLayoutClass(PMP_JOB_EXPERIENCE_OPTIONS.length)',
    );
    expect(source).toContain("formChoiceStepBleedClass('site')");
    expect(source).toContain('min-h-11');
    expect(source).not.toContain("'h-8 rounded-lg border px-2");
    const layout = formChoiceGroupClass(PMP_JOB_EXPERIENCE_OPTIONS.length, 'site');
    expect(layout).toBe('grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-0 md:gap-0');
    expect(formChoiceChipLayoutClass(PMP_JOB_EXPERIENCE_OPTIONS.length)).toBe(
      'w-full min-w-0 whitespace-nowrap px-2.5 tracking-[-0.01em] sm:px-0 sm:tracking-tight md:px-0 md:tracking-[-0.01em]',
    );
  });

  it('requires, clears, and conditionally persists the Other detail', () => {
    expect(source).toContain("jobExperience === 'other' && !jobExperienceOther.trim()");
    expect(source).toContain("if (opt.value !== 'other')");
    expect(source).toContain("setJobExperienceOther('')");
    expect(source).toContain("jobExperience === 'other' ? jobExperienceOther.trim() : undefined");
    expect(source).toContain('htmlFor="kw-lead-experience-other"');
    expect(source).toContain('required');
    expect(source).toContain('onInvalid={() =>');
    expect(source).toContain('aria-required="true"');
    expect(source).toContain('aria-invalid={jobExperienceOtherError');
    expect(source).toContain("'kw-lead-experience-other-error'");
    expect(source).toContain('role="alert"');
  });

  it('keeps Other free text out of analytics calls', () => {
    const analyticsCalls = source.match(/track(?:FunnelEvent|Event)\([\s\S]*?\);/g) ?? [];
    expect(analyticsCalls.join('\n')).not.toContain('jobExperienceOther');
  });

  it('does not change the WhatsApp/Schedule footer two-button grid', () => {
    expect(source).toContain('grid w-full grid-cols-2 gap-2');
  });

  it('restores close focus to the pre-open element or documented fallback', () => {
    expect(source).toContain('preOpenFocusRef');
    expect(source).toContain('resolveKeywordLeadCloseFocus');
    expect(source).toContain('finalFocus={() => resolveKeywordLeadCloseFocus(preOpenFocusRef.current)}');
    expect(source).toContain('[data-keyword-lead-focus-fallback]');
    expect(source).toContain("document.querySelector('main')");
  });
});
