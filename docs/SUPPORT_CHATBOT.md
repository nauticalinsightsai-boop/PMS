# Support chatbot (PM Structure)

AI support bubble on the public site (`SupportChatWidget` in `PublicShell`). Answers questions about certification pathways, FAQs, pricing, and booking mentor/advisor calls.

## Widget

- **Component:** `frontend/components/SupportChatWidget.tsx`
- **API:** `POST /api/support/chat` (`backend/app/api/support/chat/route.ts`)
- **Position:** bottom-left (WhatsApp stays bottom-right)
- **Disable:** `NEXT_PUBLIC_SUPPORT_CHAT_ENABLED=false`

## Greeting

> Hi — I'm the PM Structure assistant. Ask about certification pathways, FAQs, regional pricing, booking a mentor call, or how to enroll.

## System prompt

Built at runtime in `backend/lib/support/guardrails.js` with:

1. **CORE INFO** — contact, Calendly links, key URLs (`backend/lib/support/site-context.js`)
2. **RETRIEVED CONTEXT** — FAQ + answer pages from Chroma RAG when configured

Edit tone, scope, or refusal copy in `guardrails.js`.

## API keys

Two layers: **LLM replies** (required) and **RAG** (optional, smarter FAQ answers).

### 1. Groq — primary (recommended)

1. [console.groq.com](https://console.groq.com) → **API Keys** → create key
2. Add to repo root `.env.local`:

```bash
GROQ_API_KEY=gsk_your_key_here
```

3. Add the same key on the **marketing Vercel project** (Settings → Environment Variables). See `docs/DEPLOYMENT_VERCEL.md`.

Uses `llama-3.3-70b-versatile`.

### 2. OpenRouter — fallback (optional)

```bash
OPENROUTER_API_KEY=sk-or-v1-...
```

Used only if Groq fails. Without **either** key, the widget shows a friendly error.

### 3. Chroma Cloud — RAG (optional)

1. [trychroma.com](https://www.trychroma.com) → account + database (e.g. `websitebot`)
2. Add:

```bash
CHROMA_HOST=api.trychroma.com
CHROMA_API_KEY=your_key
CHROMA_TENANT=your_tenant_uuid
CHROMA_DATABASE=websitebot
CHROMA_SUPPORT_COLLECTION=pms_support
```

3. Index site content:

```bash
npm run index:support-rag
```

Without Chroma, the bot still works using static contact/service info only.

## Quick test

1. Add `GROQ_API_KEY` to `.env.local`
2. `npm run dev`
3. Open the site → chat bubble **bottom-left**
4. Try: *"What certifications does PM Structure offer?"* or *"How do I book a mentor call?"*

## Production (Vercel)

Set on the **frontend** Vercel project (bundled `/api/support/chat`):

- `GROQ_API_KEY` (and optionally `OPENROUTER_API_KEY`, `CHROMA_*`)
- No separate Railway step — PM Structure deploys on Vercel, not Railway.

After changing env vars, redeploy the marketing project.
