'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, GraduationCap, Moon, Sun, Github } from "lucide-react";
import { RegisterModal } from "./RegisterModal";

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export function Navbar({ toggleTheme, isDarkMode }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white shadow-sm group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-heading">PMStructure</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-6">
          <nav className="flex items-center gap-1">
            {[
              { label: "Service", href: "/pm-service" },
              { label: "Certifications", href: "/certifications" },
              { label: "Newsletter", href: "/newsletter" },
              { label: "Community", href: "/community" },
              { label: "Store", href: "/store" },
            ].map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-brand-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3 ml-4">
            <a href="https://github.com/nauticalinsightsai-boop/PMS" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <Github className="h-4 w-4" />
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <RegisterModal trigger={
              <Button className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white text-white font-semibold px-5 h-10 rounded-full transition-all">
                Get Started
              </Button>
            } />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center gap-2">
          <a href="https://github.com/nauticalinsightsai-boop/PMS" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Github className="h-5 w-5" />
            </Button>
          </a>
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
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-brand-orange transition-colors">Home</Link>
                <Link href="/pm-service" className="text-lg font-medium hover:text-brand-orange transition-colors">Service</Link>
                <Link href="/certifications" className="text-lg font-medium hover:text-brand-orange transition-colors">Certifications</Link>
                <Link href="/newsletter" className="text-lg font-medium hover:text-brand-orange transition-colors">Newsletter</Link>
                <Link href="/community" className="text-lg font-medium hover:text-brand-orange transition-colors">Community</Link>
                <Link href="/store" className="text-lg font-medium hover:text-brand-orange transition-colors">Store</Link>
                <Link href="/membership" className="text-lg font-medium hover:text-brand-orange transition-colors">Membership</Link>
                <Link href="/about" className="text-lg font-medium hover:text-brand-orange transition-colors">About</Link>
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
