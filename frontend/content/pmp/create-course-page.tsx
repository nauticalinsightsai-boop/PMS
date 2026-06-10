import type { Metadata } from 'next';
import { PmpCoursePage } from '@/components/pmp/PmpCoursePage';
import { buildPageMetadata } from '@/lib/site-metadata';
import { getPmpCourse } from './courses';

export function createPmpCoursePageExports(slug: string) {
  const course = getPmpCourse(slug);
  if (!course) throw new Error(`Unknown PMP course slug: ${slug}`);

  const metadata: Metadata = buildPageMetadata({
    title: course.title,
    description: course.description,
    path: course.path,
  });

  function Page() {
    return <PmpCoursePage course={course} />;
  }

  return { metadata, Page };
}
