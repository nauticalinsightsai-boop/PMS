/** Layout classes for public form option/radio choice groups. */

export type FormChoiceGroupVariant = 'site' | 'portal';

/**
 * Exactly four choices: one horizontal row on sm+ (`sm:grid-cols-4`),
 * two rows (2×2) on mobile (`grid-cols-2`). Other counts keep the existing
 * two-column mobile + flex-wrap desktop layout.
 */
export function formChoiceGroupClass(
  optionCount: number,
  variant: FormChoiceGroupVariant = 'site',
): string {
  if (optionCount === 4) {
    return variant === 'portal'
      ? 'grid grid-cols-2 gap-2 max-sm:gap-2 sm:grid-cols-4 sm:gap-3'
      : 'grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3';
  }
  return variant === 'portal'
    ? 'grid grid-cols-2 gap-2 max-sm:gap-2 sm:flex sm:flex-wrap sm:gap-3'
    : 'grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3';
}

/** Site chip sizing: fill grid cells for 4-across; flex-basis for wrap layouts. */
export function formChoiceChipLayoutClass(optionCount: number): string {
  if (optionCount === 4) {
    return 'w-full sm:w-full';
  }
  return 'w-full sm:w-auto sm:flex-[1_1_7rem]';
}
