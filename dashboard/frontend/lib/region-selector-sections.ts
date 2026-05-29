import type { RegionFlagCode } from '@/components/region/RegionFlag';

export type RegionId = 'global' | 'europe' | 'uk' | 'gcc' | 'india' | 'pakistan';
export type GccCountryCode = 'AE' | 'SA' | 'QA' | 'BH' | 'KW' | 'OM';

export type RegionSelectorOption = {
  id: string;
  label: string;
  flagCode: RegionFlagCode;
  regionId: RegionId;
  gccCountry?: GccCountryCode;
};

export type RegionSelectorSection = {
  title: string;
  options: RegionSelectorOption[];
  columns?: 2 | 3;
};

export const REGION_SELECTOR_SECTIONS: RegionSelectorSection[] = [
  {
    title: 'USA, UK & Europe',
    options: [
      { id: 'us', label: 'United States', flagCode: 'us', regionId: 'global' },
      { id: 'uk', label: 'United Kingdom', flagCode: 'uk', regionId: 'uk' },
      { id: 'eu', label: 'Europe', flagCode: 'eu', regionId: 'europe' },
    ],
    columns: 3,
  },
  {
    title: 'GCC',
    options: [
      { id: 'ae', label: 'United Arab Emirates', flagCode: 'ae', regionId: 'gcc', gccCountry: 'AE' },
      { id: 'sa', label: 'Saudi Arabia', flagCode: 'sa', regionId: 'gcc', gccCountry: 'SA' },
      { id: 'qa', label: 'Qatar', flagCode: 'qa', regionId: 'gcc', gccCountry: 'QA' },
      { id: 'bh', label: 'Bahrain', flagCode: 'bh', regionId: 'gcc', gccCountry: 'BH' },
      { id: 'kw', label: 'Kuwait', flagCode: 'kw', regionId: 'gcc', gccCountry: 'KW' },
      { id: 'om', label: 'Oman', flagCode: 'om', regionId: 'gcc', gccCountry: 'OM' },
    ],
    columns: 3,
  },
  {
    title: 'Asia',
    options: [
      { id: 'pk', label: 'Pakistan', flagCode: 'pk', regionId: 'pakistan' },
      { id: 'in', label: 'India', flagCode: 'in', regionId: 'india' },
    ],
    columns: 2,
  },
];

export function findRegionSelectorOption(
  regionId: RegionId,
  gccCountry: string | null | undefined,
): RegionSelectorOption | undefined {
  if (regionId === 'gcc' && gccCountry) {
    return REGION_SELECTOR_SECTIONS.flatMap((s) => s.options).find((o) => o.gccCountry === gccCountry);
  }
  return REGION_SELECTOR_SECTIONS.flatMap((s) => s.options).find(
    (o) => o.regionId === regionId && !o.gccCountry,
  );
}
