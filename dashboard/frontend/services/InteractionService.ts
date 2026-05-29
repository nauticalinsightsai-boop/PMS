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

export const InteractionService = {
  async getInteractions(page = 0, limit = 50, source?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (source) params.set('source', source);
    const response = await fetch(`/api/interactions?${params}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || 'Failed to load interactions');
    }
    const json = await response.json();
    return { data: json.data as Interaction[], count: json.count as number };
  },

  async retrySheetsSync(interactionId: string) {
    const response = await fetch(`/api/interactions/${interactionId}/retry-sheets`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Retry failed');
    return response.json();
  },

  async exportCSV() {
    window.location.href = '/api/interactions/export';
  },

  async deleteInteraction(interactionId: string) {
    const response = await fetch(`/api/interactions/${interactionId}`, { method: 'DELETE' });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || 'Delete failed');
    }
    return response.json();
  },
};
