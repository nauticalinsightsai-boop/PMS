/** Minimal distribution types for channel catalog (from X1). */

export type PlatformCategory =
  | 'Core / Owned Platform'
  | 'Writing / Publishing'
  | 'Social Distribution'
  | 'Video Platform'
  | 'Audio / Podcast'
  | 'Community / Direct'
  | 'Discovery / Search'
  | 'Syndication / Automation';

export type ChannelLifecycle = 'Active' | 'Experimental' | 'Paused';

export type ChannelFormatFamily =
  | 'Newsletter'
  | 'Article'
  | 'Post'
  | 'Thread'
  | 'Video'
  | 'Short Video'
  | 'Podcast'
  | 'Audio'
  | 'Feed'
  | 'Story'
  | 'Page'
  | 'Documentation'
  | 'Listing'
  | 'Channel'
  | 'Community'
  | 'Search'
  | 'Syndication';

export type ChannelEmphasis = 'Reach' | 'Engagement' | 'Conversion';
export type ContentRole = 'Master' | 'Copy';

export type ChannelTypeConfig = {
  id: string;
  label: string;
  channelId: string;
  platformCategory: PlatformCategory;
  formatFamily: ChannelFormatFamily;
  deepLinkTemplate?: string;
  emphasis?: ChannelEmphasis;
  defaultRole?: ContentRole;
  playbook?: Record<string, unknown>;
};

export type Channel = {
  id: string;
  label: string;
  platformCategory: PlatformCategory;
  icon: string;
  color: string;
  lifecycle: ChannelLifecycle;
  typeIds: string[];
};

export type ChannelGroup = {
  platformCategory: PlatformCategory;
  channels: Channel[];
  isExpanded: boolean;
};
