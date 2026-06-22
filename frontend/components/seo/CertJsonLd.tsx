import { PMS_SITE_URL } from '@/config/pms-site';
import { breadcrumbItemsToSchema } from '@/components/navigation/breadcrumb-schema';
import {
  getCertBreadcrumbItems,
  PMP_COMMERCIAL_LABEL,
  PMP_COMMERCIAL_PATH,
} from '@/content/site-architecture/routes';
import { T169_CONSIDERATION_FAQS } from '@/content/pmp/flagship-t169';
import { buildCourseSchema, buildFaqPageSchema, buildWebPageSchema } from '@/lib/schema';
import { certifications } from '@/data/certification-index';

export function CertJsonLd({ certId }: { certId: string }) {
  const cert = certifications.find((c) => c.id === certId);
  if (!cert) return null;

  const path = `/certifications/${certId}`;
  const pagePath = certId === 'pmp' ? PMP_COMMERCIAL_PATH : path;
  const breadcrumbLabel = certId === 'pmp' ? PMP_COMMERCIAL_LABEL : cert.name;
  const breadcrumbItems = getCertBreadcrumbItems(certId, breadcrumbLabel);
  const pageUrl = `${PMS_SITE_URL}${pagePath}`;

  const graph = [
    buildWebPageSchema({
      path: pagePath,
      name: breadcrumbLabel,
      description: cert.desc,
    }),
    buildCourseSchema({
      path: pagePath,
      name: `${cert.name} exam preparation`,
      description: cert.desc,
    }),
    breadcrumbItemsToSchema(breadcrumbItems, pagePath),
  ];

  if (certId === 'pmp') {
    graph.push(
      buildFaqPageSchema(
        T169_CONSIDERATION_FAQS.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        })),
        pageUrl,
      ),
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
      }}
    />
  );
}
