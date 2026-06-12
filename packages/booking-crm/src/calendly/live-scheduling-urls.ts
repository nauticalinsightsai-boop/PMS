/** Live pm-structure event URLs verified via Calendly API (2026-06). */
export const PM_STRUCTURE_CALENDLY_BASE = 'https://calendly.com/pm-structure' as const

export const LIVE_SITE_CALENDLY = {
  talkToMentor: `${PM_STRUCTURE_CALENDLY_BASE}/talk-to-mentor`,
  talkToAdvisor: `${PM_STRUCTURE_CALENDLY_BASE}/talk-to-advisor`,
} as const
