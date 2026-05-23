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
  { label: "Service", href: "/pm-service" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Community", href: "/community" },
] as const;

const MOBILE_NAV_LINKS = [
  { label: "Home", href: "/" },
  ...MAIN_NAV_LINKS,
  { label: "Membership", href: "/membership" },
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
      ? "px-4 py-2 text-sm font-medium transition-colors rounded-lg"
      : "text-lg font-medium transition-colors",
    active
      ? "text-pms-gradient-orange font-semibold"
      : "text-slate-600 dark:text-slate-400 hover:text-brand-orange dark:hover:text-brand-cyan",
  );
}

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export function Navbar({ toggleTheme, isDarkMode }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <BrandLogo size="nav" className="group-hover:opacity-90 transition-opacity" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          <nav className="flex items-center gap-1" aria-label="Main">
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
          
          <div className="flex items-center gap-3 ml-4">
            <RegionChip />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <RegisterModal trigger={
              <Button className="bg-brand-orange hover:bg-brand-hover text-white font-semibold px-5 h-10 rounded-full shadow-md shadow-brand-orange/25 transition-all dark:bg-brand-orange dark:hover:bg-brand-hover dark:text-white">
                {CTAS.navConsultation}
              </Button>
            } />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Sheet>
            <SheetTrigger render={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-6 w-6" />
              </Button>
            } />
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-ivory dark:bg-obsidian">
              <BrandLogo size="nav" className="mt-2" />
              <nav className="flex flex-col gap-4 mt-6" aria-label="Main">
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
                <div className="flex flex-col gap-2 mt-4">
                  <RegisterModal trigger={<Button className="w-full bg-brand-orange hover:bg-brand-deep text-white">Register Now</Button>} />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
