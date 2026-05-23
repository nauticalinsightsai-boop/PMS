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

export const BOOKINGS_ROUTE_PREFIXES = ['/dashboard/members-revenue'];

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
      title: 'Operations',
      items: [
        { name: 'Overview', path: '/dashboard/members-revenue', icon: LayoutDashboard },
        { name: 'Users & Leads', path: '/dashboard/members-revenue/users', icon: UserRound },
        { name: 'Members', path: '/dashboard/members-revenue/members', icon: Users },
        { name: 'Bookings', path: '/dashboard/members-revenue/bookings', icon: CalendarCheck },
        { name: 'Scholarship queue', path: '/dashboard/members-revenue/scholarship-review', icon: ShieldCheck },
        { name: 'Consultations', path: '/dashboard/members-revenue/consultations', icon: ShieldCheck },
        { name: 'Verification log', path: '/dashboard/members-revenue/verification-logs', icon: ShieldAlert },
        { name: 'Account region', path: '/dashboard/account/region', icon: Map },
        { name: 'Interactions', path: '/dashboard/members-revenue/interactions', icon: Inbox },
      ],
    },
    {
      title: 'Growth',
      items: [
        { name: 'Monetization', path: '/dashboard/members-revenue/monetization', icon: Banknote },
        {
          name: 'Newsletter',
          path: '/dashboard/members-revenue/newsletter',
          icon: Newspaper,
          subItems: [
            { name: 'Blogs Editor', path: '/dashboard/members-revenue/blogs', icon: Newspaper },
            { name: 'Campaigns', path: '/dashboard/members-revenue/newsletter/campaigns', icon: Mail },
          ],
        },
        {
          name: 'CTA Management',
          path: '/dashboard/members-revenue/cta',
          icon: MousePointer2,
          subItems: [
            { name: 'Analytics', path: '/dashboard/members-revenue/cta/analytics', icon: BarChart3 },
            { name: 'Audit', path: '/dashboard/members-revenue/cta/audit', icon: ShieldCheck },
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
