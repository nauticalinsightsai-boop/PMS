import { z } from 'zod';
import { mediaRefSchema } from './media';

export const servicesPageConfigSchema = z.object({
  version: z.literal(1),
  hero: z.object({
    badge: z.string(),
    title: z.string(),
    subtitle: z.string(),
  }),
  services: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      benefits: z.array(z.string()),
      iconKey: z.string(),
      visible: z.boolean(),
      sortOrder: z.number(),
      ctaHref: z.string().optional(),
    }),
  ),
  caseStudies: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      client: z.string().optional(),
      industry: z.string().optional(),
      summary: z.string(),
      image: mediaRefSchema.optional(),
      href: z.string().optional(),
      published: z.boolean(),
    }),
  ),
});

export type ServicesPageConfig = z.infer<typeof servicesPageConfigSchema>;

export function defaultServicesPageConfig(): ServicesPageConfig {
  return {
    version: 1,
    hero: {
      badge: 'Advisory & delivery',
      title: 'Project management services',
      subtitle: 'Pathway consultation, governance, corporate training, and exam readiness.',
    },
    services: [
      {
        id: 'pathway-consultation',
        title: 'Pathway consultation',
        description: 'Map experience, timeline, and goals to the right PMI, PRINCE2, or Six Sigma route.',
        benefits: ['Portfolio Strategy', 'Risk Assessment', 'Resource Optimization'],
        iconKey: 'briefcase',
        visible: true,
        sortOrder: 0,
        ctaHref: '/contact?topic=consultation',
      },
      {
        id: 'governance-pmo',
        title: 'Governance & PMO',
        description: 'Clear roles, reporting, escalation, and control rhythms.',
        benefits: ['Framework Design', 'Standardized Reporting', 'Maturity Assessment'],
        iconKey: 'settings',
        visible: true,
        sortOrder: 1,
      },
      {
        id: 'corporate-training',
        title: 'Corporate training',
        description: 'Cohort pathways with shared language and governance — not content-only delivery.',
        benefits: ['Custom Curriculum', 'Interactive Workshops', 'Post-Training Support'],
        iconKey: 'globe',
        visible: true,
        sortOrder: 2,
      },
      {
        id: 'exam-readiness',
        title: 'Exam readiness',
        description: 'Mocks, weak-area tracking, revision, and mentor review.',
        benefits: ['Mock Exams', 'Weak-Area Tracking', 'Mentor Review'],
        iconKey: 'zap',
        visible: true,
        sortOrder: 3,
      },
    ],
    caseStudies: [
      {
        id: 'case-1',
        title: 'Global PMO governance rollout',
        client: 'Enterprise client',
        industry: 'Technology',
        summary: 'Designed stage-gate reporting and escalation paths across three regions.',
        published: true,
      },
    ],
  };
}

export function parseServicesPageConfig(raw: unknown): ServicesPageConfig {
  return servicesPageConfigSchema.parse(raw);
}
