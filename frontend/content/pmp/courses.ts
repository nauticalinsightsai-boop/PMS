import { enrollPath } from '@/lib/enrollment-routes';
import { resolvePathwayTierOutcomes } from '@/lib/pathway-tier-outcomes';
import type { PmpFaq } from './types';
import { PMP_STANDARD_FAQS } from './shared';

export type PmpCourseTier = 'foundation' | 'professional' | 'mastery';

export type PmpCourseContent = {
  slug: string;
  path: string;
  tier: PmpCourseTier;
  title: string;
  description: string;
  h1: string;
  directAnswer: string;
  forLearners: string;
  notForLearners?: string;
  outcomes: string[];
  modules: string[];
  examRelevance: string;
  enrollPath: string;
  faqs: PmpFaq[];
};

const foundationModules = [
  'Full LMS access for the Foundation tier duration',
  'Orientation and structured weekly milestones',
  'Downloadable templates aligned to PMP ECO domains',
  'Baseline exam-style situational judgment practice',
];

const professionalModules = [
  'Structured mocks and scenario practice sets',
  'Timed drills with error logging by domain',
  'Cohort support and review checkpoints',
  'Exam-day pacing and readiness planning',
];

const masteryModules = [
  'Advanced mock exam cadence',
  'Domain-level weak-area remediation plans',
  'Mentor-led readiness review sessions (per programme)',
  'Exam-week review discipline and accountability',
];

const tierFaqs = (tier: string): PmpFaq[] => [
  {
    question: `Who should choose PMP ${tier}?`,
    answer: `See the learner fit section on this page. Use the readiness diagnostic if you are unsure between tiers.`,
  },
  ...PMP_STANDARD_FAQS,
];

const courses: PmpCourseContent[] = [
  {
    slug: 'pmp-foundation',
    path: '/pmp-foundation',
    tier: 'foundation',
    title: 'PMP Foundation course. PMP exam preparation',
    description:
      'Foundation-tier PMP exam preparation: core ECO coverage, baseline practice, study planning, and orientation to the 2026 exam transition.',
    h1: 'PMP Foundation course for PMP exam preparation',
    directAnswer:
      'The Foundation tier is for candidates who need structured orientation to the PMP exam, core domain vocabulary, and guided early practice before advancing to Professional or Mastery.',
    forLearners:
      'New PMP candidates, career-changers, and experienced PMs who want a guided start before intensive scenario practice.',
    notForLearners:
      'Candidates who are already scoring consistently on full timed mocks and need only final remediation: consider Mastery instead.',
    outcomes: resolvePathwayTierOutcomes('pmp', 'foundation'),
    modules: foundationModules,
    examRelevance:
      'Foundation covers concepts relevant to both the current PMP format and the post-9 July 2026 transition. Confirm domain emphasis on the latest PMI Exam Content Outline before scheduling.',
    enrollPath: enrollPath('pmp', 'foundation'),
    faqs: tierFaqs('Foundation'),
  },
  {
    slug: 'pmp-professional',
    path: '/pmp-professional',
    tier: 'professional',
    title: 'PMP Professional course: structured exam readiness',
    description:
      'Professional-tier PMP preparation with structured mocks, scenario practice, cohort support, and readiness checkpoints before Pearson VUE.',
    h1: 'PMP Professional course for PMP exam readiness',
    directAnswer:
      'The Professional tier targets candidates with foundational knowledge who need structured readiness, timed practice, and feedback loops before scheduling Pearson VUE.',
    forLearners:
      'Candidates with PM experience who are actively preparing to sit PMP within 6-12 weeks and need scenario-heavy practice.',
    notForLearners:
      'Complete beginners who have not yet mapped ECO topics: start with Foundation unless the diagnostic suggests otherwise.',
    outcomes: resolvePathwayTierOutcomes('pmp', 'professional'),
    modules: professionalModules,
    examRelevance:
      'Professional emphasizes situational judgment across People, Process, and Business Environment: skills emphasized in current and updated 2026 exam narratives. Verify weights on PMI.org.',
    enrollPath: enrollPath('pmp', 'professional'),
    faqs: [
      {
        question: 'Does Professional include scenario practice?',
        answer:
          'Yes. Scenario practice is a core component. See also the dedicated scenario practice page for how drills are organized.',
      },
      ...tierFaqs('Professional'),
    ],
  },
  {
    slug: 'pmp-mastery',
    path: '/pmp-mastery',
    tier: 'mastery',
    title: 'PMP Mastery program: scenario practice & final readiness',
    description:
      'Mastery-tier PMP preparation: intensive mock exams, weak-area remediation, mentor review, and exam-week discipline for high-confidence readiness.',
    h1: 'PMP Mastery program for scenario practice and final exam readiness',
    directAnswer:
      'The Mastery tier is for candidates who want the deepest practice volume, remediation on weak domains, and structured support through exam week.',
    forLearners:
      'Experienced candidates aiming for high-confidence readiness, retake preparation, or intensive final-month discipline.',
    outcomes: resolvePathwayTierOutcomes('pmp', 'mastery'),
    modules: masteryModules,
    examRelevance:
      'Mastery focuses on current exam-week execution: pacing, stamina, and domain remediation aligned to the PMP exam in force since 9 July 2026.',
    enrollPath: enrollPath('pmp', 'mastery'),
    faqs: tierFaqs('Mastery'),
  },
];

export const PMP_COURSE_PAGES = courses;

export const PMP_COURSE_PATHS = courses.map((c) => c.path) as readonly string[];

export function getPmpCourse(slug: string): PmpCourseContent | undefined {
  return courses.find((c) => c.slug === slug);
}
