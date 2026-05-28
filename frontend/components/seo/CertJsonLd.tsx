import { PMS_SITE_NAME, PMS_SITE_URL } from '@/config/pms-site';
import * as siteData from '@/data/siteData';

export function CertJsonLd({ certId }: { certId: string }) {
  const cert = siteData.certifications.find((c) => c.id === certId);
  if (!cert) return null;

  const url = `${PMS_SITE_URL}/certifications/${certId}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: `${cert.name} exam preparation`,
    description: cert.desc,
    provider: {
      '@type': 'Organization',
      name: PMS_SITE_NAME,
      url: PMS_SITE_URL,
    },
    url,
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: PMS_SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Certifications',
        item: `${PMS_SITE_URL}/certifications`,
      },
      { '@type': 'ListItem', position: 3, name: cert.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
