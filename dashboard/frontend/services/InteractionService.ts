import { fetchDashboardApi } from '@/lib/auth/fetch-dashboard-api';
import { withBasePath } from '@/lib/base-path';

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
    const response = await fetchDashboardApi(`/api/interactions?${params}`);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || 'Failed to load interactions');
    }
    const json = await response.json();
    return { data: json.data as Interaction[], count: json.count as number };
  },

  async retrySheetsSync(interactionId: string) {
    const response = await fetchDashboardApi(`/api/interactions/${interactionId}/retry-sheets`, {
      method: 'POST',
    });
    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      synced?: boolean;
      message?: string;
    };
    if (!response.ok) throw new Error(data.error || 'Retry failed');
    if (data.synced === false && data.error) throw new Error(data.error);
    return data;
  },

  async exportCSV() {
    window.location.href = withBasePath('/api/interactions/export');
  },

  async deleteInteraction(interactionId: string) {
    const response = await fetchDashboardApi(`/api/interactions/${interactionId}`, { method: 'DELETE' });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || 'Delete failed');
    }
    return response.json();
  },
};
