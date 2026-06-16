/**
 * Groq (primary) + OpenRouter (fallback) chat completions for support widget.
 */

const GROQ_MODEL = 'llama-3.3-70b-versatile';
const OPENROUTER_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

function hasGroqKey() {
  return Boolean(process.env.GROQ_API_KEY?.trim());
}

function hasOpenRouterKey() {
  return Boolean(process.env.OPENROUTER_API_KEY?.trim());
}

export function hasSupportLlmConfigured() {
  return hasGroqKey() || hasOpenRouterKey();
}

/**
 * @param {{ role: 'system'|'user'|'assistant'; content: string }[]} messages
 */
async function callGroq(messages) {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 512,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Groq ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content?.trim()) throw new Error('Groq returned empty reply');
  return content.trim();
}

/**
 * @param {{ role: 'system'|'user'|'assistant'; content: string }[]} messages
 */
async function callOpenRouter(messages) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pmstructure.com').replace(/\/$/, '');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY.trim()}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': siteUrl,
      'X-Title': 'PM Structure Support Chat',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 512,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content?.trim()) throw new Error('OpenRouter returned empty reply');
  return content.trim();
}

/**
 * @param {{ role: 'system'|'user'|'assistant'; content: string }[]} messages
 */
export async function completeSupportChat(messages) {
  if (!hasSupportLlmConfigured()) {
    throw new Error(
      'Support chat is not configured. Add GROQ_API_KEY (or OPENROUTER_API_KEY) to the server environment.',
    );
  }

  if (hasGroqKey()) {
    try {
      return await callGroq(messages);
    } catch (groqErr) {
      if (!hasOpenRouterKey()) throw groqErr;
      console.warn('[support-llm] Groq failed, trying OpenRouter:', groqErr);
    }
  }

  return callOpenRouter(messages);
}
