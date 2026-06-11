# Order confirmation email (post-Stripe checkout)

After a successful Stripe payment, the marketing API (`backend/`, port **3001**) marks the order paid and sends a confirmation email with a Calendly link to schedule an onboarding call.

Default Calendly URL (already wired in code):

`https://calendly.com/pm-structure/go-talk-to-mentor`

## What is already implemented

| Piece | Location |
|-------|----------|
| Mark order paid + send email | `backend/lib/sync-paid-order.ts` |
| Stripe webhook trigger | `backend/app/api/stripe/webhook/route.ts` (`checkout.session.completed`) |
| Success-page fallback trigger | `backend/app/api/checkout/session/[id]/route.ts` (session poll) |
| Email template + Calendly CTA | `backend/lib/order-confirmation-email.ts` |
| Resend sender | `backend/lib/send-email.ts` |
| Pathway success page button | `frontend/components/pages/ProgramEnrollmentSuccess.tsx` |
| Membership success page button | `frontend/app/(site)/membership/checkout/success/page.tsx` |
| Shared Calendly button | `frontend/components/checkout/OnboardingCalendlyCta.tsx` |

Idempotency: `orders.metadata.confirmationEmailSentAt` prevents duplicate sends on webhook retries.

## Your checklist (manual setup)

### 1. Resend (required for real emails)

On the **marketing API** service (`backend/` on Railway or Vercel):

```env
RESEND_API_KEY=re_...
ORDER_EMAIL_FROM=orders@pmstructure.com
ORDER_EMAIL_FROM_NAME=PM Structure
```

1. Create a [Resend](https://resend.com) account and API key.
2. Verify the sending domain (`pmstructure.com`) in Resend.
3. Set `ORDER_EMAIL_FROM` to an address on that verified domain.
4. Redeploy the API service.

Until `RESEND_API_KEY` is set, orders still mark **paid** but email is skipped (logged in dev console). Skipped sends are recorded as `confirmationEmailSkippedAt` on the order; those orders will **not** auto-resend when you add Resend later.

### 2. Stripe webhook (required in production)

`STRIPE_WEBHOOK_SECRET` is empty in local `.env.local` today. For production:

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://pmstructure.com/api/stripe/webhook` (or your API host)
3. Event: `checkout.session.completed`
4. Copy the **signing secret** → `STRIPE_WEBHOOK_SECRET` on the API service
5. Redeploy

**Local testing** (optional):

```bash
stripe listen --forward-to localhost:3001/api/stripe/webhook
```

Use the signing secret Stripe CLI prints as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### 3. Calendly link (optional override)

Defaults are already set to `go-talk-to-mentor`. Override only if the event URL changes:

```env
# API (confirmation emails)
ORDER_ONBOARDING_CALENDLY_URL=https://calendly.com/pm-structure/go-talk-to-mentor

# Frontend (success page buttons; rebuild required)
NEXT_PUBLIC_ONBOARDING_CALENDLY_URL=https://calendly.com/pm-structure/go-talk-to-mentor
```

### 4. Supabase orders table

Confirmation email requires a matching row in `orders` (created at checkout). Ensure `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SUPABASE_URL` are set on the API service.

## Verify end-to-end

1. Complete a test checkout (seat deposit or full tuition).
2. Confirm order status is `paid` in Supabase `orders`.
3. Check `orders.metadata.confirmationEmailSentAt` is set.
4. Inbox receives email with **Schedule your onboarding call** button.
5. Success page shows the same Calendly button after payment verifies.

## Dev without Resend

Run `npm run dev` and complete checkout. The API logs:

```text
[order-email] Dev preview for learner@example.com
Subject: ...
```

Copy the Calendly URL from the log to test scheduling manually.
