import { redirect } from 'next/navigation';

/** Canonical Booking CRM — CTA Management */
export const BOOKING_CRM_CTA_PATH = '/dashboard/booking-crm/cta';

/** Canonical Booking CRM — Google Sheets interaction records */
export const BOOKING_CRM_SHEETS_PATH = '/dashboard/booking-crm/interactions/sheets';

export function redirectToCtaManagement(): never {
  redirect(BOOKING_CRM_CTA_PATH);
}

export function redirectToSheetsRecords(): never {
  redirect(BOOKING_CRM_SHEETS_PATH);
}
