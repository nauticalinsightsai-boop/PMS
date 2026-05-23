import type { LegalDocument } from './types';
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED, section } from './shared';
import { BRAND } from '@/lib/brand-voice';

export const cookiesDocument: LegalDocument = {
  slug: 'cookies',
  title: 'Cookie Policy',
  lastUpdated: LEGAL_LAST_UPDATED,
  jurisdictionNote: 'Describes how we use cookies and similar technologies on our website.',
  sections: [
    section(
      'what',
      '1. What are cookies?',
      'Cookies are small text files stored on your device when you visit a website. We also use local storage for some preferences.',
    ),
    section(
      'necessary',
      '2. Strictly necessary',
      `These are required for the site to function:\n\n• Region preference (e.g. pms_region) — remembers your pricing region for up to 90 days.\n• Theme preference — light or dark mode.\n• Session / authentication — when you log in to member or admin areas.\n• Cookie consent choice (pms_cookie_consent) — records your privacy preference.\n\nYou cannot opt out of strictly necessary cookies while using the site.`,
    ),
    section(
      'optional',
      '3. Optional cookies',
      'Analytics and marketing cookies (if enabled) help us understand traffic and improve campaigns. These are off until you accept them via our cookie banner. We do not sell personal data through cookies.',
    ),
    section(
      'manage',
      '4. How to manage cookies',
      `Use the cookie banner on first visit, or clear cookies in your browser settings. You can change region anytime via the region selector in the header. For questions: ${LEGAL_CONTACT_EMAIL}.`,
    ),
    section(
      'third',
      '5. Third parties',
      'Payment processors, hosting providers, and email tools may set their own cookies when you interact with checkout or embedded services. See their policies for details.',
    ),
    section(
      'updates',
      '6. Updates',
      `We may update this policy. The “Last updated” date at the top reflects the latest version. Continued use of ${BRAND.name} after changes constitutes notice.`,
    ),
  ],
};
