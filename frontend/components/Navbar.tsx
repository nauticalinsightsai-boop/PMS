'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { RegionChip } from "@/components/RegionChip";
import { PmpRoadmapCtaLink } from "@/components/pmp/PmpRoadmapCtaLink";
import { cn } from "@/lib/utils";

const MAIN_NAV_LINKS = [
  { label: "Certifications", href: "/certifications" },
  { label: "PMP 2026", href: "/certifications/pmp" },
  { label: "Compare Pathways", href: "/certifications/compare" },
  { label: "FAQ", href: "/faq" },
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
  if (href === "/certifications/compare") {
    return pathname === "/certifications/compare";
  }
  if (href === "/certifications/pmp") {
    return pathname === "/certifications/pmp";
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
    <header className="fixed inset-x-0 top-0 z-[100] w-full bg-background/95 backdrop-blur-md border-b border-border supports-[backdrop-filter]:bg-background/80">
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
            <PmpRoadmapCtaLink
              size="default"
              className="font-semibold px-5 h-10 rounded-full"
              ctaLocation="nav"
            />
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
              <nav className="mt-6 flex flex-col gap-1 pl-4 sm:pl-5" aria-label="Main">
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
                  <PmpRoadmapCtaLink className="w-full min-h-11 rounded-full" ctaLocation="nav" />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
