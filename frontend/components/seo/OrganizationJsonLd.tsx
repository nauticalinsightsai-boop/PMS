import {
  PMS_SUPPORT_EMAIL,
  PMS_LOGO_PATH,
  PMS_ORGANIZATION_SAME_AS,
  PMS_SITE_NAME,
  PMS_SITE_URL,
} from '@/config/pms-site';
import { PMS_SITE_DESCRIPTION } from '@/config/pms-site';

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PMS_SITE_NAME,
    url: PMS_SITE_URL,
    logo: `${PMS_SITE_URL}${PMS_LOGO_PATH}`,
    description: PMS_SITE_DESCRIPTION,
    email: PMS_SUPPORT_EMAIL,
    sameAs: [...PMS_ORGANIZATION_SAME_AS],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
