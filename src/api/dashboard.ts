import { apiClient } from './client';

export interface DashboardStats {
  sync_activity_bytes: number;
  encrypted_vaults_count: number;
  linked_nodes_count: number;
  request_speed_ms: number;
  active_clips_count: number;
  security_level: string;
  daily_notifications_count: number;
  daily_clipboard_items_count: number;
  daily_vault_items_count: number;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
};
