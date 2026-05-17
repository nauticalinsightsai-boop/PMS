export interface Interaction {
  id: string;
  created_at: string;
  source: string;
  subject: string;
  email: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  sheets_status?: 'synced' | 'failed' | 'pending' | 'na';
}

const apiBase = import.meta.env.VITE_DASHBOARD_API_URL || '';

export const InteractionService = {
  async getInteractions(page = 0, limit = 50) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    const response = await fetch(`${apiBase}/api/interactions?${params}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || 'Failed to load interactions');
    }
    const json = await response.json();
    return { data: json.data as Interaction[], count: json.count as number };
  },

  async retrySheetsSync(interactionId: string) {
    const response = await fetch(`${apiBase}/api/interactions/${interactionId}/retry-sheets`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Retry failed');
    return response.json();
  },

  async exportCSV() {
    window.location.href = `${apiBase}/api/interactions/export`;
  },
};
