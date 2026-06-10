'use client';

import { PmpProgramHighlightsSection } from '@/components/pmp/PmpProgramHighlightsSection';
import { PmpProgramSocialProofSection } from '@/components/pmp/PmpProgramSocialProofSection';
import { PMP_ROADMAP_FORM_ANCHOR } from '@/content/pmp/program-offer';

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
