import { breadcrumbItemsToSchema } from '@/components/navigation/breadcrumb-schema';
import {
  getCertBreadcrumbItems,
  PMP_COMMERCIAL_LABEL,
  PMP_COMMERCIAL_PATH,
} from '@/content/site-architecture/routes';
import { buildWebPageSchema } from '@/lib/schema';
import { certifications } from '@/data/certification-index';

/** Certification reference pages: WebPage + BreadcrumbList only. Course JSON-LD is pathway-only. */
export function CertJsonLd({ certId }: { certId: string }) {
  const cert = certifications.find((c) => c.id === certId);
  if (!cert) return null;

  const path = `/certifications/${certId}`;
  const pagePath = certId === 'pmp' ? PMP_COMMERCIAL_PATH : path;
  const breadcrumbLabel = certId === 'pmp' ? PMP_COMMERCIAL_LABEL : cert.name;
  const breadcrumbItems = getCertBreadcrumbItems(certId, breadcrumbLabel);

  const graph = [
    buildWebPageSchema({
      path: pagePath,
      name: breadcrumbLabel,
      description: cert.desc,
    }),
    breadcrumbItemsToSchema(breadcrumbItems, pagePath),
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
