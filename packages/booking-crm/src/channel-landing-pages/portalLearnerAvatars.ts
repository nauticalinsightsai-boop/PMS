/**
 * Stable learner headshot paths (committed under frontend/public/portal/learners/).
 * Sources: curated stock; see scripts/ensure-learner-headshots.mjs when regenerating placeholders.
 */

export function learnerAvatarPath(channelId: string, index: 1 | 2): string {
  return `/portal/learners/${channelId}-${index}.webp`
}

export function avatarUrlsForChannel(channelId: string): [string, string] {
  return [learnerAvatarPath(channelId, 1), learnerAvatarPath(channelId, 2)]
}
