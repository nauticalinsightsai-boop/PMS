/** Layout classes for public form option/radio choice groups. */

export type FormChoiceGroupVariant = 'site' | 'portal';

/**
 * Exactly four choices: one horizontal row on sm+ (`sm:grid-cols-4`),
 * two rows (2×2) on mobile (`grid-cols-2`). Other counts keep the existing
 * two-column mobile + flex-wrap desktop layout.
 *
 * Portal exact-four uses zero gap from sm through md so locked labels fit
 * one-line in portal shells; site also uses `sm:gap-0 md:gap-0` so long
 * one-line labels fit inside the panel inset.
 */
export function formChoiceGroupClass(
  optionCount: number,
  variant: FormChoiceGroupVariant = 'site',
): string {
  if (optionCount === 4) {
    return variant === 'portal'
      ? 'grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-0 md:gap-0'
      : 'grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-0 md:gap-0';
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
 * Horizontal bleed on Fit + Eligibility step wrappers only (not Contact).
 * Site keeps the panel inset (`px-5` / `sm:px-6`) so chip rows have left/right
 * breathing room. Portal still bleeds slightly (`sm:-mx-4`) for compact shells.
 */
export function formChoiceStepBleedClass(
  variant: FormChoiceGroupVariant = 'site',
): string {
  return variant === 'portal' ? 'sm:-mx-4' : '';
}
