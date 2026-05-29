/**
 * Per-channel portal copy — every scheduleTierCta and targetMessage must be unique.
 * Persona: qualification-first, evidence-led, no hype (see docs/voice/PORTAL_COPY_RULES.md).
 */
import { ALL_CHANNELS } from '../constants/channelGroups'

export type ChannelPortalCopy = {
  scheduleTierCta: string
  contextLabel: string
  headline: string
  subheadline: string
  targetMessage: string
  availabilityLabel: string
  schedulingTitle?: string
  schedulingBody?: string
  heroCardTitle?: string
  heroCardBody?: string
  /** One line under tier heading — strategic booking hint (not the button label). */
  tierSchedulingLine?: string
}

/** Per-channel tier intro line (shown under “Pick a session” / “Select consultation tier”). */
export const TIER_SCHEDULING_LINES: Record<string, string> = {
  webinar:
    'Free mentor intro or paid pathway session. Cite the webinar title or replay in your booking note.',
  website:
    'Book mentor time for certification fit and prep. Cite the site page or asset when you reserve.',
  medium: 'Turn the Medium piece into defense, audit, or strategy time. Reference the article in your note.',
  substack:
    'Continue the newsletter thread in a live block. Cite the post or issue when you book.',
  beehiiv: 'Move from inbox to principal advisory. Align publication cadence with delivery capacity.',
  ghost: 'Go beyond the post. Align publication themes with engineering and program reality.',
  hashnode: 'Stress-test architecture and API choices from what you read. Link the article when you book.',
  'notion-public': 'Translate docs into scoped decisions. Name the Notion page or view in your booking note.',
  linkedin: 'Executive strategy and sponsor-ready next steps. Reference your LinkedIn context when you book.',
  twitter: 'Expand a thread into structured guidance. Drop the post URL or topic in your note.',
  instagram: 'Lock discovery or deep-dive time. Name the reel, story, or post when you reserve.',
  facebook: 'Book from feed or group context. Share which post or group applies.',
  reddit: 'Move from thread debate to a qualified call. Link the subreddit thread you came from.',
  threads: 'Continue from Threads without losing context. Mention the post that prompted this booking.',
  quora: 'Deepen the answer into structured advisory. Cite the Quora question or answer URL.',
  bluesky: 'Book a focused block from the open network. Mention the post or thread that referred you.',
  mastodon: 'Fediverse referral to principal time. Include your instance and the referring post.',
  pinterest: 'Align visual research with delivery decisions. Note which pin or board led you here.',
  youtube: 'Go deeper than the video. Name the channel video or series when you reserve.',
  tiktok: 'Book rigor the clip cannot hold. Drop the TikTok link or hook in your booking note.',
  snapchat: 'Reserve fast without leaving the flow. Tell us which Snap or story you came from.',
  vimeo: 'Professional showcase to advisory depth. Reference the Vimeo title you watched.',
  spotify: 'Translate the episode into scoped guidance. Name the episode when you book.',
  'apple-podcasts': 'Listener depth after Apple Podcasts. Cite the show or episode in your note.',
  'amazon-audible': 'Audible listener follow-up. Which title or episode referred you?',
  'google-podcasts': 'Feed discovery to principal time. Share the episode link if you have it.',
  podbean: 'Host-feed listeners. Reference the Podbean episode when you reserve.',
  soundcloud: 'From stream to structured guidance. Link the track or playlist you came from.',
  email: 'Inbox CTA to booked block. Note the email subject or campaign in your booking note.',
  whatsapp: 'Channel broadcast to calendar. Mention the message or broadcast you saw.',
  telegram: 'Telegram channel to live advisory. Which channel post referred you?',
  discord: 'Server or thread referral. Name the channel or thread that linked you here.',
  slack: 'Workspace referral with context intact. Which channel or workspace prompted this?',
  'google-search': 'Honor search intent. State the query or result that brought you here.',
  'youtube-search': 'YouTube SERP to live session. Which search result did you click?',
  'podcast-directories': 'Directory discovery to advisory. Which listing referred you?',
  'bing-search': 'Bing search to qualified call. Share the query or snippet that matched your need.',
  'ai-visibility': 'Verify AI-surfaced fit in a human block. Note the prompt or surface if known.',
  'rss-feeds': 'Syndicated feed to principal time. Cite the feed item or enclosure you read.',
  'content-aggregators': 'Aggregator bundle to advisory. Name the bundle or source that linked you.',
  'api-ai-fed': 'Machine-surfaced referral. Book human verification; name the API consumer if known.',
}

