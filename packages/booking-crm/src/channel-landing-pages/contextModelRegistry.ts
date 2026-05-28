/**
 * Maps each live channelId to its SSM Context Model document (authoring reference).
 * Paths are relative to the SSM workspace root on your machine.
 */
export type ContextModelEntry = {
  channelId: string
  /** Relative path under SSM root, e.g. `3- Social Distribution/LinkedIn/...` */
  contextModelPath: string
  platformFamily: string
}

/** SSM root — update if your OneDrive folder moves. */
export const SSM_CONTEXT_ROOT = 'OneDrive/Desktop/SSM'

export const CONTEXT_MODEL_REGISTRY: ContextModelEntry[] = [
  { channelId: 'website', contextModelPath: '1- Core/Website/Context Model.md', platformFamily: 'owned' },
  { channelId: 'medium', contextModelPath: '2- Publishing/Medium/Context Model.md', platformFamily: 'publishing' },
  { channelId: 'substack', contextModelPath: '2- Publishing/Substack/Context Model.md', platformFamily: 'publishing' },
  { channelId: 'beehiiv', contextModelPath: '2- Publishing/Beehiiv/Context Model.md', platformFamily: 'publishing' },
  { channelId: 'ghost', contextModelPath: '2- Publishing/Ghost/Context Model.md', platformFamily: 'publishing' },
  { channelId: 'hashnode', contextModelPath: '2- Publishing/Hashnode/Context Model.md', platformFamily: 'publishing' },
  { channelId: 'notion-public', contextModelPath: '2- Publishing/Notion/Context Model.md', platformFamily: 'publishing' },
  { channelId: 'linkedin', contextModelPath: '3- Social Distribution/LinkedIn/Context Model.md', platformFamily: 'social' },
  { channelId: 'twitter', contextModelPath: '3- Social Distribution/X-Twitter/Context Model.md', platformFamily: 'social' },
  { channelId: 'instagram', contextModelPath: '3- Social Distribution/Instagram/Context Model.md', platformFamily: 'social' },
  { channelId: 'facebook', contextModelPath: '3- Social Distribution/Facebook/Context Model.md', platformFamily: 'social' },
  { channelId: 'reddit', contextModelPath: '3- Social Distribution/Reddit/Context Model.md', platformFamily: 'social' },
  { channelId: 'threads', contextModelPath: '3- Social Distribution/Threads/Context Model.md', platformFamily: 'social' },
  { channelId: 'quora', contextModelPath: '3- Social Distribution/Quora/Context Model.md', platformFamily: 'social' },
  { channelId: 'bluesky', contextModelPath: '3- Social Distribution/Bluesky/Context Model.md', platformFamily: 'social' },
  { channelId: 'mastodon', contextModelPath: '3- Social Distribution/Mastodon/Context Model.md', platformFamily: 'social' },
  { channelId: 'pinterest', contextModelPath: '3- Social Distribution/Pinterest/Context Model.md', platformFamily: 'social' },
  { channelId: 'youtube', contextModelPath: '4- Video/YouTube/Context Model.md', platformFamily: 'video' },
  { channelId: 'tiktok', contextModelPath: '4- Video/TikTok/Context Model.md', platformFamily: 'video' },
  { channelId: 'snapchat', contextModelPath: '4- Video/Snapchat/Context Model.md', platformFamily: 'video' },
  { channelId: 'vimeo', contextModelPath: '4- Video/Vimeo/Context Model.md', platformFamily: 'video' },
  { channelId: 'spotify', contextModelPath: '5- Audio/Spotify/Context Model.md', platformFamily: 'audio' },
  { channelId: 'apple-podcasts', contextModelPath: '5- Audio/Apple Podcasts/Context Model.md', platformFamily: 'audio' },
  { channelId: 'amazon-audible', contextModelPath: '5- Audio/Amazon Audible/Context Model.md', platformFamily: 'audio' },
  { channelId: 'google-podcasts', contextModelPath: '5- Audio/Google Podcasts/Context Model.md', platformFamily: 'audio' },
  { channelId: 'podbean', contextModelPath: '5- Audio/Podbean/Context Model.md', platformFamily: 'audio' },
  { channelId: 'soundcloud', contextModelPath: '5- Audio/SoundCloud/Context Model.md', platformFamily: 'audio' },
  { channelId: 'email', contextModelPath: '6- Community/Email/Context Model.md', platformFamily: 'community' },
  { channelId: 'whatsapp', contextModelPath: '6- Community/WhatsApp/Context Model.md', platformFamily: 'community' },
  { channelId: 'telegram', contextModelPath: '6- Community/Telegram/Context Model.md', platformFamily: 'community' },
  { channelId: 'discord', contextModelPath: '6- Community/Discord/Context Model.md', platformFamily: 'community' },
  { channelId: 'slack', contextModelPath: '6- Community/Slack/Context Model.md', platformFamily: 'community' },
  { channelId: 'google-search', contextModelPath: '7- Discovery/Google Search/Context Model.md', platformFamily: 'discovery' },
  { channelId: 'youtube-search', contextModelPath: '7- Discovery/YouTube Search/Context Model.md', platformFamily: 'discovery' },
  { channelId: 'podcast-directories', contextModelPath: '7- Discovery/Podcast Directories/Context Model.md', platformFamily: 'discovery' },
  { channelId: 'bing-search', contextModelPath: '7- Discovery/Bing Search/Context Model.md', platformFamily: 'discovery' },
  { channelId: 'ai-visibility', contextModelPath: '7- Discovery/AI Visibility/Context Model.md', platformFamily: 'discovery' },
  { channelId: 'rss-feeds', contextModelPath: '8- Syndication/RSS/Context Model.md', platformFamily: 'syndication' },
  { channelId: 'content-aggregators', contextModelPath: '8- Syndication/Aggregators/Context Model.md', platformFamily: 'syndication' },
  { channelId: 'api-ai-fed', contextModelPath: '8- Syndication/API AI-fed/Context Model.md', platformFamily: 'syndication' },
]

const byId = new Map(CONTEXT_MODEL_REGISTRY.map((e) => [e.channelId, e]))

export function getContextModelEntry(channelId: string): ContextModelEntry | undefined {
  return byId.get(channelId)
}

export function getContextModelPath(channelId: string): string | undefined {
  return byId.get(channelId)?.contextModelPath
}
