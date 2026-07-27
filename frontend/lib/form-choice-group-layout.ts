/** Layout classes for public form option/radio choice groups. */

export type FormChoiceGroupVariant = 'site' | 'portal';

/**
 * Exactly four choices: one horizontal row on sm+ (`sm:grid-cols-4`),
 * two rows (2×2) on mobile (`grid-cols-2`). Other counts keep the existing
 * two-column mobile + flex-wrap desktop layout.
 *
 * Portal exact-four uses zero gap from sm through md so locked labels fit
 * one-line in portal shells; site also uses `sm:gap-0 md:gap-0` so long
 * one-line labels fit with the safe site bleed (no shell collision).
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
 * Site/portal chip sizing for exact-four groups: nowrap + zero horizontal
 * padding from sm through md; sm tracking-tight with normal desktop tracking
 * restored at md (padding reserved for gap/bleed room, not label edits).
 */
export function formChoiceChipLayoutClass(optionCount: number): string {
  if (optionCount === 4) {
    return 'w-full min-w-0 whitespace-nowrap sm:px-0 sm:tracking-tight md:px-0 md:tracking-normal';
  }
  return 'w-full sm:w-auto sm:flex-[1_1_7rem]';
}

/**
 * Negative horizontal bleed on Fit + Eligibility step wrappers only
 * (not Contact). Persists from sm through desktop (no md:mx-0 reset).
 * Site bleed matches panel inset (`sm:px-6` → `sm:-mx-6`) so chips/focus
 * rings stay inside the overflow:hidden form shell border.
 */
export function formChoiceStepBleedClass(
  variant: FormChoiceGroupVariant = 'site',
): string {
  return variant === 'portal' ? 'sm:-mx-4' : 'sm:-mx-6';
}
