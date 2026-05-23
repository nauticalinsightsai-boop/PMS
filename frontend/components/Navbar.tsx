'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { RegisterModal } from "./RegisterModal";
import { BrandLogo } from "./BrandLogo";
import { CTAS } from "@/lib/brand-voice";
import { RegionChip } from "@/components/RegionChip";
import { cn } from "@/lib/utils";

const MAIN_NAV_LINKS = [
  { label: "Certifications", href: "/certifications" },
  { label: "Compare", href: "/compare" },
  { label: "Membership", href: "/membership" },
  { label: "Service", href: "/pm-service" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Community", href: "/community" },
] as const;

const MOBILE_NAV_LINKS = [
  { label: "Home", href: "/" },
  ...MAIN_NAV_LINKS,
  { label: "About", href: "/about" },
] as const;

function isNavLinkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/certifications") {
    return pathname === "/certifications" || pathname.startsWith("/certifications/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function navLinkClassName(active: boolean, variant: "desktop" | "mobile" = "desktop") {
  return cn(
    variant === "desktop"
      ? "inline-flex min-h-11 items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg border-b-2 border-transparent"
      : "inline-flex min-h-11 items-center text-lg font-medium transition-colors",
    active
      ? "text-brand-orange border-brand-orange font-semibold"
      : "text-slate-600 dark:text-slate-400 hover:text-brand-orange border-transparent",
  );
}

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export function Navbar({ toggleTheme, isDarkMode }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandLogo size="nav" className="group-hover:opacity-90 transition-opacity" />
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <nav className="flex items-center gap-0.5" aria-label="Main">
            {MAIN_NAV_LINKS.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={navLinkClassName(active, "desktop")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-2 ml-2">
            <RegionChip />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="min-h-11 min-w-11 rounded-full" aria-label="Toggle theme">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <RegisterModal trigger={
              <Button variant="brand" className="font-semibold px-5 h-10 rounded-full">
                {CTAS.navConsultation}
              </Button>
            } />
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-1">
          <RegionChip className="md:hidden" />
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="min-h-11 min-w-11 rounded-full" aria-label="Toggle theme">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="min-h-11 min-w-11 rounded-full" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            } />
            <SheetContent side="right" className="w-[min(100vw-2rem,400px)] bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <BrandLogo size="nav" className="mt-2" />
              <div className="mt-4 hidden md:block">
                <RegionChip />
              </div>
              <nav className="flex flex-col gap-1 mt-6" aria-label="Main">
                {MOBILE_NAV_LINKS.map((link) => {
                  const active = isNavLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={navLinkClassName(active, "mobile")}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <div className="mt-4 pt-4 border-t border-border">
                  <RegisterModal trigger={<Button variant="brand" className="w-full min-h-11">Register Now</Button>} />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
