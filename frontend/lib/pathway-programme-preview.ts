export type ProgrammePanelKind = 'pdf' | 'slides' | 'video';

export interface ProgrammeInfographicStep {
  label: string;
  detail: string;
}

export interface ProgrammeInfographicHero {
  title: string;
  subtitle: string;
  steps: ProgrammeInfographicStep[];
  /** Optional static image; otherwise steps render as the visual */
  imageSrc?: string | null;
}

export interface ProgrammeInlineSection {
  heading: string;
  bullets: string[];
}

export interface ProgrammePreviewPanel {
  id: string;
  kind: ProgrammePanelKind;
  title: string;
  description: string;
  available: boolean;
  pdfSrc?: string | null;
  slidesPdfSrc?: string | null;
  videoSrc?: string | null;
  videoEmbedUrl?: string | null;
  videoTitle?: string;
  inlineSections?: ProgrammeInlineSection[];
}

export interface ProgrammePreviewContent {
  infographic: ProgrammeInfographicHero;
  panels: ProgrammePreviewPanel[];
}

const PMP_FOUNDATION_INFOGRAPHIC: ProgrammeInfographicHero = {
  title: 'PMP® Foundation: 14-Day Roadmap to 2026 Project Mastery',
  subtitle: 'Week 1 — mindset & strategy · Week 2 — mechanics & career acceleration',
  imageSrc: '/programme/pmp-foundation-roadmap.png',
  steps: [],
};

const PMP_FOUNDATION_GUIDE: ProgrammeInlineSection[] = [
  {
    heading: 'What is included',
    bullets: [
      'Full LMS access for the Foundation tier duration',
      'Orientation video and structured weekly milestones',
      'Downloadable templates aligned to PMP® ECO domains',
      'WhatsApp study rhythm check-ins (async)',
    ],
  },
  {
    heading: 'Syllabus focus',
    bullets: [
      'People, Process, and Business Environment domains',
      'Predictive, agile, and hybrid delivery patterns',
      'Exam-style situational judgment practice',
      'Transition guidance to Professional tier when ready',
    ],
  },
];

const PROGRAMME_PREVIEW_BY_OFFERING: Partial<
  Record<
    string,
    {
      infographic?: ProgrammeInfographicHero;
      panels?: ProgrammePreviewPanel[];
    }
  >
> = {
  'pmp-preparation-foundation': {
    infographic: PMP_FOUNDATION_INFOGRAPHIC,
    panels: [
      {
        id: 'guide',
        kind: 'pdf',
        title: 'Programme guide',
        description: 'Chapter 0 — programme foundation (read in this window).',
        available: true,
        pdfSrc: '/programme/pmp-foundation-program-guide.pdf',
        inlineSections: PMP_FOUNDATION_GUIDE,
      },
      {
        id: 'slides',
        kind: 'slides',
        title: 'Session slides',
        description: 'D0 — 2026 PMP Navigator deck (read in this window).',
        available: true,
        slidesPdfSrc: '/programme/pmp-foundation-session-slides.pdf',
      },
      {
        id: 'video',
        kind: 'video',
        title: 'Overview video',
        description: 'Watch the Foundation orientation in this window.',
        available: true,
        videoTitle: 'Architecting the 2026 Project Leader — 14-Day PMP Foundation',
        videoSrc: '/videos/programme/pmp-foundation-orientation.mp4',
        videoEmbedUrl: null,
      },
    ],
  },
};

function defaultInfographic(programmeTitle: string, offeringId: string): ProgrammeInfographicHero {
  const tier = offeringId.includes('mastery')
    ? 'Mastery'
    : offeringId.includes('professional')
      ? 'Professional'
      : 'Foundation';

  return {
    title: programmeTitle,
    subtitle: `${tier} pathway — structure, delivery, and exam-readiness milestones.`,
    steps: [
      { label: 'Enrol', detail: 'Confirm region, tier, and study start date' },
      { label: 'Learn', detail: 'LMS modules, templates, and milestone checkpoints' },
      { label: 'Practice', detail: 'Mocks, scenarios, and weak-area tracking' },
      { label: 'Ready', detail: 'Readiness review before official exam booking' },
    ],
  };
}

function defaultPanels(programmeTitle: string): ProgrammePreviewPanel[] {
  return [
    {
      id: 'guide',
      kind: 'pdf',
      title: 'Programme guide',
      description: 'Syllabus, milestones, and what is included in this tier.',
      available: false,
      pdfSrc: null,
      inlineSections: [
        {
          heading: programmeTitle,
          bullets: ['Programme guide will be available here for in-modal reading.'],
        },
      ],
    },
    {
      id: 'slides',
      kind: 'slides',
      title: 'Session slides',
      description: 'Sample lesson deck and study rhythm for this pathway.',
      available: false,
      slidesPdfSrc: null,
      inlineSections: [
        {
          heading: 'Lesson deck',
          bullets: ['Session slides will be available here for in-modal viewing.'],
        },
      ],
    },
    {
      id: 'video',
      kind: 'video',
      title: 'Overview video',
      description: 'Programme orientation video.',
      available: false,
      videoTitle: `${programmeTitle} — overview`,
      videoSrc: null,
      videoEmbedUrl: null,
    },
  ];
}

/** Preview kit shown in the pathway modal before checkout / consultation. */
export function getProgrammePreviewContent(
  offeringId: string,
  programmeTitle: string,
): ProgrammePreviewContent {
  const override = PROGRAMME_PREVIEW_BY_OFFERING[offeringId];

  return {
    infographic: override?.infographic ?? defaultInfographic(programmeTitle, offeringId),
    panels: override?.panels ?? defaultPanels(programmeTitle),
  };
}

export function programmePreviewHasVideo(preview: ProgrammePreviewContent): boolean {
  return preview.panels.some(
    (p) => p.kind === 'video' && p.available && (p.videoSrc || p.videoEmbedUrl),
  );
}
