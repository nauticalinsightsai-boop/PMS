'use client';

import { getCertProgramOffer } from '@/lib/cert-program-offer';
import {
  CertProgramHighlightsContent,
  CertProgramHighlightsSection,
} from '@/components/cert/CertProgramHighlightsSection';
import { PMP_ROADMAP_FORM_ANCHOR } from '@/content/pmp/program-offer';

const PMP_PROGRAM_OFFER = getCertProgramOffer('pmp', 'PMP®', 'PMI');

type PmpProgramHighlightsSectionProps = {
  roadmapAnchor?: string;
  className?: string;
  embedded?: boolean;
};

export function PmpProgramHighlightsContent({
  roadmapAnchor = PMP_ROADMAP_FORM_ANCHOR,
  className,
  embedded = false,
}: PmpProgramHighlightsSectionProps) {
  return (
    <CertProgramHighlightsContent
      offer={PMP_PROGRAM_OFFER}
      roadmapAnchor={roadmapAnchor}
      className={className}
      embedded={embedded}
    />
  );
}

/** Homepage / PMP hub programme highlights band */
export function PmpProgramHighlightsSection({
  roadmapAnchor = PMP_ROADMAP_FORM_ANCHOR,
  className,
}: PmpProgramHighlightsSectionProps) {
  return (
    <CertProgramHighlightsSection
      offer={PMP_PROGRAM_OFFER}
      roadmapAnchor={roadmapAnchor}
      className={className}
    />
  );
}
