import type { CertificationsRegistry } from '../certifications';
import { certificationsRegistrySchema } from '../certifications';
import { FIELD_KEYS } from '../keys';
import { defaultHomePageConfigV2 } from '../home';
import { defaultCertificationsHubConfig } from '../certifications';
import { defaultServicesPageConfig } from '../services';
import { defaultStoreCatalog } from '../store';
import { defaultCommunityPageConfig } from '../community';
import { defaultMembershipPageConfig } from '../membership-page';
import { defaultAboutPageConfig } from '../about';
import { defaultNewsletterHubConfig } from '../newsletter';
import bundledRegistry from '../../data/certifications-registry.json';

/** Full registry from siteData (27 certs) — regenerate via npm run build:cert-registry */
export function defaultCertificationsRegistry(): CertificationsRegistry {
  return certificationsRegistrySchema.parse(bundledRegistry);
}

export type SeedDocument = {
  field_key: string;
  content: Record<string, unknown>;
};

export function buildAllSeedDocuments(): SeedDocument[] {
  return [
    { field_key: FIELD_KEYS.HOME_PAGE_CONFIG, content: defaultHomePageConfigV2() as unknown as Record<string, unknown> },
    { field_key: FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG, content: defaultCertificationsHubConfig() as unknown as Record<string, unknown> },
    { field_key: FIELD_KEYS.CERTIFICATIONS_REGISTRY, content: defaultCertificationsRegistry() as unknown as Record<string, unknown> },
    { field_key: FIELD_KEYS.SERVICES_PAGE_CONFIG, content: defaultServicesPageConfig() as unknown as Record<string, unknown> },
    { field_key: FIELD_KEYS.STORE_CATALOG, content: defaultStoreCatalog() as unknown as Record<string, unknown> },
    { field_key: FIELD_KEYS.COMMUNITY_PAGE_CONFIG, content: defaultCommunityPageConfig() as unknown as Record<string, unknown> },
    { field_key: FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG, content: defaultMembershipPageConfig() as unknown as Record<string, unknown> },
    { field_key: FIELD_KEYS.ABOUT_PAGE_CONFIG, content: defaultAboutPageConfig() as unknown as Record<string, unknown> },
    { field_key: FIELD_KEYS.NEWSLETTER_HUB_CONFIG, content: defaultNewsletterHubConfig() as unknown as Record<string, unknown> },
  ];
}
