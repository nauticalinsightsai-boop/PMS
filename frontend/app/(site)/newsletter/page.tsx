import { Newsletter } from '@/components/pages/Newsletter';
import { buildPhase2PageMetadata } from '@/lib/site-metadata';

export const metadata = buildPhase2PageMetadata('/newsletter')!;

export default function Page() {
  return <Newsletter />;
}
