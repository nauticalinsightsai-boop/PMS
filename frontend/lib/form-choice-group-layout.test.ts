import { describe, expect, it } from 'vitest';
import {
  formChoiceChipLayoutClass,
  formChoiceGroupClass,
} from './form-choice-group-layout';

describe('formChoiceGroupClass', () => {
  it('renders exactly four choices as 2×2 mobile and one row on sm+', () => {
    expect(formChoiceGroupClass(4, 'site')).toBe(
      'grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3',
    );
    expect(formChoiceGroupClass(4, 'portal')).toBe(
      'grid grid-cols-2 gap-2 max-sm:gap-2 sm:grid-cols-4 sm:gap-3',
    );
    expect(formChoiceGroupClass(4, 'site')).toContain('grid-cols-2');
    expect(formChoiceGroupClass(4, 'site')).toContain('sm:grid-cols-4');
    expect(formChoiceGroupClass(4, 'portal')).toContain('grid-cols-2');
    expect(formChoiceGroupClass(4, 'portal')).toContain('sm:grid-cols-4');
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
  it('keeps full-width chips for four-across desktop grids', () => {
    expect(formChoiceChipLayoutClass(4)).toBe('w-full sm:w-full');
    expect(formChoiceChipLayoutClass(4)).not.toContain('sm:flex-[1_1_7rem]');
  });

  it('keeps flex-basis chips for wrap layouts', () => {
    expect(formChoiceChipLayoutClass(3)).toBe('w-full sm:w-auto sm:flex-[1_1_7rem]');
    expect(formChoiceChipLayoutClass(6)).toBe('w-full sm:w-auto sm:flex-[1_1_7rem]');
  });
});
