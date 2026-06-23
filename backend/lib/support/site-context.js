/**
 * Static site facts injected into the support chat system prompt.
 * Mirrors frontend/config/pms-site.ts — keep env keys in sync with .env.example.
 */

const PRODUCTION_SITE_URL = 'https://pmstructure.com';

function isLocalDevHost(hostname) {
  return (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]'
  );
}

function resolveSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, '');
  const isProduction = process.env.NODE_ENV === 'production';
  if (raw) {
    try {
      const host = new URL(raw).hostname;
      if (isProduction && isLocalDevHost(host)) return PRODUCTION_SITE_URL;
      return raw;
    } catch {
      /* fall through */
    }
  }
  return isProduction ? PRODUCTION_SITE_URL : raw || PRODUCTION_SITE_URL;
}

const SITE_URL = resolveSiteUrl();

export function buildSupportSiteContext() {
  const supportEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || 'support@pmstructure.com';
  const mentorCalendly =
    process.env.NEXT_PUBLIC_TALK_TO_MENTOR_CALENDLY_URL?.trim() ||
    'https://calendly.com/pm-structure/talk-to-mentor';
  const advisorCalendly =
    process.env.NEXT_PUBLIC_TALK_TO_ADVISOR_CALENDLY_URL?.trim() ||
    'https://calendly.com/pm-structure/talk-to-advisor';
  const whatsappDisplay =
    process.env.NEXT_PUBLIC_WHATSAPP_DISPLAY?.trim() || '+44 7947 540939';
  const whatsappUrl =
    process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || 'https://wa.me/447947540939';
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || '';

  const lines = [
    `Site: PM Structure (${SITE_URL})`,
    'Description: Independent exam preparation for PMI®, PRINCE2®, and Lean Six Sigma — structured readiness pathways, regional pricing, and mentor-led support. Not an official exam body or PMI ATP.',
    `Support email: ${supportEmail}`,
    phone ? `Phone: ${phone}` : null,
    `WhatsApp: ${whatsappDisplay} (${whatsappUrl})`,
    `Talk to Mentor (discovery / pathway planning): ${mentorCalendly}`,
    `Talk to Advisor (corporate PM services): ${advisorCalendly}`,
    `Certification catalogue: ${SITE_URL}/certifications`,
    `FAQ hub: ${SITE_URL}/faq`,
    `PMP FAQ: ${SITE_URL}/pmp-faq`,
    `Contact: ${SITE_URL}/contact`,
    `Newsletter: ${SITE_URL}/newsletter`,
    `Corporate / PM advisory: ${SITE_URL}/pm-service`,
    `Community (Skool): ${process.env.NEXT_PUBLIC_SKOOL_COMMUNITY_JOIN_URL?.trim() || `${SITE_URL}/community`}`,
    'Enrollment: regional pricing on certification pages → checkout with seat deposit where published.',
  ].filter(Boolean);

  return lines.join('\n');
}

export const SUPPORT_CHAT_GREETING =
  "Hi, I'm the PM Structure assistant. Ask about certification pathways, FAQs, regional pricing, booking a mentor call, or how to enroll.";
