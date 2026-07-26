import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./Navbar.tsx', import.meta.url), 'utf8');

const MAIN_NAV = [
  { label: 'PMP 2026', href: '/certifications/pmp', featured: true },
  { label: 'Certifications', href: '/certifications' },
  { label: 'Services', href: '/pm-service' },
  { label: 'Newsletter', href: '/newsletter' },
] as const;

const MOBILE_NAV = [
  { label: 'Home', href: '/' },
  ...MAIN_NAV,
  { label: 'About', href: '/about' },
] as const;

describe('Navbar mobile Sheet contract', () => {
  it('controls Sheet open state with explicit open and onOpenChange', () => {
    expect(source).toContain('const [mobileOpen, setMobileOpen] = useState(false)');
    expect(source).toContain('<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>');
  });

  it('closes on every internal mobile nav click and on pathname change', () => {
    expect(source).toContain('onClick={() => setMobileOpen(false)}');
    expect(source).toContain('setMobileOpen(false);');
    expect(source).toContain('}, [pathname]);');
    const mobileMap = source.slice(source.indexOf('{MOBILE_NAV_LINKS.map'));
    const linkBlock = mobileMap.slice(0, mobileMap.indexOf('</nav>'));
    const onClickCount = (linkBlock.match(/onClick=\{\(\) => setMobileOpen\(false\)\}/g) || [])
      .length;
    expect(onClickCount).toBe(1);
    expect(linkBlock).toContain('MOBILE_NAV_LINKS.map');
    for (const link of MOBILE_NAV) {
      expect(source).toContain(`href: "${link.href}"`);
    }
  });

  it('exposes an sr-only SheetTitle with exact text Site navigation', () => {
    expect(source).toContain('SheetTitle');
    expect(source).toContain('<SheetTitle className="sr-only">Site navigation</SheetTitle>');
  });

  it('uses a >=44px close hit target without enlarging the close icon', () => {
    expect(source).toContain('showCloseButton={false}');
    expect(source).toContain('SheetClose');
    expect(source).toContain("'absolute top-3 right-3 h-11 w-11 min-h-11 min-w-11'");
    expect(source).toContain('<XIcon />');
    expect(source).not.toMatch(/<XIcon\s+className="[^"]*(?:h-5|h-6|h-7|w-5|w-6|w-7|size-5|size-6)/);
  });

  it('preserves href/copy/order for desktop and mobile nav lists', () => {
    for (const link of MAIN_NAV) {
      expect(source).toContain(`label: "${link.label}", href: "${link.href}"`);
    }
    expect(source).toContain('{ label: "Home", href: "/" }');
    expect(source).toContain('{ label: "About", href: "/about" }');
    expect(source).toContain('...MAIN_NAV_LINKS');
    const mainIdx = MAIN_NAV.map((l) => source.indexOf(`label: "${l.label}", href: "${l.href}"`));
    for (let i = 1; i < mainIdx.length; i += 1) {
      expect(mainIdx[i]).toBeGreaterThan(mainIdx[i - 1]);
    }
    const homeIdx = source.indexOf('{ label: "Home", href: "/" }');
    const aboutIdx = source.indexOf('{ label: "About", href: "/about" }');
    expect(homeIdx).toBeGreaterThan(-1);
    expect(aboutIdx).toBeGreaterThan(homeIdx);
    expect(MOBILE_NAV).toHaveLength(6);
  });

  it('preserves analytics funnel labels and does not alter external calendly wiring', () => {
    expect(source).toContain('funnelLabel="nav_mentor"');
    expect(source).toContain('funnelLabel="nav_mentor_mobile"');
    expect(source).toContain(
      "utm={{ utm_source: 'pmstructure', utm_medium: 'nav', utm_campaign: 'mentor' }}",
    );
    expect(source).toContain(
      "utm={{ utm_source: 'pmstructure', utm_medium: 'nav', utm_campaign: 'mentor_mobile' }}",
    );
    const mobileCalendly = source.slice(
      source.indexOf('funnelLabel="nav_mentor_mobile"') - 120,
      source.indexOf('funnelLabel="nav_mentor_mobile"') + 200,
    );
    expect(mobileCalendly).not.toContain('setMobileOpen(false)');
  });

  it('keeps desktop lg breakpoint shell and mobile-only Sheet shell', () => {
    expect(source).toContain('hidden lg:flex lg:items-center lg:gap-4');
    expect(source).toContain('flex lg:hidden items-center gap-1');
    expect(source).toContain('aria-label="Open menu"');
    expect(source).toContain(
      'w-[min(100vw-2rem,400px)] bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))]',
    );
  });
});
