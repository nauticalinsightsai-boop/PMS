'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { RegionChip } from "@/components/RegionChip";
import { WebsiteCalendlyButton } from "@/components/calendly/WebsiteCalendlyButton";
import { CTAS } from "@/lib/brand-voice";
import { cn } from "@/lib/utils";

const MAIN_NAV_LINKS = [
  { label: "PMP 2026", href: "/certifications/pmp", featured: true },
  { label: "Certifications", href: "/certifications" },
  { label: "Services", href: "/pm-service" },
  { label: "Newsletter", href: "/newsletter" },
] as const;

const NAV_MENTOR_BTN =
  'bg-brand-orange hover:bg-brand-hover text-white font-semibold px-5 h-10 rounded-full shadow-lg shadow-brand-orange/20 transition-all';

const NAVBAR_SHELL =
  'fixed inset-x-0 top-0 z-[100] w-full border-b backdrop-blur-md text-foreground ' +
  'bg-white/98 border-slate-200/90 supports-[backdrop-filter]:bg-white/92 ' +
  'dark:bg-[#07071c]/98 dark:border-slate-800/90 dark:supports-[backdrop-filter]:bg-[#07071c]/92';

const MOBILE_NAV_LINKS = [
  { label: "Home", href: "/" },
  ...MAIN_NAV_LINKS,
  { label: "About", href: "/about" },
] as const;

function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/certifications") {
    if (pathname === "/certifications/pmp" || pathname.startsWith("/certifications/pmp/")) {
      return false;
    }
    return pathname === "/certifications" || pathname.startsWith("/certifications/");
  }
  if (href === "/certifications/pmp") {
    return pathname === "/certifications/pmp" || pathname.startsWith("/certifications/pmp/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClassName(
  active: boolean,
  variant: "desktop" | "mobile" = "desktop",
  featured = false,
) {
  return cn(
    variant === "desktop"
      ? "inline-flex min-h-11 items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg border-b-2 border-transparent"
      : "inline-flex min-h-11 items-center text-lg font-medium transition-colors",
    active
      ? "text-brand-orange border-brand-orange font-semibold"
      : featured
        ? "text-brand-orange font-semibold hover:text-brand-hover border-transparent"
        : "text-slate-700 dark:text-slate-300 hover:text-brand-orange border-transparent",
  );
}

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export function Navbar({ toggleTheme, isDarkMode }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className={NAVBAR_SHELL}>
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandLogo size="nav" className="group-hover:opacity-90 transition-opacity" />
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <nav className="flex items-center gap-0.5" aria-label="Main">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              const featured = "featured" in link && link.featured === true;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={navLinkClassName(active, "desktop", featured)}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-2 ml-2">
            <RegionChip />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="min-h-11 min-w-11 rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <WebsiteCalendlyButton
              size="default"
              className={NAV_MENTOR_BTN}
              tier="mentor"
              funnelLabel="nav_mentor"
              utm={{ utm_source: 'pmstructure', utm_medium: 'nav', utm_campaign: 'mentor' }}
            >
              {CTAS.talkToAMentor}
            </WebsiteCalendlyButton>
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-1">
          <RegionChip className="md:hidden" iconOnly />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="min-h-11 min-w-11 rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Sheet>
            <SheetTrigger render={
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11 rounded-full text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            } />
            <SheetContent side="right" className="w-[min(100vw-2rem,400px)] bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <BrandLogo size="nav" className="mt-2" />
              <div className="mt-4 hidden md:block">
                <RegionChip />
              </div>
              <nav className="mt-6 flex flex-col gap-1 pl-4 sm:pl-5" aria-label="Main">
                {MOBILE_NAV_LINKS.map((link) => {
                  const active = isNavLinkActive(pathname, link.href);
                  const featured = "featured" in link && link.featured === true;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={navLinkClassName(active, "mobile", featured)}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-4 pt-4 border-t border-border">
                  <WebsiteCalendlyButton
                    className={cn(NAV_MENTOR_BTN, 'w-full min-h-11 h-11')}
                    tier="mentor"
                    funnelLabel="nav_mentor_mobile"
                    utm={{ utm_source: 'pmstructure', utm_medium: 'nav', utm_campaign: 'mentor_mobile' }}
                  >
                    {CTAS.talkToAMentor}
                  </WebsiteCalendlyButton>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
