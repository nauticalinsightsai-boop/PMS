import { getOfferingById } from '@/lib/regional-catalogue';
import {
  isTransactionalEmailConfigured,
  logTransactionalEmailForDev,
  sendTransactionalEmail,
} from '@/lib/send-email';

export const DEFAULT_ONBOARDING_CALENDLY_URL =
  'https://calendly.com/pm-structure/go-talk-to-mentor';

const SUPPORT_EMAIL =
  process.env.ORDER_SUPPORT_EMAIL?.trim() ||
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
  'support@pmstructure.com';

export function resolveOnboardingCalendlyUrl(offeringId?: string | null): string {
  const base =
    process.env.ORDER_ONBOARDING_CALENDLY_URL?.trim() ||
    process.env.NEXT_PUBLIC_ONBOARDING_CALENDLY_URL?.trim() ||
    DEFAULT_ONBOARDING_CALENDLY_URL;
  if (!offeringId?.trim()) return base;
  const url = new URL(base);
  url.searchParams.set('utm_source', 'email');
  url.searchParams.set('utm_medium', 'order_confirmation');
  url.searchParams.set('utm_content', offeringId.trim());
  return url.toString();
}

export type OrderConfirmationParams = {
  to: string;
  offeringId: string;
  paymentType?: string | null;
  customerName?: string | null;
  amountDisplay?: string | null;
};

function productLabel(offeringId: string): string {
  const offering = getOfferingById(offeringId);
  if (offering) {
    const tier = offering.tierId.replace(/_/g, ' ');
    return `${offering.courseName} (${tier})`;
  }
  if (offeringId.startsWith('membership_')) {
    return 'PM Structure membership';
  }
  return 'PM Structure order';
}

function subjectFor(paymentType: string | null | undefined): string {
  if (paymentType === 'seat_deposit') return 'Your PM Structure seat reservation is confirmed';
  if (paymentType === 'membership') return 'Your PM Structure membership is confirmed';
  if (paymentType === 'store') return 'Your PM Structure order is confirmed';
  return 'Your PM Structure enrollment is confirmed';
}

function introFor(paymentType: string | null | undefined): string {
  if (paymentType === 'seat_deposit') {
    return 'Thank you for your seat reservation deposit. Your place on the pathway is reserved.';
  }
  if (paymentType === 'membership') {
    return 'Thank you for joining PM Structure membership.';
  }
  if (paymentType === 'store') {
    return 'Thank you for your purchase.';
  }
  return 'Thank you for your pathway payment. Your enrollment is confirmed.';
}

function buildOrderConfirmationContent(params: OrderConfirmationParams): {
  subject: string;
  text: string;
  html: string;
  calendlyUrl: string;
} {
  const product = productLabel(params.offeringId);
  const greeting = params.customerName?.trim() ? `Hi ${params.customerName.trim()},` : 'Hi,';
  const intro = introFor(params.paymentType);
  const calendlyUrl = resolveOnboardingCalendlyUrl(params.offeringId);
  const amountLine = params.amountDisplay?.trim()
    ? `\nAmount paid: ${params.amountDisplay.trim()}`
    : '';

  const subject = subjectFor(params.paymentType);
  const text = `${greeting}

${intro}

Order: ${product}${amountLine}

Schedule your onboarding call with a mentor:
${calendlyUrl}

We sent this email because you completed checkout on pmstructure.com. If you have questions, reply to ${SUPPORT_EMAIL}.

PM Structure`;

  const html = `<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#334155">
  <p style="margin:0 0 16px;font-size:16px">${greeting}</p>
  <p style="margin:0 0 16px;font-size:15px;line-height:1.6">${intro}</p>
  <p style="margin:0 0 8px;font-size:15px"><strong>Order:</strong> ${product}</p>
  ${
    params.amountDisplay?.trim()
      ? `<p style="margin:0 0 16px;font-size:15px"><strong>Amount paid:</strong> ${params.amountDisplay.trim()}</p>`
      : ''
  }
  <p style="margin:0 0 20px;font-size:15px;line-height:1.6">Next step: book a short onboarding call so we can align your study plan and access.</p>
  <p style="margin:0 0 24px">
    <a href="${calendlyUrl}" style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 22px;border-radius:12px">Schedule your onboarding call</a>
  </p>
  <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5">Questions? Email <a href="mailto:${SUPPORT_EMAIL}" style="color:#ea580c">${SUPPORT_EMAIL}</a>.</p>
</div>`;

  return { subject, text, html, calendlyUrl };
}

export async function sendOrderConfirmationEmail(params: OrderConfirmationParams): Promise<boolean> {
  const to = params.to.trim();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || to === 'pending@checkout.local') {
    return false;
  }

  const { subject, text, html } = buildOrderConfirmationContent(params);

  if (!isTransactionalEmailConfigured()) {
    logTransactionalEmailForDev(to, subject, text);
    return false;
  }

  await sendTransactionalEmail({ to, subject, text, html });
  return true;
}
