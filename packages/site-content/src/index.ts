export * from './keys';
export * from './media';
export * from './home';
export * from './certifications';
export * from './services';
export * from './store';
export * from './community';
export * from './membership-page';
export * from './about';
export * from './newsletter';
export * from './newsletter-posts';
export * from './seeds/index';
export { FIELD_KEYS as SITE_CONTENT_FIELD_KEYS } from './keys';

import { homePageConfigV2Schema } from './home';
import { certificationsHubConfigSchema, certificationsRegistrySchema } from './certifications';
import { servicesPageConfigSchema } from './services';
import { storeCatalogSchema } from './store';
import { communityPageConfigSchema } from './community';
import { membershipPageConfigSchema } from './membership-page';
import { aboutPageConfigSchema } from './about';
import { newsletterHubConfigSchema } from './newsletter';
import { FIELD_KEYS } from './keys';
import type { z } from 'zod';

const schemaByKey: Record<string, z.ZodTypeAny> = {
  [FIELD_KEYS.HOME_PAGE_CONFIG]: homePageConfigV2Schema,
  [FIELD_KEYS.CERTIFICATIONS_HUB_CONFIG]: certificationsHubConfigSchema,
  [FIELD_KEYS.CERTIFICATIONS_REGISTRY]: certificationsRegistrySchema,
  [FIELD_KEYS.SERVICES_PAGE_CONFIG]: servicesPageConfigSchema,
  [FIELD_KEYS.STORE_CATALOG]: storeCatalogSchema,
  [FIELD_KEYS.COMMUNITY_PAGE_CONFIG]: communityPageConfigSchema,
  [FIELD_KEYS.MEMBERSHIP_PAGE_CONFIG]: membershipPageConfigSchema,
  [FIELD_KEYS.ABOUT_PAGE_CONFIG]: aboutPageConfigSchema,
  [FIELD_KEYS.NEWSLETTER_HUB_CONFIG]: newsletterHubConfigSchema,
};

export function getSchemaForFieldKey(fieldKey: string): z.ZodTypeAny | undefined {
  return schemaByKey[fieldKey];
}

export function validateFieldContent(fieldKey: string, content: unknown) {
  const schema = getSchemaForFieldKey(fieldKey);
  if (!schema) return { success: true as const, data: content };
  return schema.safeParse(content);
}
