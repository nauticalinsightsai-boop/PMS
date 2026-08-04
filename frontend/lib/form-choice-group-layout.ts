/** Layout classes for public form option/radio choice groups. */

export type FormChoiceGroupVariant = 'site' | 'portal';

/**
 * Exactly four choices: one horizontal row on sm+ (`sm:grid-cols-4`),
 * two rows (2×2) on mobile (`grid-cols-2`). Other counts keep the existing
 * two-column mobile + flex-wrap desktop layout.
 *
 * Exact-four groups retain positive space between choices at every breakpoint
 * so their borders never visually merge inside the form panel.
 */
export function formChoiceGroupClass(
  optionCount: number,
  variant: FormChoiceGroupVariant = 'site',
): string {
  if (optionCount === 4) {
    return variant === 'portal'
      ? 'grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5 md:gap-3'
      : 'grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-2.5 md:gap-3';
  }
  return variant === 'portal'
    ? 'grid grid-cols-2 gap-2 max-sm:gap-2 sm:flex sm:flex-wrap sm:gap-3'
    : 'grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3';
}

/**
 * Site/portal chip sizing for exact-four groups: nowrap, horizontal padding,
 * and a minimal near-normal tracking adjustment at the base and md bands.
 * This keeps locked 14px labels inside their cells without shortening,
 * wrapping, clipping, or changing the approved 2×2 / 4×1 geometry.
 */
export function formChoiceChipLayoutClass(optionCount: number): string {
  if (optionCount === 4) {
    return 'w-full min-w-0 whitespace-nowrap px-3 tracking-[-0.01em] sm:px-3 sm:tracking-tight md:px-3 md:tracking-[-0.01em]';
  }
  return 'w-full sm:w-auto sm:flex-[1_1_7rem]';
}

/**
 * Choice steps keep the parent panel inset for consistent left/right breathing
 * room across site and portal shells.
 */
export function formChoiceStepBleedClass(
  _variant: FormChoiceGroupVariant = 'site',
): string {
  return '';
}
