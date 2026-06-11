# Calendly UI setup checklist (manual)

The Calendly API **cannot** set custom questions, buffers, daily limits, guests, or Stripe payment.
Apply these in Calendly → **Scheduling** → each event → **More options**.

## Standard invitee questions (all 29 events)

- Phone Number. Required. Phone
- Certification of Interest. Required. Multi-select: PMP, PRINCE2, Six Sigma + Other text
- Years of Experience. Required. Single-select: 0-2, 3-5, 6-10, 10+
- Please describe your specific question or concern. Optional. Long text
- LinkedIn Profile URL. Optional. Short text

Remove the default question: *"Please share anything that will help prepare for our meeting."*

## Per-event checklist

| ID | Event | Template | Duration | Limits | Buffer | Guests | Payment | Edit URL |
|----|-------|----------|----------|--------|--------|--------|---------|----------|
| 001 | Website Hero. Book Consultation | hero | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/website-hero-book-consultation-1) |
| 002 | Website. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/website-discovery-mentorship) |
| 003 | Website. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/website-executive-discussion) |
| 004 | Website. Expert Services Discussion | services | 45 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/website-expert-services-discussion) |
| 005 | Webinar. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/webinar-discovery-mentorship) |
| 006 | Webinar. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/webinar-executive-discussion) |
| 007 | Writing / Publishing. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/writing-publishing-discovery-mentorship) |
| 008 | Writing / Publishing. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/writing-publishing-executive-discussion) |
| 009 | Social Distribution. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/social-distribution-discovery-mentorship) |
| 010 | Social Distribution. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/social-distribution-executive-discussion) |
| 011 | Video Platform. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/video-platform-discovery-mentorship) |
| 012 | Video Platform. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/video-platform-executive-discussion) |
| 013 | Audio / Podcast. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/audio-podcast-discovery-mentorship) |
| 014 | Audio / Podcast. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/audio-podcast-executive-discussion) |
| 015 | Community / Direct. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/community-direct-discovery-mentorship) |
| 016 | Community / Direct. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/community-direct-executive-discussion) |
| 017 | Discovery / Search. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/discovery-search-discovery-mentorship) |
| 018 | Discovery / Search. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/discovery-search-executive-discussion) |
| 019 | LinkedIn. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/linkedin-discovery-mentorship) |
| 020 | LinkedIn. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/linkedin-executive-discussion) |
| 021 | YouTube. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/youtube-discovery-mentorship) |
| 022 | YouTube. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/youtube-executive-discussion) |
| 023 | Email. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/email-discovery-mentorship) |
| 024 | Email. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/email-executive-discussion) |
| 025 | RSS Feeds. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/rss-feeds-discovery-mentorship) |
| 026 | RSS Feeds. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/rss-feeds-executive-discussion) |
| 027 | Syndicated. Expert Services Discussion | services | 45 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/syndicated-expert-services-discussion) |
| 028 | Syndicated / RSS / Feeds. Discovery & Mentorship | discovery | 20 min | 2 meetings per day | 10 min before / 10 min after | Off | Free / invite only | [Open](https://calendly.com/pm-structure/syndicated-rss-feeds-discovery-mentorship) |
| 029 | Syndicated / RSS / Feeds. Executive Discussion | executive | 35 min | 2 meetings per day | 15 min before / 15 min after | On | Paid: connect Stripe in Calendly UI | [Open](https://calendly.com/pm-structure/syndicated-rss-feeds-executive-discussion) |

## Quick path in Calendly UI

1. Open [Scheduling](https://calendly.com/app/scheduling/meeting_types/user/me)
2. Click event → **Edit** → **More options**
3. **Invitee questions**: add the 5 standard questions above
4. **Limits and buffers**: set daily limit + buffer times
5. **Payment**: executive + services tiers: enable Stripe
6. **Guests**: off for discovery/hero, on for executive/services