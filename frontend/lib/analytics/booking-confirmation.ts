import { createAnalyticsEventId } from '@/lib/analytics/event-id';

const TOKEN_PREFIX = 'pms_booking_confirmation_token_';
const TRACKED_PREFIX = 'pms_booking_confirmed_lead_';

export type BookingConfirmationResult = 'track' | 'duplicate' | 'invalid';

/** Issue a same-tab proof only after Calendly sends a trusted scheduled-event message. */
export function issueBookingConfirmation(
  inviteeUuid: string,
  storage: Pick<Storage, 'setItem'>,
): string {
  const token = createAnalyticsEventId('booking_confirmation');
  storage.setItem(`${TOKEN_PREFIX}${inviteeUuid}`, token);
  return token;
}

/**
 * Authorize one conversion event per invitee. A copied/manual thank-you URL has no stored proof.
 */
export function consumeBookingConfirmation(
  inviteeUuid: string,
  token: string,
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): BookingConfirmationResult {
  if (!inviteeUuid || !token) return 'invalid';
  if (storage.getItem(`${TRACKED_PREFIX}${inviteeUuid}`) === '1') return 'duplicate';
  const expected = storage.getItem(`${TOKEN_PREFIX}${inviteeUuid}`);
  if (!expected || expected !== token) return 'invalid';
  storage.removeItem(`${TOKEN_PREFIX}${inviteeUuid}`);
  storage.setItem(`${TRACKED_PREFIX}${inviteeUuid}`, '1');
  return 'track';
}
