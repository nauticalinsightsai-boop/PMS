import {
  Home,
  Info,
  Users,
  Mail,
  HelpCircle,
  ShoppingBag,
  Briefcase,
  Award,
  Newspaper,
  GitCompare,
} from 'lucide-react';

export type WebsitePageSlug =
  | 'home'
  | 'pm-service'
  | 'certifications'
  | 'newsletter'
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
  newsletter: {
    label: 'Newsletter',
    icon: Newspaper,
    publicPath: '/newsletter',
    sections: [{ id: 'hero', label: 'Hero', fields: heroFields('newsletter') }],
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
          { key: 'mission_badge', label: 'Badge', type: 'text' },
          { key: 'mission_title', label: 'Title', type: 'text' },
          { key: 'mission_subtitle', label: 'Subtitle', type: 'textarea' },
        ],
      },
    ],
  },
  compare: {
    label: 'Compare Certifications',
    icon: GitCompare,
    publicPath: '/certifications/compare',
    sections: [{ id: 'hero', label: 'Hero', fields: heroFields('compare') }],
  },
  faq: {
    label: 'FAQ',
    icon: HelpCircle,
    publicPath: '/faq',
    sections: [{ id: 'header', label: 'Header', fields: heroFields('faq') }],
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
          { key: 'contact_title', label: 'Title', type: 'text' },
          { key: 'contact_subtitle', label: 'Subtitle', type: 'textarea' },
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
