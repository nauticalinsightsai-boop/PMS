import { CertificationViewContentTracker } from '@/components/analytics/CertificationViewContentTracker';

/** Fire Meta ViewContent (+ GA view_item) once per mount on PMP programme pages. */
export function PmpViewContentTracker({
  contentName = 'PMP Certification Programme',
  contentIds = ['pmp'],
}: {
  contentName?: string;
  contentIds?: string[];
}) {
  return (
    <CertificationViewContentTracker
      certificationId={contentIds[0] ?? 'pmp'}
      certificationName={contentName}
    />
  );
}
