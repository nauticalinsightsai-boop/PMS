'use client';

import dynamic from 'next/dynamic';
import { PMP_ROADMAP_FORM_ANCHOR } from '@/content/pmp/program-offer';

const PmpProgramHighlightsSection = dynamic(
  () =>
    import('@/components/pmp/PmpProgramHighlightsSection').then((m) => ({
      default: m.PmpProgramHighlightsSection,
    })),
  { loading: () => null },
);

const PmpProgramSocialProofSection = dynamic(
  () =>
    import('@/components/pmp/PmpProgramSocialProofSection').then((m) => ({
      default: m.PmpProgramSocialProofSection,
    })),
  { loading: () => null },
);

type PmpProgramOfferSectionsProps = {
  roadmapAnchor?: string;
  className?: string;
};

/** Homepage: highlights + combined social proof + contact bar */
export function PmpProgramOfferSections({
  roadmapAnchor = PMP_ROADMAP_FORM_ANCHOR,
  className,
}: PmpProgramOfferSectionsProps) {
  return (
    <div className={className}>
      <PmpProgramHighlightsSection roadmapAnchor={roadmapAnchor} />
      <PmpProgramSocialProofSection roadmapAnchor={roadmapAnchor} showContactBar />
    </div>
  );
}
