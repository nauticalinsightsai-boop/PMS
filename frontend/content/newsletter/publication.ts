import type { NewsletterPost } from '@pms/site-content/newsletter-posts';
import { newsletterDraftRegistry } from '@pms/site-content/newsletter-draft-registry';

/**
 * Owner-approved publication batch for the 13 long-form newsletter articles.
 *
 * The source registry intentionally remains a draft registry so the importer
 * can continue to validate and regenerate the editorial source files. This
 * file is the explicit production publication decision: it supplies the
 * publication timestamp and an existing self-hosted hero asset for every post.
 */
const LONG_FORM_PUBLICATION_DATE = '2026-07-25T23:45:00.000Z';

const HERO_IMAGE_BY_SLUG: Record<string, string> = {
  'post-transition-pmp-reset-july-2026': '/images/marketing/about-workshop-800.webp',
  'pmp-scenario-practice-operating-system-2026':
    '/images/marketing/community-workshop-600.webp',
  'pmp-application-experience-stories-gcc-engineers':
    '/images/marketing/mentorship-circle-900.webp',
  'shift-worker-8-week-pmp-study-rhythm-gcc':
    '/images/marketing/community-network-600.webp',
  'pmp-business-environment-26-percent-practice-plan':
    '/images/marketing/community-collab-600.webp',
  'ai-augmented-project-manager-governance-checklist-2026':
    '/images/marketing/membership-tools-500.webp',
  'sustainable-value-delivery-practice-2026-candidates':
    '/images/marketing/membership-templates-500.webp',
  'gcc-pmo-pmp-cohort-playbook': '/images/marketing/about-session-800.webp',
  'mena-project-talent-gap-career-evidence':
    '/images/marketing/community-mentor-600.webp',
  'hybrid-governance-gcc-transformation-portfolios':
    '/images/marketing/community-workshop-600.webp',
  'pmp-live-training-requirements-late-q4-2026':
    '/images/marketing/membership-guides-500.webp',
  'new-pmp-exam-day-format-240-minutes': '/images/marketing/about-workshop-800.webp',
  'pmi-ai-standard-gcc-pmo-operating-model':
    '/images/marketing/community-network-600.webp',
};

export const LEGACY_THIN_NEWSLETTER_SLUGS = new Set([
  '2026-pmp-exam-changes',
  'hybrid-methodologies-enterprise',
  'risk-beyond-probability-matrix',
  'ai-augmented-project-manager',
  'prince2-7th-edition-practitioner',
  'building-high-performance-pmo',
  'moral-legal-financial-reasons-managing-safety',
]);

export const publishedLongFormNewsletterPosts: NewsletterPost[] =
  newsletterDraftRegistry.posts.map((post) => {
    const heroImage = HERO_IMAGE_BY_SLUG[post.slug];
    if (!heroImage) {
      throw new Error(`Missing publication hero image for newsletter slug: ${post.slug}`);
    }

    return {
      ...post,
      status: 'published',
      publishDate: LONG_FORM_PUBLICATION_DATE,
      featuredImageUrl: heroImage,
      featuredImageMobileUrl: heroImage,
    };
  });

