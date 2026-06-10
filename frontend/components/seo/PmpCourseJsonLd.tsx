import { PMS_SITE_URL } from '@/config/pms-site';
import {
  buildBreadcrumbSchema,
  buildCourseSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
} from '@/lib/schema';
import type { PmpCourseContent } from '@/content/pmp/courses';

export function PmpCourseJsonLd({ course }: { course: PmpCourseContent }) {
  const graph = [
    buildWebPageSchema({ path: course.path, name: course.h1, description: course.description }),
    buildCourseSchema({ path: course.path, name: course.h1, description: course.description }),
    buildBreadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'PMP', path: '/pmp' },
      { name: course.h1, path: course.path },
    ]),
  ];

  if (course.faqs.length) {
    graph.push(buildFaqPageSchema(course.faqs, `${PMS_SITE_URL}${course.path}`));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}