/** Hero scheduling card (shown on every /go/* portal). */
export const HERO_CARD_BY_CHANNEL: Record<
  string,
  { heroCardTitle: string; heroCardBody: string }
> = {
  webinar: {
    heroCardTitle: 'Talk to a mentor after the briefing',
    heroCardBody:
      'Watch the webinar overview, then book a free mentor intro or a paid pathway session. Certification guidance from Project Management Structure.',
  },
  website: {
    heroCardTitle: 'Site-native consultation booking',
    heroCardBody:
      'Principal advisory for projects, deliverables, and execution. Booked from pages and assets on this site.',
  },
  medium: {
    heroCardTitle: 'Publication-to-session booking',
    heroCardBody:
      'Turn Medium reading into defense, audit, or strategy time with evidence-led principal advisory.',
  },
  substack: {
    heroCardTitle: 'Newsletter-to-live-call',
    heroCardBody: 'Continue the Substack thread in a structured working session. Cite the issue when you book.',
  },
  beehiiv: {
    heroCardTitle: 'Inbox-to-calendar',
    heroCardBody: 'Beehiiv readers. Align newsletter cadence with delivery and program reality.',
  },
  ghost: {
    heroCardTitle: 'Post-to-principal-session',
    heroCardBody: 'Ghost subscribers. Schedule depth beyond the post with engineering-aware guidance.',
  },
  hashnode: {
    heroCardTitle: 'Dev-feed scheduling',
    heroCardBody: 'Hashnode readers. Stress-test architecture and API claims in a booked block.',
  },
  'notion-public': {
    heroCardTitle: 'Docs-to-decision',
    heroCardBody: 'Notion readers. Translate documentation into scoped, executable next steps.',
  },
  linkedin: {
    heroCardTitle: 'LinkedIn-native strategy blocks',
    heroCardBody: 'Executive strategy and feasibility for LinkedIn professional referrals.',
  },
  twitter: {
    heroCardTitle: 'Thread-to-call',
    heroCardBody: 'Expand X posts into structured advisory. Drop the thread URL in your note.',
  },
  instagram: {
    heroCardTitle: 'Stories · Reels · Feed',
    heroCardBody: 'Turn Instagram engagement into discovery or deep-dive principal time.',
  },
  facebook: {
    heroCardTitle: 'Facebook booking portal',
    heroCardBody: 'Coordinate advisory for connections from pages, groups, and feed.',
  },
  reddit: {
    heroCardTitle: 'Thread-to-qualified-call',
    heroCardBody: 'Move subreddit debate into sponsor-ready technical and program judgment.',
  },
  threads: {
    heroCardTitle: 'Threads-to-calendar',
    heroCardBody: 'Continue Meta Threads context in a live advisory block.',
  },
  quora: {
    heroCardTitle: 'Answer-led booking',
    heroCardBody: 'Deepen Quora Q&A into structured guidance with principal rigor.',
  },
  bluesky: {
    heroCardTitle: 'Sky-open scheduling',
    heroCardBody: 'Real-time booking for readers arriving from Bluesky posts and threads.',
  },
  mastodon: {
    heroCardTitle: 'Fediverse scheduling',
    heroCardBody: 'Book principal time from your instance with post context intact.',
  },
  pinterest: {
    heroCardTitle: 'Pin-to-advisory',
    heroCardBody: 'Align visual research with delivery and program decisions.',
  },
  vk: {
    heroCardTitle: 'VK community booking',
    heroCardBody: 'Readers from VK communities and feeds. Book with post context.',
  },
  youtube: {
    heroCardTitle: 'Creator & sponsor calls',
    heroCardBody: 'Long-form and Shorts viewers. Schedule depth beyond the video.',
  },
  tiktok: {
    heroCardTitle: 'Beyond the clip. Real talk',
    heroCardBody: 'Video viewers. Book rigor the clip cannot provide.',
  },
  snapchat: {
    heroCardTitle: 'Snap-to-book',
    heroCardBody: 'Fast booking for story and Snap referrals without losing momentum.',
  },
  vimeo: {
    heroCardTitle: 'Showcase-to-session',
    heroCardBody: 'Vimeo viewers. Principal time after curated professional video.',
  },
  spotify: {
    heroCardTitle: 'Episode-to-action',
    heroCardBody: 'Listener sessions that translate podcast themes into scoped decisions.',
  },
  'apple-podcasts': {
    heroCardTitle: 'Listener scheduling',
    heroCardBody: 'Apple Podcasts listeners. Cite the show or episode when you reserve.',
  },
  'amazon-audible': {
    heroCardTitle: 'Audible follow-up',
    heroCardBody: 'Book depth after Audible or Amazon Music podcast discovery.',
  },
  'google-podcasts': {
    heroCardTitle: 'Feed-to-call',
    heroCardBody: 'Google Podcasts discovery. Align episode topics with your initiative.',
  },
  podbean: {
    heroCardTitle: 'Host-feed booking',
    heroCardBody: 'Podbean listeners. Reference the episode in your booking note.',
  },
  soundcloud: {
    heroCardTitle: 'Stream-to-session',
    heroCardBody: 'SoundCloud referrals. Structured guidance after playback.',
  },
  email: {
    heroCardTitle: 'Inbox-to-calendar',
    heroCardBody: 'Email list readers. Book from the campaign or subject that brought you here.',
  },
  whatsapp: {
    heroCardTitle: 'Channel-to-calendar',
    heroCardBody: 'WhatsApp channel followers. Reserve without losing broadcast context.',
  },
  telegram: {
    heroCardTitle: 'Telegram scheduling',
    heroCardBody: 'Channel and group referrals. Live advisory from Telegram context.',
  },
  discord: {
    heroCardTitle: 'Server scheduling',
    heroCardBody: 'Discord members. Book principal time from server or thread links.',
  },
  slack: {
    heroCardTitle: 'Workspace booking',
    heroCardBody: 'Slack referrals. Advisory with workspace context preserved.',
  },
  'google-search': {
    heroCardTitle: 'Search-intent scheduling',
    heroCardBody: 'Honor the query that brought you here. No generic overview calls.',
  },
  'youtube-search': {
    heroCardTitle: 'SERP-to-session',
    heroCardBody: 'YouTube search referrals. Book after the result you clicked.',
  },
  'podcast-directories': {
    heroCardTitle: 'Directory scheduling',
    heroCardBody: 'Podcast directory discovery. Align listings with program needs.',
  },
  'bing-search': {
    heroCardTitle: 'Bing-intent booking',
    heroCardBody: 'Bing SERP referrals. State the query that matched your need.',
  },
  'ai-visibility': {
    heroCardTitle: 'Human verification calls',
    heroCardBody: 'AI-surfaced referrals. Verify fit in a principal-led session.',
  },
  'rss-feeds': {
    heroCardTitle: 'Feed subscriber booking',
    heroCardBody: 'RSS readers. Cite the feed item you read before reserving.',
  },
  'content-aggregators': {
    heroCardTitle: 'Aggregator scheduling',
    heroCardBody: 'Syndicated bundles. Book advisory aligned to the source you clicked.',
  },
  'api-ai-fed': {
    heroCardTitle: 'Syndicated API booking',
    heroCardBody: 'API and AI-fed referrals. Human review of machine-surfaced expertise.',
  },
}

