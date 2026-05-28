// Channel Types Constants - ALL 90+ channel types from the distribution table

import { ChannelTypeConfig, PlatformCategory, ChannelFormatFamily } from '../types/distribution';

// ============================================================================
// CORE / OWNED PLATFORM (7 types)
// ============================================================================

const WEBSITE_TYPES: ChannelTypeConfig[] = [
 {
  id: 'website-pages',
  label: 'Pages',
  channelId: 'website',
  platformCategory: 'Core / Owned Platform',
  formatFamily: 'Page',
  emphasis: 'Conversion',
  defaultRole: 'Master'
 },
 {
  id: 'website-newsletter',
  label: 'Newsletter',
  channelId: 'website',
  platformCategory: 'Core / Owned Platform',
  formatFamily: 'Newsletter',
  emphasis: 'Engagement',
  defaultRole: 'Master'
 },
 {
  id: 'website-blog-posts',
  label: 'Blog Posts',
  channelId: 'website',
  platformCategory: 'Core / Owned Platform',
  formatFamily: 'Article',
  emphasis: 'Reach',
  defaultRole: 'Master'
 },
 {
  id: 'website-landing-pages',
  label: 'Landing Pages',
  channelId: 'website',
  platformCategory: 'Core / Owned Platform',
  formatFamily: 'Page',
  emphasis: 'Conversion',
  defaultRole: 'Master'
 },
 {
  id: 'website-gated-content',
  label: 'Gated Content',
  channelId: 'website',
  platformCategory: 'Core / Owned Platform',
  formatFamily: 'Page',
  emphasis: 'Conversion',
  defaultRole: 'Master'
 },
 {
  id: 'website-knowledge-pages',
  label: 'Knowledge Pages',
  channelId: 'website',
  platformCategory: 'Core / Owned Platform',
  formatFamily: 'Documentation',
  emphasis: 'Engagement',
  defaultRole: 'Master'
 }
];

const WEBINAR_TYPES: ChannelTypeConfig[] = [
 {
  id: 'webinar-live-session',
  label: 'Live Session',
  channelId: 'webinar',
  platformCategory: 'Core / Owned Platform',
  formatFamily: 'Video',
  emphasis: 'Conversion',
  defaultRole: 'Master'
 },
];

// ============================================================================
// WRITING / PUBLISHING (12 types)
// ============================================================================

