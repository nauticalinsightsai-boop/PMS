/** Layout classes for public form option/radio choice groups. */

export type FormChoiceGroupVariant = 'site' | 'portal';

/**
 * Exactly four choices: one horizontal row on sm+ (`sm:grid-cols-4`),
 * two rows (2×2) on mobile (`grid-cols-2`). Other counts keep the existing
 * two-column mobile + flex-wrap desktop layout.
 *
 * Portal exact-four keeps zero gap from sm through md so locked labels fit
 * one-line in portal shells. Site uses a small sm/md gap so laptop rows
 * keep readable chip breathing room with horizontal padding.
 */
export function formChoiceGroupClass(
  optionCount: number,
  variant: FormChoiceGroupVariant = 'site',
): string {
  if (optionCount === 4) {
    return variant === 'portal'
      ? 'grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-0 md:gap-0'
      : 'grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-2 md:gap-2';
  }
  return variant === 'portal'
    ? 'grid grid-cols-2 gap-2 max-sm:gap-2 sm:flex sm:flex-wrap sm:gap-3'
    : 'grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3';
}

/**
 * Site/portal chip sizing for exact-four groups: nowrap + horizontal
 * padding on all breakpoints; sm tracking-tight with normal desktop
 * tracking restored at md.
 */
export function formChoiceChipLayoutClass(optionCount: number): string {
  if (optionCount === 4) {
    return 'w-full min-w-0 whitespace-nowrap px-3 sm:px-3 sm:tracking-tight md:px-3 md:tracking-normal';
  }
  return 'w-full sm:w-auto sm:flex-[1_1_7rem]';
}

/**
 * Horizontal step wrapper adjustment for Fit + Eligibility only (not Contact).
 * Portal keeps a light negative bleed for tight shells. Site keeps normal
 * inset so chip rows respect the form body left/right padding.
 */
export function formChoiceStepBleedClass(
  variant: FormChoiceGroupVariant = 'site',
): string {
  return variant === 'portal' ? 'sm:-mx-4' : '';
}
