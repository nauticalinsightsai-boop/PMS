/** Parse display price strings from the regional matrix. */

export function parseUsdCentsFromDisplay(display: string | null | undefined): number | null {
  if (!display) return null;
  const m = String(display).match(/\$\s*([\d,]+(?:\.\d{2})?)/);
  if (!m) return null;
  return Math.round(parseFloat(m[1].replace(/,/g, '')) * 100);
}

export function gccDisplayForCountry(
  gccPrice: { display?: string | null; perCountry?: Record<string, string> },
  countryCode: string | null | undefined
): string | null {
  if (countryCode && gccPrice.perCountry?.[countryCode]) {
    return gccPrice.perCountry[countryCode];
  }
  return gccPrice.display ?? null;
}

export function showsOriginalVsScholarship(
  regionId: string,
  status: string,
  globalDisplay: string | null,
  activeDisplay: string | null
): boolean {
  if (!globalDisplay || !activeDisplay) return false;
  if (globalDisplay.trim() === activeDisplay.trim()) return false;
  if (regionId === 'india' || regionId === 'pakistan') {
    return (
      status === 'scholarship_verify' ||
      status === 'scholarship_unavailable' ||
      globalDisplay !== activeDisplay
    );
  }
  if (regionId === 'gcc') return true;
  if (regionId === 'europe' || regionId === 'uk') return true;
  return globalDisplay !== activeDisplay;
}