const GENERIC_STORED_SCHEDULE_CTAS = new Set([
  'schedule inline',
  'schedule consultation',
  'schedule online',
  'book a call',
  'book a session',
])

/** Authoritative copy packs. One row per active channel. */
export const CHANNEL_PORTAL_COPY: Record<string, ChannelPortalCopy> = {
  website: {
    scheduleTierCta: 'Talk to a mentor',
    contextLabel: 'OWNED WEB PROPERTY',
    headline: 'PM Structure: certification and career guidance',
    subheadline:
      'Request advisory or a discovery call. Book a free mentor intro or a paid pathway session.',
    targetMessage: 'Name the page or asset you came from so we align the session to your intent.',
    availabilityLabel: 'Mentor sessions open',
    schedulingTitle: 'Book a session',
    heroCardTitle: 'Site-native consultation booking',
    heroCardBody:
      'Principal advisory for projects, deliverables, and execution. Booked from pages and assets on this site.',
  },
  webinar: {
    scheduleTierCta: 'Talk to a mentor',
    contextLabel: 'WEBINAR REGISTRATION',
    headline: 'PM Structure. Webinar to mentor call',
    subheadline:
      'Watch the briefing, see which certifications we cover, then book a free mentor intro or a paid pathway session.',
    targetMessage:
      'Name the webinar title or replay when you book so we align the session to what you watched.',
    availabilityLabel: 'Free & paid webinar seats open',
    schedulingTitle: 'Choose your session type',
    tierSchedulingLine:
      'Two options only. Free intro session or paid working session. Cite the webinar when you reserve.',
  },
  medium: {
    scheduleTierCta: 'Continue from the article',
    contextLabel: 'MEDIUM PUBLICATION REFERRAL',
    headline: 'Nautical & systems advisory after Medium',
    subheadline: 'Readers moving from long-form posts to structured defense or audit time.',
    targetMessage: 'Book an academic defense or peer audit of concepts from the article you read.',
    availabilityLabel: 'Free discovery & mentorship open',
    schedulingTitle: 'Turn reading into a booked block',
  },
  substack: {
    scheduleTierCta: 'Book the live call',
    contextLabel: 'SUBSTACK REFERRAL',
    headline: 'From Substack to a live call',
    subheadline: 'Posts, notes, or newsletter. Continue the thread in a working session.',
    targetMessage:
      'Turn the Substack post or issue you read into a concrete feasibility, design, or publication decision. Cite it when you book.',
    availabilityLabel: 'Free discovery available',
  },
  beehiiv: {
    scheduleTierCta: 'Claim a Beehiiv slot',
    contextLabel: 'BEEHIIV REFERRAL',
    headline: 'Book after your Beehiiv read',
    subheadline: 'Inbox and post-feed readers. Move from subscription to principal advisory.',
    targetMessage: 'You clicked through on Beehiiv. Book time to align publication strategy with delivery reality.',
    availabilityLabel: 'Discovery open · paid tiers below',
  },
  ghost: {
    scheduleTierCta: 'Continue after the post',
    contextLabel: 'GHOST REFERRAL',
    headline: 'Principal session after Ghost',
    subheadline: 'Blog or newsletter subscribers. Schedule depth beyond the post.',
    targetMessage: 'Arrived from Ghost. Align publication themes with engineering and program delivery.',
    availabilityLabel: 'Mentorship & executive slots open',
  },
  hashnode: {
    scheduleTierCta: 'Ship the architecture call',
    contextLabel: 'HASHNODE REFERRAL',
    headline: 'Engineering advisory after Hashnode',
    subheadline: 'Developer readers. Book rigor on architecture, APIs, or delivery claims from the feed.',
    targetMessage: 'Reference the Hashnode article or series when you reserve a tier below.',
    availabilityLabel: 'Technical discovery open',
  },
  'notion-public': {
    scheduleTierCta: 'Book from Notion',
    contextLabel: 'NOTION PUBLIC REFERRAL',
    headline: 'Advisory after Notion documentation',
    subheadline: 'Wiki and public-page readers. Translate docs into scoped decisions.',
    targetMessage: 'Share which Notion page or database view prompted this booking.',
    availabilityLabel: 'Documentation-aligned sessions',
  },
  linkedin: {
    scheduleTierCta: 'Reserve executive time',
    contextLabel: 'LINKEDIN PROFESSIONAL REFERRAL',
    headline: 'Executive advisory from LinkedIn',
    subheadline: 'Structured consultation for sponsors and leaders who found this via your network.',
    targetMessage: 'Reference your LinkedIn connection context or article when booking.',
    availabilityLabel: 'Accepting executive strategy calls',
    schedulingTitle: 'Executive scheduling',
  },
  twitter: {
    scheduleTierCta: 'Expand the thread',
    contextLabel: 'X / TWITTER REFERRAL',
    headline: 'Working session after your post',
    subheadline: 'Thread, reply, or timeline referral. Expand a post into a working session.',
    targetMessage: 'Drop the post URL or thread topic in your booking note.',
    availabilityLabel: 'Discovery calls open',
  },
  instagram: {
    scheduleTierCta: 'Reserve your slot',
    contextLabel: 'INSTAGRAM REFERRAL',
    headline: 'Reels, stories, feed. Principal time',
    subheadline: 'You followed a link from Instagram. Lock discovery or a deep-dive block below.',
    targetMessage: 'Name the reel, story, or post that sent you here so we match the session.',
    availabilityLabel: 'DM follow-up after booking',
    schedulingTitle: 'Pick your session',
  },
  facebook: {
    scheduleTierCta: 'Reserve feed follow-up',
    contextLabel: 'FACEBOOK REFERRAL',
    headline: 'Live advisory from your feed',
    subheadline: 'Page followers, group members, and feed connections. Lock a call from the feed.',
    targetMessage: 'Share which Facebook post or group context applies to your request.',
    availabilityLabel: 'Messenger & calendar sync available',
  },
  reddit: {
    scheduleTierCta: 'Book thread time',
    contextLabel: 'REDDIT REFERRAL',
    headline: 'Advisory after Reddit discussion',
    subheadline: 'Subreddit or comment thread. Move from debate to a qualified call.',
    targetMessage: 'Link the subreddit thread or comment that brought you here.',
    availabilityLabel: 'Community referral slots',
  },
  threads: {
    scheduleTierCta: 'Continue to calendar',
    contextLabel: 'THREADS REFERRAL',
    headline: 'Continue from Threads in a booked block',
    subheadline: 'Feed or threaded post. Book time without losing context from Meta Threads.',
    targetMessage: 'Mention the Threads post that prompted this booking.',
    availabilityLabel: 'Short-form referral open',
  },
  quora: {
    scheduleTierCta: 'Deepen the answer',
    contextLabel: 'QUORA REFERRAL',
    headline: 'Answer-led advisory after Quora',
    subheadline: 'Question or answer referral. Deepen Q&A into structured guidance.',
    targetMessage: 'Cite the Quora question or answer URL when you schedule.',
    availabilityLabel: 'Q&A follow-up sessions',
  },
  bluesky: {
    scheduleTierCta: 'Reserve on Bluesky',
    contextLabel: 'OPEN SKY REFERRAL',
    headline: 'Continue the conversation from Bluesky',
    subheadline: 'Posts, threads, and replies. Book a focused advisory block from the open network.',
    targetMessage: 'Mention the Bluesky post or thread that brought you here when you book.',
    availabilityLabel: 'Open for discovery calls',
  },
  mastodon: {
    scheduleTierCta: 'Fediverse booking',
    contextLabel: 'MASTODON FEDERATED REFERRAL',
    headline: 'Federated feed to live advisory',
    subheadline: 'Instance or thread referral. Book principal time from the fediverse.',
    targetMessage: 'Include your instance and the post that referred you.',
    availabilityLabel: 'Federated referral slots',
  },
  pinterest: {
    scheduleTierCta: 'Book from your pin',
    contextLabel: 'PINTEREST REFERRAL',
    headline: 'Visual discovery to advisory call',
    subheadline: 'Pin or board referral. Align visual research with delivery decisions.',
    targetMessage: 'Which pin or board led you to book?',
    availabilityLabel: 'Visual-referral sessions',
  },
  vk: {
    scheduleTierCta: 'Book from VK',
    contextLabel: 'VK REFERRAL',
    headline: 'Advisory after VK',
    subheadline: 'Community or feed referral. Book principal time from your VK source.',
    targetMessage: 'Name the VK community, post, or feed that referred you.',
    availabilityLabel: 'VK referral sessions',
  },
  youtube: {
    scheduleTierCta: 'Beyond the video',
    contextLabel: 'YOUTUBE REFERRAL',
    headline: 'Book after watching on YouTube',
    subheadline: 'Channel, long-form, or Shorts. Go deeper than the video allows.',
    targetMessage: 'Which video or series prompted this booking?',
    availabilityLabel: 'Creator & sponsor sessions',
  },
  tiktok: {
    scheduleTierCta: 'Beyond the clip',
    contextLabel: 'TIKTOK VIDEO REFERRAL',
    headline: 'Structured advisory after the clip',
    subheadline: 'For You or profile link. Reserve depth the video cannot cover.',
    targetMessage: 'Drop the TikTok link or hook that sent you here.',
    availabilityLabel: 'Quick discovery open',
    schedulingTitle: 'Pick a live block',
  },
  snapchat: {
    scheduleTierCta: 'Snap your slot',
    contextLabel: 'SNAPCHAT REFERRAL',
    headline: 'Quick booking from Snapchat',
    subheadline: 'Story or swipe-up brought you here. Reserve without leaving the flow.',
    targetMessage: 'Tell us which Snap or story you came from.',
    availabilityLabel: 'Fast slots · mentorship open',
  },
  vimeo: {
    scheduleTierCta: 'After the showcase',
    contextLabel: 'VIMEO REFERRAL',
    headline: 'Professional video to advisory',
    subheadline: 'Showcase or channel referral. Book depth after curated video.',
    targetMessage: 'Reference the Vimeo title or showcase you watched.',
    availabilityLabel: 'Showcase referral open',
  },
  spotify: {
    scheduleTierCta: 'After the episode',
    contextLabel: 'SPOTIFY PODCAST REFERRAL',
    headline: 'Listener advisory after Spotify',
    subheadline: 'Episode feed listeners. Translate audio themes into scoped calls.',
    targetMessage: 'Name the episode that prompted this booking.',
    availabilityLabel: 'Listener sessions open',
  },
  'apple-podcasts': {
    scheduleTierCta: 'Listener slot',
    contextLabel: 'APPLE PODCASTS REFERRAL',
    headline: 'Live depth for podcast listeners',
    subheadline: 'iOS listeners. Continue the show in a principal advisory block.',
    targetMessage: 'Cite the Apple Podcasts episode or show title.',
    availabilityLabel: 'Podcast listener slots',
  },
  'amazon-audible': {
    scheduleTierCta: 'After Audible',
    contextLabel: 'AUDIBLE / AMAZON MUSIC REFERRAL',
    headline: 'Audible listener to live call',
    subheadline: 'Audible or Amazon Music podcast referral. Book follow-up depth.',
    targetMessage: 'Which Audible title or episode referred you?',
    availabilityLabel: 'Audible referral open',
  },
  'google-podcasts': {
    scheduleTierCta: 'Episode slot',
    contextLabel: 'GOOGLE PODCASTS REFERRAL',
    headline: 'Principal time from your episode',
    subheadline: 'Feed discovery. Align episode topics with your initiative.',
    targetMessage: 'Share the Google Podcasts episode link if you have it.',
    availabilityLabel: 'Feed referral sessions',
  },
  podbean: {
    scheduleTierCta: 'Host episode slot',
    contextLabel: 'PODBEAN REFERRAL',
    headline: 'Podbean host feed to advisory',
    subheadline: 'Hosted episode listeners. Book principal time from Podbean.',
    targetMessage: 'Which Podbean episode should we reference?',
    availabilityLabel: 'Host-feed bookings',
  },
  soundcloud: {
    scheduleTierCta: 'After the track',
    contextLabel: 'SOUNDCLOUD REFERRAL',
    headline: 'Audio stream to advisory call',
    subheadline: 'Stream or track referral. Move from playback to structured guidance.',
    targetMessage: 'Link the SoundCloud track or playlist you came from.',
    availabilityLabel: 'Stream referral open',
  },
  email: {
    scheduleTierCta: 'Reply & book',
    contextLabel: 'EMAIL LIST REFERRAL',
    headline: 'Inbox to booked advisory',
    subheadline: 'Mailing-list readers. Reserve a block after the email CTA.',
    targetMessage: 'Note the email subject or campaign that brought you here.',
    availabilityLabel: 'List-member sessions',
  },
  whatsapp: {
    scheduleTierCta: 'Book on WhatsApp',
    contextLabel: 'WHATSAPP CHANNEL REFERRAL',
    headline: 'WhatsApp channel to calendar',
    subheadline: 'Broadcast channel followers. Book without losing channel context.',
    targetMessage: 'Mention the WhatsApp broadcast or message you saw.',
    availabilityLabel: 'Channel booking open',
  },
  telegram: {
    scheduleTierCta: 'Telegram slot',
    contextLabel: 'TELEGRAM REFERRAL',
    headline: 'Telegram channel to live call',
    subheadline: 'Channel or group referral. Lock advisory time from Telegram.',
    targetMessage: 'Which Telegram channel post referred you?',
    availabilityLabel: 'Telegram referral slots',
  },
  discord: {
    scheduleTierCta: 'Server calendar',
    contextLabel: 'DISCORD SERVER REFERRAL',
    headline: 'Server member advisory booking',
    subheadline: 'Discord server or thread. Book principal time from the community.',
    targetMessage: 'Name the server channel or thread that linked you here.',
    availabilityLabel: 'Community member sessions',
  },
  slack: {
    scheduleTierCta: 'Workspace slot',
    contextLabel: 'SLACK WORKSPACE REFERRAL',
    headline: 'Workspace referral to advisory',
    subheadline: 'Private channel or workspace link. Reserve with Slack context intact.',
    targetMessage: 'Which Slack workspace or channel prompted this?',
    availabilityLabel: 'Workspace referral open',
  },
  'google-search': {
    scheduleTierCta: 'Match search intent',
    contextLabel: 'GOOGLE SEARCH REFERRAL',
    headline: 'Search-intent advisory booking',
    subheadline: 'You found this via Google. Clarify the problem before committing further.',
    targetMessage: 'What query or result page led you here?',
    availabilityLabel: 'Search-intent discovery',
  },
  'youtube-search': {
    scheduleTierCta: 'Book your session',
    contextLabel: 'YOUTUBE SEARCH REFERRAL',
    headline: 'YouTube SERP to live session',
    subheadline: 'Search results referral. Book after discovering video content.',
    targetMessage: 'Which YouTube search result did you click?',
    availabilityLabel: 'Video SERP referrals',
  },
  'podcast-directories': {
    scheduleTierCta: 'Directory slot',
    contextLabel: 'PODCAST DIRECTORY REFERRAL',
    headline: 'Directory listing to advisory',
    subheadline: 'Podcast directory discovery. Align show topics with your program.',
    targetMessage: 'Which directory listing referred you?',
    availabilityLabel: 'Directory referral slots',
  },
  'bing-search': {
    scheduleTierCta: 'Book from Bing',
    contextLabel: 'BING SEARCH REFERRAL',
    headline: 'Bing search to qualified call',
    subheadline: 'Bing SERP referral. State the query that matched your need.',
    targetMessage: 'What Bing query or snippet brought you here?',
    availabilityLabel: 'Bing-intent sessions',
  },
  'ai-visibility': {
    scheduleTierCta: 'Verify & reserve',
    contextLabel: 'AI VISIBILITY REFERRAL',
    headline: 'AI-surfaced expertise to live call',
    subheadline: 'Found via AI answer or JSON feed. Verify fit in a booked block.',
    targetMessage: 'Which AI surface or prompt referred you (if known)?',
    availabilityLabel: 'AI-referral verification calls',
  },
  'rss-feeds': {
    scheduleTierCta: 'Book from the feed',
    contextLabel: 'RSS FEED REFERRAL',
    headline: 'RSS subscriber advisory',
    subheadline: 'Feed endpoint readers. Book after syndicated content.',
    targetMessage: 'Which feed item or enclosure prompted this booking?',
    availabilityLabel: 'Feed subscriber slots',
  },
  'content-aggregators': {
    scheduleTierCta: 'Aggregator slot',
    contextLabel: 'CONTENT AGGREGATOR REFERRAL',
    headline: 'Aggregator referral to principal time',
    subheadline: 'Aggregated feed readers. Align syndicated snippets with real advisory.',
    targetMessage: 'Name the aggregator or bundle that linked you here.',
    availabilityLabel: 'Aggregator referrals',
  },
  'api-ai-fed': {
    scheduleTierCta: 'Human verification',
    contextLabel: 'API / AI-FED REFERRAL',
    headline: 'Syndicated API to live advisory',
    subheadline: 'API or AI-fed endpoint referral. Book human verification of machine-surfaced content.',
    targetMessage: 'Which API consumer or integration referred you?',
    availabilityLabel: 'Syndication referral open',
  },
}

