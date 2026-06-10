import { buildBreadcrumbSchema, buildCourseSchema } from '@/lib/schema';
import * as siteData from '@/data/siteData';

export function CertJsonLd({ certId }: { certId: string }) {
  const cert = siteData.certifications.find((c) => c.id === certId);
  if (!cert) return null;

  const path = `/certifications/${certId}`;
  const course = buildCourseSchema({
    path,
    name: `${cert.name} exam preparation`,
    description: cert.desc,
  });
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Certifications', path: '/certifications' },
    { name: cert.name, path },
  ]);

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
