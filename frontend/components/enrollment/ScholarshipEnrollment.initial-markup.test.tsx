import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScholarshipCountrySelectOptions } from './ScholarshipEnrollment';
import type { ScholarshipCountryOption } from '@/lib/enrollment/scholarship-country-options';

const SERVER_RESOLVED_OPTIONS = [
  { code: 'FK', name: 'Falkland Islands' },
  { code: 'HK', name: 'Hong Kong SAR China' },
  { code: 'MO', name: 'Macao SAR China' },
  { code: 'PS', name: 'Palestinian Territories' },
] as const satisfies readonly ScholarshipCountryOption[];

const CHROMIUM_RUNTIME_VARIANTS = [
  { code: 'FK', name: 'Falkland Islands (Islas Malvinas)' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'MO', name: 'Macao' },
  { code: 'PS', name: 'Palestine' },
] as const satisfies readonly ScholarshipCountryOption[];

function initialMarkup(countryOptions: readonly ScholarshipCountryOption[]) {
  return renderToStaticMarkup(
    <select defaultValue="">
      <option value="">Select country</option>
      <ScholarshipCountrySelectOptions options={countryOptions} />
    </select>,
  );
}

describe('ScholarshipEnrollmentPage deterministic initial markup', () => {
  it('hydrates from the serialized server option payload instead of re-resolving runtime labels', () => {
    const serverMarkup = initialMarkup(SERVER_RESOLVED_OPTIONS);
    const clientInitialMarkup = initialMarkup(SERVER_RESOLVED_OPTIONS);
    const unsafeRuntimeRecomputedMarkup = initialMarkup(CHROMIUM_RUNTIME_VARIANTS);

    expect(clientInitialMarkup).toBe(serverMarkup);
    expect(unsafeRuntimeRecomputedMarkup).not.toBe(serverMarkup);
    expect(serverMarkup).toContain('Falkland Islands');
    expect(serverMarkup).toContain('Hong Kong SAR China');
    expect(serverMarkup).toContain('Macao SAR China');
    expect(serverMarkup).toContain('Palestinian Territories');
    expect(serverMarkup).not.toContain('Falkland Islands (Islas Malvinas)');
  });
});
