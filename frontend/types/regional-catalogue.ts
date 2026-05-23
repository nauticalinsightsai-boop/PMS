/** Types for imported regional-catalogue.json (Phase 0). */

export type RegionId = 'global' | 'europe' | 'uk' | 'gcc' | 'india' | 'pakistan';

export type GccCountryCode = 'AE' | 'SA' | 'QA' | 'BH' | 'KW' | 'OM';

export type TierId =
  | 'foundation'
  | 'professional'
  | 'mastery'
  | 'mastery_corporate'
  | 'mastery_advisory';

export type OfferingStatus =
  | 'direct_checkout'
  | 'scholarship_verify'
  | 'consultation_required'
  | 'scholarship_unavailable'
  | 'global_only'
  | 'waitlist'
  | 'hidden';

export interface RegionalOfferingRule {
  status: OfferingStatus;
  primaryCta: string | null;
  secondaryCta: string | null;
  regionMessage: string | null;
}

export interface RegionalPrice {
  display: string | null;
  usdCents?: number | null;
  currencyCode: string;
  isScholarship?: boolean;
  perCountry?: Record<string, string>;
}

export interface CourseOffering {
  offeringId: string;
  familyId: string;
  familyName: string;
  courseName: string;
  courseSlug: string;
  tier: string;
  tierId: TierId;
  length: string | null;
  deliveryMode: string | null;
  adminNotes: string | null;
  regional: Record<RegionId, RegionalOfferingRule>;
  prices: Record<RegionId, RegionalPrice>;
}

export interface RegionConfig {
  id: RegionId;
  label: string;
  defaultPriceDisplay: string | null;
  canChangeRegion: boolean;
  mismatchRule: string | null;
  checkoutRule: string | null;
  websiteMessage: string | null;
}

export interface RegionalCatalogue {
  meta: {
    version: number;
    importedAt: string;
    sourceFile: string;
    offeringCount: number;
    businessRules: Record<string, string>;
    overview: { rules: { rule: string; decision: string }[]; recommendedMessage: string | null };
  };
  regions: RegionConfig[];
  regionIds: RegionId[];
  websiteCopy: Record<string, string>;
  offerings: CourseOffering[];
}
