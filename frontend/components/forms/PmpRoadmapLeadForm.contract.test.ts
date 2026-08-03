import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  EDUCATION_OPTIONS,
  EXAM_TIMELINE_OPTIONS,
  NEEDS_OBJECTIVE_OPTIONS,
  PM_EXPERIENCE_OPTIONS,
  TRAINING_STATUS_OPTIONS,
  WORK_FIELD_OPTIONS,
} from '@/lib/pmp-qualification-options';

const source = readFileSync(new URL('./PmpRoadmapLeadForm.tsx', import.meta.url), 'utf8');

describe('PmpRoadmapLeadForm component contract', () => {
  it('gives every single-choice group an accessible name', () => {
    const groups = [
      'work-field',
      'experience',
      'needs',
      'education',
      'training',
      'timeline',
    ];
    expect(source.match(/\srole="radiogroup"/g)).toHaveLength(groups.length);
    expect(source.match(/aria-required="true"/g)?.length).toBeGreaterThanOrEqual(
      groups.length,
    );
    for (const group of groups) {
      expect(source).toContain(`id={\`\${idPrefix}-${group}-label\`}`);
      expect(source).toContain(`aria-labelledby={\`\${idPrefix}-${group}-label\`}`);
      expect(source).toContain(`id={\`\${idPrefix}-${group}-options\`}`);
    }
  });

  it('uses native buttons with radio state and arrow-key selection', () => {
    expect(source).toContain('type="button"');
    expect(source).toContain('role="radio"');
    expect(source).toContain("'aria-checked': boolean");
    expect(source).toContain("event.key === 'ArrowRight'");
    expect(source).toContain("event.key === 'ArrowDown'");
    expect(source).toContain('choices[nextIndex]?.click()');
    expect(source).toContain('getPmpChoiceTabIndex');
  });

  it('announces validation and focuses the invalid control', () => {
    expect(source.match(/role="alert"/g)).toHaveLength(1);
    expect(source.match(/aria-live="assertive"/g)).toHaveLength(1);
    expect(source).toContain('focusValidationIssue(issue)');
    expect(source).toContain('aria-describedby={error ?');
    expect(source).toContain('noValidate');
    expect(source).toContain("validationIssue?.field === 'workFieldOther'");
    expect(source).toContain("validationIssue?.field === 'needsObjectiveOther'");
    expect(source).toContain("validationIssue?.field === 'pmExperienceOther'");
    expect(source).toContain("validationIssue?.field === 'educationOther'");
    expect(source).toContain("validationIssue?.field === 'trainingStatusOther'");
    expect(source).toContain("validationIssue?.field === 'fullName'");
    expect(source).toContain("validationIssue?.field === 'phone'");
    expect(source).toContain("validationIssue?.field === 'email'");
    expect(source).toContain('`${idPrefix}-name-error`');
    expect(source).toContain('`${idPrefix}-phone-error`');
    expect(source).toContain('`${idPrefix}-email-error`');
  });

  it('scopes step-transition focus to this form instance', () => {
    expect(source).toContain('const formRef = React.useRef<HTMLFormElement>(null)');
    expect(source).toContain('ref={formRef}');
    expect(source).toContain('formRef.current?.querySelector<HTMLElement>');
    expect(source).not.toContain('document.querySelector<HTMLElement>');
  });

  it('uses shared four-choice layout helper (2x2 mobile, one row desktop)', () => {
    expect(source).toContain("from '@/lib/form-choice-group-layout'");
    expect(source).toContain('formChoiceGroupClass(');
    expect(source).toContain('formChoiceChipLayoutClass(');
    expect(source).toContain('formChoiceStepBleedClass(');
    expect(source).toContain("data-step=\"fit\"");
    expect(source).toContain('formChoiceStepBleedClass(choiceVariant)');
    expect(source).toContain("data-step=\"contact\" className=\"flex flex-col gap-5 sm:gap-6\"");
    expect(source).not.toContain('formChoicePanelInsetXClass');
    expect(source).not.toContain('formChoiceChipPaddingClass');
    expect(source).not.toContain('whitespace-normal');
    expect(source).toContain('min-h-12');
    expect(source).toContain('text-sm');
    expect(WORK_FIELD_OPTIONS).toHaveLength(4);
    expect(NEEDS_OBJECTIVE_OPTIONS).toHaveLength(4);
    expect(EDUCATION_OPTIONS).toHaveLength(4);
    expect(PM_EXPERIENCE_OPTIONS).toHaveLength(4);
    expect(TRAINING_STATUS_OPTIONS).toHaveLength(4);
    expect(EXAM_TIMELINE_OPTIONS).toEqual([
      { value: 'within_3', label: '< 3 months' },
      { value: '3_to_6', label: '3–6 months' },
      { value: '6_plus', label: '6+ months' },
      { value: 'exploring', label: 'Exploring' },
    ]);
    expect(PM_EXPERIENCE_OPTIONS).toEqual([
      { value: 'under_2', label: '< 2 years' },
      { value: '2_to_5', label: '2–5 years' },
      { value: '5_to_7', label: '5–7 years' },
      { value: 'other', label: 'Other' },
    ]);
  });

  it('keeps the desktop certification form content-sized and its first step compact', () => {
    expect(source).toContain("useCertHeroLayout && 'flex flex-col'");
    expect(source).toContain('useCertHeroLayout = isCertHeroDesktop && isCompact');
    expect(source).not.toContain('min-h-[756px]');
    expect(source).toContain("'flex flex-col gap-4 px-5 py-5 sm:gap-5 sm:px-6 sm:py-6'");
    expect(source).toContain(
      "useCertHeroLayout ? 'flex flex-col gap-4 sm:gap-5' : 'flex flex-col gap-5 sm:gap-6'",
    );
    expect(source).toContain('formChoiceGroupClass(WORK_FIELD_OPTIONS.length, choiceVariant)');
    expect(source).toContain('formChoiceChipLayoutClass(WORK_FIELD_OPTIONS.length)');
  });

  it('widens only the contained site shell through the desktop inter-column gap', () => {
    expect(source).toContain('lg:w-[calc(100%+5.5rem)] lg:-ml-[5.5rem] xl:w-full xl:ml-0');
    expect(source).toContain('overflow-hidden');
    expect(source).not.toContain('lg:-mx-12');
  });

  it('balances steps 3/3/3 Context/Readiness and clears Other detail on switch-away', () => {
    expect(source).toContain('Step 1: Fit / Context (industry + experience + need)');
    expect(source).toContain('Step 2: Eligibility / Readiness (education + training + timeline)');
    expect(source).toContain("if (opt.value !== 'other') setWorkFieldOther('')");
    expect(source).toContain("if (opt.value !== 'other') setPmExperienceOther('')");
    expect(source).toContain("if (opt.value !== 'other') setEducationOther('')");
    expect(source).toContain('experience: pmExperience');
    // Authoritative DOM order within Step 1
    const industryIdx = source.indexOf('id={`${idPrefix}-work-field-label`}');
    const experienceIdx = source.indexOf('id={`${idPrefix}-experience-label`}');
    const needIdx = source.indexOf('id={`${idPrefix}-needs-label`}');
    expect(industryIdx).toBeGreaterThan(-1);
    expect(experienceIdx).toBeGreaterThan(industryIdx);
    expect(needIdx).toBeGreaterThan(experienceIdx);
    // Production blocker replacement: exactly four choices each for Industry → Experience → Need
    expect(WORK_FIELD_OPTIONS).toHaveLength(4);
    expect(PM_EXPERIENCE_OPTIONS).toHaveLength(4);
    expect(NEEDS_OBJECTIVE_OPTIONS).toHaveLength(4);
    expect(WORK_FIELD_OPTIONS.map((o) => o.label)).toEqual([
      'Construction',
      'Energy',
      'Technology',
      'Other',
    ]);
    expect(PM_EXPERIENCE_OPTIONS.map((o) => o.label)).toEqual([
      '< 2 years',
      '2–5 years',
      '5–7 years',
      'Other',
    ]);
    expect(NEEDS_OBJECTIVE_OPTIONS.map((o) => o.label)).toEqual([
      'Eligibility',
      'Exam prep',
      'Guidance',
      'Other',
    ]);
    expect(source.toLowerCase()).not.toContain('preferred contact channel');
    expect(source).not.toContain('CONTACT_CHANNEL_OPTIONS');
    expect(source).not.toContain('contactChannel');
    expect(source).not.toMatch(/value:\s*'instagram'/);
    expect(source).not.toMatch(/value:\s*'messenger'/);
    expect(source).not.toContain(
      "opt.value === 'within_3' && 'md:tracking-[-0.015em]'",
    );
  });

  it('uses one retry-stable submission ID and omits daily study-time fields', () => {
    expect(source).toContain('getOrCreatePmpSubmissionId');
    expect(source).toContain('clientSubmissionId');
    expect(source).toContain('buildPmpQualificationSubmissionPayload');
    expect(source.toLowerCase()).not.toContain('dailystudy');
    expect(source.toLowerCase()).not.toContain('studyhours');
  });

  it('wires the canonical lifecycle controller at runtime boundaries', () => {
    expect(source).toContain('createPmpRoadmapFormAnalyticsRuntime');
    expect(source).toContain('createPmpRoadmapAnalyticsTracker');
    expect(source).toContain('getAnalyticsRuntime().expose()');
    expect(source).toContain('getAnalyticsRuntime().mutate()');
    expect(source).toContain('getAnalyticsRuntime().blockAdvance(');
    expect(source).toContain(
      'getAnalyticsRuntime().advance(currentStep, nextStep, completedAnswers)',
    );
    expect(source).toContain('getAnalyticsRuntime().submit()');
    expect(source).toContain('getAnalyticsRuntime().acceptResult(res)');
  });

  it('uses only canonical roadmap analytics (no legacy helper calls)', () => {
    expect(source).toContain('createPmpRoadmapFormAnalyticsRuntime');
    expect(source).not.toContain('trackPmpQualificationFormStart');
    expect(source).not.toContain('trackPmpQualificationFitComplete');
    expect(source).not.toContain('trackPmpQualificationEligibilityComplete');
  });
});
