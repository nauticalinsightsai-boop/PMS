import {
  Inbox,
  MousePointer2,
  Map,
  ImageIcon,
  Newspaper,
  ClipboardList,
  Calendar,
  MousePointerClick,
  ShoppingCart,
  FileCheck,
  GraduationCap,
  Users,
  FileText,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { WEBSITE_CMS_PATHS } from '@/constants/websiteCmsPaths';

export interface DashboardNavSubItem {
  name: string;
  path: string;
  icon?: LucideIcon;
}

export interface DashboardNavSection {
  title: string;
  items: {
    name: string;
    path: string;
    icon: LucideIcon;
    subItems?: DashboardNavSubItem[];
  }[];
}

export const BOOKINGS_ROUTE_PREFIXES = ['/dashboard/booking-crm', '/dashboard/account'];

export const WEBSITE_ROUTE_PREFIXES = [
  '/dashboard/site-system/media-library',
  '/dashboard/site-system/newsletter',
];

export const SOCIAL_ROUTE_PREFIXES = ['/dashboard/social-media-management', '/dashboard/control-tower'];

/** @deprecated Use SOCIAL_ROUTE_PREFIXES */
export const PUBLISHER_ROUTE_PREFIXES = SOCIAL_ROUTE_PREFIXES;

/** Website tab — media + newsletter control only */
const WEBSITE_CMS_NAV: DashboardNavSection = {
  title: 'Website',
  items: [
    { name: 'Media library', path: WEBSITE_CMS_PATHS.mediaLibrary, icon: ImageIcon },
    {
      name: 'Newsletter',
      path: WEBSITE_CMS_PATHS.newsletter,
      icon: Newspaper,
      subItems: [
        { name: 'Subscribers', path: WEBSITE_CMS_PATHS.newsletterSubscribers, icon: Users },
      ],
    },
  ],
};

export const DASHBOARD_ROUTES: Record<'social' | 'bookings' | 'website', DashboardNavSection[]> = {
  social: [
    {
      title: 'Social Media Management',
      items: [
        {
          name: 'Topic Planner',
          path: '/dashboard/social-media-management/topic-planner',
          icon: ClipboardList,
        },
        {
          name: 'Schedule Calendar',
          path: '/dashboard/social-media-management/schedule-calendar',
          icon: Calendar,
        },
        {
          name: 'Link Ups',
          path: '/dashboard/social-media-management/link-ups',
          icon: MousePointerClick,
        },
      ],
    },
  ],
  bookings: [
    {
      title: 'Booking CRM',
      items: [
        { name: 'CTA Management', path: '/dashboard/booking-crm/cta', icon: MousePointer2 },
        { name: 'Interaction Inbox', path: '/dashboard/booking-crm/interactions/inbox', icon: Inbox },
        { name: 'Sheets records', path: '/dashboard/booking-crm/interactions/sheets', icon: FileText },
        { name: 'Consultations', path: '/dashboard/booking-crm/consultations', icon: ClipboardList },
        { name: 'Bookings', path: '/dashboard/booking-crm/bookings', icon: ShoppingCart },
        { name: 'Verification logs', path: '/dashboard/booking-crm/verification-logs', icon: FileCheck },
        { name: 'Scholarship review', path: '/dashboard/booking-crm/scholarship-review', icon: GraduationCap },
        { name: 'Account region', path: '/dashboard/account/region', icon: Map },
      ],
    },
  ],
  website: [WEBSITE_CMS_NAV],
};
