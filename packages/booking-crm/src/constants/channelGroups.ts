// Channel Groups - Organized by Platform Category

import { Channel, PlatformCategory, ChannelGroup } from '../types/distribution';

// ============================================================================
// ALL CHANNELS
// ============================================================================

export const ALL_CHANNELS: Channel[] = [
 // Core / Owned Platform
 {
  id: 'website',
  label: 'Website',
  platformCategory: 'Core / Owned Platform',
  icon: 'Globe',
  color: '#003366',
  lifecycle: 'Active',
  typeIds: ['website-pages', 'website-newsletter', 'website-blog-posts', 'website-landing-pages', 'website-gated-content', 'website-knowledge-pages']
 },
 {
  id: 'webinar',
  label: 'Webinar',
  platformCategory: 'Core / Owned Platform',
  icon: 'Video',
  color: '#0A0A0A',
  lifecycle: 'Active',
  typeIds: ['webinar-live-session']
 },

 // Writing / Publishing
 {
  id: 'medium',
  label: 'Medium',
  platformCategory: 'Writing / Publishing',
  icon: 'BookOpen',
  color: '#000000',
  lifecycle: 'Active',
  typeIds: ['medium-publication', 'medium-article-feed']
 },
 {
  id: 'substack',
  label: 'Substack',
  platformCategory: 'Writing / Publishing',
  icon: 'Mail',
  color: '#FF6719',
  lifecycle: 'Active',
  typeIds: ['substack-posts', 'substack-newsletter', 'substack-notes']
 },
 {
  id: 'beehiiv',
  label: 'Beehiiv',
  platformCategory: 'Writing / Publishing',
  icon: 'Send',
  color: '#FFD700',
  lifecycle: 'Experimental',
  typeIds: ['beehiiv-newsletter', 'beehiiv-post-feed']
 },
 {
  id: 'ghost',
  label: 'Ghost',
  platformCategory: 'Writing / Publishing',
  icon: 'FileText',
  color: '#15171A',
  lifecycle: 'Paused',
  typeIds: ['ghost-blog-posts', 'ghost-newsletter']
 },
 {
  id: 'hashnode',
  label: 'Hashnode',
  platformCategory: 'Writing / Publishing',
  icon: 'Hash',
  color: '#2962FF',
  lifecycle: 'Paused',
  typeIds: ['hashnode-article-feed']
 },
 {
  id: 'notion-public',
  label: 'Notion',
  platformCategory: 'Writing / Publishing',
  icon: 'FileText',
  color: '#000000',
  lifecycle: 'Experimental',
  typeIds: ['notion-public-pages', 'notion-documentation']
 },

 // Social Distribution
 {
  id: 'linkedin',
  label: 'LinkedIn',
  platformCategory: 'Social Distribution',
  icon: 'Linkedin',
  color: '#0A66C2',
  lifecycle: 'Active',
  typeIds: ['linkedin-profile-feed', 'linkedin-company-page', 'linkedin-newsletter', 'linkedin-articles', 'linkedin-video']
 },
 {
  id: 'twitter',
  label: 'X',
  platformCategory: 'Social Distribution',
  icon: 'Twitter',
  color: '#000000',
  lifecycle: 'Active',
  typeIds: ['twitter-timeline', 'twitter-threads', 'twitter-replies']
 },
 {
  id: 'instagram',
  label: 'Instagram',
  platformCategory: 'Social Distribution',
  icon: 'Instagram',
  color: '#E4405F',
  lifecycle: 'Active',
  typeIds: ['instagram-feed', 'instagram-reels', 'instagram-stories', 'instagram-broadcast-channel']
 },
 {
  id: 'facebook',
  label: 'Facebook',
  platformCategory: 'Social Distribution',
  icon: 'Facebook',
  color: '#1877F2',
  lifecycle: 'Active',
  typeIds: ['facebook-profile', 'facebook-page', 'facebook-feed', 'facebook-groups']
 },
 {
  id: 'reddit',
  label: 'Reddit',
  platformCategory: 'Social Distribution',
  icon: 'MessageCircle',
  color: '#FF4500',
  lifecycle: 'Active',
  typeIds: ['reddit-subreddits', 'reddit-posts', 'reddit-comment-threads']
 },
 {
  id: 'threads',
  label: 'Threads',
  platformCategory: 'Social Distribution',
  icon: 'AtSign',
  color: '#000000',
  lifecycle: 'Experimental',
  typeIds: ['threads-feed', 'threads-threaded-posts']
 },
 {
  id: 'quora',
  label: 'Quora',
  platformCategory: 'Social Distribution',
  icon: 'HelpCircle',
  color: '#B92B27',
  lifecycle: 'Active',
  typeIds: ['quora-questions', 'quora-answers']
 },
 {
  id: 'bluesky',
  label: 'Bluesky',
  platformCategory: 'Social Distribution',
  icon: 'Cloud',
  color: '#0085FF',
  lifecycle: 'Experimental',
  typeIds: ['bluesky-feed', 'bluesky-threads']
 },
 {
  id: 'mastodon',
  label: 'Mastodon',
  platformCategory: 'Social Distribution',
  icon: 'Globe',
  color: '#6364FF',
  lifecycle: 'Experimental',
  typeIds: ['mastodon-federated-feed', 'mastodon-threads']
 },
 {
  id: 'pinterest',
  label: 'Pinterest',
  platformCategory: 'Social Distribution',
  icon: 'Image',
  color: '#E60023',
  lifecycle: 'Paused',
  typeIds: ['pinterest-pins-boards']
 },
 {
  id: 'vk',
  label: 'VK',
  platformCategory: 'Social Distribution',
  icon: 'Share2',
  color: '#0077FF',
  lifecycle: 'Experimental',
  typeIds: ['vk-feed', 'vk-communities']
 },

 // Video Platform
 {
  id: 'youtube',
  label: 'YouTube',
  platformCategory: 'Video Platform',
  icon: 'Youtube',
  color: '#FF0000',
  lifecycle: 'Active',
  typeIds: ['youtube-channel', 'youtube-long-form-video', 'youtube-shorts']
 },
 {
  id: 'tiktok',
  label: 'TikTok',
  platformCategory: 'Video Platform',
  icon: 'Video',
  color: '#000000',
  lifecycle: 'Experimental',
  typeIds: ['tiktok-video-feed']
 },
 {
  id: 'snapchat',
  label: 'Snapchat',
  platformCategory: 'Video Platform',
  icon: 'Ghost',
  color: '#FFFC00',
  lifecycle: 'Paused',
  typeIds: ['snapchat-story-feed']
 },
 {
  id: 'vimeo',
  label: 'Vimeo',
  platformCategory: 'Video Platform',
  icon: 'Video',
  color: '#1AB7EA',
  lifecycle: 'Paused',
  typeIds: ['vimeo-channel', 'vimeo-video-showcase']
 },

 // Audio / Podcast
 {
  id: 'spotify',
  label: 'Spotify',
  platformCategory: 'Audio / Podcast',
  icon: 'Music',
  color: '#1DB954',
  lifecycle: 'Active',
  typeIds: ['spotify-podcast-listing', 'spotify-episode-feed']
 },
 {
  id: 'apple-podcasts',
  label: 'Apple Podcasts',
  platformCategory: 'Audio / Podcast',
  icon: 'Podcast',
  color: '#9933CC',
  lifecycle: 'Active',
  typeIds: ['apple-podcasts-podcast-listing', 'apple-podcasts-episode-feed']
 },
 {
  id: 'amazon-audible',
  label: 'Amazon Music / Audible',
  platformCategory: 'Audio / Podcast',
  icon: 'Headphones',
  color: '#FF9900',
  lifecycle: 'Experimental',
  typeIds: ['amazon-audible-podcast-listing', 'amazon-audible-episode-feed']
 },
 {
  id: 'google-podcasts',
  label: 'Google Podcasts',
  platformCategory: 'Audio / Podcast',
  icon: 'Podcast',
  color: '#4285F4',
  lifecycle: 'Paused',
  typeIds: ['google-podcasts-podcast-listing', 'google-podcasts-episode-feed']
 },
 {
  id: 'podbean',
  label: 'Podbean',
  platformCategory: 'Audio / Podcast',
  icon: 'Radio',
  color: '#8BC34A',
  lifecycle: 'Experimental',
  typeIds: ['podbean-podcast-hosting', 'podbean-episode-feed']
 },
 {
  id: 'soundcloud',
  label: 'SoundCloud',
  platformCategory: 'Audio / Podcast',
  icon: 'CloudRain',
  color: '#FF5500',
  lifecycle: 'Paused',
  typeIds: ['soundcloud-audio-stream-feed']
 },

 // Community / Direct
 {
  id: 'email',
  label: 'Email',
  platformCategory: 'Community / Direct',
  icon: 'Mail',
  color: '#4A90A4',
  lifecycle: 'Active',
  typeIds: ['email-mailing-list', 'email-inbox-delivery']
 },
 {
  id: 'whatsapp',
  label: 'WhatsApp Channels',
  platformCategory: 'Community / Direct',
  icon: 'MessageSquare',
  color: '#25D366',
  lifecycle: 'Experimental',
  typeIds: ['whatsapp-broadcast-channel']
 },
 {
  id: 'telegram',
  label: 'Telegram',
  platformCategory: 'Community / Direct',
  icon: 'Send',
  color: '#0088CC',
  lifecycle: 'Active',
  typeIds: ['telegram-channels', 'telegram-groups']
 },
 {
  id: 'discord',
  label: 'Discord',
  platformCategory: 'Community / Direct',
  icon: 'MessageCircle',
  color: '#5865F2',
  lifecycle: 'Active',
  typeIds: ['discord-server', 'discord-channels', 'discord-threads']
 },
 {
  id: 'slack',
  label: 'Slack',
  platformCategory: 'Community / Direct',
  icon: 'Hash',
  color: '#4A154B',
  lifecycle: 'Paused',
  typeIds: ['slack-workspace', 'slack-private-channels']
 },

 // Discovery / Search
 {
  id: 'google-search',
  label: 'Google Search',
  platformCategory: 'Discovery / Search',
  icon: 'Search',
  color: '#4285F4',
  lifecycle: 'Active',
  typeIds: ['google-search-indexed-pages', 'google-search-serp-results']
 },
 {
  id: 'youtube-search',
  label: 'YouTube Search',
  platformCategory: 'Discovery / Search',
  icon: 'Search',
  color: '#FF0000',
  lifecycle: 'Active',
  typeIds: ['youtube-search-video-results']
 },
 {
  id: 'podcast-directories',
  label: 'Podcast Directories',
  platformCategory: 'Discovery / Search',
  icon: 'List',
  color: '#6B7280',
  lifecycle: 'Active',
  typeIds: ['podcast-directories-listings']
 },
 {
  id: 'bing-search',
  label: 'Bing Search',
  platformCategory: 'Discovery / Search',
  icon: 'Search',
  color: '#008373',
  lifecycle: 'Experimental',
  typeIds: ['bing-search-indexed-pages', 'bing-search-serp-results']
 },
 {
  id: 'ai-visibility',
  label: 'AI Visibility',
  platformCategory: 'Discovery / Search',
  icon: 'Bot',
  color: '#8B5CF6',
  lifecycle: 'Experimental',
  typeIds: ['ai-visibility-json-integration']
 },

 // Syndication / Automation
 {
  id: 'rss-feeds',
  label: 'RSS Feeds',
  platformCategory: 'Syndication / Automation',
  icon: 'Rss',
  color: '#F26522',
  lifecycle: 'Active',
  typeIds: ['rss-feed-endpoint']
 },
 {
  id: 'content-aggregators',
  label: 'Content Aggregators',
  platformCategory: 'Syndication / Automation',
  icon: 'Layers',
  color: '#6B7280',
  lifecycle: 'Experimental',
  typeIds: ['aggregators-aggregated-feeds']
 },
 {
  id: 'api-ai-fed',
  label: 'API / AI-fed Systems',
  platformCategory: 'Syndication / Automation',
  icon: 'Code',
  color: '#10B981',
  lifecycle: 'Experimental',
  typeIds: ['api-knowledge-endpoints']
 }
];