const MEDIUM_TYPES: ChannelTypeConfig[] = [
 {
  id: 'medium-publication',
  label: 'Publication',
  channelId: 'medium',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Article',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'medium-article-feed',
  label: 'Article Feed',
  channelId: 'medium',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Feed',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const SUBSTACK_TYPES: ChannelTypeConfig[] = [
 {
  id: 'substack-posts',
  label: 'Posts',
  channelId: 'substack',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Post',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'substack-newsletter',
  label: 'Newsletter',
  channelId: 'substack',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Newsletter',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'substack-notes',
  label: 'Notes',
  channelId: 'substack',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const BEEHIIV_TYPES: ChannelTypeConfig[] = [
 {
  id: 'beehiiv-newsletter',
  label: 'Newsletter',
  channelId: 'beehiiv',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Newsletter',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'beehiiv-post-feed',
  label: 'Post Feed',
  channelId: 'beehiiv',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Feed',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const GHOST_TYPES: ChannelTypeConfig[] = [
 {
  id: 'ghost-blog-posts',
  label: 'Blog Posts',
  channelId: 'ghost',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Article',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'ghost-newsletter',
  label: 'Newsletter',
  channelId: 'ghost',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Newsletter',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const HASHNODE_TYPES: ChannelTypeConfig[] = [
 {
  id: 'hashnode-article-feed',
  label: 'Article Feed',
  channelId: 'hashnode',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Article',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const NOTION_TYPES: ChannelTypeConfig[] = [
 {
  id: 'notion-public-pages',
  label: 'Public Pages',
  channelId: 'notion-public',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Page',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'notion-documentation',
  label: 'Documentation',
  channelId: 'notion-public',
  platformCategory: 'Writing / Publishing',
  formatFamily: 'Documentation',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

// ============================================================================
// SOCIAL DISTRIBUTION (30 types)
// ============================================================================

const LINKEDIN_TYPES: ChannelTypeConfig[] = [
 {
  id: 'linkedin-profile-feed',
  label: 'Profile Feed',
  channelId: 'linkedin',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'linkedin-company-page',
  label: 'Company Page',
  channelId: 'linkedin',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'linkedin-newsletter',
  label: 'Newsletter',
  channelId: 'linkedin',
  platformCategory: 'Social Distribution',
  formatFamily: 'Newsletter',
  emphasis: 'Engagement',
  defaultRole: 'Master'
 },
 {
  id: 'linkedin-articles',
  label: 'Articles',
  channelId: 'linkedin',
  platformCategory: 'Social Distribution',
  formatFamily: 'Article',
  emphasis: 'Engagement',
  defaultRole: 'Master'
 },
 {
  id: 'linkedin-video',
  label: 'Video',
  channelId: 'linkedin',
  platformCategory: 'Social Distribution',
  formatFamily: 'Video',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const TWITTER_TYPES: ChannelTypeConfig[] = [
 {
  id: 'twitter-timeline',
  label: 'Timeline',
  channelId: 'twitter',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'twitter-threads',
  label: 'Threads',
  channelId: 'twitter',
  platformCategory: 'Social Distribution',
  formatFamily: 'Thread',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'twitter-replies',
  label: 'Replies',
  channelId: 'twitter',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const INSTAGRAM_TYPES: ChannelTypeConfig[] = [
 {
  id: 'instagram-feed',
  label: 'Feed',
  channelId: 'instagram',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'instagram-reels',
  label: 'Reels',
  channelId: 'instagram',
  platformCategory: 'Social Distribution',
  formatFamily: 'Short Video',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'instagram-stories',
  label: 'Stories',
  channelId: 'instagram',
  platformCategory: 'Social Distribution',
  formatFamily: 'Story',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'instagram-broadcast-channel',
  label: 'Broadcast Channel',
  channelId: 'instagram',
  platformCategory: 'Social Distribution',
  formatFamily: 'Channel',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const FACEBOOK_TYPES: ChannelTypeConfig[] = [
 {
  id: 'facebook-profile',
  label: 'Profile',
  channelId: 'facebook',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'facebook-page',
  label: 'Page',
  channelId: 'facebook',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'facebook-feed',
  label: 'Feed',
  channelId: 'facebook',
  platformCategory: 'Social Distribution',
  formatFamily: 'Feed',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'facebook-groups',
  label: 'Groups',
  channelId: 'facebook',
  platformCategory: 'Social Distribution',
  formatFamily: 'Community',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const REDDIT_TYPES: ChannelTypeConfig[] = [
 {
  id: 'reddit-subreddits',
  label: 'Subreddits',
  channelId: 'reddit',
  platformCategory: 'Social Distribution',
  formatFamily: 'Community',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'reddit-posts',
  label: 'Posts',
  channelId: 'reddit',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'reddit-comment-threads',
  label: 'Comment Threads',
  channelId: 'reddit',
  platformCategory: 'Social Distribution',
  formatFamily: 'Thread',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const THREADS_TYPES: ChannelTypeConfig[] = [
 {
  id: 'threads-feed',
  label: 'Feed',
  channelId: 'threads',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'threads-threaded-posts',
  label: 'Threaded Posts',
  channelId: 'threads',
  platformCategory: 'Social Distribution',
  formatFamily: 'Thread',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const QUORA_TYPES: ChannelTypeConfig[] = [
 {
  id: 'quora-questions',
  label: 'Questions',
  channelId: 'quora',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'quora-answers',
  label: 'Answers',
  channelId: 'quora',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const BLUESKY_TYPES: ChannelTypeConfig[] = [
 {
  id: 'bluesky-feed',
  label: 'Feed',
  channelId: 'bluesky',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'bluesky-threads',
  label: 'Threads',
  channelId: 'bluesky',
  platformCategory: 'Social Distribution',
  formatFamily: 'Thread',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const MASTODON_TYPES: ChannelTypeConfig[] = [
 {
  id: 'mastodon-federated-feed',
  label: 'Federated Feed',
  channelId: 'mastodon',
  platformCategory: 'Social Distribution',
  formatFamily: 'Feed',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'mastodon-threads',
  label: 'Threads',
  channelId: 'mastodon',
  platformCategory: 'Social Distribution',
  formatFamily: 'Thread',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const PINTEREST_TYPES: ChannelTypeConfig[] = [
 {
  id: 'pinterest-pins-boards',
  label: 'Pins & Boards',
  channelId: 'pinterest',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const VK_TYPES: ChannelTypeConfig[] = [
{
  id: 'vk-feed',
  label: 'Feed',
  channelId: 'vk',
  platformCategory: 'Social Distribution',
  formatFamily: 'Post',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
{
  id: 'vk-communities',
  label: 'Communities',
  channelId: 'vk',
  platformCategory: 'Social Distribution',
  formatFamily: 'Community',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

// ============================================================================
// VIDEO PLATFORM (7 types)
// ============================================================================

const YOUTUBE_TYPES: ChannelTypeConfig[] = [
 {
  id: 'youtube-channel',
  label: 'Channel',
  channelId: 'youtube',
  platformCategory: 'Video Platform',
  formatFamily: 'Channel',
  emphasis: 'Reach',
  defaultRole: 'Master'
 },
 {
  id: 'youtube-long-form-video',
  label: 'Long-form Video',
  channelId: 'youtube',
  platformCategory: 'Video Platform',
  formatFamily: 'Video',
  emphasis: 'Engagement',
  defaultRole: 'Master'
 },
 {
  id: 'youtube-shorts',
  label: 'Shorts',
  channelId: 'youtube',
  platformCategory: 'Video Platform',
  formatFamily: 'Short Video',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const TIKTOK_TYPES: ChannelTypeConfig[] = [
 {
  id: 'tiktok-video-feed',
  label: 'Video Feed',
  channelId: 'tiktok',
  platformCategory: 'Video Platform',
  formatFamily: 'Short Video',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const SNAPCHAT_TYPES: ChannelTypeConfig[] = [
 {
  id: 'snapchat-story-feed',
  label: 'Story Feed',
  channelId: 'snapchat',
  platformCategory: 'Video Platform',
  formatFamily: 'Story',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const VIMEO_TYPES: ChannelTypeConfig[] = [
 {
  id: 'vimeo-channel',
  label: 'Channel',
  channelId: 'vimeo',
  platformCategory: 'Video Platform',
  formatFamily: 'Channel',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'vimeo-video-showcase',
  label: 'Video Showcase',
  channelId: 'vimeo',
  platformCategory: 'Video Platform',
  formatFamily: 'Video',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

// ============================================================================
// AUDIO / PODCAST (12 types)
// ============================================================================

const SPOTIFY_TYPES: ChannelTypeConfig[] = [
 {
  id: 'spotify-podcast-listing',
  label: 'Podcast Listing',
  channelId: 'spotify',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Listing',
  emphasis: 'Reach',
  defaultRole: 'Master'
 },
 {
  id: 'spotify-episode-feed',
  label: 'Episode Feed',
  channelId: 'spotify',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Podcast',
  emphasis: 'Engagement',
  defaultRole: 'Master'
 }
];

const APPLE_PODCASTS_TYPES: ChannelTypeConfig[] = [
 {
  id: 'apple-podcasts-podcast-listing',
  label: 'Podcast Listing',
  channelId: 'apple-podcasts',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Listing',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'apple-podcasts-episode-feed',
  label: 'Episode Feed',
  channelId: 'apple-podcasts',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Podcast',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const AMAZON_AUDIBLE_TYPES: ChannelTypeConfig[] = [
 {
  id: 'amazon-audible-podcast-listing',
  label: 'Podcast Listing',
  channelId: 'amazon-audible',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Listing',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'amazon-audible-episode-feed',
  label: 'Episode Feed',
  channelId: 'amazon-audible',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Podcast',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const GOOGLE_PODCASTS_TYPES: ChannelTypeConfig[] = [
 {
  id: 'google-podcasts-podcast-listing',
  label: 'Podcast Listing',
  channelId: 'google-podcasts',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Listing',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'google-podcasts-episode-feed',
  label: 'Episode Feed',
  channelId: 'google-podcasts',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Podcast',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const PODBEAN_TYPES: ChannelTypeConfig[] = [
 {
  id: 'podbean-podcast-hosting',
  label: 'Podcast Hosting',
  channelId: 'podbean',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Podcast',
  emphasis: 'Engagement',
  defaultRole: 'Master'
 },
 {
  id: 'podbean-episode-feed',
  label: 'Episode Feed',
  channelId: 'podbean',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Podcast',
  emphasis: 'Engagement',
  defaultRole: 'Master'
 }
];

const SOUNDCLOUD_TYPES: ChannelTypeConfig[] = [
 {
  id: 'soundcloud-audio-stream-feed',
  label: 'Audio Stream Feed',
  channelId: 'soundcloud',
  platformCategory: 'Audio / Podcast',
  formatFamily: 'Audio',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

// ============================================================================
// COMMUNITY / DIRECT (10 types)
// ============================================================================

const EMAIL_TYPES: ChannelTypeConfig[] = [
 {
  id: 'email-mailing-list',
  label: 'Mailing List',
  channelId: 'email',
  platformCategory: 'Community / Direct',
  formatFamily: 'Newsletter',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'email-inbox-delivery',
  label: 'Inbox Delivery',
  channelId: 'email',
  platformCategory: 'Community / Direct',
  formatFamily: 'Newsletter',
  emphasis: 'Conversion',
  defaultRole: 'Copy'
 }
];

const WHATSAPP_TYPES: ChannelTypeConfig[] = [
 {
  id: 'whatsapp-broadcast-channel',
  label: 'Broadcast Channel',
  channelId: 'whatsapp',
  platformCategory: 'Community / Direct',
  formatFamily: 'Channel',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const TELEGRAM_TYPES: ChannelTypeConfig[] = [
 {
  id: 'telegram-channels',
  label: 'Channels',
  channelId: 'telegram',
  platformCategory: 'Community / Direct',
  formatFamily: 'Channel',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'telegram-groups',
  label: 'Groups',
  channelId: 'telegram',
  platformCategory: 'Community / Direct',
  formatFamily: 'Community',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const DISCORD_TYPES: ChannelTypeConfig[] = [
 {
  id: 'discord-server',
  label: 'Server',
  channelId: 'discord',
  platformCategory: 'Community / Direct',
  formatFamily: 'Community',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'discord-channels',
  label: 'Channels',
  channelId: 'discord',
  platformCategory: 'Community / Direct',
  formatFamily: 'Channel',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'discord-threads',
  label: 'Threads',
  channelId: 'discord',
  platformCategory: 'Community / Direct',
  formatFamily: 'Thread',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

const SLACK_TYPES: ChannelTypeConfig[] = [
 {
  id: 'slack-workspace',
  label: 'Workspace',
  channelId: 'slack',
  platformCategory: 'Community / Direct',
  formatFamily: 'Community',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 },
 {
  id: 'slack-private-channels',
  label: 'Private Channels',
  channelId: 'slack',
  platformCategory: 'Community / Direct',
  formatFamily: 'Channel',
  emphasis: 'Engagement',
  defaultRole: 'Copy'
 }
];

// ============================================================================
// DISCOVERY / SEARCH (7 types)
// ============================================================================

const GOOGLE_SEARCH_TYPES: ChannelTypeConfig[] = [
 {
  id: 'google-search-indexed-pages',
  label: 'Indexed Pages',
  channelId: 'google-search',
  platformCategory: 'Discovery / Search',
  formatFamily: 'Search',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'google-search-serp-results',
  label: 'SERP Results',
  channelId: 'google-search',
  platformCategory: 'Discovery / Search',
  formatFamily: 'Search',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const YOUTUBE_SEARCH_TYPES: ChannelTypeConfig[] = [
 {
  id: 'youtube-search-video-results',
  label: 'Video Results',
  channelId: 'youtube-search',
  platformCategory: 'Discovery / Search',
  formatFamily: 'Search',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const PODCAST_DIRECTORIES_TYPES: ChannelTypeConfig[] = [
 {
  id: 'podcast-directories-listings',
  label: 'Directory Listings',
  channelId: 'podcast-directories',
  platformCategory: 'Discovery / Search',
  formatFamily: 'Listing',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const BING_SEARCH_TYPES: ChannelTypeConfig[] = [
 {
  id: 'bing-search-indexed-pages',
  label: 'Indexed Pages',
  channelId: 'bing-search',
  platformCategory: 'Discovery / Search',
  formatFamily: 'Search',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 },
 {
  id: 'bing-search-serp-results',
  label: 'SERP Results',
  channelId: 'bing-search',
  platformCategory: 'Discovery / Search',
  formatFamily: 'Search',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const AI_VISIBILITY_TYPES: ChannelTypeConfig[] = [
 {
  id: 'ai-visibility-json-integration',
  label: 'AI Backend JSON Integration',
  channelId: 'ai-visibility',
  platformCategory: 'Discovery / Search',
  formatFamily: 'Syndication',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

// ============================================================================
// SYNDICATION / AUTOMATION (3 types)
// ============================================================================

const RSS_TYPES: ChannelTypeConfig[] = [
 {
  id: 'rss-feed-endpoint',
  label: 'Feed Endpoint',
  channelId: 'rss-feeds',
  platformCategory: 'Syndication / Automation',
  formatFamily: 'Syndication',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const AGGREGATOR_TYPES: ChannelTypeConfig[] = [
 {
  id: 'aggregators-aggregated-feeds',
  label: 'Aggregated Feeds',
  channelId: 'content-aggregators',
  platformCategory: 'Syndication / Automation',
  formatFamily: 'Syndication',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

const API_TYPES: ChannelTypeConfig[] = [
 {
  id: 'api-knowledge-endpoints',
  label: 'Knowledge Endpoints',
  channelId: 'api-ai-fed',
  platformCategory: 'Syndication / Automation',
  formatFamily: 'Syndication',
  emphasis: 'Reach',
  defaultRole: 'Copy'
 }
];

// ============================================================================
// COMBINED EXPORTS
// ============================================================================

export const ALL_CHANNEL_TYPES: ChannelTypeConfig[] = [
 // Core / Owned Platform (7)
 ...WEBSITE_TYPES,
 ...WEBINAR_TYPES,
 // Writing / Publishing (12)
 ...MEDIUM_TYPES,
 ...SUBSTACK_TYPES,
 ...BEEHIIV_TYPES,
 ...GHOST_TYPES,
 ...HASHNODE_TYPES,
 ...NOTION_TYPES,
 // Social Distribution (30)
 ...LINKEDIN_TYPES,
 ...TWITTER_TYPES,
 ...INSTAGRAM_TYPES,
 ...FACEBOOK_TYPES,
 ...REDDIT_TYPES,
 ...THREADS_TYPES,
 ...QUORA_TYPES,
 ...BLUESKY_TYPES,
 ...MASTODON_TYPES,
 ...PINTEREST_TYPES,
...VK_TYPES,
 // Video Platform (7)
 ...YOUTUBE_TYPES,
 ...TIKTOK_TYPES,
 ...SNAPCHAT_TYPES,
 ...VIMEO_TYPES,
 // Audio / Podcast (12)
 ...SPOTIFY_TYPES,
 ...APPLE_PODCASTS_TYPES,
 ...AMAZON_AUDIBLE_TYPES,
 ...GOOGLE_PODCASTS_TYPES,
 ...PODBEAN_TYPES,
 ...SOUNDCLOUD_TYPES,
 // Community / Direct (10)
 ...EMAIL_TYPES,
 ...WHATSAPP_TYPES,
 ...TELEGRAM_TYPES,
 ...DISCORD_TYPES,
 ...SLACK_TYPES,
 // Discovery / Search (7)
 ...GOOGLE_SEARCH_TYPES,
 ...YOUTUBE_SEARCH_TYPES,
 ...PODCAST_DIRECTORIES_TYPES,
 ...BING_SEARCH_TYPES,
 ...AI_VISIBILITY_TYPES,
 // Syndication / Automation (3)
 ...RSS_TYPES,
 ...AGGREGATOR_TYPES,
 ...API_TYPES
];

// Helper functions
export const getChannelTypeById = (id: string): ChannelTypeConfig | undefined => {
 return ALL_CHANNEL_TYPES.find(ct => ct.id === id);
};

export const getChannelTypesByChannelId = (channelId: string): ChannelTypeConfig[] => {
 return ALL_CHANNEL_TYPES.filter(ct => ct.channelId === channelId);
};

export const getChannelTypesByPlatformCategory = (category: PlatformCategory): ChannelTypeConfig[] => {
 return ALL_CHANNEL_TYPES.filter(ct => ct.platformCategory === category);
};

export const getChannelTypesByFormatFamily = (formatFamily: ChannelFormatFamily): ChannelTypeConfig[] => {
 return ALL_CHANNEL_TYPES.filter(ct => ct.formatFamily === formatFamily);
};

export const getMasterChannelTypes = (): ChannelTypeConfig[] => {
 return ALL_CHANNEL_TYPES.filter(ct => ct.defaultRole === 'Master');
};

export const getCopyChannelTypes = (): ChannelTypeConfig[] => {
 return ALL_CHANNEL_TYPES.filter(ct => ct.defaultRole === 'Copy');
};

// Export individual category arrays for convenience
export {
 WEBSITE_TYPES,
 WEBINAR_TYPES,
 MEDIUM_TYPES,
 SUBSTACK_TYPES,
 BEEHIIV_TYPES,
 GHOST_TYPES,
 HASHNODE_TYPES,
 NOTION_TYPES,
 LINKEDIN_TYPES,
 TWITTER_TYPES,
 INSTAGRAM_TYPES,
 FACEBOOK_TYPES,
 REDDIT_TYPES,
 THREADS_TYPES,
 QUORA_TYPES,
 BLUESKY_TYPES,
 MASTODON_TYPES,
 PINTEREST_TYPES,
VK_TYPES,
 YOUTUBE_TYPES,
 TIKTOK_TYPES,
 SNAPCHAT_TYPES,
 VIMEO_TYPES,
 SPOTIFY_TYPES,
 APPLE_PODCASTS_TYPES,
 AMAZON_AUDIBLE_TYPES,
 GOOGLE_PODCASTS_TYPES,
 PODBEAN_TYPES,
 SOUNDCLOUD_TYPES,
 EMAIL_TYPES,
 WHATSAPP_TYPES,
 TELEGRAM_TYPES,
 DISCORD_TYPES,
 SLACK_TYPES,
 GOOGLE_SEARCH_TYPES,
 YOUTUBE_SEARCH_TYPES,
 PODCAST_DIRECTORIES_TYPES,
 BING_SEARCH_TYPES,
 AI_VISIBILITY_TYPES,
 RSS_TYPES,
 AGGREGATOR_TYPES,
 API_TYPES
};

