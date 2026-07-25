import type { LeadRecoveryContext } from './types';
import { homeCalendlyVariant, pathwayCalendlyVariant, tierIdFromPathwayTier } from './copy';
import { markLeadConverted } from './session-state';
import { issueBookingConfirmation } from '@/lib/analytics/booking-confirmation';

export type CalendlySessionState = {
  openedAt: number;
  funnelLabel?: string;
  siteCertId?: string;
  tierId?: string;
  booked: boolean;
};

let session: CalendlySessionState | null = null;
let onCloseCallback: ((ctx: LeadRecoveryContext) => void) | null = null;

const CALENDLY_FAST_MS = 15_000;

export function setCalendlyCloseHandler(cb: (ctx: LeadRecoveryContext) => void): void {
  onCloseCallback = cb;
}

export function beginCalendlySession(opts: {
  funnelLabel?: string;
  siteCertId?: string;
  tierId?: string;
}): void {
  session = {
    openedAt: Date.now(),
    funnelLabel: opts.funnelLabel,
    siteCertId: opts.siteCertId,
    tierId: opts.tierId,
    booked: false,
  };
}

export function markCalendlyBooked(): void {
  if (session) session.booked = true;
}

export function getCalendlySession(): CalendlySessionState | null {
  return session;
}

function parsePathwayFunnel(funnelLabel?: string): { siteCertId?: string; tierId?: string } {
  if (!funnelLabel?.startsWith('pathway:')) return {};
  const parts = funnelLabel.split(':');
  return { siteCertId: parts[1], tierId: parts[2] };
}

export function notifyCalendlyClosed(): void {
  if (!session || session.booked || !onCloseCallback) {
    session = null;
    return;
  }

  const explored = Date.now() - session.openedAt >= CALENDLY_FAST_MS;
  const pathway = parsePathwayFunnel(session.funnelLabel);
  const siteCertId = session.siteCertId ?? pathway.siteCertId;
  const tierId = session.tierId ?? pathway.tierId;

  let variant: LeadRecoveryContext['variant'];
  if (session.funnelLabel?.startsWith('pathway:') && tierId) {
    variant = pathwayCalendlyVariant(tierId, explored);
  } else if (session.funnelLabel === 'home_tool_calendly') {
    variant = 'home_tool_calendly_bounce';
  } else if (session.funnelLabel?.startsWith('home_') || session.funnelLabel === 'home_hero_consultation') {
    variant = homeCalendlyVariant(explored);
  } else if (session.funnelLabel?.includes(':') && !session.funnelLabel.startsWith('pathway:')) {
    variant = 'channel_calendly_bounce';
  } else {
    variant = homeCalendlyVariant(explored);
  }

  onCloseCallback({
    variant,
    siteCertId,
    tierId: tierId ? tierIdFromPathwayTier(tierId) : undefined,
    parentSurface: 'calendly',
  });

  session = null;
}

let listenerInstalled = false;

export function installCalendlyBookedListener(): void {
  if (typeof window === 'undefined' || listenerInstalled) return;
  listenerInstalled = true;

  window.addEventListener('message', (e) => {
    if (e.origin !== 'https://calendly.com') return;
    const data = e.data as {
      event?: string;
      payload?: { invitee?: { uri?: string }; event?: { uri?: string } };
    };
    if (data?.event === 'calendly.event_scheduled') {
      markCalendlyBooked();
      markLeadConverted();
      const inviteeUri = data.payload?.invitee?.uri;
      const inviteeUuid = inviteeUri?.split('/').filter(Boolean).pop();
      if (inviteeUuid && !window.location.pathname.startsWith('/booking-confirmed')) {
        let token = '';
        try {
          token = issueBookingConfirmation(inviteeUuid, sessionStorage);
        } catch {
          return;
        }
        const url =
          `/booking-confirmed?invitee_uuid=${encodeURIComponent(inviteeUuid)}` +
          `&booking_token=${encodeURIComponent(token)}`;
        window.location.assign(url);
      }
    }
  });
}
