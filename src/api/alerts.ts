import { apiClient } from './client';

export interface Alert {
  id: string;
  user_id: string;
  title: string;
  message: string;
  source_app?: string;
  device_name?: string;
  received_at: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const alertsApi = {
  getAlerts: async (): Promise<Alert[]> => {
    const response = await apiClient.get('/alerts/');
    return response.data;
  },
};
