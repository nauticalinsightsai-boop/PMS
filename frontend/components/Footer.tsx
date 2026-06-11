import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Video,
  Pin,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND, BRAND_LINES } from '@/lib/brand-voice';
import {
  formatOfficeLocation,
  getPmsWhatsAppDisplay,
  getPmsWhatsAppUrl,
  isContactPhoneConfigured,
  isLegalEntityConfigured,
  isWhatsAppConfigured,
  PMS_CONTACT_PHONE,
  PMS_LEGAL_ENTITY_ADDRESS,
  PMS_OFFICE_LOCATIONS,
  PMS_SUPPORT_EMAIL,
} from '@/config/pms-site';
import { SectionAmbience } from '@/components/SectionAmbience';
import { FOOTER_LEGAL_LINKS } from '@/constants/legal';
import { FOOTER_SOCIAL_LINKS } from '@/constants/socialProfiles';

const FOOTER_SOCIAL_ICONS: Record<(typeof FOOTER_SOCIAL_LINKS)[number]['id'], LucideIcon> = {
  linkedin: Linkedin,
  x: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Video,
  pinterest: Pin,
};

const EXPLORE_LINKS: ReadonlyArray<{ label: string; href: string; highlight?: boolean }> = [
  { label: 'Certifications', href: '/certifications' },
  { label: 'Compare pathways', href: '/certifications/compare', highlight: true },
  { label: 'Resource store', href: '/community?view=store' },
  { label: 'Membership', href: '/membership' },
];

const RESOURCES_LINKS: ReadonlyArray<{ label: string; href: string; highlight?: boolean }> = [
  { label: 'PMP exam 2026', href: '/pmp-exam-2026', highlight: true },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
];

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-sandstone dark:border-slate-800 bg-gradient-to-b from-ivory via-porcelain to-orange-50/35 dark:from-obsidian dark:via-[#0a0f24] dark:to-[#120e28]">
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto py-10 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div className="flex flex-col gap-4">
            <BrandLogo size="footer" />
            <p className="text-sm text-carbon dark:text-slate-400 leading-snug max-w-xs font-medium">
              {BRAND_LINES.promise}
            </p>
            <div className="flex flex-wrap gap-2.5" aria-label="Social media">
              {FOOTER_SOCIAL_LINKS.map(({ id, url, ariaLabel }) => {
                const Icon = FOOTER_SOCIAL_ICONS[id];
                return (
                  <a
                    key={id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={ariaLabel}
                    className="p-1.5 rounded-full bg-card shadow-sm text-muted-foreground hover:text-brand-orange transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">
              Explore
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-carbon dark:text-slate-400 font-medium">
              {EXPLORE_LINKS.map(({ label, href, highlight }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={
                      highlight
                        ? 'hover:text-brand-orange font-bold text-brand-orange/80'
                        : 'hover:text-brand-orange transition-colors'
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">
              Resources
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-carbon dark:text-slate-400 font-medium">
              {RESOURCES_LINKS.map(({ label, href, highlight }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={
                      highlight
                        ? 'hover:text-brand-orange font-semibold text-brand-purple/90 transition-colors'
                        : 'hover:text-brand-orange transition-colors'
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">
              Support
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-carbon dark:text-slate-400 font-medium">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                <a
                  href={`mailto:${PMS_SUPPORT_EMAIL}`}
                  className="hover:text-brand-orange transition-colors"
                >
                  {PMS_SUPPORT_EMAIL}
                </a>
              </li>
              {isWhatsAppConfigured() ? (
                <li className="flex items-start gap-2.5">
                  <MessageCircle className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                  <a
                    href={getPmsWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-orange transition-colors"
                  >
                    WhatsApp: {getPmsWhatsAppDisplay()}
                  </a>
                </li>
              ) : null}
              {isContactPhoneConfigured() ? (
                <li className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>{PMS_CONTACT_PHONE}</span>
                </li>
              ) : null}
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  {PMS_OFFICE_LOCATIONS.map((loc) => (
                    <span key={loc.city}>{formatOfficeLocation(loc)}</span>
                  ))}
                </div>
              </li>
              {isLegalEntityConfigured() ? (
                <li className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-obsidian dark:text-white">Registered office</span>
                    <span>{PMS_LEGAL_ENTITY_ADDRESS}</span>
                  </div>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-sandstone dark:bg-slate-800" />

        <nav
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-carbon dark:text-slate-500 font-medium mb-4"
          aria-label="Legal"
        >
          {FOOTER_LEGAL_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-orange transition-colors">
              {item.shortLabel}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-carbon dark:text-slate-500 font-medium">
          <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