for (const [id, copy] of Object.entries(CHANNEL_PORTAL_COPY)) {
  const hero = HERO_CARD_BY_CHANNEL[id]
  if (hero) {
    CHANNEL_PORTAL_COPY[id] = {
      ...copy,
      heroCardTitle: copy.heroCardTitle ?? hero.heroCardTitle,
      heroCardBody: copy.heroCardBody ?? hero.heroCardBody,
    }
  }
}

const _scheduleCtas = new Set<string>()
for (const [id, copy] of Object.entries(CHANNEL_PORTAL_COPY)) {
  if (_scheduleCtas.has(copy.scheduleTierCta)) {
    console.warn(`[channelPortalCopy] Duplicate scheduleTierCta for ${id}: ${copy.scheduleTierCta}`)
  }
  _scheduleCtas.add(copy.scheduleTierCta)
}

/** Ensure every active channel has a pack (dev warning only). */
for (const ch of ALL_CHANNELS) {
  if (!CHANNEL_PORTAL_COPY[ch.id]) {
    console.warn(`[channelPortalCopy] Missing copy pack for channel: ${ch.id}`)
  }
}

export function getChannelPortalCopy(channelId: string): ChannelPortalCopy | null {
  return CHANNEL_PORTAL_COPY[channelId] ?? null
}

