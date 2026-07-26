import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { formChoiceGroupClass } from '@/lib/form-choice-group-layout';
import { PMP_JOB_EXPERIENCE_OPTIONS } from '@/lib/pmp-roadmap-form-options';

const source = readFileSync(new URL('./KeywordLeadPopup.tsx', import.meta.url), 'utf8');

describe('KeywordLeadPopup experience option layout contract', () => {
  it('uses the shared four-choice layout for years of experience', () => {
    expect(PMP_JOB_EXPERIENCE_OPTIONS).toHaveLength(4);
    expect(source).toContain("from '@/lib/form-choice-group-layout'");
    expect(source).toContain(
      "formChoiceGroupClass(PMP_JOB_EXPERIENCE_OPTIONS.length, 'site')",
    );
    const layout = formChoiceGroupClass(PMP_JOB_EXPERIENCE_OPTIONS.length, 'site');
    expect(layout).toContain('grid-cols-2');
    expect(layout).toContain('sm:grid-cols-4');
  });

  it('does not change the WhatsApp/Schedule footer two-button grid', () => {
    expect(source).toContain('grid w-full grid-cols-2 gap-2');
  });
});
