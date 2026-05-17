const apiBase = import.meta.env.VITE_API_URL || '';

export async function submitInteraction(body: {
  source?: string;
  subject?: string;
  email: string;
  payload?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}) {
  const response = await fetch(`${apiBase}/api/interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || 'Submission failed');
  }

  return response.json();
}
