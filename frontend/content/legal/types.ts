export type LegalRegionSlug =
  | 'global'
  | 'eu'
  | 'uk'
  | 'us'
  | 'gcc'
  | 'india'
  | 'pakistan';

export type GccCountryLegalSlug = 'ae' | 'sa' | 'qa' | 'bh' | 'kw' | 'om';

export interface LegalSectionLink {
  href: string;
  label: string;
}

export interface LegalSection {
  id: string;
  heading: string;
  body: string;
  links?: LegalSectionLink[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  lastUpdated: string;
  jurisdictionNote: string;
  sections: LegalSection[];
}

export interface LegalHubCard {
  title: string;
  description: string;
  href: string;
}
