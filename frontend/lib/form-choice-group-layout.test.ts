import { describe, expect, it } from 'vitest';
import {
  formChoiceChipLayoutClass,
  formChoiceGroupClass,
  formChoiceStepBleedClass,
} from './form-choice-group-layout';

describe('formChoiceGroupClass', () => {
  it('uses the approved exact-four class strings', () => {
    expect(formChoiceGroupClass(4, 'site')).toBe(
      'grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-2 md:gap-2',
    );
    expect(formChoiceGroupClass(4, 'portal')).toBe(
      'grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-0 md:gap-0',
    );
  });

  it('preserves flex-wrap desktop layout for non-four option counts', () => {
    expect(formChoiceGroupClass(3, 'site')).toBe(
      'grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3',
    );
    expect(formChoiceGroupClass(5, 'site')).toBe(
      'grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3',
    );
    expect(formChoiceGroupClass(7, 'portal')).toBe(
      'grid grid-cols-2 gap-2 max-sm:gap-2 sm:flex sm:flex-wrap sm:gap-3',
    );
    expect(formChoiceGroupClass(3, 'site')).not.toContain('sm:grid-cols-4');
    expect(formChoiceGroupClass(5, 'portal')).not.toContain('sm:grid-cols-4');
  });
});

describe('formChoiceChipLayoutClass', () => {
  it('uses the approved exact-four chip class string', () => {
    expect(formChoiceChipLayoutClass(4)).toBe(
      'w-full min-w-0 whitespace-nowrap px-3 sm:px-3 sm:tracking-tight md:px-3 md:tracking-normal',
    );
    expect(formChoiceChipLayoutClass(4)).not.toContain('md:tracking-tight');
    expect(formChoiceChipLayoutClass(4)).not.toContain('sm:px-0');
    expect(formChoiceChipLayoutClass(4)).not.toContain('md:px-0');
    expect(formChoiceChipLayoutClass(4)).not.toContain('whitespace-normal');
  });

  it('keeps flex-basis chips for wrap layouts', () => {
    expect(formChoiceChipLayoutClass(3)).toBe('w-full sm:w-auto sm:flex-[1_1_7rem]');
    expect(formChoiceChipLayoutClass(6)).toBe('w-full sm:w-auto sm:flex-[1_1_7rem]');
  });
});

describe('formChoiceStepBleedClass', () => {
  it('keeps portal bleed and leaves site step inset to form body padding', () => {
    expect(formChoiceStepBleedClass('site')).toBe('');
    expect(formChoiceStepBleedClass('portal')).toBe('sm:-mx-4');
    expect(formChoiceStepBleedClass('site')).not.toContain('sm:-mx-6');
    expect(formChoiceStepBleedClass('portal')).not.toContain('md:mx-0');
  });
});
