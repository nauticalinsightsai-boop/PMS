/**
 * Record a successful Stripe payment into the same interactions pipeline used by
 * website forms (Supabase form_submissions + Google Sheets), so purchases show up
 * in the Sheets records alongside leads. Best-effort: never throws.
 */
function siteOrigin(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_MARKETING_SITE_URL ||
    '';
  return raw ? raw.replace(/\/$/, '') : null;
}

export async function recordPaidOrderToSheet(params: {
  email: string;
  offeringId: string;
  sessionId: string;
  metadata: Record<string, unknown>;
}): Promise<boolean> {
  const origin = siteOrigin();
  if (!origin) return false;

  const m = params.metadata;
  const str = (key: string): string | undefined =>
    typeof m[key] === 'string' && (m[key] as string).trim() ? (m[key] as string) : undefined;

  const paymentType = str('paymentType') ?? 'purchase';
  const tier = str('membershipTier');
  const billing = str('billingCycle');
  const amount = str('checkoutDisplay');
  const currency = str('checkoutCurrency');
  const customerName = str('customerName') ?? str('stripeCustomerName');

  const subjectParts = ['Payment', paymentType, tier].filter(Boolean) as string[];
  const subject = `${subjectParts.join(' · ')}${amount ? ` (${amount})` : ''}`.slice(0, 500);

  try {
    const res = await fetch(`${origin}/api/interactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'payment',
        subject,
        email: params.email,
        payload: {
          paymentType,
          offeringId: params.offeringId,
          membershipTier: tier,
          billingCycle: billing,
          amountDisplay: amount,
          currency,
          customerName,
          stripeSessionId: params.sessionId,
          paymentStatus: 'paid',
        },
        website: '',
        company: '',
      }),
    });
    return res.ok;
  } catch (e) {
    console.error('[record-payment-interaction] failed to record payment to sheet', e);
    return false;
  }
}
