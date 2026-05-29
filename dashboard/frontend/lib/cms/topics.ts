import type { CmsStatus } from '@/lib/cms/types';

export const CMS_TOPICS_FIELD_KEY = 'cms_topics_registry';

export interface CmsTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  status: CmsStatus;
  featuredImageUrl: string;
  modifiedDate: string;
}

export interface CmsTopicsRegistry {
  version: 1;
  topics: CmsTopic[];
}

export function defaultCmsTopicsRegistry(): CmsTopicsRegistry {
  const now = new Date().toISOString();
  const seed = (
    id: string,
    name: string,
    slug: string,
    description: string,
    status: CmsStatus = 'active',
  ): CmsTopic => ({
    id,
    name,
    slug,
    description,
    metaTitle: name,
    metaDescription: description,
    status,
    featuredImageUrl: '',
    modifiedDate: now,
  });

  return {
    version: 1,
    topics: [
      seed('topic-employee', 'Employee', 'employee', 'Workplace safety topics for employees and frontline staff.'),
      seed('topic-employer', 'Employer', 'employer', 'Employer responsibilities, compliance, and safety leadership.'),
      seed('topic-hazards', 'Hazards', 'hazards', 'Identifying and controlling workplace hazards.'),
      seed(
        'topic-laws-and-regulations',
        'Laws & Regulations',
        'laws-and-regulations',
        'Legal frameworks and regulatory requirements for HSE.',
      ),
      seed('topic-policy', 'Policy', 'policy', 'Safety policies, procedures, and governance.'),
      seed(
        'topic-roles-and-responsibilities',
        'Roles & Responsibilities',
        'roles-and-responsibilities',
        'Defined roles for safety accountability across teams.',
      ),
      seed('topic-safety', 'Safety', 'safety', 'General safety management and best practices.'),
    ],
  };
}

export function parseCmsTopicsRegistry(raw: unknown): CmsTopicsRegistry {
  if (!raw || typeof raw !== 'object') return defaultCmsTopicsRegistry();
  const data = raw as Partial<CmsTopicsRegistry>;
  if (data.version !== 1 || !Array.isArray(data.topics)) return defaultCmsTopicsRegistry();
  return {
    version: 1,
    topics: data.topics.filter((t): t is CmsTopic => Boolean(t?.id && t?.name)),
  };
}

export function createEmptyTopic(): CmsTopic {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: '',
    slug: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft',
    featuredImageUrl: '',
    modifiedDate: now,
  };
}