// ============================================================================
// PLATFORM CATEGORY DEFINITIONS
// ============================================================================

export const PLATFORM_CATEGORIES: PlatformCategory[] = [
 'Core / Owned Platform',
 'Writing / Publishing',
 'Social Distribution',
 'Video Platform',
 'Audio / Podcast',
 'Community / Direct',
 'Discovery / Search',
 'Syndication / Automation'
];

export const PLATFORM_CATEGORY_COLORS: Record<PlatformCategory, string> = {
 'Core / Owned Platform': '#003366',
 'Writing / Publishing': '#10B981',
 'Social Distribution': '#3B82F6',
 'Video Platform': '#EF4444',
 'Audio / Podcast': '#8B5CF6',
 'Community / Direct': '#F59E0B',
 'Discovery / Search': '#6366F1',
 'Syndication / Automation': '#6B7280'
};

export const PLATFORM_CATEGORY_ICONS: Record<PlatformCategory, string> = {
 'Core / Owned Platform': 'Globe',
 'Writing / Publishing': 'FileText',
 'Social Distribution': 'Share2',
 'Video Platform': 'Video',
 'Audio / Podcast': 'Headphones',
 'Community / Direct': 'Users',
 'Discovery / Search': 'Search',
 'Syndication / Automation': 'Rss'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getChannelById = (id: string): Channel | undefined => {
 return ALL_CHANNELS.find(c => c.id === id);
};

export const getChannelsByPlatformCategory = (category: PlatformCategory): Channel[] => {
 return ALL_CHANNELS.filter(c => c.platformCategory === category);
};

export const getActiveChannels = (): Channel[] => {
 return ALL_CHANNELS.filter(c => c.lifecycle === 'Active');
};

export const getChannelGroups = (): ChannelGroup[] => {
 return PLATFORM_CATEGORIES.map(category => ({
  platformCategory: category,
  channels: getChannelsByPlatformCategory(category),
  isExpanded: false
 }));
};

export const getChannelLabel = (id: string): string => {
 const channel = getChannelById(id);
 return channel?.label || id;
};

export const getChannelColor = (id: string): string => {
 const channel = getChannelById(id);
 return channel?.color || '#6B7280';
};

