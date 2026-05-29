export const FIELD_KEYS = {
  HOME_PAGE_CONFIG: 'home_page_config',
  CERTIFICATIONS_HUB_CONFIG: 'certifications_hub_config',
  CERTIFICATIONS_REGISTRY: 'certifications_registry',
  SERVICES_PAGE_CONFIG: 'services_page_config',
  STORE_CATALOG: 'store_catalog',
  COMMUNITY_PAGE_CONFIG: 'community_page_config',
  MEMBERSHIP_PAGE_CONFIG: 'membership_page_config',
  ABOUT_PAGE_CONFIG: 'about_page_config',
  NEWSLETTER_HUB_CONFIG: 'newsletter_hub_config',
  GLOBAL_CONTENT: 'global_content',
  SITE_SETTINGS: 'site_settings',
} as const;

export type FieldKey = (typeof FIELD_KEYS)[keyof typeof FIELD_KEYS];

export const ALL_FIELD_KEYS = Object.values(FIELD_KEYS);
