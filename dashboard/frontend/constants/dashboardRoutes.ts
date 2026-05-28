import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarCheck,
  Inbox,
  Banknote,
  Newspaper,
  MousePointer2,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  Search,
  Map,
  LineChart,
  Settings,
  Mail,
  History,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { PUBLIC_SITE_PAGES, dashboardPageEditorPath } from './publicSitePages';

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

export const BOOKINGS_ROUTE_PREFIXES = ['/dashboard/booking-crm'];

export const WEBSITE_ROUTE_PREFIXES = ['/dashboard/site-system'];

export const SOCIAL_ROUTE_PREFIXES = ['/dashboard/control-tower'];

/** Admin sidebar: one item per live public website page */
const websitePageNavItems = PUBLIC_SITE_PAGES.map((page) => ({
  name: page.label,
  path: dashboardPageEditorPath(page.slug),
  icon: page.icon,
}));

export const DASHBOARD_ROUTES: Record<'social' | 'bookings' | 'website', DashboardNavSection[]> = {
  social: [
    {
      title: 'Social Control',
      items: [
        { name: 'Control Tower', path: '/dashboard/control-tower', icon: LayoutDashboard },
      ],
    },
  ],
  bookings: [
    {
      title: 'Booking CRM',
      items: [
        { name: 'CTA Management', path: '/dashboard/booking-crm/cta', icon: MousePointer2 },
        { name: 'Sheets records', path: '/dashboard/booking-crm/interactions/sheets', icon: Inbox },
        { name: 'Bookings', path: '/dashboard/booking-crm/bookings', icon: CalendarCheck },
        { name: 'Consultations', path: '/dashboard/booking-crm/consultations', icon: ShieldCheck },
        { name: 'Scholarship queue', path: '/dashboard/booking-crm/scholarship-review', icon: ShieldCheck },
        { name: 'Verification log', path: '/dashboard/booking-crm/verification-logs', icon: ShieldAlert },
        { name: 'Account region', path: '/dashboard/account/region', icon: Map },
      ],
    },
    {
      title: 'Legacy & growth',
      items: [
        { name: 'Users & Leads', path: '/dashboard/booking-crm/users', icon: UserRound },
        { name: 'Members', path: '/dashboard/booking-crm/members', icon: Users },
        { name: 'Monetization', path: '/dashboard/booking-crm/monetization', icon: Banknote },
        {
          name: 'Newsletter',
          path: '/dashboard/booking-crm/newsletter',
          icon: Newspaper,
          subItems: [
            { name: 'Blogs Editor', path: '/dashboard/booking-crm/blogs', icon: Newspaper },
            { name: 'Campaigns', path: '/dashboard/booking-crm/newsletter/campaigns', icon: Mail },
          ],
        },
      ],
    },
  ],
  website: [
    {
      title: 'Website pages',
      items: websitePageNavItems,
    },
    {
      title: 'System',
      items: [
        { name: 'Security', path: '/dashboard/site-system/security', icon: ShieldAlert },
        { name: 'SEO Health', path: '/dashboard/site-system/seo', icon: Search },
        { name: 'Sitemap', path: '/dashboard/site-system/sitemap', icon: Map },
        { name: 'Analytics', path: '/dashboard/site-system/analytics', icon: LineChart },
        { name: 'Settings', path: '/dashboard/site-system/settings', icon: Settings },
        { name: 'Data Migration', path: '/dashboard/migrate', icon: History },
      ],
    },
  ],
};
