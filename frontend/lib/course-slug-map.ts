/**
 * Maps matrix course names → siteData certification ids (Phase 0 stub).
 * Extend as siteData grows; offerings without a page use courseSlug from catalogue.
 */

export { MATRIX_COURSE_TO_SITE_ID } from '../../packages/regional-catalogue/scholarship';
import { MATRIX_COURSE_TO_SITE_ID } from '../../packages/regional-catalogue/scholarship';

export function siteIdForMatrixCourse(courseName: string): string | undefined {
  return MATRIX_COURSE_TO_SITE_ID[courseName];
}
