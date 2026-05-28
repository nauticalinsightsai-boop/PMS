import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  MapPin,
  LayoutDashboard,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { dashboardLoginUrl } from '@/lib/site-config';
import { BrandLogo } from '@/components/BrandLogo';
import { BRAND, BRAND_LINES } from '@/lib/brand-voice';
import {
  isContactPhoneConfigured,
  isLegalEntityConfigured,
  PMS_CONTACT_PHONE,
  PMS_LEGAL_ENTITY_ADDRESS,
  PMS_SUPPORT_EMAIL,
} from '@/config/pms-site';
import { SectionAmbience } from '@/components/SectionAmbience';

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-sandstone dark:border-slate-800 bg-gradient-to-b from-ivory via-porcelain to-orange-50/35 dark:from-obsidian dark:via-[#0a0f24] dark:to-[#120e28]">
      <SectionAmbience tone="blend" />
      <div className="container relative z-10 mx-auto py-16 md:py-24">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-6">
            <BrandLogo size="footer" />
            <p className="text-sm text-carbon dark:text-slate-400 leading-relaxed max-w-xs font-medium">
              {BRAND_LINES.promise}
            </p>
            <div className="flex gap-4" aria-label="Social media (coming soon)">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Youtube, label: 'YouTube' },
              ].map(({ Icon, label }) => (
                <span
                  key={label}
                  aria-disabled
                  title={`${label} (coming soon)`}
                  className="p-2 rounded-full bg-card shadow-sm text-muted-foreground opacity-60"
                >
                  <Icon className="h-5 w-5" />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">
              Certifications
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-carbon dark:text-slate-400 font-medium">
              <li>
                <Link href="/certifications/pmp" className="hover:text-brand-orange transition-colors">
                  PMP® Certification
                </Link>
              </li>
              <li>
                <Link href="/certifications/capm" className="hover:text-brand-orange transition-colors">
                  CAPM® Certification
                </Link>
              </li>
              <li>
                <Link href="/certifications/prince2" className="hover:text-brand-orange transition-colors">
                  PRINCE2®
                </Link>
              </li>
              <li>
                <Link
                  href="/certifications/compare"
                  className="hover:text-brand-orange font-bold text-brand-orange/80"
                >
                  Compare pathways
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">
              Resources
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-carbon dark:text-slate-400 font-medium">
              <li>
                <Link href="/faq" className="hover:text-brand-orange transition-colors">
                  Help &amp; FAQ
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-brand-orange transition-colors">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/newsletter" className="hover:text-brand-orange transition-colors">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="/legal" className="hover:text-brand-orange transition-colors">
                  Policies &amp; legal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-obsidian dark:text-white">
              Support
            </h3>
            <ul className="flex flex-col gap-4 text-sm text-carbon dark:text-slate-400 font-medium">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-brand-orange shrink-0" />
                <a
                  href={`mailto:${PMS_SUPPORT_EMAIL}`}
                  className="hover:text-brand-orange transition-colors"
                >
                  {PMS_SUPPORT_EMAIL}
                </a>
              </li>
              {isContactPhoneConfigured() ? (
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-brand-orange shrink-0" />
                  <span>{PMS_CONTACT_PHONE}</span>
                </li>
              ) : null}
              {isLegalEntityConfigured() ? (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-orange shrink-0" />
                  <span>{PMS_LEGAL_ENTITY_ADDRESS}</span>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <Separator className="my-12 bg-sandstone dark:bg-slate-800" />

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href={dashboardLoginUrl}>
              <Button
                size="lg"
                variant="brand"
                className="font-semibold px-6 rounded-full gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin Dashboard
              </Button>
            </a>
            <p className="text-xs text-carbon dark:text-slate-500 font-medium text-center sm:text-left">
              Platform login for content, inbox &amp; members
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-carbon dark:text-slate-500 font-medium">
            <span>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</span>
            <Link href="/legal" className="hover:text-brand-orange transition-colors">
              Policies &amp; legal
            </Link>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-slate-400 max-w-3xl mx-auto text-center leading-relaxed font-medium">
          Tuition, regional pricing, certification disclaimers, and terms of use are in our{' '}
          <Link href="/legal" className="text-brand-orange hover:underline font-semibold">
            legal &amp; compliance hub
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
