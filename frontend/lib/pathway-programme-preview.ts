export type ProgrammeResourceKind = 'video' | 'pdf' | 'slides' | 'infographic';

export interface ProgrammeResource {
  kind: ProgrammeResourceKind;
  title: string;
  description: string;
  href: string;
}

export interface ProgrammePreviewContent {
  videoEmbedUrl: string | null;
  videoTitle: string;
  resources: ProgrammeResource[];
}

/** Preview kit shown in the pathway modal before checkout / consultation. */
export function getProgrammePreviewContent(
  offeringId: string,
  programmeTitle: string,
): ProgrammePreviewContent {
  const slug = offeringId.replace(/[^a-z0-9-]+/gi, '-').toLowerCase();

  return {
    videoTitle: `${programmeTitle} — overview`,
    videoEmbedUrl: null,
    resources: [
      {
        kind: 'pdf',
        title: 'Programme guide (PDF)',
        description: 'Syllabus, milestones, and what is included in this tier.',
        href: `#programme-guide-${slug}`,
      },
      {
        kind: 'slides',
        title: 'Session slides',
        description: 'Sample lesson deck and study rhythm for this pathway.',
        href: `#session-slides-${slug}`,
      },
      {
        kind: 'infographic',
        title: 'Pathway infographic',
        description: 'Visual map from enrolment through exam readiness.',
        href: `#pathway-infographic-${slug}`,
      },
    ],
  };
}
