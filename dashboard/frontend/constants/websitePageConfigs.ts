import {
  Home,
  Info,
  Users,
  Mail,
  HelpCircle,
  ShoppingBag,
  Briefcase,
  Award,
  GitCompare,
} from 'lucide-react';

export type WebsitePageSlug =
  | 'home'
  | 'pm-service'
  | 'certifications'
  | 'community'
  | 'store'
  | 'about'
  | 'compare'
  | 'faq'
  | 'contact'
  | 'membership';

export interface WebsitePageField {
  key: string;
  label: string;
  type: 'text' | 'textarea';
  /** Live default copy shown when no CMS value is saved yet (mirrors the public page fallback). */
  defaultValue?: string;
}

export interface WebsitePageSection {
  id: string;
  label: string;
  fields: WebsitePageField[];
}

export interface WebsitePageConfig {
  label: string;
  icon: typeof Home;
  publicPath: string;
  sections: WebsitePageSection[];
}

const heroFields = (prefix: string): WebsitePageField[] => [
  { key: `${prefix}_badge`, label: 'Badge / eyebrow', type: 'text' },
  { key: `${prefix}_title`, label: 'Page title', type: 'text' },
  { key: `${prefix}_subtitle`, label: 'Subtitle', type: 'textarea' },
];

export const WEBSITE_PAGE_CONFIGS: Record<WebsitePageSlug, WebsitePageConfig> = {
  home: {
    label: 'Home',
    icon: Home,
    publicPath: '/',
    sections: [
      { id: 'hero', label: 'Hero', fields: heroFields('hero') },
      {
        id: 'frameworks',
        label: 'Global Frameworks',
        fields: [
          { key: 'frameworks_title', label: 'Section title', type: 'text' },
          { key: 'frameworks_subtitle', label: 'Section subtitle', type: 'textarea' },
        ],
      },
    ],
  },
  'pm-service': {
    label: 'PM Service',
    icon: Briefcase,
    publicPath: '/pm-service',
    sections: [{ id: 'hero', label: 'Hero', fields: heroFields('pm_service') }],
  },
  certifications: {
    label: 'Certifications',
    icon: Award,
    publicPath: '/certifications',
    sections: [
      { id: 'hero', label: 'Hero', fields: heroFields('certifications') },
      {
        id: 'listing',
        label: 'Listing intro',
        fields: [
          { key: 'certifications_list_title', label: 'Listing title', type: 'text' },
          { key: 'certifications_list_subtitle', label: 'Listing subtitle', type: 'textarea' },
        ],
      },
    ],
  },
  community: {
    label: 'Community',
    icon: Users,
    publicPath: '/community',
    sections: [{ id: 'hero', label: 'Hero', fields: heroFields('community') }],
  },
  store: {
    label: 'Store',
    icon: ShoppingBag,
    publicPath: '/store',
    sections: [{ id: 'hero', label: 'Hero', fields: heroFields('store') }],
  },
  about: {
    label: 'About',
    icon: Info,
    publicPath: '/about',
    sections: [
      {
        id: 'mission',
        label: 'Mission',
        fields: [
          { key: 'mission_badge', label: 'Badge', type: 'text', defaultValue: 'Our Mission' },
          {
            key: 'mission_title',
            label: 'Title',
            type: 'text',
            defaultValue: 'Structured project management education and advisory',
          },
          {
            key: 'mission_subtitle',
            label: 'Subtitle',
            type: 'textarea',
            defaultValue:
              'Independent exam prep and structured readiness across PMI, PRINCE2, and Six Sigma.',
          },
        ],
      },
      {
        id: 'story',
        label: 'Our Story',
        fields: [
          { key: 'story_title', label: 'Section title', type: 'text', defaultValue: 'Our Story' },
          {
            key: 'story_text_1',
            label: 'Paragraph 1',
            type: 'textarea',
            defaultValue:
              'PM Structure began as a structured study circle for busy project professionals preparing for PMI exams. The gap was never lack of material: it was lack of pathway, accountability, and readiness measurement.',
          },
          {
            key: 'story_text_2',
            label: 'Paragraph 2',
            type: 'textarea',
            defaultValue:
              'Today we support learners and teams across regions with independent exam-preparation pathways, advisory services, and practical tools. Our focus remains certification readiness, governance thinking, and delivery discipline.',
          },
        ],
      },
    ],
  },
  compare: {
    label: 'Compare Certifications',
    icon: GitCompare,
    publicPath: '/certifications/compare',
    sections: [
      {
        id: 'hero',
        label: 'Hero',
        fields: [
          {
            key: 'compare_badge',
            label: 'Badge / eyebrow',
            type: 'text',
            defaultValue: 'Comparison matrix',
          },
          {
            key: 'compare_title',
            label: 'Page title',
            type: 'text',
            defaultValue: 'Compare project management certifications',
          },
          {
            key: 'compare_subtitle',
            label: 'Subtitle',
            type: 'textarea',
            defaultValue:
              'Pick up to three pathways from any mix of PMI®, PRINCE2®, and Lean Six Sigma, then review tiers, prep time, and regional tuition in one matrix.',
          },
        ],
      },
    ],
  },
  faq: {
    label: 'FAQ',
    icon: HelpCircle,
    publicPath: '/faq',
    sections: [
      {
        id: 'header',
        label: 'Header',
        fields: [
          { key: 'faq_badge', label: 'Badge / eyebrow', type: 'text', defaultValue: '' },
          {
            key: 'faq_title',
            label: 'Page title',
            type: 'text',
            defaultValue: 'Frequently Asked Questions',
          },
          {
            key: 'faq_subtitle',
            label: 'Subtitle',
            type: 'textarea',
            defaultValue:
              'PMP 2026 exam prep, certification pathways, regional pricing, membership, delivery, and policies.',
          },
        ],
      },
    ],
  },
  contact: {
    label: 'Contact',
    icon: Mail,
    publicPath: '/contact',
    sections: [
      {
        id: 'header',
        label: 'Header',
        fields: [
          { key: 'contact_title', label: 'Title', type: 'text', defaultValue: 'Get in Touch' },
          {
            key: 'contact_subtitle',
            label: 'Subtitle',
            type: 'textarea',
            defaultValue:
              'Have questions about our certifications or membership? Our team is here to help you navigate your career path.',
          },
        ],
      },
    ],
  },
  membership: {
    label: 'Membership',
    icon: ShoppingBag,
    publicPath: '/membership',
    sections: [{ id: 'hero', label: 'Hero', fields: heroFields('membership_hero') }],
  },
};

export const WEBSITE_PAGE_SLUGS = Object.keys(WEBSITE_PAGE_CONFIGS) as WebsitePageSlug[];

export function isWebsitePageSlug(slug: string): slug is WebsitePageSlug {
  return slug in WEBSITE_PAGE_CONFIGS;
}
