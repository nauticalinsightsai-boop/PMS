/**
 * Self-hosted marketing imagery (WebP under /images/marketing/).
 * Regenerate assets: node scripts/generate-marketing-images.mjs
 */

const m = (name: string) => `/images/marketing/${name}.webp`;

export const MARKETING_HERO_SOCIAL_AVATARS = [
  { src: m('hero-social-avatar-1'), alt: '', width: 40, height: 40 },
  { src: m('hero-social-avatar-2'), alt: '', width: 40, height: 40 },
  { src: m('hero-social-avatar-3'), alt: '', width: 40, height: 40 },
  { src: m('hero-social-avatar-4'), alt: '', width: 40, height: 40 },
] as const;

export const MARKETING_PMP_AVATARS = {
  amara: m('pmp-avatar-amara'),
  david: m('pmp-avatar-david'),
  priya: m('pmp-avatar-priya'),
  james: m('pmp-avatar-james'),
  sarah: m('pmp-avatar-sarah'),
  hassan: m('pmp-avatar-hassan'),
  elena: m('pmp-avatar-elena'),
  michael: m('pmp-avatar-michael'),
  fatima: m('pmp-avatar-fatima'),
  robert: m('pmp-avatar-robert'),
} as const;

/** Generic testimonial avatar by index (deterministic). */
export function marketingTestimonialAvatar(index: number): string {
  const keys = Object.keys(MARKETING_PMP_AVATARS) as (keyof typeof MARKETING_PMP_AVATARS)[];
  return MARKETING_PMP_AVATARS[keys[index % keys.length]];
}

export const MARKETING_STOCK_IMAGES = {
  communityGrid: [
    { src: m('community-collab-600'), alt: 'Project professionals collaborating', width: 600, height: 600 },
    { src: m('community-workshop-600'), alt: 'Study workshop session', width: 600, height: 450 },
    { src: m('community-mentor-600'), alt: 'Mentor-led discussion', width: 600, height: 450 },
    { src: m('community-network-600'), alt: 'Professional networking', width: 600, height: 600 },
  ],
  mentorship: {
    src: m('mentorship-circle-900'),
    alt: 'Community study circle and mentorship',
    width: 900,
    height: 900,
  },
  aboutStory: [
    {
      src: m('about-workshop-800'),
      alt: 'Mentor-led certification workshop',
      width: 800,
      height: 1000,
    },
    {
      src: m('about-session-800'),
      alt: 'Project professionals in a structured study session',
      width: 800,
      height: 800,
    },
  ],
  membershipResources: [
    { src: m('membership-templates-500'), alt: 'Exam prep templates', width: 500, height: 500 },
    { src: m('membership-guides-500'), alt: 'Study guides and playbooks', width: 500, height: 500 },
    { src: m('membership-tools-500'), alt: 'PM planning tools', width: 500, height: 500 },
    { src: m('membership-webinars-500'), alt: 'Expert webinar recordings', width: 500, height: 500 },
  ],
  /** Blog / newsletter card fallback */
  articleCard: { src: m('community-collab-600'), width: 800, height: 600 },
  storeProduct: { src: m('membership-tools-500'), width: 400, height: 500 },
} as const;
