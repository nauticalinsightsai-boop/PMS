/** Persona / CRO lint for portal copy (no hype, no duplicate banned CTAs). */

const BANNED_CTA_PHRASES = [
  'schedule online',
  'schedule here',
  'book a call',
  'book a session',
  'book from',
  'click here',
  'limited time',
  'act now',
  'don\'t miss',
]

const HYPE_WORDS = [
  'amazing',
  'incredible',
  'revolutionary',
  'game-changer',
  'guaranteed',
  'exclusive offer',
  'hurry',
]

export type PersonaLintIssue = {
  field: string
  message: string
  severity: 'warning' | 'error'
}

export function lintPortalCopyFields(fields: Record<string, string | undefined>): PersonaLintIssue[] {
  const issues: PersonaLintIssue[] = []
  for (const [field, raw] of Object.entries(fields)) {
    const value = raw?.trim()
    if (!value) continue
    const lower = value.toLowerCase()
    for (const banned of BANNED_CTA_PHRASES) {
      if (field === 'scheduleTierCta' && lower === banned) {
        issues.push({
          field,
          message: `Avoid generic CTA "${banned}" — use a platform-native phrase`,
          severity: 'error',
        })
      } else if (lower.includes(banned) && field === 'scheduleTierCta') {
        issues.push({
          field,
          message: `CTA contains overused phrase "${banned}"`,
          severity: 'warning',
        })
      }
    }
    if (field === 'scheduleTierCta' && value.includes('→')) {
      issues.push({
        field,
        message: 'Use one platform-native phrase — avoid arrow CTAs like "Wiki → session"',
        severity: 'error',
      })
    }
    for (const hype of HYPE_WORDS) {
      if (lower.includes(hype)) {
        issues.push({
          field,
          message: `Hype language "${hype}" — keep qualification-first tone`,
          severity: 'warning',
        })
      }
    }
    if (value.length > 280 && (field === 'targetMessage' || field === 'subheadline')) {
      issues.push({
        field,
        message: 'Long for this surface — consider tightening',
        severity: 'warning',
      })
    }
  }
  return issues
}

export function lintChannelLandingPageDraft(page: {
  headline?: string
  subheadline?: string
  targetMessage?: string
  contextLabel?: string
  primaryButtonText?: string
}): PersonaLintIssue[] {
  return lintPortalCopyFields({
    headline: page.headline,
    subheadline: page.subheadline,
    targetMessage: page.targetMessage,
    contextLabel: page.contextLabel,
    scheduleTierCta: page.primaryButtonText,
  })
}
