import type { InteractionSource } from './form-submissions';
import { certNameFromPayload } from './form-submissions';
import { buildRecordsRow, type SheetSubmissionRow } from './sheets-human-row';

/** Ops tabs that existed before API automation — kept in sync for the team. */
export const ALL_LEADS_TAB = 'All Leads';

export const LEGACY_SOURCE_TAB: Partial<Record<InteractionSource, string>> = {
  contact: 'Contact',
  subscription: 'Newsletter',
  waitlist: 'Waitlist',
  pmp_roadmap_lead: 'Roadmap Leads',
  cert_roadmap_lead: 'Roadmap Leads',
  consultation: 'Consultations',
  scholarship_review: 'Scholarship',
  lead_recovery: 'Lead Recovery',
  register_modal: 'Register Events',
  channel_portal: 'Channel Portals',
  meeting_booking: 'Meeting Bookings',
  documentation_request: 'Contact',
};

function field(payload: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (value == null || value === '') continue;
    if (Array.isArray(value)) return value.map(String).join(', ');
    if (typeof value === 'object') continue;
    return String(value);
  }
  return '';
}

function nameFromPayload(payload: Record<string, unknown>): string {
  const full = field(payload, ['fullName', 'name']);
  if (full) return full;
  return [field(payload, ['firstName']), field(payload, ['lastName'])].filter(Boolean).join(' ');
}

function formatLegacyTimestamp(iso: string): string {
  if (!iso.trim()) return '';
  try {
    return new Date(iso).toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Europe/London',
    });
  } catch {
    return iso;
  }
}

/** Matches live “All Leads” tab headers (15 columns). */
export function buildAllLeadsLegacyRow(row: SheetSubmissionRow): string[] {
  return [...buildRecordsRow(row), '', ''];
}

export function legacyTabForSource(source: InteractionSource): string | null {
  return LEGACY_SOURCE_TAB[source] ?? null;
}

/** Build a row for a legacy filtered tab (matches existing header layouts). */
export function buildLegacyFilteredTabRow(tabName: string, row: SheetSubmissionRow): string[] {
  const payload = row.payload ?? {};
  const ts = formatLegacyTimestamp(row.created_at);
  const name = nameFromPayload(payload);
  const email = row.email.trim().toLowerCase();
  const phone = field(payload, ['phoneFull', 'phone', 'whatsapp', 'whatsappNumber']);
  const message = field(payload, ['message', 'notes']);
  const cert =
    certNameFromPayload(payload) || field(payload, ['certificationInterest', 'siteCertId', 'offeringId']);

  switch (tabName) {
    case 'Contact':
      return [ts, name, email, phone, row.subject, message, 'New'];
    case 'Newsletter':
      return [ts, name, email, field(payload, ['tierLabel', 'subscriptionType']) || 'Newsletter', 'Active'];
    case 'Waitlist':
      return [ts, name, email, cert || row.subject, field(payload, ['priority']), 'Waiting'];
    case 'Roadmap Leads':
      return [
        ts,
        name,
        email,
        field(payload, ['role', 'currentRole']),
        cert || field(payload, ['desiredRole']),
        field(payload, ['jobExperienceYears', 'experienceLevel']),
        'New',
      ];
    case 'Consultations':
      return [
        ts,
        name,
        email,
        phone,
        field(payload, ['preferredDate', 'meetingDate']),
        field(payload, ['preferredTime', 'meetingTime']),
        field(payload, ['topic']) || row.subject,
        'New',
      ];
    case 'Scholarship':
      return [
        ts,
        name,
        email,
        field(payload, ['background']),
        message || field(payload, ['motivation']),
        field(payload, ['portfolioLink', 'portfolioUrl']),
        'New',
      ];
    case 'Lead Recovery':
      return [
        ts,
        name,
        email,
        cert || field(payload, ['previousCourse']),
        message,
        field(payload, ['recoveryOffer', 'formLabel']),
        'New',
      ];
    case 'Register Events':
      return [
        ts,
        name,
        email,
        field(payload, ['eventName', 'formLabel']) || row.subject,
        field(payload, ['eventDate']),
        field(payload, ['ticketType', 'tierLabel']),
        'Registered',
      ];
    case 'Channel Portals':
      return [
        ts,
        name || field(payload, ['partnerName', 'company']),
        email,
        field(payload, ['channel', 'originLabel', 'placement']),
        field(payload, ['leadVolume']),
        'New',
      ];
    case 'Meeting Bookings':
      return [
        ts,
        name,
        email,
        field(payload, ['meetingType', 'formLabel']) || row.subject,
        field(payload, ['meetingDate', 'preferredDate']),
        field(payload, ['meetingTime', 'preferredTime']),
        field(payload, ['meetingLink', 'calendlyUrl']),
        'Booked',
      ];
    default:
      return buildAllLeadsLegacyRow(row);
  }
}

export function legacyTabsToUpdate(source: InteractionSource): string[] {
  const tabs = new Set<string>([ALL_LEADS_TAB]);
  const filtered = legacyTabForSource(source);
  if (filtered) tabs.add(filtered);
  return [...tabs];
}
