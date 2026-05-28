/** Normalize YouTube / Vimeo URLs to an iframe embed src. */
export function toWebinarEmbedSrc(url: string): string | null {
  const raw = url.trim()
  if (!raw) return null
  try {
    const u = new URL(raw.startsWith('http') ? raw : `https://${raw}`)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = u.pathname.slice(1).split('/')[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      const embed = u.pathname.match(/\/embed\/([^/?]+)/)
      if (embed) return `https://www.youtube.com/embed/${embed[1]}`
      const shorts = u.pathname.match(/\/shorts\/([^/?]+)/)
      if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`
    }

    if (host === 'vimeo.com') {
      const id = u.pathname.match(/\/(\d+)/)
      return id ? `https://player.vimeo.com/video/${id[1]}` : null
    }

    if (host === 'player.vimeo.com') return raw

    return null
  } catch {
    return null
  }
}
