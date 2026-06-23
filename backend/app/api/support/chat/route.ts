import { ensureMonorepoEnv } from '@/lib/ensure-monorepo-env';
import { buildSupportSystemPrompt } from '@/lib/support/guardrails';
import { completeSupportChat, hasSupportLlmConfigured } from '@/lib/support/llm';
import { retrieveSupportContext } from '@/lib/support/rag';
import {
  getSupportChatClientIp,
  isSupportChatRateLimited,
} from '@/lib/support/rate-limit';
import { buildSupportSiteContext } from '@/lib/support/site-context';

export const runtime = 'nodejs';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function parseMessages(raw: unknown): ChatMessage[] | null {
  if (!Array.isArray(raw)) return null;
  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const role = (item as ChatMessage).role;
    const content = (item as ChatMessage).content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const trimmed = content.trim();
    if (!trimmed || trimmed.length > 4000) return null;
    messages.push({ role, content: trimmed });
  }
  if (!messages.length || messages[messages.length - 1].role !== 'user') return null;
  return messages.slice(-12);
}

function sanitizeSupportReply(reply: string): string {
  if (process.env.NODE_ENV !== 'production') return reply;
  return reply
    .replace(/https?:\/\/localhost(?::\d+)?/gi, 'https://pmstructure.com')
    .replace(/https?:\/\/127\.0\.0\.1(?::\d+)?/gi, 'https://pmstructure.com');
}

export async function POST(request: Request) {
  ensureMonorepoEnv();

  const ip = getSupportChatClientIp(request);
  if (isSupportChatRateLimited(ip)) {
    return Response.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }

  if (!hasSupportLlmConfigured()) {
    return Response.json(
      {
        error:
          'Support chat is temporarily unavailable. Email support@pmstructure.com or use WhatsApp for help.',
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const messages = parseMessages((body as { messages?: unknown })?.messages);
  if (!messages) {
    return Response.json({ error: 'Invalid messages' }, { status: 400 });
  }

  const lastUser = messages[messages.length - 1].content;
  const retrievedContext = await retrieveSupportContext(lastUser);
  const systemPrompt = buildSupportSystemPrompt({
    coreInfo: buildSupportSiteContext(),
    retrievedContext,
  });

  const llmMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  try {
    const reply = sanitizeSupportReply(await completeSupportChat(llmMessages));
    return Response.json({ reply });
  } catch (err) {
    console.error('[support/chat]', err);
    return Response.json(
      {
        error:
          'Sorry — I could not reach the assistant right now. Try again or contact support@pmstructure.com.',
      },
      { status: 502 },
    );
  }
}
