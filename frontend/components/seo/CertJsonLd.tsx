import { breadcrumbItemsToSchema } from '@/components/navigation/breadcrumb-schema';
import {
  getCertBreadcrumbItems,
  PMP_COMMERCIAL_LABEL,
  PMP_COMMERCIAL_PATH,
} from '@/content/site-architecture/routes';
import { buildCourseSchema } from '@/lib/schema';
import * as siteData from '@/data/siteData';

export function CertJsonLd({ certId }: { certId: string }) {
  const cert = siteData.certifications.find((c) => c.id === certId);
  if (!cert) return null;

  const path = `/certifications/${certId}`;
  const breadcrumbLabel = certId === 'pmp' ? PMP_COMMERCIAL_LABEL : cert.name;
  const breadcrumbItems = getCertBreadcrumbItems(certId, breadcrumbLabel);
  const course = buildCourseSchema({
    path,
    name: `${cert.name} exam preparation`,
    description: cert.desc,
  });
  const breadcrumb = breadcrumbItemsToSchema(
    breadcrumbItems,
    certId === 'pmp' ? PMP_COMMERCIAL_PATH : path,
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
