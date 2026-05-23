import {
  BRAND,
  BRAND_LINES,
  HOME_COPY,
  CERTIFICATIONS_COPY,
  COMMUNITY_COPY,
  SERVICES_COPY,
  CTAS,
} from '@/lib/brand-voice';

/** Suggested published `website_data` field_key → content defaults for the site editor */
export const BRAND_VOICE_CMS_DEFAULTS: Record<string, string> = {
  hero_badge: HOME_COPY.heroBadge,
  hero_title: HOME_COPY.heroTitle,
  hero_subtitle: HOME_COPY.heroSubtitle,
  cta_primary: HOME_COPY.ctaPrimary,
  cta_secondary: HOME_COPY.ctaSecondary,
  frameworks_title: HOME_COPY.frameworksTitle,
  frameworks_subtitle: HOME_COPY.frameworksSubtitle,
  certifications_badge: CERTIFICATIONS_COPY.heroBadge,
  certifications_title: CERTIFICATIONS_COPY.heroTitle,
  certifications_subtitle: CERTIFICATIONS_COPY.heroSubtitle,
  certifications_list_subtitle: CERTIFICATIONS_COPY.listingSubtitle,
  community_badge: COMMUNITY_COPY.heroBadge,
  community_title: COMMUNITY_COPY.heroTitle,
  community_subtitle: COMMUNITY_COPY.heroSubtitle,
  pm_service_badge: SERVICES_COPY.heroBadge,
  pm_service_title: SERVICES_COPY.heroTitle,
  pm_service_subtitle: SERVICES_COPY.heroSubtitle,
  membership_subtitle: HOME_COPY.membershipSubtitle,
  faq_subtitle:
    'Pathways, readiness support, community, and pricing — ask if your case is not listed.',
  mission_subtitle: BRAND_LINES.positioning,
  brand_tagline: BRAND_LINES.primary,
  brand_name: BRAND.name,
  cta_pathway_consultation: CTAS.pathwayConsultation,
  cta_readiness_check: CTAS.readinessCheck,
};
