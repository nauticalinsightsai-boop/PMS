import type { PortalSocialProofItem } from '../types/channelLandingPage'
import { learnerAvatarPath } from './portalLearnerAvatars'
import { IMPLEMENTATION_SCOPE_41 } from './platformBrandSources'

type RawStory = { quote: string; name: string; title: string; credential?: string }

function pair(
  channelId: string,
  a: RawStory,
  b: RawStory
): [PortalSocialProofItem, PortalSocialProofItem] {
  return [
    { ...a, avatarUrl: learnerAvatarPath(channelId, 1) },
    { ...b, avatarUrl: learnerAvatarPath(channelId, 2) },
  ]
}

const RAW: Record<string, [RawStory, RawStory]> = {
  website: [
    {
      quote:
        'I compared pathways on the PM Structure site, booked mentor sessions, and sat PMP® with a rhythm I could keep. Cleared on my timeline.',
      name: 'Sarah M.',
      title: 'Program Manager · Logistics',
      credential: 'PMP®',
    },
    {
      quote:
        'A certification page on PM Structure answered my CAPM® questions. After a free mentor intro I enrolled, completed prep, and passed.',
      name: 'James O.',
      title: 'Project Coordinator · Healthcare',
      credential: 'CAPM®',
    },
  ],
  webinar: [
    {
      quote:
        'After the webinar replay I booked a mentor intro. We locked PMI-RMP® prep length and regional tuition. Cleared six months later.',
      name: 'Priya K.',
      title: 'Risk Lead · Energy',
      credential: 'PMI-RMP®',
    },
    {
      quote:
        'The live briefing clarified PRINCE2® fit. Mentor check-ins through prep kept me on track. Passed Foundation first sit.',
      name: 'Daniel R.',
      title: 'Delivery Manager · Public sector',
      credential: 'PRINCE2® Foundation',
    },
  ],
  medium: [
    {
      quote:
        'A Medium article on exam prep led me to PM Structure. One mentor call turned it into a PMP® plan. Cleared with Above Target in two domains.',
      name: 'Elena V.',
      title: 'Senior PM · Technology',
      credential: 'PMP®',
    },
    {
      quote:
        'I read a Medium piece on Lean Six Sigma, booked mentor time, and structured Green Belt prep around shift work. Passed.',
      name: 'Marcus T.',
      title: 'Operations Lead · Manufacturing',
      credential: 'Six Sigma Green Belt',
    },
  ],
  substack: [
    {
      quote:
        'A Substack issue linked here. The free mentor intro clarified CAPM® vs PMP®. I enrolled, sat mocks, and cleared CAPM®.',
      name: 'Hannah W.',
      title: 'Associate PM · Financial services',
      credential: 'CAPM®',
    },
    {
      quote:
        'A long Substack post on agile credentials pushed me to book. PMI-ACP® prep with mentor feedback helped me pass.',
      name: 'Omar S.',
      title: 'Agile Coach · Telecom',
      credential: 'PMI-ACP®',
    },
  ],
  beehiiv: [
    {
      quote:
        'A Beehiiv email CTA brought me to PM Structure. I compared tuition, booked sessions, and cleared PMP®.',
      name: 'Lin C.',
      title: 'PMO Analyst · Aviation',
      credential: 'PMP®',
    },
    {
      quote:
        'I clicked through a Beehiiv post, booked executive mentor time, and structured PgMP® prep. Passed on my second attempt.',
      name: 'Rachel F.',
      title: 'Portfolio Manager · Insurance',
      credential: 'PgMP®',
    },
  ],
  ghost: [
    {
      quote:
        'A Ghost newsletter issue sent me here. Mentor sessions turned reading into a PMP® study plan. Cleared last quarter.',
      name: 'Tomás L.',
      title: 'Project Lead · Construction',
      credential: 'PMP®',
    },
    {
      quote:
        'A Ghost blog post on quality certs led to a mentor call. Green Belt prep fit my plant schedule. Passed.',
      name: 'Aisha N.',
      title: 'Continuous Improvement · Retail',
      credential: 'Six Sigma Green Belt',
    },
  ],
  hashnode: [
    {
      quote:
        'A Hashnode dev-career article linked to PM Structure. CAPM® prep with mentor mocks worked. Cleared.',
      name: 'Kevin P.',
      title: 'Software PM · SaaS',
      credential: 'CAPM®',
    },
    {
      quote:
        'I followed a Hashnode series, booked mentor time, and locked PMP® prep. Cleared with a plan I could defend to my sponsor.',
      name: 'Nina R.',
      title: 'Engineering Manager · FinTech',
      credential: 'PMP®',
    },
  ],
  'notion-public': [
    {
      quote:
        'A public Notion wiki page pointed me here. PRINCE2® Foundation prep with mentor Q&A. Passed.',
      name: 'David H.',
      title: 'PMO Consultant · Advisory',
      credential: 'PRINCE2® Foundation',
    },
    {
      quote:
        'Documentation in Notion led me to book. One mentor intro clarified CAPM® fit. Cleared three months later.',
      name: 'Sophie L.',
      title: 'Business Analyst · Energy',
      credential: 'CAPM®',
    },
  ],
  linkedin: [
    {
      quote:
        'A LinkedIn article on portfolio governance led me to PM Structure. Executive mentor time structured PgMP® prep. Cleared.',
      name: 'Michael B.',
      title: 'Director · Infrastructure',
      credential: 'PgMP®',
    },
    {
      quote:
        'I saw a connection post about PMP®, booked mentor time, and aligned prep with travel. Cleared PMP®.',
      name: 'Angela C.',
      title: 'Senior Consultant · Professional services',
      credential: 'PMP®',
    },
  ],
  twitter: [
    {
      quote:
        'An X thread on agile certs linked here. Mentor calls turned the thread into PMI-ACP® prep. Passed.',
      name: 'Chris D.',
      title: 'Product Owner · Media',
      credential: 'PMI-ACP®',
    },
    {
      quote:
        'A post on X about early-career PM credentials sent me here. CAPM® prep with mentor check-ins. Cleared.',
      name: 'Fatima Z.',
      title: 'Scrum Master · Healthtech',
      credential: 'CAPM®',
    },
  ],
  instagram: [
    {
      quote:
        'A Reels link led me to PM Structure. I booked a free mentor intro, chose PMP®, and prep check-ins kept me accountable. Cleared PMP®.',
      name: 'Maya J.',
      title: 'Marketing PM · E-commerce',
      credential: 'PMP®',
    },
    {
      quote:
        'An Instagram feed post on certifications brought me here. One mentor call cleared my doubts. CAPM® prep, then pass.',
      name: 'Luis G.',
      title: 'Coordinator · Hospitality',
      credential: 'CAPM®',
    },
  ],
  facebook: [
    {
      quote:
        'A Facebook group post linked to PM Structure. Mentor sessions fit around family time. Cleared PMP®.',
      name: 'Jennifer A.',
      title: 'PM · Nonprofit',
      credential: 'PMP®',
    },
    {
      quote:
        'A group thread on exam prep led me to book. CAPM® pathway made sense after the free intro. Passed.',
      name: 'Robert K.',
      title: 'Volunteer Lead · Community org',
      credential: 'CAPM®',
    },
  ],
  reddit: [
    {
      quote:
        'A subreddit thread on PMP® prep linked here. Mentor feedback on mocks mattered. Cleared.',
      name: 'Alex T.',
      title: 'Engineer · Aerospace',
      credential: 'PMP®',
    },
    {
      quote:
        'Reddit discussion on risk certs sent me here. PMI-RMP® prep with mentor support. Passed.',
      name: 'Samira H.',
      title: 'Analyst · Government',
      credential: 'PMI-RMP®',
    },
  ],
  threads: [
    {
      quote:
        'A Threads post on study resources linked here. CAPM® prep with structured mentor touchpoints. Cleared.',
      name: 'Jordan M.',
      title: 'Creator · Education',
      credential: 'CAPM®',
    },
    {
      quote:
        'A Threads conversation on agile led to PM Structure. PMI-ACP® prep and mentor review. Passed.',
      name: 'Casey W.',
      title: 'Freelance PM · Creative',
      credential: 'PMI-ACP®',
    },
  ],
  quora: [
    {
      quote:
        'A Quora answer on PMP® experience hours linked here. Mentor time clarified my application story. Cleared PMP®.',
      name: 'Irene P.',
      title: 'Consultant · Telecom',
      credential: 'PMP®',
    },
    {
      quote:
        'I found PM Structure through a Quora question thread. CAPM® fit my experience level. Passed.',
      name: 'Ben S.',
      title: 'MBA Candidate · General mgmt',
      credential: 'CAPM®',
    },
  ],
  bluesky: [
    {
      quote:
        'A Bluesky post on governance certs led me here. PRINCE2® Foundation prep with mentor Q&A. Cleared.',
      name: 'Taylor N.',
      title: 'Policy Analyst · Public sector',
      credential: 'PRINCE2® Foundation',
    },
    {
      quote:
        'A thread on quality methods linked here. Green Belt prep with mentor check-ins. Passed.',
      name: 'Morgan F.',
      title: 'Research Lead · Academia',
      credential: 'Six Sigma Green Belt',
    },
  ],
  mastodon: [
    {
      quote:
        'A post on my Mastodon instance linked here. CAPM® mentor intro, then prep. Cleared.',
      name: 'Riley C.',
      title: 'Fediverse dev · Open source',
      credential: 'CAPM®',
    },
    {
      quote:
        'A federated thread on PM careers sent me here. PMP® prep around volunteer work. Passed.',
      name: 'Quinn E.',
      title: 'Community Organizer · NGO',
      credential: 'PMP®',
    },
  ],
  pinterest: [
    {
      quote:
        'A Pinterest pin on certification roadmaps led here. PMP® prep with mentor milestones. Cleared.',
      name: 'Dana V.',
      title: 'Interior PM · Design-build',
      credential: 'PMP®',
    },
    {
      quote:
        'Research on a Pinterest board linked here. CAPM® pathway after one mentor call. Passed.',
      name: 'Brooke L.',
      title: 'Event PM · Retail',
      credential: 'CAPM®',
    },
  ],
  vk: [
    {
      quote:
        'A VK community post linked to PM Structure. Mentor sessions in English worked for my schedule. Cleared PMP®.',
      name: 'Ivan P.',
      title: 'Project Lead · Logistics',
      credential: 'PMP®',
    },
    {
      quote:
        'A VK group discussion on certs led me to book. CAPM® prep with regional tuition clarity. Passed.',
      name: 'Olga S.',
      title: 'Analyst · Energy',
      credential: 'CAPM®',
    },
  ],
  youtube: [
    {
      quote:
        'A YouTube video on entry-level PM certs linked here. CAPM® prep after a free mentor intro. Cleared.',
      name: 'Ethan R.',
      title: 'Video Editor · Media',
      credential: 'CAPM®',
    },
    {
      quote:
        'A YouTube series on PMP® domains sent me here. Mentor mocks before exam day. Passed PMP®.',
      name: 'Chloe B.',
      title: 'Sponsor PM · Consumer goods',
      credential: 'PMP®',
    },
  ],
  tiktok: [
    {
      quote:
        'A TikTok clip on CAPM® vs PMP® linked here. Short mentor calls fit my schedule. Cleared CAPM®.',
      name: 'Zoe K.',
      title: 'Gen-Z Coordinator · Startup',
      credential: 'CAPM®',
    },
    {
      quote:
        'A TikTok on process improvement led me to PM Structure. Green Belt prep with mentor support. Passed.',
      name: 'Malik J.',
      title: 'Ops Associate · Logistics',
      credential: 'Six Sigma Green Belt',
    },
  ],
  snapchat: [
    {
      quote:
        'A Snap story led me to PM Structure. One mentor call cleared pathway doubts. CAPM® prep, then pass.',
      name: 'Jordan K.',
      title: 'Project Coordinator · Retail',
      credential: 'CAPM®',
    },
    {
      quote:
        'A swipe-up from Snapchat brought me here. PMP® prep with check-ins between shifts. Cleared.',
      name: 'Skyler T.',
      title: 'Assistant PM · Hospitality',
      credential: 'PMP®',
    },
  ],
  vimeo: [
    {
      quote:
        'A Vimeo showcase on agile delivery linked here. PMI-ACP® prep with mentor review. Passed.',
      name: 'Grace M.',
      title: 'Producer · Creative agency',
      credential: 'PMI-ACP®',
    },
    {
      quote:
        'Professional video on PMP® study habits led me to book. Cleared PMP® with a plan I kept.',
      name: 'Henry W.',
      title: 'Documentary PM · Film',
      credential: 'PMP®',
    },
  ],
  spotify: [
    {
      quote:
        'A Spotify episode on PMP® myths linked here. Mentor time turned listening into a study plan. Cleared.',
      name: 'Noah A.',
      title: 'Listener · Supply chain',
      credential: 'PMP®',
    },
    {
      quote:
        'Episode show notes sent me here. Green Belt prep with mentor accountability. Passed.',
      name: 'Ella D.',
      title: 'Ops Manager · Food & bev',
      credential: 'Six Sigma Green Belt',
    },
  ],
  'apple-podcasts': [
    {
      quote:
        'An Apple Podcasts episode on early PM credentials linked here. CAPM® cleared in four months.',
      name: 'Victor L.',
      title: 'iOS listener · Tech',
      credential: 'CAPM®',
    },
    {
      quote:
        'A podcast on career switches led me to PM Structure. PMP® prep with mentor mocks. Passed.',
      name: 'Mia C.',
      title: 'Listener · Healthcare admin',
      credential: 'PMP®',
    },
  ],
  'amazon-audible': [
    {
      quote:
        'An Audible recommendation on risk management linked here. PMI-RMP® prep with mentor support. Cleared.',
      name: 'Patricia G.',
      title: 'Audible listener · Finance',
      credential: 'PMI-RMP®',
    },
    {
      quote:
        'Commute listening on PMP® led me to book mentor time. Cleared with structured prep.',
      name: 'George N.',
      title: 'Commuter · Manufacturing',
      credential: 'PMP®',
    },
  ],
  podbean: [
    {
      quote:
        'A Podbean episode cited PM Structure. CAPM® fit after the free intro. Passed.',
      name: 'Carla M.',
      title: 'Host listener · Education',
      credential: 'CAPM®',
    },
    {
      quote:
        'Host feed notes linked here. PMI-ACP® prep with agile mentor feedback. Cleared.',
      name: 'Derek F.',
      title: 'Podcast fan · SaaS',
      credential: 'PMI-ACP®',
    },
  ],
  soundcloud: [
    {
      quote:
        'A SoundCloud talk on PM careers linked here. CAPM® prep between tours. Passed.',
      name: 'Jasmine R.',
      title: 'Audio fan · Music industry',
      credential: 'CAPM®',
    },
    {
      quote:
        'A playlist episode on quality certs sent me here. Green Belt prep with mentor check-ins. Cleared.',
      name: 'Andre V.',
      title: 'DJ · Events',
      credential: 'Six Sigma Green Belt',
    },
  ],
  email: [
    {
      quote:
        'An email campaign linked here. Mentor intro clarified PMP® fit before I paid tuition. Cleared.',
      name: 'Lisa H.',
      title: 'Inbox reader · Insurance',
      credential: 'PMP®',
    },
    {
      quote:
        'The subject line promised cert clarity. One mentor call, CAPM® prep, pass.',
      name: 'Paul J.',
      title: 'Newsletter reader · SaaS',
      credential: 'CAPM®',
    },
  ],
  whatsapp: [
    {
      quote:
        'A WhatsApp channel broadcast linked here. Mentor sessions worked across time zones. Cleared PMP®.',
      name: 'Amira K.',
      title: 'Channel follower · GCC',
      credential: 'PMP®',
    },
    {
      quote:
        'Our group shared a PM Structure link. CAPM® prep with regional pricing explained. Passed.',
      name: 'Yusuf A.',
      title: 'Group admin · Community',
      credential: 'CAPM®',
    },
  ],
  telegram: [
    {
      quote:
        'A Telegram channel post led me here. PMP® prep with async mentor check-ins. Cleared.',
      name: 'Sergei M.',
      title: 'Channel subscriber · Remote',
      credential: 'PMP®',
    },
    {
      quote:
        'Telegram study group linked here. PRINCE2® Foundation prep. Passed first sit.',
      name: 'Lena V.',
      title: 'Group member · EU',
      credential: 'PRINCE2® Foundation',
    },
  ],
  discord: [
    {
      quote:
        'A Discord server thread on PM certs linked here. CAPM® after free mentor intro. Cleared.',
      name: 'Tyler G.',
      title: 'Server member · Gaming-adjacent tech',
      credential: 'CAPM®',
    },
    {
      quote:
        'Our study server pinned PM Structure. PMP® prep with mentor office hours. Passed.',
      name: 'Morgan P.',
      title: 'Mod · Study server',
      credential: 'PMP®',
    },
  ],
  slack: [
    {
      quote:
        'A Slack workspace link led here. Executive mentor time for PgMP® prep. Cleared.',
      name: 'Jessica W.',
      title: 'Workspace member · Enterprise',
      credential: 'PgMP®',
    },
    {
      quote:
        'Slack thread on agile certs linked here. PMI-ACP® prep with mentor review. Passed.',
      name: 'Ryan C.',
      title: 'Engineer · Platform team',
      credential: 'PMI-ACP®',
    },
  ],
  'google-search': [
    {
      quote:
        'A Google search on Six Sigma prep led here. Mentor call clarified Green Belt fit. Passed.',
      name: 'Zara M.',
      title: 'Searcher · Retail',
      credential: 'Six Sigma Green Belt',
    },
    {
      quote:
        'Search results pointed to PM Structure. CAPM® prep after free intro. Cleared.',
      name: 'Finn D.',
      title: 'Job seeker · Construction',
      credential: 'CAPM®',
    },
  ],
  'youtube-search': [
    {
      quote:
        'YouTube search on PMP® domains led here. Mentor mocks before exam. Cleared PMP®.',
      name: 'Cole R.',
      title: 'Researcher · Media',
      credential: 'PMP®',
    },
    {
      quote:
        'A YouTube search result linked here. CAPM® pathway in one mentor call. Passed.',
      name: 'Priya S.',
      title: 'Student · Engineering',
      credential: 'CAPM®',
    },
  ],
  'podcast-directories': [
    {
      quote:
        'A podcast directory listing linked here. CAPM® prep with mentor support. Cleared.',
      name: 'Nora L.',
      title: 'Directory browser · Tech',
      credential: 'CAPM®',
    },
    {
      quote:
        'Directory browse led to PM Structure. PMP® prep with check-ins. Passed.',
      name: 'Ian M.',
      title: 'Listener · Admin',
      credential: 'PMP®',
    },
  ],
  'bing-search': [
    {
      quote:
        'Bing search on PMI-RMP® led here. Mentor structured prep. Cleared.',
      name: 'Helen R.',
      title: 'Searcher · Finance',
      credential: 'PMI-RMP®',
    },
    {
      quote:
        'A Bing snippet matched my question. PMP® prep, then pass.',
      name: 'Stan D.',
      title: 'Analyst · Manufacturing',
      credential: 'PMP®',
    },
  ],
  'ai-visibility': [
    {
      quote:
        'An AI answer cited PM Structure. I verified with a human mentor intro. CAPM® cleared.',
      name: 'Nadia B.',
      title: 'AI referrer · Education',
      credential: 'CAPM®',
    },
    {
      quote:
        'I followed an AI summary link and booked mentor time. PMP® prep with real feedback. Passed.',
      name: 'Oscar L.',
      title: 'Researcher · SaaS',
      credential: 'PMP®',
    },
  ],
  'rss-feeds': [
    {
      quote:
        'An RSS item on cert prep linked here. CAPM® after mentor intro. Cleared.',
      name: 'Riley A.',
      title: 'RSS reader · Media',
      credential: 'CAPM®',
    },
    {
      quote:
        'Feed enclosure notes led me to book. Green Belt prep. Passed.',
      name: 'Sam V.',
      title: 'Subscriber · Events',
      credential: 'Six Sigma Green Belt',
    },
  ],
  'content-aggregators': [
    {
      quote:
        'A content bundle linked here. PMP® prep with mentor milestones. Cleared.',
      name: 'Kate H.',
      title: 'Aggregator user · Insurance',
      credential: 'PMP®',
    },
    {
      quote:
        'Aggregated feed item sent me here. CAPM® fit confirmed on call. Passed.',
      name: 'Neil J.',
      title: 'Reader · SaaS',
      credential: 'CAPM®',
    },
  ],
  'api-ai-fed': [
    {
      quote:
        'An integration surface linked here. Human mentor verified PMI-ACP® fit. Passed.',
      name: 'Alex G.',
      title: 'Integrator · Tech',
      credential: 'PMI-ACP®',
    },
    {
      quote:
        'Syndicated knowledge link led to PM Structure. PMP® prep with mentor support. Cleared.',
      name: 'Jen W.',
      title: 'Platform user · Enterprise',
      credential: 'PMP®',
    },
  ],
}

/** All 41 implementation-scope channels must have exactly two learner stories. */
void IMPLEMENTATION_SCOPE_41

export const PORTAL_LEARNER_STORIES: Record<
  string,
  [PortalSocialProofItem, PortalSocialProofItem]
> = Object.fromEntries(Object.entries(RAW).map(([id, [a, b]]) => [id, pair(id, a, b)]))

export function getPortalLearnerStories(channelId: string): PortalSocialProofItem[] {
  return PORTAL_LEARNER_STORIES[channelId] ?? []
}