/** Reject legacy breadcrumb CTAs (e.g. "Wiki → working session") in favor of pack defaults. */
export function resolveScheduleTierCta(channelId: string, stored?: string | null): string {
  const pack = CHANNEL_PORTAL_COPY[channelId]?.scheduleTierCta ?? 'Reserve a time block'
  const trimmed = stored?.trim()
  if (
    trimmed &&
    !trimmed.includes('→') &&
    !GENERIC_STORED_SCHEDULE_CTAS.has(trimmed.toLowerCase())
  ) {
    return trimmed
  }
  return pack
}

/** Strategic one-liner under tier section heading (not the tier button label). */
export function getTierSchedulingLine(channelId: string): string {
  const copy = CHANNEL_PORTAL_COPY[channelId]
  return (
    copy?.tierSchedulingLine ??
    TIER_SCHEDULING_LINES[channelId] ??
    copy?.targetMessage ??
    copy?.scheduleTierCta ??
    'Reserve a focused advisory block. Cite what brought you here when you book.'
  )
}

export function getScheduleTierCtaFromCopy(channelId: string): string {
  return resolveScheduleTierCta(channelId)
}

export function channelPortalCopyToPlatformShape(
  copy: ChannelPortalCopy
): {
  contextLabel: string
  headline: string
  subheadline: string
  targetMessage: string
  availabilityLabel: string
} {
  return {
    contextLabel: copy.contextLabel.toUpperCase(),
    headline: copy.headline,
    subheadline: copy.subheadline,
    targetMessage: copy.targetMessage,
    availabilityLabel: copy.availabilityLabel,
  }
}
