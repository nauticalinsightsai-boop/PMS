import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(
  new URL('./PmpRoadmapLeadForm.tsx', import.meta.url),
  'utf8',
);

describe('PmpRoadmapLeadForm component contract', () => {
  it('gives every single-choice group an accessible name', () => {
    const groups = [
      'work-field',
      'needs',
      'education',
      'experience',
      'training',
      'timeline',
    ];
    expect(source.match(/\srole="radiogroup"/g)).toHaveLength(groups.length);
    expect(source.match(/aria-required="true"/g)).toHaveLength(groups.length);
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
    expect(source).toContain('role="alert"');
    expect(source).toContain('aria-live="assertive"');
    expect(source).toContain('focusValidationIssue(issue)');
    expect(source).toContain('aria-describedby={error ?');
  });

  it('scopes step-transition focus to this form instance', () => {
    expect(source).toContain('const formRef = React.useRef<HTMLFormElement>(null)');
    expect(source).toContain('ref={formRef}');
    expect(source).toContain('formRef.current?.querySelector<HTMLElement>');
    expect(source).not.toContain('document.querySelector<HTMLElement>');
  });

  it('uses a bounded two-column mobile layout for long choice labels', () => {
    expect(source).toContain("'grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3'");
    expect(source).toContain("'grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3'");
    expect(source).toContain("'flex min-h-12 min-w-0 w-full");
    expect(source).toContain('sm:w-auto sm:flex-[1_1_7rem]');
  });

  it('uses one retry-stable submission ID and omits daily study-time fields', () => {
    expect(source).toContain('getOrCreatePmpSubmissionId');
    expect(source).toContain('clientSubmissionId');
    expect(source).toContain('buildPmpQualificationSubmissionPayload');
    expect(source.toLowerCase()).not.toContain('dailystudy');
    expect(source.toLowerCase()).not.toContain('studyhours');
  });

  it('keeps mount exposure distinct from the first real form mutation', () => {
    expect(source).toContain('trackPmpQualificationFormOpen({');
    expect(source).toContain('trackPmpQualificationFormStart({');
    expect(source).toContain('if (!formStartedRef.current)');
  });
});
